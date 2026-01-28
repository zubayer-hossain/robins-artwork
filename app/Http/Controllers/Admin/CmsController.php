<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
    public function page(string $page, Request $request): Response
    {
        $section = $request->query('section');
        
        $settings = CmsSetting::where('page', $page)
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        $sectionOrders = [
            'home' => ['hero', 'stats', 'featured', 'about', 'contact_cta'],
            'gallery' => ['header', 'controls', 'empty_state', 'cta'],
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

        CmsSetting::clearCache($page);

        return redirect()->back()->with('success', ucfirst($page) . ' page settings updated successfully!');
    }

    /**
     * Add a new FAQ item
     */
    public function addFaq(Request $request, string $page, string $section)
    {
        // Find the highest existing FAQ number
        $existingFaqs = CmsSetting::where('page', $page)
            ->where('section', $section)
            ->where('key', 'like', 'faq%_question')
            ->get();

        $maxNum = 0;
        foreach ($existingFaqs as $faq) {
            if (preg_match('/faq(\d+)_question/', $faq->key, $matches)) {
                $maxNum = max($maxNum, (int) $matches[1]);
            }
        }

        $newNum = $maxNum + 1;
        $maxSortOrder = CmsSetting::where('page', $page)
            ->where('section', $section)
            ->max('sort_order') ?? 0;

        // Create the question field
        CmsSetting::create([
            'page' => $page,
            'section' => $section,
            'key' => "faq{$newNum}_question",
            'value' => '',
            'type' => 'text',
            'description' => "FAQ {$newNum} question",
            'sort_order' => $maxSortOrder + 1,
            'is_active' => true
        ]);

        // Create the answer field
        CmsSetting::create([
            'page' => $page,
            'section' => $section,
            'key' => "faq{$newNum}_answer",
            'value' => '',
            'type' => 'textarea',
            'description' => "FAQ {$newNum} answer",
            'sort_order' => $maxSortOrder + 2,
            'is_active' => true
        ]);

        CmsSetting::clearCache($page);

        return redirect()->back()->with('success', "FAQ {$newNum} added successfully!");
    }

    /**
     * Delete a FAQ item
     */
    public function deleteFaq(Request $request, string $page, string $section, int $faqNum)
    {
        // Delete both question and answer
        CmsSetting::where('page', $page)
            ->where('section', $section)
            ->where(function ($query) use ($faqNum) {
                $query->where('key', "faq{$faqNum}_question")
                      ->orWhere('key', "faq{$faqNum}_answer");
            })
            ->delete();

        CmsSetting::clearCache($page);

        return redirect()->back()->with('success', "FAQ {$faqNum} deleted successfully!");
    }

    /**
     * Show global settings
     */
    public function global(Request $request): Response
    {
        $section = $request->query('section');
        
        $settings = CmsSetting::where('page', 'global')
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('section');

        $sectionOrders = ['site', 'contact', 'social', 'images'];
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

        CmsSetting::clearCache('global');

        return redirect()->back()->with('success', 'Global settings updated successfully!');
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
     * List images as JSON (for image picker component)
     */
    public function listImages()
    {
        $images = CmsSetting::getUploadedImages();
        
        // Ensure all images have full URLs
        $images = array_map(function($image) {
            // If URL is relative, convert to full URL
            if (isset($image['url']) && !str_starts_with($image['url'], 'http')) {
                $image['url'] = url($image['url']);
            }
            // Also store relative URL for flexibility
            if (isset($image['path']) && !isset($image['relative_url'])) {
                $image['relative_url'] = Storage::url($image['path']);
            }
            return $image;
        }, $images);
        
        return response()->json([
            'success' => true,
            'images' => $images
        ]);
    }

    /**
     * Upload new image
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'alt_text' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100'
        ]);

        try {
            $file = $request->file('image');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = strtolower($file->getClientOriginalExtension());
            
            // Generate unique filename
            $filename = Str::slug($originalName) . '-' . time() . '.' . $extension;
            
            // Ensure directories exist
            $this->ensureDirectoriesExist();
            
            // Store original image
            $path = $file->storeAs('cms/images', $filename, 'public');
            
            // Get image dimensions
            $dimensions = $this->getImageDimensions($file->getRealPath());
            
            // Create thumbnails using native PHP GD
            $this->createThumbnails($file->getRealPath(), $filename, $extension);
            
            // Store image record - use full URL for better compatibility
            $relativeUrl = Storage::url($path);
            $fullUrl = url($relativeUrl);
            
            $imageData = [
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => $fullUrl,
                'relative_url' => $relativeUrl,
                'alt_text' => $request->alt_text ?? $originalName,
                'category' => $request->category ?? 'general',
                'file_size' => $file->getSize(),
                'dimensions' => $dimensions,
                'uploaded_at' => now()->toISOString()
            ];
            
            CmsSetting::addImage($imageData);
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully!',
                'image' => $imageData
            ]);
            
        } catch (\Exception $e) {
            Log::error('Image upload error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
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
        
        try {
            // Delete files from storage
            if (isset($image['path'])) {
                Storage::disk('public')->delete($image['path']);
            }
            Storage::disk('public')->delete('cms/images/thumbs/thumb_' . $filename);
            Storage::disk('public')->delete('cms/images/thumbs/medium_' . $filename);
            
            // Remove from collection
            $success = CmsSetting::removeImage($filename);
            
            return response()->json([
                'success' => $success,
                'message' => $success ? 'Image deleted successfully!' : 'Failed to delete image'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Image delete error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image'
            ], 500);
        }
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
        
        try {
            switch ($request->action) {
                case 'delete_multiple':
                    foreach ($request->image_filenames as $filename) {
                        $image = CmsSetting::getImageByFilename($filename);
                        if ($image) {
                            // Delete files
                            if (isset($image['path'])) {
                                Storage::disk('public')->delete($image['path']);
                            }
                            Storage::disk('public')->delete('cms/images/thumbs/thumb_' . $filename);
                            Storage::disk('public')->delete('cms/images/thumbs/medium_' . $filename);
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
            
        } catch (\Exception $e) {
            Log::error('Image organize error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to organize images'
            ], 500);
        }
    }

    /**
     * Ensure required directories exist
     */
    private function ensureDirectoriesExist(): void
    {
        $directories = [
            'cms/images',
            'cms/images/thumbs'
        ];
        
        foreach ($directories as $dir) {
            if (!Storage::disk('public')->exists($dir)) {
                Storage::disk('public')->makeDirectory($dir);
            }
        }
    }

    /**
     * Create thumbnails using native PHP GD
     */
    private function createThumbnails(string $sourcePath, string $filename, string $extension): void
    {
        try {
            // Load the source image based on extension
            $sourceImage = $this->loadImage($sourcePath, $extension);
            
            if (!$sourceImage) {
                Log::warning('Failed to load source image for thumbnails: ' . $filename);
                return;
            }
            
            $originalWidth = imagesx($sourceImage);
            $originalHeight = imagesy($sourceImage);
            
            // Create small thumbnail (150x150)
            $this->createResizedImage(
                $sourceImage,
                $originalWidth,
                $originalHeight,
                150,
                150,
                storage_path('app/public/cms/images/thumbs/thumb_' . $filename),
                $extension
            );
            
            // Create medium thumbnail (400x400)
            $this->createResizedImage(
                $sourceImage,
                $originalWidth,
                $originalHeight,
                400,
                400,
                storage_path('app/public/cms/images/thumbs/medium_' . $filename),
                $extension
            );
            
            // Free memory
            imagedestroy($sourceImage);
            
        } catch (\Exception $e) {
            Log::warning('Failed to create thumbnails for ' . $filename . ': ' . $e->getMessage());
        }
    }

    /**
     * Load image from file based on extension
     */
    private function loadImage(string $path, string $extension)
    {
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
                return @imagecreatefromjpeg($path);
            case 'png':
                return @imagecreatefrompng($path);
            case 'gif':
                return @imagecreatefromgif($path);
            case 'webp':
                if (function_exists('imagecreatefromwebp')) {
                    return @imagecreatefromwebp($path);
                }
                return null;
            default:
                return null;
        }
    }

    /**
     * Create a resized/cropped image (fit to dimensions)
     */
    private function createResizedImage($sourceImage, int $originalWidth, int $originalHeight, int $targetWidth, int $targetHeight, string $outputPath, string $extension): void
    {
        // Calculate crop dimensions to maintain aspect ratio and fill target
        $sourceRatio = $originalWidth / $originalHeight;
        $targetRatio = $targetWidth / $targetHeight;
        
        if ($sourceRatio > $targetRatio) {
            // Source is wider - crop width
            $cropHeight = $originalHeight;
            $cropWidth = (int)($originalHeight * $targetRatio);
            $cropX = (int)(($originalWidth - $cropWidth) / 2);
            $cropY = 0;
        } else {
            // Source is taller - crop height
            $cropWidth = $originalWidth;
            $cropHeight = (int)($originalWidth / $targetRatio);
            $cropX = 0;
            $cropY = (int)(($originalHeight - $cropHeight) / 2);
        }
        
        // Create the thumbnail image
        $thumb = imagecreatetruecolor($targetWidth, $targetHeight);
        
        // Preserve transparency for PNG and GIF
        if (in_array(strtolower($extension), ['png', 'gif'])) {
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);
            $transparent = imagecolorallocatealpha($thumb, 0, 0, 0, 127);
            imagefilledrectangle($thumb, 0, 0, $targetWidth, $targetHeight, $transparent);
        }
        
        // Copy and resize
        imagecopyresampled(
            $thumb,
            $sourceImage,
            0, 0,
            $cropX, $cropY,
            $targetWidth, $targetHeight,
            $cropWidth, $cropHeight
        );
        
        // Ensure output directory exists
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
        
        // Save based on extension
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
                imagejpeg($thumb, $outputPath, 85);
                break;
            case 'png':
                imagepng($thumb, $outputPath, 8);
                break;
            case 'gif':
                imagegif($thumb, $outputPath);
                break;
            case 'webp':
                if (function_exists('imagewebp')) {
                    imagewebp($thumb, $outputPath, 85);
                }
                break;
        }
        
        imagedestroy($thumb);
    }

    /**
     * Get image dimensions using native PHP
     */
    private function getImageDimensions(string $path): array
    {
        try {
            $imageInfo = @getimagesize($path);
            
            if ($imageInfo) {
                return [
                    'width' => $imageInfo[0],
                    'height' => $imageInfo[1]
                ];
            }
            
            return ['width' => 0, 'height' => 0];
            
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
