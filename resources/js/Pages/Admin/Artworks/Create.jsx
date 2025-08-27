import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminArtworkCreate({ auth, mediums, statuses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        slug: '',
        medium: '',
        year: '',
        size_text: '',
        price: '',
        status: 'draft',
        story: '',
        tags: '',
        is_original: true,
        is_print_available: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.artworks.store'), {
            onSuccess: () => {
                reset();
            },
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

    return (
        <AdminLayout user={auth.user} header="Create New Artwork">
            <Head title="Create Artwork" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('admin.artworks.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Artworks
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Artwork</h1>
                        <p className="text-gray-600">Add a new artwork to your collection</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                            <Label htmlFor="price">Price (£)</Label>
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Description & Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="story">Story/Description</Label>
                                        <Textarea
                                            id="story"
                                            value={data.story}
                                            onChange={(e) => setData('story', e.target.value)}
                                            placeholder="Tell the story behind this artwork..."
                                            rows={4}
                                        />
                                        {errors.story && <p className="text-sm text-red-600 mt-1">{errors.story}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="tags">Tags</Label>
                                        <Input
                                            id="tags"
                                            value={data.tags}
                                            onChange={(e) => setData('tags', e.target.value)}
                                            placeholder="landscape, mountain, scotland (comma separated)"
                                        />
                                        {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publication</CardTitle>
                                </CardHeader>
                                <CardContent>
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Artwork Type</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Creating...' : 'Create Artwork'}
                                    </Button>
                                    <Link href={route('admin.artworks.index')}>
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}