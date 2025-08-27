<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    /**
     * Display CMS overview dashboard
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Cms/Index', [
            'pages' => $this->getPagesOverview()
        ]);
    }

    /**
     * Show settings for a specific page
     */
    public function page(string $page): Response
    {
        $settings = CmsSetting::where('page', $page)
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        $breadcrumbs = [
            ['label' => 'CMS', 'url' => route('admin.cms.index')],
            ['label' => ucfirst($page) . ' Page', 'url' => null]
        ];

        return Inertia::render('Admin/Cms/Page', [
            'page' => $page,
            'settings' => $settings,
            'breadcrumbs' => $breadcrumbs,
            'pageTitle' => ucfirst($page) . ' Page Settings'
        ]);
    }

    /**
     * Update page settings
     */
    public function updatePage(Request $request, string $page)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:cms_settings,id',
            'settings.*.value' => 'nullable|string'
        ]);

        foreach ($request->settings as $settingData) {
            $setting = CmsSetting::find($settingData['id']);
            if ($setting) {
                $setting->update(['value' => $settingData['value']]);
            }
        }

        // Clear cache for this page
        CmsSetting::clearCache($page);

        return redirect()->back()->with('success', ucfirst($page) . ' page settings updated successfully!');
    }

    /**
     * Show global settings
     */
    public function global(): Response
    {
        $settings = CmsSetting::where('page', 'global')
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        $breadcrumbs = [
            ['label' => 'CMS', 'url' => route('admin.cms.index')],
            ['label' => 'Global Settings', 'url' => null]
        ];

        return Inertia::render('Admin/Cms/Global', [
            'settings' => $settings,
            'breadcrumbs' => $breadcrumbs,
            'pageTitle' => 'Global Settings'
        ]);
    }

    /**
     * Update global settings
     */
    public function updateGlobal(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:cms_settings,id',
            'settings.*.value' => 'nullable|string'
        ]);

        foreach ($request->settings as $settingData) {
            $setting = CmsSetting::find($settingData['id']);
            if ($setting) {
                $setting->update(['value' => $settingData['value']]);
            }
        }

        // Clear cache for global settings
        CmsSetting::clearCache('global');

        return redirect()->back()->with('success', 'Global settings updated successfully!');
    }

    /**
     * Get pages overview with stats
     */
    private function getPagesOverview(): array
    {
        $pages = ['home', 'gallery', 'about', 'contact'];
        $overview = [];

        foreach ($pages as $page) {
            $settingsCount = CmsSetting::where('page', $page)->count();
            $sectionsCount = CmsSetting::where('page', $page)
                ->distinct('section')
                ->count();

            $overview[] = [
                'name' => $page,
                'title' => ucfirst($page) . ' Page',
                'description' => $this->getPageDescription($page),
                'settings_count' => $settingsCount,
                'sections_count' => $sectionsCount,
                'icon' => $this->getPageIcon($page),
                'color' => $this->getPageColor($page),
                'url' => route('admin.cms.page', $page)
            ];
        }

        return $overview;
    }

    /**
     * Get page description for overview
     */
    private function getPageDescription(string $page): string
    {
        return match($page) {
            'home' => 'Manage homepage hero, stats, featured content and call-to-action sections',
            'gallery' => 'Control gallery display, filters, and artwork interaction features',
            'about' => 'Edit artist story, philosophy, and biography content',
            'contact' => 'Update contact information, form settings, and FAQ content',
            default => 'Manage page content and settings'
        };
    }

    /**
     * Get page icon for overview
     */
    private function getPageIcon(string $page): string
    {
        return match($page) {
            'home' => '🏠',
            'gallery' => '🎨',
            'about' => '👨‍🎨',
            'contact' => '📧',
            default => '📄'
        };
    }

    /**
     * Get page color for overview
     */
    private function getPageColor(string $page): string
    {
        return match($page) {
            'home' => 'from-blue-500 to-purple-600',
            'gallery' => 'from-purple-500 to-pink-600',
            'about' => 'from-green-500 to-blue-600',
            'contact' => 'from-orange-500 to-red-600',
            default => 'from-gray-500 to-gray-600'
        };
    }
}