<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
                        'thumb' => $artwork->primaryImage->hasGeneratedConversion('thumb')
                            ? $artwork->primaryImage->getUrl('thumb')
                            : $artwork->primaryImage->getUrl(),
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
        return Inertia::render('Admin/Artworks/Create', [
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

        try {
            DB::beginTransaction();

            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            $artwork = Artwork::create($validated);

            DB::commit();

            Log::info('Artwork created successfully', ['artwork_id' => $artwork->id, 'title' => $artwork->title]);

            return redirect()->route('admin.artworks.edit', $artwork)
                ->with('success', 'Artwork created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to create artwork', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()->withInput()
                ->with('error', 'Failed to create artwork. Please try again.');
        }
    }

    public function show(Artwork $artwork): Response
    {
        $artwork->load(['media', 'editions']);

        return Inertia::render('Admin/Artworks/Show', [
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
                'created_at' => $artwork->created_at,
                'updated_at' => $artwork->updated_at,
                'images' => $artwork->images->map(function ($image) {
                    if (!file_exists($image->getPath())) return null;
                    return [
                        'id' => $image->id,
                        'is_primary' => $image->custom_properties['is_primary'] ?? false,
                        'thumb' => $image->getUrl('thumb'),
                        'medium' => $image->getUrl('medium'),
                        'xl' => $image->getUrl('xl'),
                    ];
                })->filter()->values(),
                'editions' => $artwork->editions->map(function ($edition) {
                    return [
                        'id' => $edition->id,
                        'sku' => $edition->sku,
                        'edition_total' => $edition->edition_total,
                        'price' => $edition->price,
                        'stock' => $edition->stock,
                        'is_limited' => $edition->is_limited,
                        'created_at' => $edition->created_at->format('M j, Y'),
                    ];
                }),
            ],
        ]);
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
                    if (!file_exists($image->getPath())) return null;
                    return [
                        'id' => $image->id,
                        'is_primary' => $image->custom_properties['is_primary'] ?? false,
                        'thumb' => $image->getUrl('thumb'),
                        'medium' => $image->getUrl('medium'),
                        'xl' => $image->getUrl('xl'),
                    ];
                })->filter()->values(),
                'editions' => $artwork->editions->map(function ($edition) {
                    return [
                        'id' => $edition->id,
                        'sku' => $edition->sku,
                        'edition_total' => $edition->edition_total,
                        'price' => $edition->price,
                        'stock' => $edition->stock,
                        'is_limited' => $edition->is_limited,
                        'created_at' => $edition->created_at->format('M j, Y'),
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

        try {
            DB::beginTransaction();

            $artwork->update($validated);

            DB::commit();

            Log::info('Artwork updated successfully', ['artwork_id' => $artwork->id, 'title' => $artwork->title]);

            return back()->with('success', 'Artwork updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to update artwork', [
                'artwork_id' => $artwork->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()->withInput()
                ->with('error', 'Failed to update artwork. Please try again.');
        }
    }

    public function destroy(Artwork $artwork)
    {
        try {
            DB::beginTransaction();

            $artworkTitle = $artwork->title;
            $artworkId = $artwork->id;

            $artwork->delete();

            DB::commit();

            Log::info('Artwork deleted successfully', ['artwork_id' => $artworkId, 'title' => $artworkTitle]);

            return redirect()->route('admin.artworks.index')
                ->with('success', 'Artwork deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to delete artwork', [
                'artwork_id' => $artwork->id,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Failed to delete artwork. Please try again.');
        }
    }

    /**
     * Upload images for an artwork
     */
    public function uploadImages(Request $request, Artwork $artwork)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        try {
            $uploadedImages = [];
            $existingCount = $artwork->getMedia('artwork-images')->count();

            foreach ($request->file('images') as $index => $file) {
                $isPrimary = ($existingCount === 0 && $index === 0);
                
                $media = $artwork->addMedia($file)
                    ->withCustomProperties(['is_primary' => $isPrimary])
                    ->toMediaCollection('artwork-images');
                
                $uploadedImages[] = [
                    'id' => $media->id,
                    'is_primary' => $isPrimary,
                    'thumb' => $media->getUrl('thumb'),
                    'medium' => $media->getUrl('medium'),
                    'xl' => $media->getUrl('xl'),
                ];
            }

            Log::info('Images uploaded for artwork', [
                'artwork_id' => $artwork->id,
                'count' => count($uploadedImages)
            ]);

            return response()->json([
                'success' => true,
                'message' => count($uploadedImages) . ' image(s) uploaded successfully!',
                'images' => $uploadedImages
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to upload images', [
                'artwork_id' => $artwork->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an image from an artwork
     */
    public function deleteImage(Request $request, Artwork $artwork, $mediaId)
    {
        try {
            $media = $artwork->getMedia('artwork-images')->where('id', $mediaId)->first();

            if (!$media) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image not found'
                ], 404);
            }

            $wasPrimary = $media->custom_properties['is_primary'] ?? false;
            $media->delete();

            // If the deleted image was primary, set the first remaining image as primary
            if ($wasPrimary) {
                $firstImage = $artwork->getMedia('artwork-images')->first();
                if ($firstImage) {
                    $firstImage->setCustomProperty('is_primary', true);
                    $firstImage->save();
                }
            }

            Log::info('Image deleted from artwork', [
                'artwork_id' => $artwork->id,
                'media_id' => $mediaId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete image', [
                'artwork_id' => $artwork->id,
                'media_id' => $mediaId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image'
            ], 500);
        }
    }

    /**
     * Set an image as primary
     */
    public function setPrimaryImage(Request $request, Artwork $artwork, $mediaId)
    {
        try {
            // Remove primary from all images
            foreach ($artwork->getMedia('artwork-images') as $media) {
                $media->setCustomProperty('is_primary', false);
                $media->save();
            }

            // Set the selected image as primary
            $media = $artwork->getMedia('artwork-images')->where('id', $mediaId)->first();
            if ($media) {
                $media->setCustomProperty('is_primary', true);
                $media->save();
            }

            Log::info('Primary image set for artwork', [
                'artwork_id' => $artwork->id,
                'media_id' => $mediaId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Primary image updated!'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to set primary image', [
                'artwork_id' => $artwork->id,
                'media_id' => $mediaId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to set primary image'
            ], 500);
        }
    }

    /**
     * Reorder images
     */
    public function reorderImages(Request $request, Artwork $artwork)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'required|integer'
        ]);

        try {
            foreach ($request->order as $index => $mediaId) {
                $media = $artwork->getMedia('artwork-images')->where('id', $mediaId)->first();
                if ($media) {
                    $media->order_column = $index;
                    $media->save();
                }
            }

            Log::info('Images reordered for artwork', [
                'artwork_id' => $artwork->id,
                'order' => $request->order
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image order updated!'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to reorder images', [
                'artwork_id' => $artwork->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder images'
            ], 500);
        }
    }
}
