import { Head, useForm, Link } from '@inertiajs/react';
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
import { ArrowLeft, Save, Palette, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import ImageUploader from '@/Components/ImageUploader';
import RichTextEditor from '@/Components/RichTextEditor';

export default function AdminArtworkCreate({ auth, mediums, statuses, flash }) {
    const [newTagInput, setNewTagInput] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        slug: '',
        medium: '',
        year: '',
        size_text: '',
        price: '',
        status: 'draft',
        story: { content: '' },
        tags: [],
        is_original: true,
        is_print_available: false,
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
        post(route('admin.artworks.store'), {
            onSuccess: () => {
                reset();
                if (window.toast) {
                    window.toast.success('Artwork created successfully!', 'Success');
                }
                // Redirect to artworks list
                window.location.href = route('admin.artworks.index');
            },
            onError: (errors) => {
                if (window.toast) {
                    window.toast.error('Please check the form for errors.', 'Validation Error');
                }
            }
        });
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData('title', title);
        if (!data.slug) {
            setData('slug', generateSlug(title));
        }
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
            header="Create New Artwork"
            headerIcon={<Palette className="w-8 h-8 text-white" />}
            headerDescription="Add a new artwork to your collection"
            headerActions={
                <Link href={route('admin.artworks.index')}>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Artworks
                    </Button>
                </Link>
            }
        >
            <Head title="Create Artwork" />
            
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
                                                onChange={handleTitleChange}
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
                                            <Label htmlFor="price">Price ($)</Label>
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
                                        {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images Section - Shows prompt to save first */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-purple-900">
                                        <ImageIcon className="w-5 h-5" />
                                        Artwork Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Save Artwork First</h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            Create and save the artwork first, then you'll be able to upload images.
                                            You'll be redirected to the edit page where you can add images.
                                        </p>
                                    </div>
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
                                        {processing ? 'Creating...' : 'Create Artwork'}
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