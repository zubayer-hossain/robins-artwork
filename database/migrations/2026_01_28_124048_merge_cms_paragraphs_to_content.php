<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration merges multiple paragraph fields into a single content field
     * for the following sections:
     * - home/about (paragraph1, paragraph2)
     * - about/story (paragraph1, paragraph2, paragraph3)
     * - about/process (paragraph1, paragraph2, paragraph3)
     */
    public function up(): void
    {
        // Define sections that need merging
        $sectionsToMerge = [
            ['page' => 'home', 'section' => 'about', 'paragraphs' => ['paragraph1', 'paragraph2']],
            ['page' => 'about', 'section' => 'story', 'paragraphs' => ['paragraph1', 'paragraph2', 'paragraph3']],
            ['page' => 'about', 'section' => 'process', 'paragraphs' => ['paragraph1', 'paragraph2', 'paragraph3']],
        ];

        foreach ($sectionsToMerge as $section) {
            // Check if content already exists
            $existingContent = DB::table('cms_settings')
                ->where('page', $section['page'])
                ->where('section', $section['section'])
                ->where('key', 'content')
                ->first();

            if ($existingContent) {
                continue; // Skip if content already exists
            }

            // Get all paragraph values
            $paragraphs = [];
            foreach ($section['paragraphs'] as $paragraphKey) {
                $paragraph = DB::table('cms_settings')
                    ->where('page', $section['page'])
                    ->where('section', $section['section'])
                    ->where('key', $paragraphKey)
                    ->first();

                if ($paragraph && !empty($paragraph->value)) {
                    // Wrap in <p> tags if not already HTML
                    $value = $paragraph->value;
                    if (!str_starts_with(trim($value), '<')) {
                        $value = '<p>' . $value . '</p>';
                    }
                    $paragraphs[] = $value;
                }
            }

            // If we found paragraphs, create the merged content
            if (!empty($paragraphs)) {
                $mergedContent = implode('', $paragraphs);

                // Insert the new content field
                DB::table('cms_settings')->insert([
                    'page' => $section['page'],
                    'section' => $section['section'],
                    'key' => 'content',
                    'value' => $mergedContent,
                    'type' => 'textarea',
                    'description' => ucfirst($section['section']) . ' section content (supports rich text formatting)',
                    'sort_order' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Delete the old paragraph fields
                DB::table('cms_settings')
                    ->where('page', $section['page'])
                    ->where('section', $section['section'])
                    ->whereIn('key', $section['paragraphs'])
                    ->delete();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration cannot be reversed automatically
        // The original paragraph data would be lost
        // Run the CmsSeeder to restore default values if needed
    }
};
