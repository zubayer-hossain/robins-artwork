<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Edition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditionController extends Controller
{
    public function index(): Response
    {
        $editions = Edition::with(['artwork'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Editions/Index', [
            'editions' => $editions->through(function ($edition) {
                return [
                    'id' => $edition->id,
                    'sku' => $edition->sku,
                    'price' => $edition->price,
                    'stock' => $edition->stock,
                    'is_limited' => $edition->is_limited,
                    'artwork' => [
                        'id' => $edition->artwork->id,
                        'title' => $edition->artwork->title,
                        'slug' => $edition->artwork->slug,
                    ],
                    'created_at' => $edition->created_at->format('M d, Y'),
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        $artworks = Artwork::where('status', 'published')
            ->select('id', 'title', 'slug')
            ->get();

        return Inertia::render('Admin/Editions/Create', [
            'artworks' => $artworks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
            'sku' => 'required|string|max:255|unique:editions,sku',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_limited' => 'boolean',
        ]);

        Edition::create($validated);

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edition created successfully.');
    }

    public function edit(Edition $edition): Response
    {
        $artworks = Artwork::where('status', 'published')
            ->select('id', 'title', 'slug')
            ->get();

        return Inertia::render('Admin/Editions/Edit', [
            'edition' => [
                'id' => $edition->id,
                'artwork_id' => $edition->artwork_id,
                'sku' => $edition->sku,
                'price' => $edition->price,
                'stock' => $edition->stock,
                'is_limited' => $edition->is_limited,
            ],
            'artworks' => $artworks,
        ]);
    }

    public function update(Request $request, Edition $edition)
    {
        $validated = $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
            'sku' => 'required|string|max:255|unique:editions,sku,' . $edition->id,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_limited' => 'boolean',
        ]);

        $edition->update($validated);

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edition updated successfully.');
    }

    public function destroy(Edition $edition)
    {
        $edition->delete();

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edition deleted successfully.');
    }
}
