<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Transform the data manually to preserve pagination
        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'total' => $order->total,
                'currency' => $order->currency,
                'status' => $order->status,
                'stripe_session_id' => $order->stripe_session_id,
                'customer_name' => $order->user?->name ?? 'Guest',
                'customer_email' => $order->billing_email ?? $order->user?->email,
                'items_count' => $order->items->count(),
                'created_at' => $order->created_at->format('M j, Y H:i'),
            ];
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items.artwork.media', 'items.edition.artwork.media', 'shippingAddress', 'billingAddress']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'total' => $order->total,
                'currency' => $order->currency,
                'status' => $order->status,
                'stripe_session_id' => $order->stripe_session_id,
                'order_notes' => $order->order_notes,
                'customer_name' => $order->user?->name ?? 'Guest',
                'customer_email' => $order->user?->email ?? 'N/A',
                'user_id' => $order->user_id,
                'meta' => $order->meta,
                'created_at' => $order->created_at->format('M j, Y H:i'),
                'updated_at' => $order->updated_at->format('M j, Y H:i'),
                'shipping_address' => $order->shippingAddress ? [
                    'label' => $order->shippingAddress->label,
                    'name' => $order->shippingAddress->name,
                    'company' => $order->shippingAddress->company,
                    'address_line_1' => $order->shippingAddress->address_line_1,
                    'address_line_2' => $order->shippingAddress->address_line_2,
                    'city' => $order->shippingAddress->city,
                    'state_province' => $order->shippingAddress->state_province,
                    'postal_code' => $order->shippingAddress->postal_code,
                    'country' => $order->shippingAddress->country,
                    'phone' => $order->shippingAddress->phone,
                ] : null,
                'billing_address' => $order->billingAddress ? [
                    'label' => $order->billingAddress->label,
                    'name' => $order->billingAddress->name,
                    'company' => $order->billingAddress->company,
                    'address_line_1' => $order->billingAddress->address_line_1,
                    'address_line_2' => $order->billingAddress->address_line_2,
                    'city' => $order->billingAddress->city,
                    'state_province' => $order->billingAddress->state_province,
                    'postal_code' => $order->billingAddress->postal_code,
                    'country' => $order->billingAddress->country,
                    'phone' => $order->billingAddress->phone,
                ] : null,
                'items' => $order->items->map(function ($item) {
                    $artwork = $item->artwork ?? $item->edition?->artwork;
                    return [
                        'id' => $item->id,
                        'qty' => $item->qty,
                        'unit_price' => $item->unit_price,
                        'title_snapshot' => $item->title_snapshot,
                        'artwork' => $artwork ? [
                            'id' => $artwork->id,
                            'title' => $artwork->title,
                            'slug' => $artwork->slug,
                            'medium' => $artwork->medium,
                            'year' => $artwork->year,
                            'primaryImage' => $artwork->primaryImage ? [
                                'thumb' => $artwork->primaryImage->getUrl('thumb'),
                                'medium' => $artwork->primaryImage->getUrl('medium'),
                            ] : null,
                        ] : null,
                        'edition' => $item->edition ? [
                            'id' => $item->edition->id,
                            'sku' => $item->edition->sku,
                            'name' => $item->edition->name,
                            'is_limited' => $item->edition->is_limited,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,paid,refunded,cancelled',
            ]);

            DB::transaction(function () use ($order, $request) {
                $order->update([
                    'status' => $request->status,
                ]);
            });

            return back()->with('success', 'Order status updated successfully!');

        } catch (\Exception $e) {
            Log::error('Order status update failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Failed to update order status. Please try again.');
        }
    }

    /**
     * Download order invoice (admin)
     */
    public function downloadInvoice(Order $order)
    {
        $order->load(['items.artwork', 'items.edition.artwork', 'shippingAddress', 'billingAddress', 'user']);

        $logoUrl = null;
        if (config('app.logo_path')) {
            $path = public_path(config('app.logo_path'));
            if (file_exists($path)) {
                $logoUrl = $path;
            }
        }

        // Get currency settings
        $currencyCode = \App\Services\CmsService::getDefaultCurrency();
        $currencySymbol = \App\Services\CmsService::getCurrencySymbol($currencyCode);

        $pdf = Pdf::setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => true,
            'dpi'                  => 96,
            'defaultFont'          => 'DejaVu Sans',
        ])->loadView('pdfs.order-receipt', [
            'order'   => $order,
            'logoUrl' => $logoUrl,
            'currencyCode' => $currencyCode,
            'currencySymbol' => $currencySymbol,
        ]);

        $pdf->setPaper('A4', 'portrait');

        $filename = 'invoice-order-' . $order->id . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
