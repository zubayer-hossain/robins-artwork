<?php

namespace Database\Seeders;

use App\Models\Artwork;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtworkSeeder extends Seeder
{
    public function run(): void
    {
        $artworks = [
            [
                'title' => 'Mountain Vista',
                'medium' => 'Oil',
                'year' => 2024,
                'size_text' => '24" x 36"',
                'price' => 1200.00,
                'status' => 'published',
                'story' => ['content' => 'A breathtaking mountain landscape painted in oils, capturing the majesty of nature.'],
                'tags' => ['Oil', 'Landscape', 'Mountain', 'Nature', '2024'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Urban Reflections',
                'medium' => 'Watercolor',
                'year' => 2023,
                'size_text' => '18" x 24"',
                'price' => 800.00,
                'status' => 'published',
                'story' => ['content' => 'City lights reflected in rain puddles, a modern urban scene.'],
                'tags' => ['Watercolor', 'Urban', 'City', 'Reflection', '2023'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Wildflower Meadow',
                'medium' => 'Acrylic',
                'year' => 2024,
                'size_text' => '30" x 40"',
                'price' => 950.00,
                'status' => 'published',
                'story' => ['content' => 'A vibrant meadow filled with wildflowers in full bloom.'],
                'tags' => ['Acrylic', 'Flowers', 'Nature', 'Colorful', '2024'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Ocean Waves',
                'medium' => 'Gouache',
                'year' => 2023,
                'size_text' => '22" x 28"',
                'price' => 750.00,
                'status' => 'published',
                'story' => ['content' => 'Dynamic ocean waves crashing against rocky shores.'],
                'tags' => ['Gouache', 'Ocean', 'Waves', 'Seascape', '2023'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Forest Path',
                'medium' => 'Oil',
                'year' => 2024,
                'size_text' => '36" x 48"',
                'price' => 1500.00,
                'status' => 'published',
                'story' => ['content' => 'A serene forest path leading through ancient trees.'],
                'tags' => ['Oil', 'Forest', 'Path', 'Nature', '2024'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Desert Sunset',
                'medium' => 'Watercolor',
                'year' => 2023,
                'size_text' => '20" x 30"',
                'price' => 650.00,
                'status' => 'published',
                'story' => ['content' => 'Warm desert colors as the sun sets over sand dunes.'],
                'tags' => ['Watercolor', 'Desert', 'Sunset', 'Warm', '2023'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Abstract Harmony',
                'medium' => 'Mixed Media',
                'year' => 2024,
                'size_text' => '40" x 40"',
                'price' => 1800.00,
                'status' => 'published',
                'story' => ['content' => 'An abstract composition exploring color and form.'],
                'tags' => ['Mixed Media', 'Abstract', 'Modern', 'Color', '2024'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Bird in Flight',
                'medium' => 'Ink',
                'year' => 2023,
                'size_text' => '16" x 20"',
                'price' => 450.00,
                'status' => 'published',
                'story' => ['content' => 'A graceful bird captured in mid-flight with ink strokes.'],
                'tags' => ['Ink', 'Bird', 'Flight', 'Minimal', '2023'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Winter Solitude',
                'medium' => 'Oil',
                'year' => 2024,
                'size_text' => '28" x 36"',
                'price' => 1100.00,
                'status' => 'published',
                'story' => ['content' => 'A peaceful winter scene with snow-covered trees.'],
                'tags' => ['Oil', 'Winter', 'Snow', 'Peaceful', '2024'],
                'is_original' => true,
                'is_print_available' => true,
            ],
            [
                'title' => 'Garden Party',
                'medium' => 'Acrylic',
                'year' => 2023,
                'size_text' => '24" x 30"',
                'price' => 900.00,
                'status' => 'published',
                'story' => ['content' => 'A colorful garden scene with flowers and butterflies.'],
                'tags' => ['Acrylic', 'Garden', 'Flowers', 'Butterflies', '2023'],
                'is_original' => true,
                'is_print_available' => true,
            ],
        ];

        foreach ($artworks as $artworkData) {
            $artworkData['slug'] = Str::slug($artworkData['title']);
            $artwork = Artwork::create($artworkData);
            
            // Add media with more reliable image URLs
            try {
                // Use more reliable image service
                $imageUrls = [
                    'https://picsum.photos/seed/' . $artwork->id . '1/600/600',
                    'https://picsum.photos/seed/' . $artwork->id . '2/1000/1000',
                    'https://picsum.photos/seed/' . $artwork->id . '3/2000/2000',
                ];
                
                foreach ($imageUrls as $index => $imageUrl) {
                    $media = $artwork->addMediaFromUrl($imageUrl)
                        ->toMediaCollection('artwork-images', 'public');
                    
                    // Set custom properties
                    $media->setCustomProperty('is_primary', $index === 0);
                    $media->save();
                    
                    // Add a small delay to avoid overwhelming the image service
                    usleep(100000); // 0.1 second delay
                }
            } catch (\Exception $e) {
                // If external images fail, just log the error and continue
                \Log::warning("Failed to add external images for artwork {$artwork->id}: " . $e->getMessage());
                
                // Don't create placeholder media - just continue without images
                // The frontend will handle missing images gracefully
            }
        }
    }
}
