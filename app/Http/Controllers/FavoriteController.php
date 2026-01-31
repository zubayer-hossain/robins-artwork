<?php

namespace App\Http\Controllers;

use App\Models\UserFavorite;
use App\Models\UserRecentView;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    /**
     * Display user's favorites
     * Note: Authorization is handled by route-level 'customer' middleware
     */
    public function index(): Response
    {
        $favorites = UserFavorite::with(['artwork.media'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($favorite) {
                return [
                    'id' => $favorite->id,
                    'artwork' => [
                        'id' => $favorite->artwork->id,
                        'slug' => $favorite->artwork->slug,
                        'title' => $favorite->artwork->title,
                        'medium' => $favorite->artwork->medium,
                        'year' => $favorite->artwork->year,
                        'price' => $favorite->artwork->price,
                        'tags' => $favorite->artwork->tags,
                        'primaryImage' => $favorite->artwork->primaryImage ? [
                            'thumb' => $favorite->artwork->primaryImage->getUrl('thumb'),
                            'medium' => $favorite->artwork->primaryImage->getUrl('medium'),
                        ] : null,
                    ],
                    'added_at' => $favorite->created_at,
                ];
            });

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle favorite status
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
        ]);

        $userId = Auth::id();
        $artworkId = $request->artwork_id;

        $favorite = UserFavorite::where('user_id', $userId)
            ->where('artwork_id', $artworkId)
            ->first();

        if ($favorite) {
            // Remove from favorites
            $favorite->delete();
            $isFavorite = false;
            $message = 'Removed from favorites';
        } else {
            // Add to favorites
            UserFavorite::create([
                'user_id' => $userId,
                'artwork_id' => $artworkId,
            ]);
            $isFavorite = true;
            $message = 'Added to favorites';
        }

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite,
            'message' => $message,
        ]);
    }

    /**
     * Check if artwork is favorited
     */
    public function check(Artwork $artwork): JsonResponse
    {
        $isFavorite = UserFavorite::where('user_id', Auth::id())
            ->where('artwork_id', $artwork->id)
            ->exists();

        return response()->json([
            'is_favorite' => $isFavorite,
        ]);
    }

    /**
     * Get user's recent views
     */
    public function recentViews()
    {
        $userId = Auth::id();
        
        $recentViews = UserRecentView::with(['artwork.media'])
            ->where('user_id', $userId)
            ->orderBy('viewed_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($view) use ($userId) {
                // Check if this artwork is in user's favorites
                $isFavorite = UserFavorite::where('user_id', $userId)
                    ->where('artwork_id', $view->artwork->id)
                    ->exists();
                
                return [
                    'id' => $view->artwork->id,
                    'title' => $view->artwork->title,
                    'slug' => $view->artwork->slug,
                    'price' => $view->artwork->price,
                    'medium' => $view->artwork->medium,
                    'year' => $view->artwork->year,
                    'tags' => $view->artwork->tags,
                    'primaryImage' => $view->artwork->primaryImage ? [
                        'thumb' => $view->artwork->primaryImage->getUrl('thumb'),
                        'medium' => $view->artwork->primaryImage->getUrl('medium'),
                    ] : null,
                    'isFavorite' => $isFavorite,
                    'viewed_at' => $view->viewed_at,
                ];
            });

        return Inertia::render('RecentViews/Index', [
            'recentViews' => $recentViews,
        ]);
    }

    /**
     * Track artwork view
     */
    public function trackView(Request $request): JsonResponse
    {
        $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
        ]);

        $userId = Auth::id();
        $artworkId = $request->artwork_id;

        // Update or create recent view
        UserRecentView::updateOrCreate(
            [
                'user_id' => $userId,
                'artwork_id' => $artworkId,
            ],
            [
                'viewed_at' => now(),
            ]
        );

        // Keep only the latest 10 views per user
        $recentViews = UserRecentView::where('user_id', $userId)
            ->orderBy('viewed_at', 'desc')
            ->offset(10)
            ->limit(1000) // Add limit to make offset work
            ->pluck('id');

        if ($recentViews->count() > 0) {
            UserRecentView::whereIn('id', $recentViews)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'View tracked',
        ]);
    }
}
