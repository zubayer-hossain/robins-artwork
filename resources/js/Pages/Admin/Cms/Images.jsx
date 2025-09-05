import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    ChevronRight, 
    Upload, 
    Image as ImageIcon, 
    Trash2, 
    Edit3, 
    Search, 
    Filter,
    Download,
    Eye,
    Copy,
    FolderPlus,
    Grid,
    List,
    MoreHorizontal
} from 'lucide-react';
import { useState, useRef } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';

export default function CmsImages({ auth, images, settings, breadcrumbs, pageTitle }) {
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [selectedImages, setSelectedImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploading, setIsUploading] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const fileInputRef = useRef(null);

    // Get unique categories from images
    const categories = ['all', ...new Set(images.map(img => img.category))];
    
    // Filter images based on search and category
    const filteredImages = images.filter(image => {
        const matchesSearch = !searchQuery || 
            image.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.alt_text.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        
        setIsUploading(true);
        
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ""));
            formData.append('category', 'general');

            try {
                const response = await fetch(route('admin.cms.images.upload'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                });

                const result = await response.json();
                
                if (result.success) {
                    window.toast?.success(`${file.name} uploaded successfully`);
                } else {
                    window.toast?.error(result.message || `Failed to upload ${file.name}`);
                }
            } catch (error) {
                window.toast?.error(`Network error uploading ${file.name}`);
            }
        }
        
        setIsUploading(false);
        // Refresh the page to show new images
        router.reload();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleImageSelect = (filename) => {
        setSelectedImages(prev => 
            prev.includes(filename) 
                ? prev.filter(f => f !== filename)
                : [...prev, filename]
        );
    };

    const handleSelectAll = () => {
        setSelectedImages(
            selectedImages.length === filteredImages.length 
                ? [] 
                : filteredImages.map(img => img.filename)
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) return;
        
        if (!confirm(`Delete ${selectedImages.length} image(s)?`)) return;

        try {
            const response = await fetch(route('admin.cms.images.organize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    action: 'delete_multiple',
                    image_filenames: selectedImages
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                window.toast?.success('Images deleted successfully');
                setSelectedImages([]);
                router.reload();
            } else {
                window.toast?.error('Failed to delete images');
            }
        } catch (error) {
            window.toast?.error('Network error');
        }
    };

    const handleBulkCategoryUpdate = async (newCategory) => {
        if (selectedImages.length === 0) return;

        try {
            const response = await fetch(route('admin.cms.images.organize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    action: 'update_category',
                    image_filenames: selectedImages,
                    category: newCategory
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                window.toast?.success('Category updated successfully');
                setSelectedImages([]);
                router.reload();
            } else {
                window.toast?.error('Failed to update category');
            }
        } catch (error) {
            window.toast?.error('Network error');
        }
    };

    const copyImageUrl = (image) => {
        navigator.clipboard.writeText(image.url);
        window.toast?.success('Image URL copied to clipboard');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={pageTitle}
            headerIcon={<ImageIcon className="w-8 h-8 text-white" />}
            headerDescription="Upload, organize, and manage website images"
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-purple-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href={route('admin.cms.index')} className="hover:text-purple-600 transition-colors font-medium">
                            CMS
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {breadcrumbs.filter(crumb => crumb.label.toLowerCase() !== 'cms').map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {crumb.url ? (
                                    <Link href={crumb.url} className="hover:text-purple-600 transition-colors font-medium">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-semibold">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.filter(crumb => crumb.label.toLowerCase() !== 'cms').length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* CMS Sidebar */}
                        <div className="lg:col-span-1">
                            <CmsSidebar 
                                currentPage="images" 
                                currentSection="upload"
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            {/* Upload Section */}
                            <Card className="border-0 shadow-xl mb-6">
                                <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Upload Images
                                                </CardTitle>
                                                <p className="text-gray-600 text-sm">
                                                    Drag & drop or click to upload images
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Files
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-gray-600">Uploading images...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                                                <p className="text-lg font-medium text-gray-900 mb-2">
                                                    Drop images here or click to browse
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Supports: JPEG, PNG, GIF, WebP (Max: 10MB each)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                    />
                                </CardContent>
                            </Card>

                            {/* Image Library */}
                            <Card className="border-0 shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <ImageIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Image Library
                                                </CardTitle>
                                                <p className="text-gray-600 text-sm">
                                                    {filteredImages.length} of {images.length} images
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            {/* Search */}
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search images..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-10 w-64"
                                                />
                                            </div>
                                            
                                            {/* Category Filter */}
                                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(category => (
                                                        <SelectItem key={category} value={category}>
                                                            {category === 'all' ? 'All Categories' : category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* View Mode */}
                                            <div className="flex border rounded-lg">
                                                <Button
                                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('grid')}
                                                    className="rounded-r-none"
                                                >
                                                    <Grid className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('list')}
                                                    className="rounded-l-none"
                                                >
                                                    <List className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bulk Actions */}
                                    {selectedImages.length > 0 && (
                                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mt-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-blue-900">
                                                    {selectedImages.length} image(s) selected
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedImages([])}
                                                >
                                                    Clear Selection
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Select onValueChange={handleBulkCategoryUpdate}>
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Change Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.filter(cat => cat !== 'all').map(category => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleDeleteSelected}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Selected
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="p-6">
                                    {filteredImages.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-lg font-medium text-gray-500 mb-2">
                                                {searchQuery || categoryFilter !== 'all' ? 'No images found' : 'No images uploaded yet'}
                                            </p>
                                            <p className="text-gray-400">
                                                {searchQuery || categoryFilter !== 'all' 
                                                    ? 'Try adjusting your search or filter criteria'
                                                    : 'Upload your first image to get started'
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Select All */}
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-gray-300"
                                                    />
                                                    Select All ({filteredImages.length})
                                                </label>
                                            </div>

                                            {/* Images Grid/List */}
                                            <div className={viewMode === 'grid' 
                                                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
                                                : 'space-y-3'
                                            }>
                                                {filteredImages.map((image) => (
                                                    <ImageCard
                                                        key={image.filename}
                                                        image={image}
                                                        viewMode={viewMode}
                                                        isSelected={selectedImages.includes(image.filename)}
                                                        onSelect={() => handleImageSelect(image.filename)}
                                                        onCopyUrl={() => copyImageUrl(image)}
                                                        formatFileSize={formatFileSize}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Image Card Component
function ImageCard({ image, viewMode, isSelected, onSelect, onCopyUrl, formatFileSize }) {
    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="rounded border-gray-300"
                />
                <img
                    src={image.url}
                    alt={image.alt_text}
                    className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{image.original_name}</p>
                    <p className="text-sm text-gray-500 truncate">{image.alt_text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>{formatFileSize(image.file_size)}</span>
                        <span>{image.dimensions.width} × {image.dimensions.height}</span>
                        <Badge variant="outline" className="text-xs">{image.category}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onCopyUrl}>
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="absolute top-2 left-2 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="rounded border-gray-300 shadow-sm"
                />
            </div>
            
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                    src={image.url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={onCopyUrl}>
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-3">
                <p className="font-medium text-gray-900 text-sm truncate" title={image.original_name}>
                    {image.original_name}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                        {image.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                        {formatFileSize(image.file_size)}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    {image.dimensions.width} × {image.dimensions.height}
                </p>
            </div>
        </div>
    );
}