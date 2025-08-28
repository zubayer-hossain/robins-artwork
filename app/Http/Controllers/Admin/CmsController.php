<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Facades\Image;

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
    public function page(string $page, string $section = null): Response
    {
        $settings = CmsSetting::where('page', $page)
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        // Define section order based on page to match frontend
        $sectionOrders = [
            'home' => ['hero', 'stats', 'featured', 'about', 'contact_cta'],
            'gallery' => ['header', 'controls', 'empty_state', 'cta', 'features', 'footer_info'],
            'about' => ['hero', 'story', 'philosophy', 'process', 'cta'],
            'contact' => ['hero', 'form', 'info', 'faq', 'cta']
        ];
        
        $orderedSections = $sectionOrders[$page] ?? array_keys($settings->toArray());
        $defaultSection = $section ?? ($orderedSections[0] ?? null);

        $breadcrumbs = [
            ['label' => 'CMS', 'url' => route('admin.cms.index')],
            ['label' => ucfirst($page) . ' Page', 'url' => null]
        ];

        return Inertia::render('Admin/Cms/Page', [
            'page' => $page,
            'settings' => $settings,
            'breadcrumbs' => $breadcrumbs,
            'pageTitle' => ucfirst($page) . ' Page Settings',
            'activeSection' => $defaultSection
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
    public function global(string $section = null): Response
    {
        $settings = CmsSetting::where('page', 'global')
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        // Define section order for global settings
        $sectionOrders = ['site', 'contact', 'social'];
        $orderedSections = $sectionOrders;
        $defaultSection = $section ?? ($orderedSections[0] ?? null);

        $breadcrumbs = [
            ['label' => 'CMS', 'url' => route('admin.cms.index')],
            ['label' => 'Global Settings', 'url' => null]
        ];

        return Inertia::render('Admin/Cms/Global', [
            'settings' => $settings,
            'breadcrumbs' => $breadcrumbs,
            'pageTitle' => 'Global Settings',
            'activeSection' => $defaultSection
        ]);
    }

    /**
     * Show image management interface
     */
    public function images(): Response
    {
        $images = CmsSetting::getUploadedImages();
        $settings = CmsSetting::getImageSettings();
        
        $breadcrumbs = [
            ['label' => 'CMS', 'url' => route('admin.cms.index')],
            ['label' => 'Image Management', 'url' => null]
        ];

        return Inertia::render('Admin/Cms/Images', [
            'images' => $images,
            'settings' => $settings,
            'breadcrumbs' => $breadcrumbs,
            'pageTitle' => 'Image Management'
        ]);
    }

    /**
     * Upload new image
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
            'alt_text' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100'
        ]);

        $file = $request->file('image');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        
        // Generate unique filename
        $filename = Str::slug($originalName) . '-' . time() . '.' . $extension;
        
        // Store original image
        $path = $file->storeAs('cms/images', $filename, 'public');
        
        // Create thumbnails
        $this->createThumbnails($file, $filename);
        
        // Store image record
        $imageData = [
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => Storage::url($path),
            'alt_text' => $request->alt_text ?? $originalName,
            'category' => $request->category ?? 'general',
            'file_size' => $file->getSize(),
            'dimensions' => $this->getImageDimensions($file),
            'uploaded_at' => now()->toISOString()
        ];
        
        // Add to collection using model method
        CmsSetting::addImage($imageData);
        
        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully!',
            'image' => $imageData
        ]);
    }

    /**
     * Delete image
     */
    public function deleteImage(Request $request, string $filename)
    {
        $image = CmsSetting::getImageByFilename($filename);
        
        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Image not found'
            ], 404);
        }
        
        // Delete files from storage
        Storage::disk('public')->delete($image['path']);
        Storage::disk('public')->delete('cms/images/thumbs/thumb_' . $image['filename']);
        Storage::disk('public')->delete('cms/images/thumbs/medium_' . $image['filename']);
        
        // Remove from collection using model method
        $success = CmsSetting::removeImage($filename);
        
        return response()->json([
            'success' => $success,
            'message' => $success ? 'Image deleted successfully!' : 'Failed to delete image'
        ]);
    }

    /**
     * Update image metadata
     */
    public function updateImage(Request $request, string $filename)
    {
        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100'
        ]);
        
        $updateData = [];
        if ($request->has('alt_text')) {
            $updateData['alt_text'] = $request->alt_text;
        }
        if ($request->has('category')) {
            $updateData['category'] = $request->category;
        }
        
        $success = CmsSetting::updateImage($filename, $updateData);
        
        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Image not found'
            ], 404);
        }
        
        $updatedImage = CmsSetting::getImageByFilename($filename);
        
        return response()->json([
            'success' => true,
            'message' => 'Image updated successfully!',
            'image' => $updatedImage
        ]);
    }

    /**
     * Organize images (bulk operations)
     */
    public function organizeImages(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete_multiple,update_category',
            'image_filenames' => 'required|array',
            'category' => 'nullable|string|max:100'
        ]);
        
        switch ($request->action) {
            case 'delete_multiple':
                foreach ($request->image_filenames as $filename) {
                    $image = CmsSetting::getImageByFilename($filename);
                    if ($image) {
                        // Delete files
                        Storage::disk('public')->delete($image['path']);
                        Storage::disk('public')->delete('cms/images/thumbs/thumb_' . $image['filename']);
                        Storage::disk('public')->delete('cms/images/thumbs/medium_' . $image['filename']);
                        // Remove from collection
                        CmsSetting::removeImage($filename);
                    }
                }
                break;
                
            case 'update_category':
                foreach ($request->image_filenames as $filename) {
                    CmsSetting::updateImage($filename, ['category' => $request->category]);
                }
                break;
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Images organized successfully!'
        ]);
    }



    /**
     * Create thumbnails for uploaded image
     */
    private function createThumbnails($file, string $filename): void
    {
        try {
            // Create thumbnails directory if it doesn't exist
            if (!Storage::disk('public')->exists('cms/images/thumbs')) {
                Storage::disk('public')->makeDirectory('cms/images/thumbs');
            }
            
            $image = Image::make($file);
            
            // Create small thumbnail (150x150)
            $thumb = clone $image;
            $thumb->fit(150, 150)->save(storage_path('app/public/cms/images/thumbs/thumb_' . $filename));
            
            // Create medium thumbnail (400x400)
            $medium = clone $image;
            $medium->fit(400, 400)->save(storage_path('app/public/cms/images/thumbs/medium_' . $filename));
            
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Log::warning('Failed to create thumbnails for ' . $filename . ': ' . $e->getMessage());
        }
    }

    /**
     * Get image dimensions
     */
    private function getImageDimensions($file): array
    {
        try {
            $image = Image::make($file);
            return [
                'width' => $image->width(),
                'height' => $image->height()
            ];
        } catch (\Exception $e) {
            return ['width' => 0, 'height' => 0];
        }
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