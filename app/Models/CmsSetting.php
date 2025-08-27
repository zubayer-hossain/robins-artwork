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
}