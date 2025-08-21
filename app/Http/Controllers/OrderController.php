<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        
        // Ensure the user can only view their own orders
        if ($order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to order.');
        }

        $order->load(['items.artwork', 'items.edition.artwork']);

        return Inertia::render('Dashboard/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'total' => $order->total,
                'currency' => $order->currency,
                'status' => $order->status,
                'stripe_session_id' => $order->stripe_session_id,
                'email' => $order->email,
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
                            'medium' => $item->artwork->medium,
                            'year' => $item->artwork->year,
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
}
