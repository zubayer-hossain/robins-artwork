<?php

namespace Database\Seeders;

use App\Models\Artwork;
use App\Models\Edition;
use Illuminate\Database\Seeder;

class EditionSeeder extends Seeder
{
    public function run(): void
    {
        $artworks = Artwork::take(5)->get();

        foreach ($artworks as $artwork) {
            // Create limited edition prints
            Edition::create([
                'artwork_id' => $artwork->id,
                'sku' => 'ED-' . strtoupper(substr($artwork->medium, 0, 2)) . '-' . $artwork->id . '-001',
                'edition_total' => 50,
                'price' => $artwork->price * 0.3, // 30% of original price
                'stock' => 50,
                'is_limited' => true,
            ]);

            // Create open edition prints for some artworks
            if ($artwork->is_print_available) {
                Edition::create([
                    'artwork_id' => $artwork->id,
                    'sku' => 'OE-' . strtoupper(substr($artwork->medium, 0, 2)) . '-' . $artwork->id . '-002',
                    'edition_total' => 0, // Unlimited
                    'price' => $artwork->price * 0.2, // 20% of original price
                    'stock' => 100,
                    'is_limited' => false,
                ]);
            }
        }
    }
}
