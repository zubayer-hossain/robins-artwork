<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\UserFavorite;
use App\Models\UserRecentView;
use App\Models\CmsSetting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class ArtworkController extends Controller
{
    use AuthorizesRequests;
    public function index(): Response
    {
        // Handle both direct parameters and filter[] parameters for backward compatibility
        $query = Artwork::query()->where('status', 'published');
        
        // Apply filters manually for better control
        if (request('title')) {
            $query->where('title', 'like', '%' . request('title') . '%');
        }
        
        if (request('medium') && request('medium') !== 'all') {
            $query->where('medium', request('medium'));
        }
        
        if (request('year') && request('year') !== 'all') {
            $query->where('year', request('year'));
        }
        
        if (request('price_min') && is_numeric(request('price_min'))) {
            $query->where('price', '>=', request('price_min'));
        }
        
        if (request('price_max') && is_numeric(request('price_max'))) {
            $query->where('price', '<=', request('price_max'));
        }
        
        $artworks = $query
            ->with(['media', 'editions'])
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        // Get total count of all published artworks (unfiltered)
        $totalArtworks = Artwork::where('status', 'published')->count();

        // Calculate dynamic stats
        $stats = [
            'totalArtworks' => $totalArtworks,
            'totalMediums' => Artwork::where('status', 'published')->distinct('medium')->count('medium'),
            'totalYears' => Artwork::where('status', 'published')->distinct('year')->count('year'),
        ];

        // Get user's favorites if authenticated
        $userFavorites = [];
        if (Auth::check()) {
            $userFavorites = UserFavorite::where('user_id', Auth::id())
                ->pluck('artwork_id')
                ->toArray();
        }

        // Get all Gallery page CMS settings
        $cmsSettings = CmsSetting::getPageSettings('gallery');

        return Inertia::render('Gallery/Index', [
            'artworks' => $artworks->through(function ($artwork) use ($userFavorites) {
                return [
                    'id' => $artwork->id,
                    'slug' => $artwork->slug,
                    'title' => $artwork->title,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
                    'size_text' => $artwork->size_text,
                    'price' => $artwork->price,
                    'tags' => $artwork->tags,
                    'isFavorite' => in_array($artwork->id, $userFavorites),
                    'primaryImage' => $artwork->primaryImage ? [
                        'thumb' => $artwork->primaryImage->getUrl('thumb'),
                        'medium' => $artwork->primaryImage->getUrl('medium'),
                    ] : [
                        'thumb' => 'https://picsum.photos/400/400?random=' . $artwork->id,
                        'medium' => 'https://picsum.photos/1000/1000?random=' . $artwork->id,
                    ],
                    'editions' => $artwork->editions->map(function ($edition) {
                        return [
                            'id' => $edition->id,
                            'sku' => $edition->sku,
                            'price' => $edition->price,
                            'stock' => $edition->stock,
                            'is_limited' => $edition->is_limited,
                        ];
                    }),
                ];
            }),
            'filters' => array_merge([
                'title' => '',
                'medium' => 'all',
                'year' => 'all',
                'price_min' => '',
                'price_max' => '',
                'tag' => '',
            ], request()->only(['status', 'title', 'medium', 'year', 'price_min', 'price_max', 'tag'])),
            'totalArtworks' => $totalArtworks,
            'stats' => $stats,
            'cmsSettings' => $cmsSettings,
        ]);
    }

    public function show(string $slug): Response
    {
        $artwork = Artwork::where('slug', $slug)
            ->with(['media', 'editions'])
            ->firstOrFail();

        $this->authorize('view', $artwork);
        
        // Track view if user is authenticated
        if (Auth::check()) {
            UserRecentView::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'artwork_id' => $artwork->id,
                ],
                [
                    'viewed_at' => now(),
                ]
            );

            // Keep only the latest 10 views per user
            $recentViews = UserRecentView::where('user_id', Auth::id())
                ->orderBy('viewed_at', 'desc')
                ->offset(10)
                ->limit(1000) // Add limit to make offset work
                ->pluck('id');

            if ($recentViews->count() > 0) {
                UserRecentView::whereIn('id', $recentViews)->delete();
            }
        }

        // Check if artwork is favorited by current user
        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = UserFavorite::where('user_id', Auth::id())
                ->where('artwork_id', $artwork->id)
                ->exists();
        }

        return Inertia::render('Gallery/Show', [
            'artwork' => [
                'id' => $artwork->id,
                'slug' => $artwork->slug,
                'title' => $artwork->title,
                'medium' => $artwork->medium,
                'year' => $artwork->year,
                'size_text' => $artwork->size_text,
                'price' => $artwork->price,
                'status' => $artwork->status,
                'story' => $artwork->story,
                'tags' => $artwork->tags,
                'is_original' => $artwork->is_original,
                'is_print_available' => $artwork->is_print_available,
                'images' => $artwork->images->count() > 0 ? $artwork->images->map(function ($image) {
                    try {
                        // For now, use original image URLs since conversions aren't working
                        $originalUrl = $image->getUrl();
                        
                        return [
                            'id' => $image->id,
                            'is_primary' => $image->custom_properties['is_primary'] ?? false,
                            'thumb' => $originalUrl,
                            'medium' => $originalUrl,
                            'xl' => $originalUrl,
                            'original' => $originalUrl,
                        ];
                    } catch (\Exception $e) {
                        // If there's an issue with the media file, return placeholder
                        return [
                            'id' => $image->id,
                            'is_primary' => $image->custom_properties['is_primary'] ?? false,
                            'thumb' => 'https://picsum.photos/400/400?random=' . $artwork->id,
                            'medium' => 'https://picsum.photos/1000/1000?random=' . $artwork->id,
                            'xl' => 'https://picsum.photos/2000/2000?random=' . $artwork->id,
                            'original' => 'https://picsum.photos/2000/2000?random=' . $artwork->id,
                        ];
                    }
                })->values()->toArray() : [
                    [
                        'id' => 0,
                        'is_primary' => true,
                        'thumb' => 'https://picsum.photos/400/400?random=' . $artwork->id,
                        'medium' => 'https://picsum.photos/1000/1000?random=' . $artwork->id,
                        'xl' => 'https://picsum.photos/2000/2000?random=' . $artwork->id,
                        'original' => 'https://picsum.photos/2000/2000?random=' . $artwork->id,
                    ]
                ],
                'editions' => $artwork->editions->map(function ($edition) {
                    return [
                        'id' => $edition->id,
                        'sku' => $edition->sku,
                        'edition_total' => $edition->edition_total,
                        'price' => $edition->price,
                        'stock' => $edition->stock,
                        'is_limited' => $edition->is_limited,
                    ];
                }),
            ],
            'isFavorite' => $isFavorite,
        ]);
    }
}
