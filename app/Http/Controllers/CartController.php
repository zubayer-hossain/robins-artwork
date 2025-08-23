<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Artwork;
use App\Models\Edition;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CartController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    /**
     * Display the user's cart
     */
    public function index(Request $request)
    {
        $cartItems = CartItem::with(['artwork.media', 'edition'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'metadata' => $item->metadata,
                    'artwork' => $item->artwork ? [
                        'id' => $item->artwork->id,
                        'slug' => $item->artwork->slug,
                        'title' => $item->artwork->title,
                        'primaryImage' => $item->artwork->primaryImage ? [
                            'thumb' => $item->artwork->primaryImage->getUrl('thumb'),
                            'medium' => $item->artwork->primaryImage->getUrl('medium'),
                        ] : null,
                    ] : null,
                    'edition' => $item->edition ? [
                        'id' => $item->edition->id,
                        'sku' => $item->edition->sku,
                        'is_limited' => $item->edition->is_limited,
                    ] : null,
                ];
            });

        $totalPrice = $cartItems->sum('total_price');
        $itemCount = $cartItems->sum('quantity');

        // Return JSON for AJAX requests (cart dropdown) - only when explicitly requested
        if ($request->ajax() && 
            $request->header('X-Requested-With') === 'XMLHttpRequest' && 
            $request->header('Accept') === 'application/json') {
            return response()->json([
                'cartItems' => $cartItems,
                'totalPrice' => $totalPrice,
                'itemCount' => $itemCount,
            ]);
        }

        // Return Inertia response for regular page requests
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
            'itemCount' => $itemCount,
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:original,edition',
            'artwork_id' => 'required_if:type,original|exists:artworks,id',
            'edition_id' => 'required_if:type,edition|exists:editions,id',
            'quantity' => 'integer|min:1|max:10',
        ]);

        $userId = Auth::id();
        $type = $request->type;
        $quantity = $request->quantity ?? 1;

        // Get the item details
        if ($type === 'original') {
            $artwork = Artwork::findOrFail($request->artwork_id);
            $price = $artwork->price;
            $name = $artwork->title . ' (Original)';
            $description = "Original {$artwork->medium} artwork";
            $artworkId = $artwork->id;
            $editionId = null;
        } else {
            $edition = Edition::with('artwork')->findOrFail($request->edition_id);
            $artwork = $edition->artwork;
            $price = $edition->price;
            $name = $artwork->title . ' (' . ($edition->is_limited ? 'Limited' : 'Open') . ' Edition)';
            $description = ($edition->is_limited ? 'Limited' : 'Open') . " edition print - SKU: {$edition->sku}";
            $artworkId = null;
            $editionId = $edition->id;
        }

        // Check if item already exists in cart
        $existingItem = CartItem::where('user_id', $userId)
            ->where('artwork_id', $artworkId)
            ->where('edition_id', $editionId)
            ->first();

        if ($existingItem) {
            // Item already exists in cart - don't increase quantity
            return response()->json([
                'success' => false,
                'message' => 'Item is already in your cart',
                'already_in_cart' => true,
                'cart_count' => CartItem::where('user_id', $userId)->sum('quantity'),
            ], 400);
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'artwork_id' => $artworkId,
                'edition_id' => $editionId,
                'type' => $type,
                'quantity' => $quantity,
                'price' => $price,
                'name' => $name,
                'description' => $description,
                'metadata' => [
                    'artwork_title' => $artwork->title,
                    'artwork_medium' => $artwork->medium,
                    'artwork_year' => $artwork->year,
                    'added_at' => now()->toISOString(),
                ],
            ]);
        }

        // Get updated cart count
        $cartCount = CartItem::where('user_id', $userId)->sum('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'cart_count' => $cartCount,
            'item' => [
                'id' => $cartItem->id,
                'name' => $cartItem->name,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
            ],
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        $cartCount = CartItem::where('user_id', Auth::id())->sum('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully',
            'cart_count' => $cartCount,
            'item' => [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'total_price' => $cartItem->total_price,
            ],
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(CartItem $cartItem): JsonResponse
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        $cartCount = CartItem::where('user_id', Auth::id())->sum('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
            'cart_count' => $cartCount,
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear(): JsonResponse
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully',
            'cart_count' => 0,
        ]);
    }

    /**
     * Get cart count for header
     */
    public function count(): JsonResponse
    {
        $count = CartItem::where('user_id', Auth::id())->sum('quantity');

        return response()->json([
            'count' => $count,
        ]);
    }
}
