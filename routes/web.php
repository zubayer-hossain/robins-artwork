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
use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ArtworkController as AdminArtworkController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\EditionController as AdminEditionController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\CmsController as AdminCmsController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\AnalyticsController as AdminAnalyticsController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/gallery', [ArtworkController::class, 'index'])->name('gallery');
Route::get('/art/{slug}', [ArtworkController::class, 'show'])->name('artwork.show');
Route::get('/about', [AboutController::class, 'index'])->name('about');
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


// Checkout routes - Laravel 12: Only for authenticated customers
Route::middleware(['customer'])->group(function () {
    Route::post('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
});

// Stripe webhook
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])->name('webhooks.stripe');

// Customer dashboard - Laravel 12: ONLY for customers, NOT admins
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['customer'])
    ->name('dashboard');

// Customer routes - Laravel 12: ONLY accessible by customers
Route::middleware(['customer'])->group(function () {
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

// Admin routes - Laravel 12: Completely separate from customer routes
Route::prefix('admin')->name('admin.')->middleware('web')->group(function () {
    // Admin auth routes - Laravel 12: Protected with guest middleware to prevent authenticated access
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->middleware('guest')->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('guest')->name('login.store');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    
    // Admin protected routes - Laravel 12: ONLY for admin users
    Route::middleware(['admin'])->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('artworks', AdminArtworkController::class);
        
        // Artwork Image Management
        Route::post('/artworks/{artwork}/images', [AdminArtworkController::class, 'uploadImages'])->name('artworks.images.upload');
        Route::delete('/artworks/{artwork}/images/{media}', [AdminArtworkController::class, 'deleteImage'])->name('artworks.images.delete');
        Route::post('/artworks/{artwork}/images/{media}/primary', [AdminArtworkController::class, 'setPrimaryImage'])->name('artworks.images.primary');
        Route::post('/artworks/{artwork}/images/reorder', [AdminArtworkController::class, 'reorderImages'])->name('artworks.images.reorder');
        
        Route::resource('orders', AdminOrderController::class)->only(['index', 'show']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::resource('editions', AdminEditionController::class);
        
        // Admin profile management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/delete', [ProfileController::class, 'destroy'])->name('profile.destroy');
        
        // Contact messages management
        Route::resource('contact', AdminContactController::class)->only(['index', 'show', 'destroy']);
        Route::patch('/contact/{contact_message}/mark-read', [AdminContactController::class, 'markAsRead'])->name('contact.mark-read');
        Route::patch('/contact/{contact_message}/mark-replied', [AdminContactController::class, 'markAsReplied'])->name('contact.mark-replied');
        
        // CMS management
        Route::get('/cms', [AdminCmsController::class, 'index'])->name('cms.index');
        Route::get('/cms/global', [AdminCmsController::class, 'global'])->name('cms.global');
        Route::patch('/cms/global', [AdminCmsController::class, 'updateGlobal'])->name('cms.global.update');
        
        // CMS Image Management
        Route::get('/cms/images', [AdminCmsController::class, 'images'])->name('cms.images');
        Route::get('/cms/images/list', [AdminCmsController::class, 'listImages'])->name('cms.images.list');
        Route::post('/cms/images/upload', [AdminCmsController::class, 'uploadImage'])->name('cms.images.upload');
        Route::delete('/cms/images/{filename}', [AdminCmsController::class, 'deleteImage'])->name('cms.images.delete');
        Route::patch('/cms/images/{filename}', [AdminCmsController::class, 'updateImage'])->name('cms.images.update');
        Route::post('/cms/images/organize', [AdminCmsController::class, 'organizeImages'])->name('cms.images.organize');
        
        // CMS Page Management - Single route with section as query parameter
        Route::get('/cms/{page}', [AdminCmsController::class, 'page'])->name('cms.page');
        Route::patch('/cms/{page}', [AdminCmsController::class, 'updatePage'])->name('cms.page.update');
        
        // CMS FAQ CRUD
        Route::post('/cms/{page}/{section}/faq', [AdminCmsController::class, 'addFaq'])->name('cms.faq.add');
        Route::delete('/cms/{page}/{section}/faq/{faqNum}', [AdminCmsController::class, 'deleteFaq'])->name('cms.faq.delete');

        // Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index'])->name('analytics.index');
    });
});

require __DIR__.'/auth.php';
