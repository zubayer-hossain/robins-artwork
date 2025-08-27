<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Order;
use App\Models\User;
use App\Models\ContactMessage;
use App\Models\Edition;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Current stats - ALL data regardless of status
        $totalArtworks = Artwork::count(); // All artworks
        $publishedArtworks = Artwork::where('status', 'published')->count();
        $draftArtworks = Artwork::where('status', 'draft')->count();
        
        $totalOrders = Order::count(); // All orders
        $paidOrders = Order::where('status', 'paid')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        $refundedOrders = Order::where('status', 'refunded')->count();
        
        $totalRevenue = Order::where('status', 'paid')->sum('total'); // Only paid orders for revenue
        $pendingRevenue = Order::where('status', 'pending')->sum('total');
        
        $totalMessages = ContactMessage::count(); // All messages
        $unreadMessages = ContactMessage::where('status', 'unread')->count();
        $readMessages = ContactMessage::where('status', 'read')->count();
        $repliedMessages = ContactMessage::where('status', 'replied')->count();
        
        $totalCustomers = User::whereHas('roles', function($query) {
            $query->where('name', 'customer');
        })->count();
        $totalEditions = Edition::count();
        $lowStockEditions = Edition::where('stock', '<', 5)->count();
        $outOfStockEditions = Edition::where('stock', '=', 0)->count();
        $totalUsers = User::count();
        
        // Previous month stats for comparison - ALL data
        $previousMonth = Carbon::now()->subMonth();
        
        $previousArtworks = Artwork::where('created_at', '<', $previousMonth->endOfMonth())->count();
        $previousOrders = Order::where('created_at', '<', $previousMonth->endOfMonth())->count();
        $previousRevenue = Order::where('status', 'paid')
            ->where('created_at', '<', $previousMonth->endOfMonth())
            ->sum('total');
        $previousCustomers = User::whereHas('roles', function($query) {
            $query->where('name', 'customer');
        })->where('created_at', '<', $previousMonth->endOfMonth())->count();
        $previousMessages = ContactMessage::where('created_at', '<', $previousMonth->endOfMonth())->count();
        
        // Calculate percentage changes
        $artworksChange = $previousArtworks > 0 
            ? round((($totalArtworks - $previousArtworks) / $previousArtworks) * 100, 1)
            : ($totalArtworks > 0 ? 100 : 0);
            
        $ordersChange = $previousOrders > 0 
            ? round((($totalOrders - $previousOrders) / $previousOrders) * 100, 1)
            : ($totalOrders > 0 ? 100 : 0);
            
        $revenueChange = $previousRevenue > 0 
            ? round((($totalRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : ($totalRevenue > 0 ? 100 : 0);
            
        $customersChange = $previousCustomers > 0 
            ? round((($totalCustomers - $previousCustomers) / $previousCustomers) * 100, 1)
            : ($totalCustomers > 0 ? 100 : 0);
            
        $messagesChange = $previousMessages > 0 
            ? round((($totalMessages - $previousMessages) / $previousMessages) * 100, 1)
            : ($totalMessages > 0 ? 100 : 0);
        
        // Recent activity - orders and messages
        $recentOrders = Order::with(['user', 'items.edition'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->user->name ?? 'Guest',
                    'customer_email' => $order->user->email ?? $order->billing_email,
                    'total' => $order->total,
                    'status' => $order->status,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->toISOString(),
                    'formatted_date' => $order->created_at->diffForHumans(),
                ];
            });
            
        $recentMessages = ContactMessage::latest()
            ->limit(3)
            ->get()
            ->map(function($message) {
                return [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'subject' => $message->subject,
                    'status' => $message->status,
                    'created_at' => $message->created_at->toISOString(),
                    'formatted_date' => $message->created_at->diffForHumans(),
                ];
            });
            
        // Recent artworks
        $recentArtworks = Artwork::where('status', 'published')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function($artwork) {
                return [
                    'id' => $artwork->id,
                    'title' => $artwork->title,
                    'slug' => $artwork->slug,
                    'price' => $artwork->price,
                    'created_at' => $artwork->created_at->toISOString(),
                    'formatted_date' => $artwork->created_at->diffForHumans(),
                ];
            });

        $stats = [
            // Main totals (all data regardless of status)
            'totalArtworks' => $totalArtworks,
            'totalOrders' => $totalOrders,
            'totalRevenue' => number_format($totalRevenue, 2),
            'totalMessages' => $totalMessages,
            'totalCustomers' => $totalCustomers,
            'totalEditions' => $totalEditions,
            'totalUsers' => $totalUsers,
            
            // Artwork breakdowns
            'publishedArtworks' => $publishedArtworks,
            'draftArtworks' => $draftArtworks,
            
            // Order breakdowns
            'paidOrders' => $paidOrders,
            'pendingOrders' => $pendingOrders,
            'cancelledOrders' => $cancelledOrders,
            'refundedOrders' => $refundedOrders,
            'pendingRevenue' => number_format($pendingRevenue, 2),
            
            // Message breakdowns
            'unreadMessages' => $unreadMessages,
            'readMessages' => $readMessages,
            'repliedMessages' => $repliedMessages,
            
            // Edition breakdowns
            'lowStockEditions' => $lowStockEditions,
            'outOfStockEditions' => $outOfStockEditions,
            
            // Change percentages
            'artworksChange' => $artworksChange,
            'ordersChange' => $ordersChange,
            'revenueChange' => $revenueChange,
            'customersChange' => $customersChange,
            'messagesChange' => $messagesChange,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentMessages' => $recentMessages,
            'recentArtworks' => $recentArtworks,
        ]);
    }
}
