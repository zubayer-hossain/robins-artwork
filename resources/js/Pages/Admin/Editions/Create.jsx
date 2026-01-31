import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Save, Package, Eye, ExternalLink, Image as ImageIcon, Palette } from 'lucide-react';

export default function AdminEditionCreate({ auth, artworks, flash }) {
    const { currency } = usePage().props;
    // Check for pre-selected artwork from URL
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedArtworkId = urlParams.get('artwork_id');
    const preselectedArtwork = preselectedArtworkId ? artworks.find(a => a.id == preselectedArtworkId) : null;

    const { data, setData, post, processing, errors, reset } = useForm({
        artwork_id: preselectedArtwork?.id || '',
        sku: preselectedArtwork ? generateInitialSKU(preselectedArtwork) : '',
        edition_total: '',
        price: '',
        stock: '',
        is_limited: true,
    });

    const [selectedArtworkTitle, setSelectedArtworkTitle] = useState(preselectedArtwork?.title || '');

    // Helper function to generate initial SKU
    function generateInitialSKU(artwork) {
        if (!artwork) return '';
        const cleanTitle = artwork.title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 10);
        return `${cleanTitle}-print-${Date.now().toString().slice(-4)}`;
    }

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
        post(route('admin.editions.store'), {
            onSuccess: () => {
                reset();
                if (window.toast) {
                    window.toast.success('Edition created successfully!', 'Success');
                }
                // Redirect to editions list
                window.location.href = route('admin.editions.index');
            },
            onError: (errors) => {
                if (window.toast) {
                    window.toast.error('Please check the form for errors.', 'Validation Error');
                }
            }
        });
    };

    const generateSKU = (artworkId) => {
        const artwork = artworks.find(a => a.id == artworkId);
        if (artwork) {
            const cleanTitle = artwork.title
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 10);
            return `${cleanTitle}-print-${Date.now().toString().slice(-4)}`;
        }
        return '';
    };

    const handleArtworkChange = (artworkTitle) => {
        const selectedArtwork = artworks.find(a => a.title === artworkTitle);
        if (selectedArtwork) {
            setData('artwork_id', selectedArtwork.id);
            setSelectedArtworkTitle(artworkTitle);
            if (!data.sku) {
                setData('sku', generateSKU(selectedArtwork.id));
            }
        }
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="Create New Edition"
            headerIcon={<Package className="w-8 h-8 text-white" />}
            headerDescription="Add a new print edition for an artwork"
            headerActions={
                <Link href={route('admin.editions.index')}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Editions
                    </Button>
                </Link>
            }
        >
            <Head title="Create Edition" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        Edition Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <Label htmlFor="artwork_id">Artwork *</Label>
                                        <Select value={selectedArtworkTitle} onValueChange={handleArtworkChange}>
                                            <SelectTrigger className="h-auto min-h-[42px]">
                                                <SelectValue placeholder="Select an artwork" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[400px]">
                                                {artworks.map((artwork) => (
                                                    <SelectItem key={artwork.id} value={artwork.title} className="py-2">
                                                        <div className="flex items-center gap-3">
                                                            {artwork.image ? (
                                                                <img 
                                                                    src={artwork.image} 
                                                                    alt={artwork.title}
                                                                    className="w-10 h-10 object-cover rounded border border-gray-200"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="font-medium">{artwork.title}</div>
                                                                <div className="text-xs text-gray-500">{artwork.medium} {artwork.year ? `• ${artwork.year}` : ''}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.artwork_id && <p className="text-sm text-red-600 mt-1">{errors.artwork_id}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="sku">SKU *</Label>
                                            <Input
                                                id="sku"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                placeholder="edition-sku-identifier"
                                                required
                                            />
                                            {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="price">Price ({currency?.symbol || '$'}) *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                required
                                            />
                                            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="stock">Initial Stock *</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                required
                                            />
                                            {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="edition_total">Edition Total</Label>
                                            <Input
                                                id="edition_total"
                                                type="number"
                                                value={data.edition_total}
                                                onChange={(e) => setData('edition_total', e.target.value)}
                                                placeholder="Limited edition size"
                                                min="1"
                                                disabled={!data.is_limited}
                                            />
                                            {errors.edition_total && <p className="text-sm text-red-600 mt-1">{errors.edition_total}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selected Artwork Info */}
                            {data.artwork_id && (
                                <Card className="border-0 shadow-lg overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                                        <CardTitle className="flex items-center gap-2 text-purple-900">
                                            <Palette className="w-5 h-5" />
                                            Selected Artwork
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {(() => {
                                            const selectedArtwork = artworks.find(a => a.id == data.artwork_id);
                                            return selectedArtwork ? (
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Artwork Image */}
                                                    <div className="md:w-48 flex-shrink-0">
                                                        {selectedArtwork.image ? (
                                                            <img 
                                                                src={selectedArtwork.image} 
                                                                alt={selectedArtwork.title}
                                                                className="w-full h-48 md:h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-48 md:h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <ImageIcon className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                                                                    <span className="text-sm text-purple-400">No image</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Artwork Details */}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <h3 className="text-xl font-bold text-gray-900">{selectedArtwork.title}</h3>
                                                            <Link href={route('admin.artworks.show', selectedArtwork.id)}>
                                                                <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    View
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                                <span className="text-gray-500">Medium:</span>
                                                                <span className="font-medium text-gray-900">{selectedArtwork.medium || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                                <span className="text-gray-500">Year:</span>
                                                                <span className="font-medium text-gray-900">{selectedArtwork.year || 'N/A'}</span>
                                                            </div>
                                                            {selectedArtwork.size_text && (
                                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded col-span-2">
                                                                    <span className="text-gray-500">Size:</span>
                                                                    <span className="font-medium text-gray-900">{selectedArtwork.size_text}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-purple-600" />
                                        Edition Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_limited"
                                            checked={data.is_limited}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setData('is_limited', checked);
                                                if (!checked) {
                                                    setData('edition_total', '');
                                                }
                                            }}
                                        />
                                        <Label htmlFor="is_limited">Limited Edition</Label>
                                    </div>
                                    {data.is_limited && (
                                        <p className="text-sm text-gray-600">
                                            This edition will have a limited number of prints available.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Save className="w-5 h-5 text-green-600" />
                                        Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-3" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Creating...' : 'Create Edition'}
                                    </Button>
                                    <Link href={route('admin.editions.index')}>
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