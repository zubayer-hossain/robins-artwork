<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
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
            'limitedEditions' => \App\Models\Edition::where('stock', '>', 0)->count(),
            'featuredArtists' => Artwork::published()->distinct('medium')->count(),
        ];

        return Inertia::render('Home', [
            'featuredArtworks' => $featuredArtworks->map(function ($artwork) {
                return [
                    'id' => $artwork->id,
                    'slug' => $artwork->slug,
                    'title' => $artwork->title,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
                    'price' => $artwork->price,
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
