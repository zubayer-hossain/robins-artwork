<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Edition;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditionController extends Controller
{
    public function index(): Response
    {
        $editions = Edition::with(['artwork'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($edition) {
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
            ->orderBy('title')
            ->get(['id', 'title', 'slug']);

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

        $edition = Edition::create($validated);

        return redirect()->route('admin.editions.edit', $edition)
            ->with('success', 'Edition created successfully.');
    }

    public function edit(Edition $edition): Response
    {
        $edition->load(['artwork']);
        
        $artworks = Artwork::where('status', 'published')
            ->orderBy('title')
            ->get(['id', 'title', 'slug']);

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
                ] : null,
            ],
            'artworks' => $artworks,
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

        $edition->update($validated);

        return back()->with('success', 'Edition updated successfully.');
    }

    public function destroy(Edition $edition)
    {
        $edition->delete();

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edition deleted successfully.');
    }
}