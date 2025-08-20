<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
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

        return Inertia::render('Gallery/Index', [
            'artworks' => $artworks->through(function ($artwork) {
                return [
                    'id' => $artwork->id,
                    'slug' => $artwork->slug,
                    'title' => $artwork->title,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
                    'size_text' => $artwork->size_text,
                    'price' => $artwork->price,
                    'tags' => $artwork->tags,
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
        ]);
    }

    public function show(string $slug): Response
    {
        $artwork = Artwork::where('slug', $slug)
            ->with(['media', 'editions'])
            ->firstOrFail();

        $this->authorize('view', $artwork);

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
                    return [
                        'id' => $image->id,
                        'is_primary' => $image->custom_properties['is_primary'] ?? false,
                        'thumb' => $image->getUrl('thumb'),
                        'medium' => $image->getUrl('medium'),
                        'xl' => $image->getUrl('xl'),
                        'original' => $image->getUrl(),
                    ];
                }) : [
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
        ]);
    }
}
