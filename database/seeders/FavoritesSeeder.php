<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserFavorite;
use App\Models\User;
use App\Models\Artwork;

class FavoritesSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users and artworks
        $users = User::all();
        $artworks = Artwork::all();

        if ($users->isEmpty() || $artworks->isEmpty()) {
            $this->command->warn('No users or artworks found. Please run UserSeeder and ArtworkSeeder first.');
            return;
        }

        foreach ($users as $user) {
            // Create 3-8 favorites per user
            $numFavorites = rand(3, 8);
            $usedArtworks = [];
            
            for ($i = 0; $i < $numFavorites; $i++) {
                // Select random artwork (avoid duplicates for same user)
                $availableArtworks = $artworks->whereNotIn('id', $usedArtworks);
                if ($availableArtworks->isEmpty()) break;
                
                $artwork = $availableArtworks->random();
                $usedArtworks[] = $artwork->id;
                
                UserFavorite::create([
                    'user_id' => $user->id,
                    'artwork_id' => $artwork->id,
                ]);
            }
        }

        $this->command->info('User favorites seeded successfully!');
    }
}
