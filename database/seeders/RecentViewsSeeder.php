<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserRecentView;
use App\Models\User;
use App\Models\Artwork;
use Carbon\Carbon;

class RecentViewsSeeder extends Seeder
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
            // Create 5-15 recent views per user
            $numViews = rand(5, 15);
            $usedArtworks = [];
            
            for ($i = 0; $i < $numViews; $i++) {
                // Select random artwork (avoid duplicates for same user)
                $availableArtworks = $artworks->whereNotIn('id', $usedArtworks);
                if ($availableArtworks->isEmpty()) break;
                
                $artwork = $availableArtworks->random();
                $usedArtworks[] = $artwork->id;
                
                // Random view time within last 30 days
                $viewedAt = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
                
                UserRecentView::create([
                    'user_id' => $user->id,
                    'artwork_id' => $artwork->id,
                    'viewed_at' => $viewedAt,
                ]);
            }
        }

        $this->command->info('User recent views seeded successfully!');
    }
}
