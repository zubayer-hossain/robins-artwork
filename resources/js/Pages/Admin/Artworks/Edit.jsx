import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminArtworksEdit({ artwork, mediums, statuses }) {
    const [newTag, setNewTag] = useState('');
    const [newTagInput, setNewTagInput] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (artwork) {
            put(route('admin.artworks.update', artwork.id));
        } else {
            post(route('admin.artworks.store'));
        }
    };

    const addTag = () => {
        if (newTagInput.trim() && !data.tags.includes(newTagInput.trim())) {
            setData('tags', [...data.tags, newTagInput.trim()]);
            setNewTagInput('');
        }
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

    return (
        <>
            <Head title={artwork ? `Edit ${artwork.title}` : 'Create Artwork'} />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('admin.artworks.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Artworks
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {artwork ? `Edit ${artwork.title}` : 'Create New Artwork'}
                        </h1>
                        <p className="text-gray-600">
                            {artwork ? 'Update artwork details' : 'Add a new artwork to your gallery'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Slug</label>
                                    <Input
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated from title"
                                        error={errors.slug}
                                    />
                                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Medium *</label>
                                    <Select value={data.medium} onValueChange={(value) => setData('medium', value)}>
                                        <SelectTrigger placeholder="Select medium">
                                            <SelectValue value={data.medium} placeholder="Select medium" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mediums.map((medium) => (
                                                <SelectItem key={medium} value={medium}>
                                                    {medium}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.medium && <p className="text-red-500 text-sm mt-1">{errors.medium}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Year</label>
                                    <Input
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        placeholder="2024"
                                        error={errors.year}
                                    />
                                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Dimensions</label>
                                    <Input
                                        value={data.size_text}
                                        onChange={(e) => setData('size_text', e.target.value)}
                                        placeholder="24&quot; x 36&quot;"
                                        error={errors.size_text}
                                    />
                                    {errors.size_text && <p className="text-red-500 text-sm mt-1">{errors.size_text}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="1200.00"
                                        error={errors.price}
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger placeholder="Select status">
                                            <SelectValue value={data.status} placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content & Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Artist's Story</label>
                                <textarea
                                    value={data.story.content || ''}
                                    onChange={(e) => setData('story', { ...data.story, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tell the story behind this artwork..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tags</label>
                                <div className="flex gap-2 mb-2">
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
                                <div className="flex gap-2">
                                    <Input
                                        value={newTagInput}
                                        onChange={(e) => setNewTagInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Add a tag..."
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_original}
                                        onChange={(e) => setData('is_original', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">Original artwork</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_print_available}
                                        onChange={(e) => setData('is_print_available', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">Prints available</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            {artwork ? 'Update Artwork' : 'Create Artwork'}
                        </Button>
                        <Link href={route('admin.artworks.index')} className="flex-1">
                            <Button variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

