import { useState, useRef, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import {
    Image as ImageIcon,
    Upload,
    X,
    Search,
    Grid,
    Check,
    FolderOpen,
    Trash2,
    Link as LinkIcon,
    Loader2,
    ExternalLink
} from 'lucide-react';

/**
 * ImagePicker Component - A reusable component for selecting images from the CMS library
 * or uploading new images. Perfect for CMS settings and content management.
 * 
 * @param {string} value - Current image URL
 * @param {function} onChange - Callback when image is selected (receives URL string)
 * @param {string} label - Label for the input
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 * @param {string} helpText - Help text to display below the input
 */
export default function ImagePicker({ 
    value = '', 
    onChange, 
    label = 'Image', 
    placeholder = 'Enter image URL or select from library',
    error = '',
    helpText = ''
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Get unique categories from images
    const categories = ['all', ...new Set(images.map(img => img.category).filter(Boolean))];

    // Helper to check if current value matches an image URL
    const isImageSelected = (imageUrl) => {
        if (!value || !imageUrl) return false;
        // Compare URLs - normalize both to handle relative vs absolute
        const normalizeUrl = (url) => {
            if (!url) return '';
            // Remove origin from full URLs for comparison
            try {
                const parsed = new URL(url, window.location.origin);
                return parsed.pathname;
            } catch {
                return url.startsWith('/') ? url : `/${url}`;
            }
        };
        return normalizeUrl(value) === normalizeUrl(imageUrl);
    };

    // Filter images
    const filteredImages = images.filter(image => {
        const matchesSearch = !searchQuery || 
            image.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.alt_text?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Open modal and fetch images
    const openModal = async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        
        try {
            const response = await fetch(route('admin.cms.images.list'));
            const data = await response.json();
            setImages(data.images || []);
        } catch (error) {
            console.error('Failed to fetch images:', error);
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle image selection
    const selectImage = (image) => {
        // Ensure we use the full URL
        let url = image.url;
        if (url && !url.startsWith('http')) {
            url = window.location.origin + url;
        }
        onChange(url);
        setIsModalOpen(false);
    };

    // Handle file upload
    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        const file = files[0]; // Single file for picker
        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ""));
        formData.append('category', 'cms');

        try {
            const response = await fetch(route('admin.cms.images.upload'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            setUploadProgress(100);
            
            if (result.success) {
                // Add to images list and select it
                setImages(prev => [result.image, ...prev]);
                onChange(result.image.url);
                setIsModalOpen(false);
            } else {
                alert(result.message || 'Failed to upload image');
            }
        } catch (error) {
            alert('Network error uploading image');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Drag and drop handlers
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    };

    // Clear image
    const clearImage = () => {
        onChange('');
    };

    return (
        <div className="space-y-2">
            {label && (
                <Label className="text-sm font-medium text-gray-700">{label}</Label>
            )}
            
            {/* Preview & Input Area */}
            <div className="space-y-3">
                {/* Current Image Preview */}
                {value && (
                    <div className="relative group">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                                src={value.startsWith('http') ? value : (value.startsWith('/') ? value : `/${value}`)}
                                alt="Selected image"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12">Image not found</text></svg>';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white hover:bg-gray-100"
                                        onClick={openModal}
                                    >
                                        <FolderOpen className="w-4 h-4 mr-1" />
                                        Change
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={clearImage}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* URL Input with Browse Button */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="pl-10 pr-10"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={openModal}
                        className="shrink-0 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                    >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Browse Library
                    </Button>
                </div>

                {/* Help Text */}
                {helpText && (
                    <p className="text-xs text-gray-500">{helpText}</p>
                )}

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Image Library</h2>
                                <p className="text-sm text-gray-600">Select an image or upload a new one</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-4 border-b bg-gray-50">
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                                    isDragging 
                                        ? 'border-purple-500 bg-purple-50' 
                                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                                }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                                        <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Drag & drop an image here, or{' '}
                                            <button
                                                type="button"
                                                className="text-purple-600 hover:text-purple-700 font-medium"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                browse
                                            </button>
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP up to 10MB</p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                            </div>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex items-center gap-3 p-4 border-b">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search images..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {categories.length > 1 && (
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Images Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-48">
                                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                                </div>
                            ) : filteredImages.length === 0 ? (
                                <div className="text-center py-12">
                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">
                                        {searchQuery ? 'No images found' : 'No images in library'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Upload an image above to get started
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {filteredImages.map((image) => {
                                        const selected = isImageSelected(image.url);
                                        const imageDisplayUrl = image.url?.startsWith('http') ? image.url : (image.url?.startsWith('/') ? image.url : `/${image.url}`);
                                        
                                        return (
                                        <button
                                            key={image.filename}
                                            type="button"
                                            onClick={() => selectImage(image)}
                                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                                selected 
                                                    ? 'border-purple-500 ring-2 ring-purple-200' 
                                                    : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <img
                                                src={imageDisplayUrl}
                                                alt={image.alt_text || image.original_name}
                                                className="w-full h-full object-cover"
                                            />
                                            {selected && (
                                                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs truncate">
                                                    {image.original_name || image.filename}
                                                </p>
                                            </div>
                                        </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-500">
                                {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} available
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
