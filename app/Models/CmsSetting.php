<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CmsSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'page',
        'section',
        'key',
        'value',
        'type',
        'description',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    /**
     * Get a CMS value by page, section, and key
     */
    public static function getValue(string $page, string $section, string $key, $default = null)
    {
        $cacheKey = "cms.{$page}.{$section}.{$key}";
        
        return Cache::remember($cacheKey, 3600, function () use ($page, $section, $key, $default) {
            $setting = self::where('page', $page)
                          ->where('section', $section)
                          ->where('key', $key)
                          ->where('is_active', true)
                          ->first();
            
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Get all settings for a page
     */
    public static function getPageSettings(string $page)
    {
        $cacheKey = "cms.page.{$page}";
        
        return Cache::remember($cacheKey, 3600, function () use ($page) {
            return self::where('page', $page)
                      ->where('is_active', true)
                      ->orderBy('section')
                      ->orderBy('sort_order')
                      ->get()
                      ->groupBy('section')
                      ->map(function ($items) {
                          return $items->pluck('value', 'key');
                      });
        });
    }

    /**
     * Clear cache when model is updated
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($model) {
            self::clearCache($model->page);
        });

        static::deleted(function ($model) {
            self::clearCache($model->page);
        });
    }

    /**
     * Clear cache for a specific page
     */
    public static function clearCache(?string $page = null)
    {
        if ($page) {
            Cache::forget("cms.page.{$page}");
            // Clear individual setting caches for this page
            $settings = self::where('page', $page)->get();
            foreach ($settings as $setting) {
                Cache::forget("cms.{$setting->page}.{$setting->section}.{$setting->key}");
            }
        } else {
            // Clear all CMS cache
            Cache::flush();
        }
    }

    /**
     * Get uploaded images data
     */
    public static function getUploadedImages(): array
    {
        $setting = self::where('page', 'global')
            ->where('section', 'images')
            ->where('key', 'uploaded_images')
            ->where('is_active', true)
            ->first();
            
        if (!$setting || !$setting->value) {
            return [];
        }
        
        $images = json_decode($setting->value, true);
        return is_array($images) ? $images : [];
    }

    /**
     * Store uploaded images data
     */
    public static function setUploadedImages(array $images): void
    {
        self::updateOrCreate(
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'uploaded_images'
            ],
            [
                'value' => json_encode($images),
                'type' => 'json',
                'description' => 'Uploaded images data for CMS image management',
                'sort_order' => 1,
                'is_active' => true
            ]
        );
        
        // Clear cache
        self::clearCache('global');
    }

    /**
     * Get images by category
     */
    public static function getImagesByCategory(string $category = null): array
    {
        $allImages = self::getUploadedImages();
        
        if (!$category) {
            return $allImages;
        }
        
        return array_filter($allImages, function ($image) use ($category) {
            return isset($image['category']) && $image['category'] === $category;
        });
    }

    /**
     * Get image by filename
     */
    public static function getImageByFilename(string $filename): ?array
    {
        $images = self::getUploadedImages();
        
        foreach ($images as $image) {
            if (isset($image['filename']) && $image['filename'] === $filename) {
                return $image;
            }
        }
        
        return null;
    }

    /**
     * Add new image to the collection
     */
    public static function addImage(array $imageData): void
    {
        $images = self::getUploadedImages();
        $images[] = $imageData;
        self::setUploadedImages($images);
    }

    /**
     * Remove image from the collection
     */
    public static function removeImage(string $filename): bool
    {
        $images = self::getUploadedImages();
        $imageIndex = array_search($filename, array_column($images, 'filename'));
        
        if ($imageIndex === false) {
            return false;
        }
        
        unset($images[$imageIndex]);
        $images = array_values($images); // Re-index array
        
        self::setUploadedImages($images);
        return true;
    }

    /**
     * Update image in the collection
     */
    public static function updateImage(string $filename, array $updateData): bool
    {
        $images = self::getUploadedImages();
        $imageIndex = array_search($filename, array_column($images, 'filename'));
        
        if ($imageIndex === false) {
            return false;
        }
        
        // Merge update data with existing image data
        $images[$imageIndex] = array_merge($images[$imageIndex], $updateData);
        $images[$imageIndex]['updated_at'] = now()->toISOString();
        
        self::setUploadedImages($images);
        return true;
    }

    /**
     * Get image management settings
     */
    public static function getImageSettings(): array
    {
        return [
            'max_file_size' => self::getValue('global', 'images', 'max_file_size', '10240'), // 10MB default
            'allowed_types' => self::getValue('global', 'images', 'allowed_types', 'jpeg,png,jpg,gif,webp'),
            'thumbnail_sizes' => self::getValue('global', 'images', 'thumbnail_sizes', '150x150,400x400'),
            'auto_optimize' => self::getValue('global', 'images', 'auto_optimize', '1'),
            'storage_disk' => self::getValue('global', 'images', 'storage_disk', 'public'),
        ];
    }

    /**
     * Get managed image categories (stored list; lowercase)
     */
    public static function getImageCategories(): array
    {
        $setting = self::where('page', 'global')
            ->where('section', 'images')
            ->where('key', 'image_categories')
            ->where('is_active', true)
            ->first();

        if (!$setting || !$setting->value) {
            return ['general', 'hero', 'gallery', 'blog', 'uncategorized'];
        }

        $categories = json_decode($setting->value, true);
        return is_array($categories) ? array_map('strtolower', $categories) : ['general', 'hero', 'gallery', 'blog', 'uncategorized'];
    }

    /**
     * Set managed image categories (store as lowercase)
     */
    public static function setImageCategories(array $categories): void
    {
        $categories = array_values(array_unique(array_map('strtolower', $categories)));
        self::updateOrCreate(
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'image_categories'
            ],
            [
                'value' => json_encode($categories),
                'type' => 'json',
                'description' => 'Managed image categories for CMS',
                'sort_order' => 0,
                'is_active' => true
            ]
        );
        self::clearCache('global');
    }

    /**
     * Rename category across all images
     */
    public static function renameImageCategory(string $oldName, string $newName): int
    {
        $images = self::getUploadedImages();
        $count = 0;
        $oldLower = strtolower($oldName);
        $newLower = strtolower($newName);

        foreach ($images as $index => $image) {
            $cat = isset($image['category']) ? strtolower($image['category']) : '';
            if ($cat === $oldLower) {
                $images[$index]['category'] = $newLower;
                $count++;
            }
        }

        if ($count > 0) {
            self::setUploadedImages($images);
        }
        return $count;
    }

    /**
     * Reassign images in a category to uncategorized
     */
    public static function reassignImagesToUncategorized(string $categoryName): int
    {
        return self::renameImageCategory($categoryName, 'uncategorized');
    }
}