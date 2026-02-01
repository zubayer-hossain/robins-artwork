<?php

namespace App\Providers;

use App\Models\Artwork;
use App\Models\Order;
use App\Policies\ArtworksPolicy;
use App\Policies\OrdersPolicy;
use App\Services\AnalyticsService as AppAnalyticsService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use MeShaon\RequestAnalytics\Services\AnalyticsService as PackageAnalyticsService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Use our AnalyticsService so unique visitor count is always int (package can return string from DB)
        $this->app->bind(PackageAnalyticsService::class, AppAnalyticsService::class);
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
