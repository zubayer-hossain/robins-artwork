<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Order;
use App\Models\User;
use App\Models\ContactMessage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalArtworks' => Artwork::where('status', 'published')->count(),
            'totalOrders' => Order::where('status', 'paid')->count(),
            'totalRevenue' => Order::where('status', 'paid')->sum('total'),
            'unreadMessages' => ContactMessage::where('status', 'unread')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
