<?php

namespace App\Services;

use App\Models\CmsSetting;
use Illuminate\Support\Facades\Cache;

class CmsService
{
    /**
     * Get CMS content for a specific page
     */
    public static function getPageContent(string $page): array
    {
        return CmsSetting::getPageSettings($page);
    }

    /**
     * Get a single CMS value
     */
    public static function get(string $page, string $section, string $key, $default = null)
    {
        return CmsSetting::getValue($page, $section, $key, $default);
    }

    /**
     * Get global settings
     */
    public static function getGlobalSettings(): array
    {
        return CmsSetting::getPageSettings('global');
    }

    /**
     * Get a global setting value
     */
    public static function getGlobal(string $section, string $key, $default = null)
    {
        return CmsSetting::getValue('global', $section, $key, $default);
    }

    /**
     * Check if a feature is enabled
     */
    public static function isEnabled(string $page, string $section, string $key): bool
    {
        $value = CmsSetting::getValue($page, $section, $key, '0');
        return in_array($value, ['1', 'true', true, 1], true);
    }

    /**
     * Get gallery control settings
     */
    public static function getGalleryControls(): array
    {
        return [
            'show_filters' => self::isEnabled('gallery', 'controls', 'show_filters'),
            'show_search' => self::isEnabled('gallery', 'controls', 'show_search'),
            'show_cart_button' => self::isEnabled('gallery', 'controls', 'show_cart_button'),
            'show_favorite_button' => self::isEnabled('gallery', 'controls', 'show_favorite_button'),
        ];
    }

    /**
     * Get home page stats settings
     */
    public static function getStatsSettings(): array
    {
        return [
            'show_stats' => self::isEnabled('home', 'stats', 'show_stats'),
            'stat1_label' => self::get('home', 'stats', 'stat1_label', 'Original Artworks'),
            'stat2_label' => self::get('home', 'stats', 'stat2_label', 'Limited Editions'),
            'stat3_label' => self::get('home', 'stats', 'stat3_label', 'Art Mediums'),
        ];
    }

    /**
     * Get default currency setting
     */
    public static function getDefaultCurrency(): string
    {
        return self::getGlobal('site', 'default_currency', 'USD');
    }

    /**
     * Get currency symbol for a currency code
     */
    public static function getCurrencySymbol(?string $currency = null): string
    {
        $currency = $currency ?? self::getDefaultCurrency();
        $symbols = [
            'USD' => '$',
            'GBP' => '£',
            'EUR' => '€',
        ];
        return $symbols[strtoupper($currency)] ?? '$';
    }
}