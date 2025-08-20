<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrdersPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Users can see their own orders, admins can see all
    }

    public function view(User $user, Order $order): bool
    {
        if ($user->hasRole('admin')) {
            return true; // Admins can view all orders
        }

        return $order->user_id === $user->id; // Users can only view their own orders
    }

    public function create(User $user): bool
    {
        return true; // Anyone can create orders (checkout)
    }

    public function update(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }
}
