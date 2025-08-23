<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Edition;
use App\Models\UserFavorite;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredArtworks = Artwork::published()
            ->with(['media', 'editions'])
            ->inRandomOrder()
            ->limit(6)
            ->get();

        // Get real statistics from database
        $stats = [
            'totalArtworks' => Artwork::published()->count(),
            'limitedEditions' => Edition::where('stock', '>', 0)->count(),
            'featuredArtists' => Artwork::published()->distinct('medium')->count(),
        ];

        // Get user's favorites if authenticated
        $userFavorites = [];
        if (Auth::check()) {
            $userFavorites = UserFavorite::where('user_id', Auth::id())
                ->pluck('artwork_id')
                ->toArray();
        }

        return Inertia::render('Home', [
            'featuredArtworks' => $featuredArtworks->map(function ($artwork) use ($userFavorites) {
                return [
                    'id' => $artwork->id,
                    'slug' => $artwork->slug,
                    'title' => $artwork->title,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
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
                ];
            }),
            'stats' => $stats,
        ]);
    }
}
