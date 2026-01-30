import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Save, X, Palette, Edit, Eye, Image as ImageIcon, Package, Plus, Trash2, DollarSign } from 'lucide-react';
import ImageUploader from '@/Components/ImageUploader';
import RichTextEditor from '@/Components/RichTextEditor';

export default function AdminArtworksEdit({ auth, artwork, mediums, statuses, flash }) {
    const { currency } = usePage().props;
    const [newTagInput, setNewTagInput] = useState('');
    const [artworkImages, setArtworkImages] = useState(artwork?.images || []);

    const { data, setData, put, processing, errors } = useForm({
        title: artwork?.title || '',
        slug: artwork?.slug || '',
        medium: artwork?.medium || '',
        year: artwork?.year || '',
        size_text: artwork?.size_text || '',
        price: artwork?.price || '',
        status: artwork?.status || 'draft',
        story: artwork?.story || { content: '' },
        tags: artwork?.tags || [],
        is_original: artwork?.is_original ?? true,
        is_print_available: artwork?.is_print_available ?? false,
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success && window.toast) {
            window.toast.success(flash.success, 'Success');
        }
        if (flash?.error && window.toast) {
            window.toast.error(flash.error, 'Error');
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.artworks.update', artwork.id), {
            onError: (errors) => {
                if (window.toast) {
                    window.toast.error('Please check the form for errors.', 'Validation Error');
                }
            }
        });
    };

    const addTag = () => {
        const input = newTagInput.trim();
        if (!input) return;

        // Check if input contains commas - split into multiple tags
        if (input.includes(',')) {
            const newTags = input
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag && !data.tags.includes(tag));
            
            if (newTags.length > 0) {
                setData('tags', [...data.tags, ...newTags]);
            }
        } else {
            // Single tag
            if (!data.tags.includes(input)) {
                setData('tags', [...data.tags, input]);
            }
        }
        setNewTagInput('');
    };

    const removeTag = (tagToRemove) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleTagPaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText.includes(',')) {
            e.preventDefault();
            const newTags = pastedText
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag && !data.tags.includes(tag));
            
            if (newTags.length > 0) {
                setData('tags', [...data.tags, ...newTags]);
            }
            setNewTagInput('');
        }
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={`Edit ${artwork.title}`}
            headerIcon={<Edit className="w-8 h-8 text-white" />}
            headerDescription="Update artwork details"
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href={route('admin.artworks.show', artwork.id)}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <Eye className="w-4 h-4 mr-2" />
                            View Artwork
                        </Button>
                    </Link>
                    <Link href={route('admin.artworks.index')}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Artworks
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${artwork.title}`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-purple-600" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Enter artwork title"
                                                required
                                            />
                                            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="slug">URL Slug</Label>
                                            <Input
                                                id="slug"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                placeholder="artwork-url-slug"
                                            />
                                            {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="medium">Medium *</Label>
                                            <Select value={data.medium} onValueChange={(value) => setData('medium', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select medium" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mediums.map((medium) => (
                                                        <SelectItem key={medium} value={medium}>
                                                            {medium}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.medium && <p className="text-sm text-red-600 mt-1">{errors.medium}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="year">Year</Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={data.year}
                                                onChange={(e) => setData('year', e.target.value)}
                                                placeholder="2024"
                                                min="1900"
                                                max={new Date().getFullYear() + 1}
                                            />
                                            {errors.year && <p className="text-sm text-red-600 mt-1">{errors.year}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="price">Price ({currency?.symbol || '$'})</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                            />
                                            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="size_text">Size Description</Label>
                                        <Input
                                            id="size_text"
                                            value={data.size_text}
                                            onChange={(e) => setData('size_text', e.target.value)}
                                            placeholder="e.g., 30cm x 40cm, A4, etc."
                                        />
                                        {errors.size_text && <p className="text-sm text-red-600 mt-1">{errors.size_text}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Save className="w-5 h-5 text-blue-600" />
                                        Description & Tags
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <Label htmlFor="story">Story/Description</Label>
                                        <p className="text-xs text-gray-500 mb-2">Use the rich text editor to format your artwork's story</p>
                                        <RichTextEditor
                                            content={data.story.content || ''}
                                            onChange={(content) => setData('story', { ...data.story, content })}
                                            placeholder="Tell the story behind this artwork..."
                                        />
                                        {errors.story && <p className="text-sm text-red-600 mt-1">{errors.story}</p>}
                                    </div>

                                    <div>
                                        <Label>Tags</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {data.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="gap-1">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 hover:text-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">Paste comma-separated tags or add one at a time</p>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newTagInput}
                                                onChange={(e) => setNewTagInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                onPaste={handleTagPaste}
                                                placeholder="wildlife, nature, landscape..."
                                                className="flex-1"
                                            />
                                            <Button type="button" onClick={addTag} variant="outline">
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images Section */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-purple-900">
                                        <ImageIcon className="w-5 h-5" />
                                        Artwork Images
                                        {artworkImages.length > 0 && (
                                            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                                                {artworkImages.length}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ImageUploader
                                        artworkId={artwork.id}
                                        images={artworkImages}
                                        onImagesChange={setArtworkImages}
                                    />
                                </CardContent>
                            </Card>

                            {/* Editions Section */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-orange-900">
                                            <Package className="w-5 h-5" />
                                            Print Editions
                                            {artwork.editions && artwork.editions.length > 0 && (
                                                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                                                    {artwork.editions.length}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <Link href={route('admin.editions.create') + `?artwork_id=${artwork.id}`}>
                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Edition
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {artwork.editions && artwork.editions.length > 0 ? (
                                        <div className="space-y-3">
                                            {artwork.editions.map((edition) => (
                                                <div 
                                                    key={edition.id}
                                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            edition.is_limited 
                                                                ? 'bg-orange-100 text-orange-600' 
                                                                : 'bg-green-100 text-green-600'
                                                        }`}>
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono font-medium text-gray-900">{edition.sku}</span>
                                                                {edition.is_limited ? (
                                                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                                                        Limited ({edition.edition_total})
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                                                        Open Edition
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                                <span className="flex items-center gap-1">
                                                                    <DollarSign className="w-3 h-3" />
                                                                    {currency?.symbol || '$'}{Number(edition.price).toLocaleString()}
                                                                </span>
                                                                <span>•</span>
                                                                <span className={edition.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                                    {edition.stock} in stock
                                                                </span>
                                                                {edition.created_at && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{edition.created_at}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('admin.editions.edit', edition.id)}>
                                                            <Button variant="outline" size="sm" title="Edit Edition">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.editions.show', edition.id)}>
                                                            <Button variant="outline" size="sm" title="View Edition">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package className="w-8 h-8 text-orange-400" />
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-700 mb-2">No Editions Yet</h4>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Create print editions to sell reproductions of this artwork.
                                            </p>
                                            <Link href={route('admin.editions.create') + `?artwork_id=${artwork.id}`}>
                                                <Button className="bg-orange-600 hover:bg-orange-700">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create First Edition
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Save className="w-5 h-5" />
                                        Publication
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-green-900">
                                        <Palette className="w-5 h-5" />
                                        Artwork Type
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_original"
                                            checked={data.is_original}
                                            onChange={(e) => setData('is_original', e.target.checked)}
                                        />
                                        <Label htmlFor="is_original">Original Artwork</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_print_available"
                                            checked={data.is_print_available}
                                            onChange={(e) => setData('is_print_available', e.target.checked)}
                                        />
                                        <Label htmlFor="is_print_available">Prints Available</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Save className="w-5 h-5" />
                                        Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-3" 
                                        disabled={processing}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Updating...' : 'Update Artwork'}
                                    </Button>
                                    <Link href={route('admin.artworks.index')}>
                                        <Button type="button" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </AdminLayout>
    );
}