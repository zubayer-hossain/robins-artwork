import { useState, useRef, useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Image as ImageIcon,
    Upload,
    X,
    Star,
    Trash2,
    Loader2,
    GripVertical,
    Plus,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

/**
 * ImageUploader Component - A drag-and-drop image uploader for artworks
 * Supports multiple images, reordering, and setting primary image.
 * 
 * @param {number} artworkId - ID of the artwork (required for upload/delete operations)
 * @param {array} images - Array of existing images [{id, thumb, medium, xl, is_primary}]
 * @param {function} onImagesChange - Callback when images change
 * @param {boolean} disabled - Disable all interactions
 */
export default function ImageUploader({ 
    artworkId,
    images = [], 
    onImagesChange,
    disabled = false
}) {
    const [localImages, setLocalImages] = useState(images);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    // Show toast message
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Handle file upload
    const handleFileUpload = async (files) => {
        if (!files || files.length === 0 || !artworkId) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images[]', file);
        });

        try {
            const response = await fetch(route('admin.artworks.images.upload', artworkId), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            setUploadProgress(100);
            
            if (result.success) {
                const newImages = [...localImages, ...result.images];
                setLocalImages(newImages);
                onImagesChange?.(newImages);
                showToast(result.message);
            } else {
                showToast(result.message || 'Failed to upload images', 'error');
            }
        } catch (error) {
            showToast('Network error uploading images', 'error');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle delete image
    const handleDelete = async (imageId) => {
        if (!artworkId || !confirm('Delete this image?')) return;

        try {
            const response = await fetch(route('admin.artworks.images.delete', [artworkId, imageId]), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                const newImages = localImages.filter(img => img.id !== imageId);
                // If deleted was primary, set first as primary
                if (newImages.length > 0 && !newImages.some(img => img.is_primary)) {
                    newImages[0].is_primary = true;
                }
                setLocalImages(newImages);
                onImagesChange?.(newImages);
                showToast('Image deleted');
            } else {
                showToast(result.message || 'Failed to delete image', 'error');
            }
        } catch (error) {
            showToast('Network error deleting image', 'error');
        }
    };

    // Handle set primary
    const handleSetPrimary = async (imageId) => {
        if (!artworkId) return;

        try {
            const response = await fetch(route('admin.artworks.images.primary', [artworkId, imageId]), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                const newImages = localImages.map(img => ({
                    ...img,
                    is_primary: img.id === imageId
                }));
                setLocalImages(newImages);
                onImagesChange?.(newImages);
                showToast('Primary image updated');
            } else {
                showToast(result.message || 'Failed to set primary', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    // Drag and drop handlers for file upload
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        
        // Check if it's a file drop or reorder drop
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    }, [artworkId, localImages]);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes('Files')) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    };

    // Image reordering
    const handleImageDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleImageDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...localImages];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);
        
        setDraggedIndex(index);
        setLocalImages(newImages);
    };

    const handleImageDragEnd = async () => {
        if (draggedIndex === null || !artworkId) {
            setDraggedIndex(null);
            return;
        }

        setDraggedIndex(null);
        onImagesChange?.(localImages);

        // Save order to backend
        try {
            const response = await fetch(route('admin.artworks.images.reorder', artworkId), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: localImages.map(img => img.id)
                }),
            });

            const result = await response.json();
            if (!result.success) {
                showToast('Failed to save order', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    const noArtworkYet = !artworkId;

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    noArtworkYet 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : isDragging 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer'
                }`}
                onDrop={!noArtworkYet ? handleDrop : undefined}
                onDragOver={!noArtworkYet ? handleDragOver : undefined}
                onDragEnter={!noArtworkYet ? handleDragEnter : undefined}
                onDragLeave={!noArtworkYet ? handleDragLeave : undefined}
                onClick={() => !noArtworkYet && !isUploading && fileInputRef.current?.click()}
            >
                <div className="p-6 text-center">
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        className="fill-none stroke-gray-200 stroke-[4]"
                                    />
                                    <circle
                                        cx="32" cy="32" r="28"
                                        className="fill-none stroke-purple-600 stroke-[4]"
                                        strokeDasharray={175.9}
                                        strokeDashoffset={175.9 - (175.9 * uploadProgress) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-purple-600">{uploadProgress}%</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Uploading images...</p>
                        </div>
                    ) : noArtworkYet ? (
                        <>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Save artwork first</p>
                            <p className="text-xs text-gray-400">You can add images after creating the artwork</p>
                        </>
                    ) : (
                        <>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                                isDragging ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                                <Upload className={`w-6 h-6 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP up to 10MB each</p>
                        </>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={noArtworkYet || isUploading}
                />
            </div>

            {/* Images Grid */}
            {localImages.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                            {localImages.length} Image{localImages.length !== 1 ? 's' : ''}
                        </h4>
                        <p className="text-xs text-gray-500">Drag to reorder</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {localImages.map((image, index) => (
                            <div
                                key={image.id}
                                draggable={!disabled && artworkId}
                                onDragStart={(e) => handleImageDragStart(e, index)}
                                onDragOver={(e) => handleImageDragOver(e, index)}
                                onDragEnd={handleImageDragEnd}
                                className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                    image.is_primary 
                                        ? 'border-yellow-400 ring-2 ring-yellow-200' 
                                        : 'border-gray-200 hover:border-gray-300'
                                } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                            >
                                <img
                                    src={image.thumb || image.medium || image.xl}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Primary Badge */}
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-yellow-400 text-yellow-900 text-xs gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            Primary
                                        </Badge>
                                    </div>
                                )}

                                {/* Drag Handle */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-6 h-6 bg-white/90 rounded shadow flex items-center justify-center cursor-grab">
                                        <GripVertical className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-1">
                                        {!image.is_primary && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 px-2 bg-white/90 hover:bg-white text-gray-700"
                                                onClick={() => handleSetPrimary(image.id)}
                                                disabled={disabled}
                                            >
                                                <Star className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 px-2"
                                            onClick={() => handleDelete(image.id)}
                                            disabled={disabled}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Add More Button */}
                        {artworkId && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 flex flex-col items-center justify-center gap-2"
                                disabled={disabled || isUploading}
                            >
                                <Plus className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500">Add More</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {localImages.length === 0 && artworkId && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No images uploaded yet</p>
                    <p className="text-xs text-gray-400 mt-1">Upload images to showcase this artwork</p>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300 ${
                    toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                } text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2`}>
                    {toast.type === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                    ) : (
                        <CheckCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}
        </div>
    );
}
