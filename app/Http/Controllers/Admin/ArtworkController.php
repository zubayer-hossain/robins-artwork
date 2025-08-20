<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArtworkController extends Controller
{
    public function index(): Response
    {
        $artworks = Artwork::with(['media'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($artwork) {
                return [
                    'id' => $artwork->id,
                    'slug' => $artwork->slug,
                    'title' => $artwork->title,
                    'medium' => $artwork->medium,
                    'status' => $artwork->status,
                    'price' => $artwork->price,
                    'primaryImage' => $artwork->primaryImage ? [
                        'thumb' => $artwork->primaryImage->getUrl('thumb'),
                    ] : null,
                    'created_at' => $artwork->created_at->format('M j, Y'),
                ];
            });

        return Inertia::render('Admin/Artworks/Index', [
            'artworks' => $artworks,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Artworks/Edit', [
            'artwork' => null,
            'mediums' => ['Oil', 'Watercolor', 'Acrylic', 'Gouache', 'Ink', 'Mixed Media'],
            'statuses' => ['draft', 'published', 'sold'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:artworks,slug',
            'medium' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'size_text' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0|max:999999.99',
            'status' => 'required|in:draft,published,sold',
            'story' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_original' => 'boolean',
            'is_print_available' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $artwork = Artwork::create($validated);

        return redirect()->route('admin.artworks.edit', $artwork)
            ->with('success', 'Artwork created successfully.');
    }

    public function edit(Artwork $artwork): Response
    {
        $artwork->load(['media', 'editions']);

        return Inertia::render('Admin/Artworks/Edit', [
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
                'images' => $artwork->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'is_primary' => $image->custom_properties['is_primary'] ?? false,
                        'thumb' => $image->getUrl('thumb'),
                        'medium' => $image->getUrl('medium'),
                        'xl' => $image->getUrl('xl'),
                    ];
                }),
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
            'mediums' => ['Oil', 'Watercolor', 'Acrylic', 'Gouache', 'Ink', 'Mixed Media'],
            'statuses' => ['draft', 'published', 'sold'],
        ]);
    }

    public function update(Request $request, Artwork $artwork)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:artworks,slug,' . $artwork->id,
            'medium' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'size_text' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0|max:999999.99',
            'status' => 'required|in:draft,published,sold',
            'story' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_original' => 'boolean',
            'is_print_available' => 'boolean',
        ]);

        $artwork->update($validated);

        return back()->with('success', 'Artwork updated successfully.');
    }

    public function destroy(Artwork $artwork)
    {
        $artwork->delete();

        return redirect()->route('admin.artworks.index')
            ->with('success', 'Artwork deleted successfully.');
    }
}
