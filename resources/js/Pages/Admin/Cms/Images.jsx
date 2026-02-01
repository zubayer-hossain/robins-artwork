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
    Search, 
    Download,
    Eye,
    Copy,
    Grid,
    List,
    X,
    CheckCircle,
    Sparkles,
    FolderOpen,
    Maximize2,
    Info,
    AlertCircle,
    Tags,
    Pencil,
    Plus
} from 'lucide-react';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';
import ConfirmDialog from '@/Components/ConfirmDialog';

const toTitleCase = (s) => !s ? '' : s.charAt(0).toUpperCase() + (s.slice(1) || '').toLowerCase();

export default function CmsImages({ auth, images, settings, breadcrumbs, pageTitle, categories: backendCategories = [] }) {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedImages, setSelectedImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, filename: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadCategory, setUploadCategory] = useState('General');
    const [bulkCategorySelect, setBulkCategorySelect] = useState('');
    const [managedCategories, setManagedCategories] = useState(backendCategories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [categoryDeleteConfirm, setCategoryDeleteConfirm] = useState(null);
    const [isCategorySaving, setIsCategorySaving] = useState(false);
    const fileInputRef = useRef(null);

    // Merge backend categories with any from images (title-case for display)
    const categoriesForFilter = useMemo(() => {
        const fromImages = [...new Set(images.map(img => img.category).filter(Boolean))].map(toTitleCase);
        const fromBackend = managedCategories.map(toTitleCase);
        const set = new Set([...fromBackend, ...fromImages]);
        set.add('Uncategorized');
        return ['all', ...set];
    }, [images, managedCategories]);

    const uploadCategoryOptions = useMemo(() => {
        const fromImages = [...new Set(images.map(img => img.category).filter(Boolean))].map(toTitleCase);
        const fromBackend = managedCategories.map(toTitleCase);
        return [...new Set([...fromBackend, ...fromImages])].sort();
    }, [images, managedCategories]);

    useEffect(() => {
        setManagedCategories(backendCategories || []);
    }, [backendCategories]);
    
    // Helper to get display URL (handles relative/absolute URLs)
    const getDisplayUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return url.startsWith('/') ? url : `/${url}`;
    };

    // Helper to get full URL for copying
    const getFullUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return window.location.origin + (url.startsWith('/') ? url : `/${url}`);
    };

    // Filter images based on search and category
    const filteredImages = images.filter(image => {
        const matchesSearch = !searchQuery || 
            image.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.alt_text?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all'
            || (categoryFilter === 'Uncategorized' ? !image.category || image.category?.toLowerCase() === 'uncategorized' : image.category?.toLowerCase() === categoryFilter?.toLowerCase());
        
        return matchesSearch && matchesCategory;
    });

    const showToast = (message) => {
        setSuccessMessage(message);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        const totalFiles = files.length;
        let completedFiles = 0;
        
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ""));
            formData.append('category', uploadCategory.toLowerCase());

            try {
                const response = await fetch(route('admin.cms.images.upload'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                const result = await response.json();
                
                completedFiles++;
                setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
                
                if (result.success) {
                    showToast(`${file.name} uploaded successfully`);
                } else {
                    window.toast?.error(result.message || `Failed to upload ${file.name}`);
                }
            } catch (error) {
                completedFiles++;
                setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
                window.toast?.error(`Network error uploading ${file.name}`);
            }
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        router.reload();
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleFileUpload(files);
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

    const performDeleteSelected = async () => {
        if (selectedImages.length === 0) return;
        setIsDeleting(true);
        try {
            const response = await fetch(route('admin.cms.images.organize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    action: 'delete_multiple',
                    image_filenames: selectedImages
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                showToast('Images deleted successfully');
                setSelectedImages([]);
                setDeleteConfirm({ open: false, type: null, filename: null });
                router.reload();
            } else {
                window.toast?.error('Failed to delete images');
            }
        } catch (error) {
            window.toast?.error('Network error');
        } finally {
            setIsDeleting(false);
        }
    };

    const performDeleteSingle = async (filename) => {
        if (!filename) return;
        setIsDeleting(true);
        try {
            const response = await fetch(route('admin.cms.images.organize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    action: 'delete_multiple',
                    image_filenames: [filename]
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                showToast('Image deleted successfully');
                setDeleteConfirm({ open: false, type: null, filename: null });
                router.reload();
            } else {
                window.toast?.error('Failed to delete image');
            }
        } catch (error) {
            window.toast?.error('Network error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedImages.length === 0) return;
        setDeleteConfirm({ open: true, type: 'bulk', filename: null });
    };

    const handleDeleteSingle = (filename) => {
        setDeleteConfirm({ open: true, type: 'single', filename });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm.type === 'bulk') {
            await performDeleteSelected();
        } else if (deleteConfirm.type === 'single' && deleteConfirm.filename) {
            await performDeleteSingle(deleteConfirm.filename);
        }
    };

    const handleBulkCategoryUpdate = async (newCategory) => {
        if (selectedImages.length === 0) return;

        try {
            const response = await fetch(route('admin.cms.images.organize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    action: 'update_category',
                    image_filenames: selectedImages,
                    category: newCategory.toLowerCase()
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                showToast('Category updated successfully');
                setSelectedImages([]);
                setBulkCategorySelect('');
                router.reload();
            } else {
                window.toast?.error('Failed to update category');
            }
        } catch (error) {
            window.toast?.error('Network error');
        }
    };

    const handleAddCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        setIsCategorySaving(true);
        try {
            const response = await fetch(route('admin.cms.images.categories.store'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ name: name.toLowerCase() }),
            });
            const result = await response.json();
            if (result.success) {
                setManagedCategories(result.categories || []);
                setNewCategoryName('');
                showToast(result.message || 'Category added.');
            } else {
                window.toast?.error(result.message || 'Failed to add category');
            }
        } catch (error) {
            window.toast?.error('Network error');
        } finally {
            setIsCategorySaving(false);
        }
    };

    const handleSaveEditCategory = async () => {
        const newName = editCategoryName.trim().toLowerCase();
        if (!editingCategory || !newName) return;
        setIsCategorySaving(true);
        try {
            const response = await fetch(route('admin.cms.images.categories.update'), {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    old_name: editingCategory.toLowerCase(),
                    new_name: newName,
                    update_images: true,
                }),
            });
            const result = await response.json();
            if (result.success) {
                setManagedCategories(result.categories || []);
                setEditingCategory(null);
                setEditCategoryName('');
                showToast(result.message || 'Category updated.');
            } else {
                window.toast?.error(result.message || 'Failed to update category');
            }
        } catch (error) {
            window.toast?.error('Network error');
        } finally {
            setIsCategorySaving(false);
        }
    };

    const handleCancelEditCategory = () => {
        setEditingCategory(null);
        setEditCategoryName('');
    };

    const performDeleteCategory = async () => {
        if (!categoryDeleteConfirm?.name) return;
        setIsCategorySaving(true);
        try {
            const response = await fetch(route('admin.cms.images.categories.destroy'), {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: categoryDeleteConfirm.name.toLowerCase(),
                    reassign_uncategorized: true,
                }),
            });
            const result = await response.json();
            if (result.success) {
                setManagedCategories(result.categories || []);
                setCategoryDeleteConfirm(null);
                showToast(result.message || 'Category deleted.');
                router.reload();
            } else {
                window.toast?.error(result.message || 'Failed to delete category');
            }
        } catch (error) {
            window.toast?.error('Network error');
        } finally {
            setIsCategorySaving(false);
        }
    };

    const copyImageUrl = (image) => {
        // Ensure we copy the full URL
        const url = getFullUrl(image.url);
        navigator.clipboard.writeText(url);
        showToast('Image URL copied to clipboard');
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
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
            <Head title={`${pageTitle} - CMS`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs + Manage Categories */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href={route('admin.dashboard')} className="hover:text-blue-600 transition-colors font-medium">
                                Admin
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <Link href={route('admin.cms.index')} className="hover:text-blue-600 transition-colors font-medium">
                                CMS
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 font-semibold">Image Management</span>
                        </nav>
                        <Button
                            variant="outline"
                            className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shrink-0"
                            onClick={() => document.getElementById('manage-categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                            <Tags className="w-4 h-4 mr-2" />
                            Manage Categories
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* CMS Sidebar */}
                        <div className="lg:col-span-1">
                            <CmsSidebar 
                                currentPage="images" 
                                currentSection="upload"
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Upload Section */}
                            <Card className="border-0 shadow-xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-white">
                                                    Upload Images
                                                </CardTitle>
                                                <p className="text-blue-100 text-sm">
                                                    Drag & drop or click to upload
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Files
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {/* Category for new uploads */}
                                    <div className="mb-4 flex flex-wrap items-center gap-3">
                                        <Label className="text-sm font-medium text-gray-700">Category for new uploads</Label>
                                        <Select value={uploadCategory} onValueChange={setUploadCategory}>
                                            <SelectTrigger className="w-48 bg-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {uploadCategoryOptions.map(cat => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-500">Images you upload will be saved under this category.</p>
                                    </div>
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                                            isDragging 
                                                ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' 
                                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                        }`}
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-24 h-24 mb-6">
                                                    <svg className="w-24 h-24 transform -rotate-90">
                                                        <circle
                                                            className="text-gray-200"
                                                            strokeWidth="6"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="45"
                                                            cx="48"
                                                            cy="48"
                                                        />
                                                        <circle
                                                            className="text-blue-600"
                                                            strokeWidth="6"
                                                            strokeDasharray={283}
                                                            strokeDashoffset={283 - (283 * uploadProgress) / 100}
                                                            strokeLinecap="round"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="45"
                                                            cx="48"
                                                            cy="48"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-blue-600">{uploadProgress}%</span>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900 mb-1">Uploading images...</p>
                                                <p className="text-sm text-gray-500">Please wait while your files are being uploaded</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                                                    isDragging 
                                                        ? 'bg-blue-100 scale-110 rotate-3' 
                                                        : 'bg-gray-100'
                                                }`}>
                                                    <ImageIcon className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
                                                </div>
                                                <p className="text-xl font-semibold text-gray-900 mb-2">
                                                    {isDragging ? 'Drop your images here!' : 'Drag & drop images here'}
                                                </p>
                                                <p className="text-gray-500 mb-6">or click to browse from your computer</p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {['JPEG', 'PNG', 'GIF', 'WebP'].map(format => (
                                                        <Badge key={format} variant="outline" className="text-xs bg-white">
                                                            {format}
                                                        </Badge>
                                                    ))}
                                                    <Badge variant="outline" className="text-xs bg-white">Max 10MB</Badge>
                                                </div>
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
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                <FolderOpen className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Image Library
                                                </CardTitle>
                                                <p className="text-gray-500 text-sm">
                                                    {filteredImages.length} of {images.length} images
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Filters */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Search */}
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search images..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-10 w-48 lg:w-64 bg-white"
                                                />
                                            </div>
                                            
                                            {/* Category Filter */}
                                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                <SelectTrigger className="w-36 bg-white">
                                                    <SelectValue placeholder="All Categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoriesForFilter.map(category => (
                                                        <SelectItem key={category} value={category}>
                                                            {category === 'all' ? 'All Categories' : category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* View Mode Toggle */}
                                            <div className="flex bg-gray-100 rounded-lg p-1">
                                                <Button
                                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('grid')}
                                                    className={`rounded-md ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                                                >
                                                    <Grid className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('list')}
                                                    className={`rounded-md ${viewMode === 'list' ? 'shadow-sm' : ''}`}
                                                >
                                                    <List className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bulk Actions */}
                                    {selectedImages.length > 0 && (
                                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mt-4 border border-blue-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-blue-900">
                                                    {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedImages([])}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Select value={bulkCategorySelect} onValueChange={(v) => { setBulkCategorySelect(v); handleBulkCategoryUpdate(v); }}>
                                                    <SelectTrigger className="w-40 bg-white">
                                                        <SelectValue placeholder="Change Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoriesForFilter.filter(cat => cat !== 'all').map(category => (
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
                                                    className="shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="p-6">
                                    {filteredImages.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <ImageIcon className="w-12 h-12 text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {searchQuery || categoryFilter !== 'all' ? 'No images found' : 'No images uploaded yet'}
                                            </h3>
                                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                {searchQuery || categoryFilter !== 'all' 
                                                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                                                    : 'Upload your first image to get started. Drag & drop or use the upload button above.'
                                                }
                                            </p>
                                            {(searchQuery || categoryFilter !== 'all') && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setCategoryFilter('all');
                                                    }}
                                                >
                                                    Clear Filters
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Select All */}
                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="group-hover:text-gray-900 transition-colors">
                                                        Select All ({filteredImages.length})
                                                    </span>
                                                </label>
                                                <div className="text-sm text-gray-500">
                                                    Total size: {formatFileSize(filteredImages.reduce((sum, img) => sum + (img.file_size || 0), 0))}
                                                </div>
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
                                                        onPreview={() => setPreviewImage(image)}
                                                        onCopyUrl={() => copyImageUrl(image)}
                                                        onDelete={() => handleDeleteSingle(image.filename)}
                                                        formatFileSize={formatFileSize}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Manage Categories — settings at bottom so Upload and Library flow first */}
                            <Card id="manage-categories" className="border-0 shadow-xl overflow-hidden scroll-mt-6">
                                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <Tags className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-white">
                                                Manage Categories
                                            </CardTitle>
                                            <p className="text-emerald-100 text-sm">
                                                Add, rename, or remove image categories. Names are stored in lowercase; displayed in title case.
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex flex-wrap items-end gap-3 mb-6">
                                        <div className="flex-1 min-w-[200px]">
                                            <Label htmlFor="new-category" className="text-sm font-medium text-gray-700">New category</Label>
                                            <Input
                                                id="new-category"
                                                placeholder="e.g. Blog, Products"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                                className="mt-1 bg-white"
                                                disabled={isCategorySaving}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddCategory}
                                            disabled={!newCategoryName.trim() || isCategorySaving}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            {isCategorySaving ? 'Adding…' : 'Add Category'}
                                        </Button>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Current categories</Label>
                                        {managedCategories.length === 0 ? (
                                            <p className="text-sm text-gray-500 py-2">No custom categories yet. Add one above or use categories when uploading.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {managedCategories.map((cat) => (
                                                    <li
                                                        key={cat}
                                                        className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                                    >
                                                        {editingCategory === cat ? (
                                                            <>
                                                                <Input
                                                                    value={editCategoryName}
                                                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleSaveEditCategory();
                                                                        if (e.key === 'Escape') handleCancelEditCategory();
                                                                    }}
                                                                    className="flex-1 max-w-xs bg-white"
                                                                    autoFocus
                                                                    disabled={isCategorySaving}
                                                                />
                                                                <Button size="sm" onClick={handleSaveEditCategory} disabled={!editCategoryName.trim() || isCategorySaving}>
                                                                    Save
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={handleCancelEditCategory} disabled={isCategorySaving}>
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="flex-1 font-medium text-gray-900">{toTitleCase(cat)}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setEditingCategory(cat);
                                                                        setEditCategoryName(toTitleCase(cat));
                                                                    }}
                                                                    className="text-gray-500 hover:text-gray-700"
                                                                    disabled={isCategorySaving}
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>
                                                                {cat.toLowerCase() !== 'uncategorized' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setCategoryDeleteConfirm({ open: true, name: cat })}
                                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                        disabled={isCategorySaving}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <ConfirmDialog
                isOpen={deleteConfirm.open}
                onClose={() => !isDeleting && setDeleteConfirm({ open: false, type: null, filename: null })}
                onConfirm={handleConfirmDelete}
                title={deleteConfirm.type === 'bulk' ? 'Delete selected images?' : 'Delete this image?'}
                message={deleteConfirm.type === 'bulk'
                    ? `Delete ${selectedImages.length} image(s)? This action cannot be undone.`
                    : 'Delete this image? This action cannot be undone.'}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
                variant="danger"
            />

            {/* Category delete confirmation modal */}
            <ConfirmDialog
                isOpen={!!(categoryDeleteConfirm?.open && categoryDeleteConfirm?.name)}
                onClose={() => !isCategorySaving && setCategoryDeleteConfirm(null)}
                onConfirm={performDeleteCategory}
                title="Delete this category?"
                message={categoryDeleteConfirm?.name
                    ? `Delete the category "${toTitleCase(categoryDeleteConfirm.name)}"? Images in this category will be set to Uncategorized.`
                    : ''}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isCategorySaving}
                variant="danger"
            />

            {/* Image Preview Modal / Lightbox */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div 
                        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <img
                                src={getDisplayUrl(previewImage.url)}
                                alt={previewImage.alt_text}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                        
                        {/* Image Info Panel */}
                        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{previewImage.original_name}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                                        {previewImage.dimensions && (
                                            <span className="flex items-center gap-1">
                                                <Maximize2 className="w-4 h-4" />
                                                {previewImage.dimensions.width} × {previewImage.dimensions.height}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Info className="w-4 h-4" />
                                            {formatFileSize(previewImage.file_size)}
                                        </span>
                                        {previewImage.category && (
                                            <Badge variant="secondary" className="bg-white/20 text-white">
                                                {previewImage.category}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Button 
                                        variant="secondary" 
                                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                                        onClick={() => copyImageUrl(previewImage)}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy URL
                                    </Button>
                                    <a href={getDisplayUrl(previewImage.url)} download={previewImage.original_name}>
                                        <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

// Image Card Component
function ImageCard({ image, viewMode, isSelected, onSelect, onPreview, onCopyUrl, onDelete, formatFileSize }) {
    const [isHovered, setIsHovered] = useState(false);
    
    // Helper to get display URL (handles relative/absolute URLs)
    const getDisplayUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return url.startsWith('/') ? url : `/${url}`;
    };
    
    const imageUrl = getDisplayUrl(image.url);
    
    if (viewMode === 'list') {
        return (
            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div 
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer group"
                    onClick={onPreview}
                >
                    <img
                        src={imageUrl}
                        alt={image.alt_text}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{image.original_name}</p>
                    <p className="text-sm text-gray-500 truncate">{image.alt_text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>{formatFileSize(image.file_size)}</span>
                        {image.dimensions && (
                            <span>{image.dimensions.width} × {image.dimensions.height}</span>
                        )}
                        {image.category && (
                            <Badge variant="outline" className="text-xs">{image.category}</Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onPreview} className="hover:bg-blue-50">
                        <Eye className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onCopyUrl} className="hover:bg-blue-50">
                        <Copy className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete} className="hover:bg-red-50 text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected 
                    ? 'ring-3 ring-blue-500 ring-offset-2 shadow-lg' 
                    : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Selection Checkbox */}
            <div className={`absolute top-3 left-3 z-10 transition-all duration-200 ${
                isSelected || isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-5 h-5 rounded-md border-2 border-white shadow-lg cursor-pointer bg-white/90"
                />
            </div>
            
            {/* Image Container */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer" onClick={onPreview}>
                <img
                    src={imageUrl}
                    alt={image.alt_text}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Overlay with Actions */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-300 flex items-end justify-center pb-4 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="flex gap-2">
                        <Button 
                            size="sm" 
                            className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); onPreview(); }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); onCopyUrl(); }}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm truncate mb-2" title={image.original_name}>
                    {image.original_name}
                </p>
                <div className="flex items-center justify-between">
                    {image.category && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                            {image.category}
                        </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                        {formatFileSize(image.file_size)}
                    </span>
                </div>
                {image.dimensions && (
                    <p className="text-xs text-gray-400 mt-2">
                        {image.dimensions.width} × {image.dimensions.height}
                    </p>
                )}
            </div>
        </div>
    );
}
