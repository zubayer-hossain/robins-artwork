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

        // Calculate month-over-month changes
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        
        // Orders change
        $currentMonthOrders = $user->orders()->whereMonth('created_at', $currentMonth->month)->whereYear('created_at', $currentMonth->year)->count();
        $lastMonthOrders = $user->orders()->whereMonth('created_at', $lastMonth->month)->whereYear('created_at', $lastMonth->year)->count();
        
        if ($lastMonthOrders > 0) {
            $ordersChange = round((($currentMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1);
        } elseif ($currentMonthOrders > 0 && $lastMonthOrders == 0) {
            $ordersChange = 100; // New activity this month
        } else {
            $ordersChange = null; // No data to compare
        }
        
        // Spending change
        $currentMonthSpent = $user->orders()->where('status', 'paid')->whereMonth('created_at', $currentMonth->month)->whereYear('created_at', $currentMonth->year)->sum('total');
        $lastMonthSpent = $user->orders()->where('status', 'paid')->whereMonth('created_at', $lastMonth->month)->whereYear('created_at', $lastMonth->year)->sum('total');
        
        if ($lastMonthSpent > 0) {
            $spendingChange = round((($currentMonthSpent - $lastMonthSpent) / $lastMonthSpent) * 100, 1);
        } elseif ($currentMonthSpent > 0 && $lastMonthSpent == 0) {
            $spendingChange = 100; // New spending this month
        } else {
            $spendingChange = null; // No data to compare
        }
        
        // Add changes to stats
        $stats['ordersChange'] = $ordersChange;
        $stats['spendingChange'] = $spendingChange;

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
