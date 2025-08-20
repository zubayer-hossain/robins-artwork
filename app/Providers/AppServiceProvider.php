<?php

namespace App\Providers;

use App\Models\Artwork;
use App\Models\Order;
use App\Policies\ArtworksPolicy;
use App\Policies\OrdersPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Register policies for Laravel 12
        Gate::policy(Artwork::class, ArtworksPolicy::class);
        Gate::policy(Order::class, OrdersPolicy::class);
    }
}
