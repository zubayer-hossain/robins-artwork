<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user statistics
        $stats = [
            'totalOrders' => $user->orders()->count(),
            'totalSpent' => $user->orders()->where('status', 'paid')->sum('total'),
            'favoriteArtworks' => $user->favorites()->count(),
            'recentViews' => $user->recentViews()->count(),
        ];

        // Get recent orders (last 3)
        $recentOrders = $user->orders()
            ->with(['items.edition.artwork'])
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
