<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\Models\Address; // Added this import for Address model

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's orders with related data
        $orders = $user->orders()
            ->with(['items.edition.artwork', 'items.artwork'])
            ->latest()
            ->paginate(10);

        // Get order statistics
        $stats = [
            'totalOrders' => $user->orders()->count(),
            'paidOrders' => $user->orders()->where('status', 'paid')->count(),
            'pendingOrders' => $user->orders()->where('status', 'pending')->count(),
            'totalSpent' => $user->orders()->where('status', 'paid')->sum('total'),
        ];

        return Inertia::render('Dashboard/Orders', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        $user = $request->user();
        
        // Debug logging
        \Log::info('Order show attempt', [
            'user_id' => $user ? $user->id : null,
            'order_user_id' => $order->user_id,
            'order_id' => $order->id,
            'session_id' => $request->session()->getId(),
            'authenticated' => Auth::check(),
        ]);
        
        // Ensure the user can only view their own orders
        if ($order->user_id != $user->id) {
            \Log::warning('Unauthorized order access', [
                'user_id' => $user ? $user->id : null,
                'order_user_id' => $order->user_id,
                'order_id' => $order->id,
            ]);
            abort(403, 'Unauthorized access to order.');
        }

        $order->load(['items.artwork', 'items.edition.artwork', 'shippingAddress', 'billingAddress', 'user']);

        return Inertia::render('Dashboard/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'total' => $order->total,
                'currency' => $order->currency,
                'status' => $order->status,
                'stripe_session_id' => $order->stripe_session_id,
                'order_notes' => $order->order_notes,
                'email' => $order->user->email,
                'created_at' => $order->created_at->format('M j, Y H:i'),
                'updated_at' => $order->updated_at->format('M j, Y H:i'),
                'shipping_address' => $order->shippingAddress ? [
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
                    return [
                        'id' => $item->id,
                        'qty' => $item->qty,
                        'unit_price' => $item->unit_price,
                        'title_snapshot' => $item->title_snapshot,
                        'artwork' => $item->artwork ? [
                            'id' => $item->artwork->id,
                            'title' => $item->artwork->title,
                            'slug' => $item->artwork->slug,
                            'medium' => $item->artwork->medium,
                            'year' => $item->artwork->year,
                            'primaryImage' => $item->artwork->primaryImage ? [
                                'thumb' => $item->artwork->primaryImage->getUrl('thumb'),
                                'medium' => $item->artwork->primaryImage->getUrl('medium'),
                            ] : null,
                        ] : null,
                        'edition' => $item->edition ? [
                            'id' => $item->edition->id,
                            'name' => $item->edition->name,
                            'sku' => $item->edition->sku,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Create order from cart items
     */
    public function store(Request $request): JsonResponse
    {
        $userId = Auth::id();
        
        // Get user's cart items
        $cartItems = CartItem::where('user_id', $userId)
            ->with(['artwork', 'edition'])
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty'
            ], 400);
        }

        // Validate address selection
        $request->validate([
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'required|exists:addresses,id',
            'order_notes' => 'nullable|string|max:1000',
        ]);

        // Ensure addresses belong to the user
        $shippingAddress = Address::where('id', $request->shipping_address_id)
            ->where('user_id', $userId)
            ->where('type', 'shipping')
            ->first();
            
        $billingAddress = Address::where('id', $request->billing_address_id)
            ->where('user_id', $userId)
            ->where('type', 'billing')
            ->first();

        if (!$shippingAddress || !$billingAddress) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid address selection'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Calculate total
            $total = $cartItems->sum('total_price');

            // Create order
            $order = Order::create([
                'user_id' => $userId,
                'stripe_session_id' => 'manual_' . time() . '_' . $userId, // Temporary ID for manual orders
                'total' => $total,
                'currency' => 'usd',
                'status' => 'pending',
                'order_notes' => $request->input('order_notes'),
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'meta' => [
                    'source' => 'cart_submission',
                    'created_at' => now()->toISOString(),
                ],
            ]);

            // Create order items from cart items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'artwork_id' => $cartItem->artwork_id,
                    'edition_id' => $cartItem->edition_id,
                    'qty' => $cartItem->quantity,
                    'unit_price' => $cartItem->price,
                    'title_snapshot' => $cartItem->name,
                ]);
            }

            // Clear the cart
            CartItem::where('user_id', $userId)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }


    public function downloadReceipt(Order $order)
    {
        // Authz
        if ($order->user_id != Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Eager load
        $order->load(['items.artwork', 'items.edition.artwork', 'shippingAddress', 'billingAddress', 'user']);

        // Optional: a remote or local absolute logo path (Dompdf needs absolute path or data URI)
        $logoUrl = null;
        if (config('app.logo_path')) {
            // e.g., public/storage/logo.png
            $path = public_path(config('app.logo_path'));
            if (file_exists($path)) {
                $logoUrl = $path; // local absolute path works when isRemoteEnabled=false
            }
        }
        // Or if using Storage::url and remote:
        // $logoUrl = url('storage/logo.png');

        $pdf = Pdf::setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => true, // set true if you reference http(s) images/fonts
            'dpi'                  => 96,
            'defaultFont'          => 'DejaVu Sans',
        ])->loadView('pdfs.order-receipt', [
            'order'   => $order,
            'logoUrl' => $logoUrl,
        ]);

        $pdf->setPaper('A4', 'portrait');

        $filename = 'receipt-order-' . $order->id . '-' . now()->format('Y-m-d') . '.pdf';        

        return $pdf->download($filename);
    }
}
