<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AddressController;
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

// Debug route for authentication testing
Route::get('/debug/auth', function () {
    return response()->json([
        'authenticated' => auth()->check(),
        'user_id' => auth()->id(),
        'user' => auth()->user(),
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
    ]);
})->middleware('auth')->name('debug.auth');

// Debug route for CSRF testing
Route::post('/debug/csrf', function () {
    return response()->json([
        'success' => true,
        'message' => 'CSRF token is valid',
        'received_token' => request()->header('X-CSRF-TOKEN'),
        'session_token' => csrf_token(),
    ]);
})->middleware('auth')->name('debug.csrf');

// CSRF token refresh route
Route::get('/csrf-token', function () {
    return response()->json([
        'token' => csrf_token(),
    ]);
})->middleware('auth')->name('csrf.token');


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
    Route::post('/profile/delete', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Customer orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/receipt', [OrderController::class, 'downloadReceipt'])->name('orders.receipt');
    
    // Customer addresses
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::post('/addresses/{address}/update', [AddressController::class, 'update'])->name('addresses.update');
    Route::post('/addresses/{address}/delete', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::patch('/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('addresses.set-default');
    
    // Cart routes
    Route::post('/cart/{cartItem}/delete', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');

    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');
    
    // Favorites routes
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    Route::get('/favorites/check/{artwork}', [FavoriteController::class, 'check'])->name('favorites.check');
    
    // Recent views routes
    Route::get('/recent-views', [FavoriteController::class, 'recentViews'])->name('recent-views');
    Route::post('/track-view', [FavoriteController::class, 'trackView'])->name('track-view');
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
