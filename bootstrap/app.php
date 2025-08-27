<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Laravel 12: Register custom middleware aliases for better UX
        $middleware->alias([
            'role' => \App\Http\Middleware\CustomRoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'ensure_single_role' => \App\Http\Middleware\EnsureSingleRole::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        ]);

        // Laravel 12: Additional security middleware for role-based access
        $middleware->group('admin', [
            'auth',
            'verified',
            'role:admin',
            'ensure_single_role:admin',
        ]);

        $middleware->group('customer', [
            'auth',
            'verified', 
            'role:customer',
            'ensure_single_role:customer',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();