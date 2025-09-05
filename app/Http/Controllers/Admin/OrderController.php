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
        $order->load(['user', 'items.artwork', 'items.edition.artwork']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'total' => $order->total,
                'currency' => $order->currency,
                'status' => $order->status,
                'stripe_session_id' => $order->stripe_session_id,
                'customer_name' => $order->user?->name ?? 'Guest',
                'customer_email' => $order->user?->email ?? 'N/A',
                'meta' => $order->meta,
                'created_at' => $order->created_at->format('M j, Y H:i'),
                'updated_at' => $order->updated_at->format('M j, Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'qty' => $item->qty,
                        'unit_price' => $item->unit_price,
                        'title_snapshot' => $item->title_snapshot,
                        'artwork' => $item->artwork ? [
                            'id' => $item->artwork->id,
                            'title' => $item->artwork->title,
                            'slug' => $item->artwork->slug,
                        ] : null,
                        'edition' => $item->edition ? [
                            'id' => $item->edition->id,
                            'sku' => $item->edition->sku,
                            'artwork_title' => $item->edition->artwork->title,
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
}
