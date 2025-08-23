<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CartItem;
use App\Models\User;
use App\Models\Artwork;
use App\Models\Edition;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users, artworks, and editions
        $users = User::all();
        $artworks = Artwork::all();
        $editions = Edition::all();

        if ($users->isEmpty() || $artworks->isEmpty()) {
            $this->command->warn('No users or artworks found. Please run UserSeeder and ArtworkSeeder first.');
            return;
        }

        foreach ($users as $user) {
            // Create 1-4 cart items per user
            $numItems = rand(1, 4);
            $usedArtworks = [];
            
            for ($i = 0; $i < $numItems; $i++) {
                // Select random artwork (avoid duplicates in same cart)
                $availableArtworks = $artworks->whereNotIn('id', $usedArtworks);
                if ($availableArtworks->isEmpty()) break;
                
                $artwork = $availableArtworks->random();
                $usedArtworks[] = $artwork->id;
                
                // Random quantity between 1 and 3
                $quantity = rand(1, 3);
                
                // Decide if this is an artwork or edition
                $isEdition = rand(0, 1) && !$editions->isEmpty();
                
                if ($isEdition) {
                    // Find editions for this artwork
                    $artworkEditions = $editions->where('artwork_id', $artwork->id);
                    if ($artworkEditions->isNotEmpty()) {
                        $edition = $artworkEditions->random();
                        
                        CartItem::create([
                            'user_id' => $user->id,
                            'artwork_id' => $artwork->id,
                            'edition_id' => $edition->id,
                            'quantity' => $quantity,
                            'price' => $edition->price ?? $artwork->price,
                            'name' => $artwork->title . ' - ' . $edition->name,
                            'description' => $artwork->medium . ' • ' . $artwork->year . ' • Edition',
                        ]);
                    } else {
                        // Fallback to artwork only
                        CartItem::create([
                            'user_id' => $user->id,
                            'artwork_id' => $artwork->id,
                            'edition_id' => null,
                            'quantity' => $quantity,
                            'price' => $artwork->price,
                            'name' => $artwork->title,
                            'description' => $artwork->medium . ' • ' . $artwork->year,
                        ]);
                    }
                } else {
                    // Artwork only
                    CartItem::create([
                        'user_id' => $user->id,
                        'artwork_id' => $artwork->id,
                        'edition_id' => null,
                        'quantity' => $quantity,
                        'price' => $artwork->price,
                        'name' => $artwork->title,
                        'description' => $artwork->medium . ' • ' . $artwork->year,
                    ]);
                }
            }
        }

        $this->command->info('Cart items seeded successfully!');
    }
}
