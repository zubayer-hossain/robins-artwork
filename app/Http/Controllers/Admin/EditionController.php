<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Edition;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EditionController extends Controller
{
    public function index(): Response
    {
        $editions = Edition::with(['artwork.media'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($edition) {
                $artworkImage = null;
                if ($edition->artwork && $edition->artwork->primaryImage) {
                    $media = $edition->artwork->primaryImage;
                    if (file_exists($media->getPath())) {
                        $artworkImage = $media->hasGeneratedConversion('thumb') 
                            ? $media->getUrl('thumb') 
                            : $media->getUrl();
                    }
                }
                
                return [
                    'id' => $edition->id,
                    'sku' => $edition->sku,
                    'edition_total' => $edition->edition_total,
                    'price' => $edition->price,
                    'stock' => $edition->stock,
                    'is_limited' => $edition->is_limited,
                    'artwork' => $edition->artwork ? [
                        'id' => $edition->artwork->id,
                        'title' => $edition->artwork->title,
                        'slug' => $edition->artwork->slug,
                        'image' => $artworkImage,
                    ] : null,
                    'created_at' => $edition->created_at->format('M j, Y'),
                ];
            });

        return Inertia::render('Admin/Editions/Index', [
            'editions' => $editions,
        ]);
    }

    public function create(): Response
    {
        $artworks = Artwork::where('status', 'published')
            ->with('media')
            ->orderBy('title')
            ->get()
            ->map(function ($artwork) {
                $primaryImage = null;
                if ($artwork->primaryImage && file_exists($artwork->primaryImage->getPath())) {
                    $primaryImage = $artwork->primaryImage->hasGeneratedConversion('thumb') 
                        ? $artwork->primaryImage->getUrl('thumb') 
                        : $artwork->primaryImage->getUrl();
                }
                return [
                    'id' => $artwork->id,
                    'title' => $artwork->title,
                    'slug' => $artwork->slug,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
                    'size_text' => $artwork->size_text,
                    'image' => $primaryImage,
                ];
            });

        return Inertia::render('Admin/Editions/Create', [
            'artworks' => $artworks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
            'sku' => 'required|string|max:255|unique:editions,sku',
            'edition_total' => 'nullable|integer|min:1|max:10000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:10000',
            'is_limited' => 'boolean',
        ]);

        // Ensure is_limited is properly cast to boolean
        $validated['is_limited'] = (bool) $validated['is_limited'];
        
        // If not limited edition, set edition_total to null
        if (!$validated['is_limited']) {
            $validated['edition_total'] = null;
        }

        try {
            DB::beginTransaction();

            $edition = Edition::create($validated);

            DB::commit();

            Log::info('Edition created successfully', ['edition_id' => $edition->id, 'sku' => $edition->sku]);

            return redirect()->route('admin.editions.index')
                ->with('success', 'Edition created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to create edition', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()->withInput()
                ->with('error', 'Failed to create edition. Please try again.');
        }
    }

    public function edit(Edition $edition): Response
    {
        $edition->load(['artwork.media']);
        
        // Get artwork image
        $artworkImage = null;
        if ($edition->artwork && $edition->artwork->primaryImage && file_exists($edition->artwork->primaryImage->getPath())) {
            $artworkImage = $edition->artwork->primaryImage->hasGeneratedConversion('thumb') 
                ? $edition->artwork->primaryImage->getUrl('thumb') 
                : $edition->artwork->primaryImage->getUrl();
        }
        
        $artworks = Artwork::where('status', 'published')
            ->with('media')
            ->orderBy('title')
            ->get()
            ->map(function ($artwork) {
                $primaryImage = null;
                if ($artwork->primaryImage && file_exists($artwork->primaryImage->getPath())) {
                    $primaryImage = $artwork->primaryImage->hasGeneratedConversion('thumb') 
                        ? $artwork->primaryImage->getUrl('thumb') 
                        : $artwork->primaryImage->getUrl();
                }
                return [
                    'id' => $artwork->id,
                    'title' => $artwork->title,
                    'slug' => $artwork->slug,
                    'medium' => $artwork->medium,
                    'year' => $artwork->year,
                    'size_text' => $artwork->size_text,
                    'image' => $primaryImage,
                ];
            });

        return Inertia::render('Admin/Editions/Edit', [
            'edition' => [
                'id' => $edition->id,
                'artwork_id' => $edition->artwork_id,
                'sku' => $edition->sku,
                'edition_total' => $edition->edition_total,
                'price' => $edition->price,
                'stock' => $edition->stock,
                'is_limited' => $edition->is_limited,
                'artwork' => $edition->artwork ? [
                    'id' => $edition->artwork->id,
                    'title' => $edition->artwork->title,
                    'slug' => $edition->artwork->slug,
                    'medium' => $edition->artwork->medium,
                    'year' => $edition->artwork->year,
                    'size_text' => $edition->artwork->size_text,
                    'image' => $artworkImage,
                ] : null,
            ],
            'artworks' => $artworks,
        ]);
    }

    public function show(Edition $edition): Response
    {
        $edition->load(['artwork']);

        return Inertia::render('Admin/Editions/Show', [
            'edition' => [
                'id' => $edition->id,
                'artwork_id' => $edition->artwork_id,
                'sku' => $edition->sku,
                'edition_total' => $edition->edition_total,
                'price' => $edition->price,
                'stock' => $edition->stock,
                'is_limited' => $edition->is_limited,
                'created_at' => $edition->created_at,
                'updated_at' => $edition->updated_at,
                'artwork' => $edition->artwork ? [
                    'id' => $edition->artwork->id,
                    'title' => $edition->artwork->title,
                    'slug' => $edition->artwork->slug,
                    'medium' => $edition->artwork->medium,
                    'year' => $edition->artwork->year,
                    'size_text' => $edition->artwork->size_text,
                ] : null,
            ],
        ]);
    }

    public function update(Request $request, Edition $edition)
    {
        $validated = $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
            'sku' => 'required|string|max:255|unique:editions,sku,' . $edition->id,
            'edition_total' => 'nullable|integer|min:1|max:10000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:10000',
            'is_limited' => 'boolean',
        ]);

        // Ensure is_limited is properly cast to boolean
        $validated['is_limited'] = (bool) $validated['is_limited'];
        
        // If not limited edition, set edition_total to null
        if (!$validated['is_limited']) {
            $validated['edition_total'] = null;
        }

        try {
            DB::beginTransaction();

            $edition->update($validated);

            DB::commit();

            Log::info('Edition updated successfully', ['edition_id' => $edition->id, 'sku' => $edition->sku]);

            return redirect()->route('admin.editions.index')
                ->with('success', 'Edition updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to update edition', [
                'edition_id' => $edition->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()->withInput()
                ->with('error', 'Failed to update edition. Please try again.');
        }
    }

    public function destroy(Edition $edition)
    {
        try {
            DB::beginTransaction();

            $editionSku = $edition->sku;
            $editionId = $edition->id;

            $edition->delete();

            DB::commit();

            Log::info('Edition deleted successfully', ['edition_id' => $editionId, 'sku' => $editionSku]);

            return redirect()->route('admin.editions.index')
                ->with('success', 'Edition deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to delete edition', [
                'edition_id' => $edition->id,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Failed to delete edition. Please try again.');
        }
    }
}