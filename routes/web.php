<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ArtworkController as AdminArtworkController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\EditionController as AdminEditionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/gallery', [ArtworkController::class, 'index'])->name('gallery');
Route::get('/art/{slug}', [ArtworkController::class, 'show'])->name('artwork.show');
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Test route for debugging
Route::get('/test', function () {
    return Inertia::render('Test', ['message' => 'Hello World']);
})->name('test');

// Checkout routes
Route::post('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

// Stripe webhook
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])->name('webhooks.stripe');

// Customer dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Customer orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin auth routes (no middleware - accessible to everyone)
    Route::get('/login', function () {
        return Inertia::render('Admin/Auth/Login');
    })->name('login');
    
    // Admin protected routes
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('artworks', AdminArtworkController::class);
        Route::resource('orders', AdminOrderController::class)->only(['index', 'show']);
        Route::resource('editions', AdminEditionController::class);
        
        // Contact messages management
        Route::get('/contact', function () {
            return Inertia::render('Admin/Contact/Index');
        })->name('contact.index');
    });
});

require __DIR__.'/auth.php';
