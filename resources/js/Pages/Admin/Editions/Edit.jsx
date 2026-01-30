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
import ConfirmDialog from '@/Components/ConfirmDialog';
import { ArrowLeft, Save, Trash2, Package, Eye, ExternalLink, Image as ImageIcon, Palette, Layers } from 'lucide-react';

export default function AdminEditionEdit({ auth, edition, artworks, flash }) {
    const { currency } = usePage().props;
    const { data, setData, patch, processing, errors, delete: deleteEdition } = useForm({
        artwork_id: edition.artwork_id || '',
        sku: edition.sku || '',
        edition_total: edition.edition_total || '',
        price: edition.price || '',
        stock: edition.stock || '',
        is_limited: Boolean(edition.is_limited),
    });

    const [selectedArtworkTitle, setSelectedArtworkTitle] = useState(edition.artwork?.title || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
        patch(route('admin.editions.update', edition.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Edition updated successfully!', 'Success');
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

    const handleDelete = () => {
        setIsDeleting(true);
        deleteEdition(route('admin.editions.destroy', edition.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Edition deleted successfully!', 'Success');
                }
            },
            onError: () => {
                setIsDeleting(false);
                if (window.toast) {
                    window.toast.error('Failed to delete edition.', 'Error');
                }
            }
        });
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={`Edit Edition: ${edition.sku}`}
            headerIcon={<Package className="w-8 h-8 text-white" />}
            headerDescription="Update edition details and pricing"
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {edition.artwork && (
                        <Link href={route('admin.artworks.edit', edition.artwork.id)}>
                            <Button variant="outline" className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50">
                                <Palette className="w-4 h-4 mr-2" />
                                Back to Artwork
                            </Button>
                        </Link>
                    )}
                    <Link href={route('admin.editions.index')}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Layers className="w-4 h-4 mr-2" />
                            All Editions
                        </Button>
                    </Link>
                    <Link href={route('admin.editions.show', edition.id)}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Eye className="w-4 h-4 mr-2" />
                            View Edition
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Edition: ${edition.sku}`} />
            
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
                                        <Select value={selectedArtworkTitle} onValueChange={(artworkTitle) => {
                                            const selectedArtwork = artworks.find(a => a.title === artworkTitle);
                                            if (selectedArtwork) {
                                                setData('artwork_id', selectedArtwork.id);
                                                setSelectedArtworkTitle(artworkTitle);
                                            }
                                        }}>
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
                                            <Label htmlFor="stock">Stock *</Label>
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

                            {/* Current Artwork Info */}
                            {edition.artwork && (
                                <Card className="border-0 shadow-lg overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                                        <CardTitle className="flex items-center gap-2 text-purple-900">
                                            <Palette className="w-5 h-5" />
                                            Linked Artwork
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Artwork Image */}
                                            <div className="md:w-48 flex-shrink-0">
                                                {edition.artwork.image ? (
                                                    <img 
                                                        src={edition.artwork.image} 
                                                        alt={edition.artwork.title}
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
                                                    <h3 className="text-xl font-bold text-gray-900">{edition.artwork.title}</h3>
                                                    <Link href={route('admin.artworks.show', edition.artwork.id)}>
                                                        <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                        <span className="text-gray-500">Medium:</span>
                                                        <span className="font-medium text-gray-900">{edition.artwork.medium || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                        <span className="text-gray-500">Year:</span>
                                                        <span className="font-medium text-gray-900">{edition.artwork.year || 'N/A'}</span>
                                                    </div>
                                                    {edition.artwork.size_text && (
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded col-span-2">
                                                            <span className="text-gray-500">Size:</span>
                                                            <span className="font-medium text-gray-900">{edition.artwork.size_text}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
                                        {processing ? 'Updating...' : 'Update Edition'}
                                    </Button>
                                    <Link href={route('admin.editions.index')}>
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-gray-600" />
                                        Edition Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Edition ID:</span>
                                            <span className="font-mono">{edition.id}</span>
                                        </div>
                                        {data.is_limited && data.edition_total && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Edition Size:</span>
                                                    <span className="font-semibold">{data.edition_total}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Remaining:</span>
                                                    <span className={`font-semibold ${
                                                        data.stock > 5 ? 'text-green-600' : 
                                                        data.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                        {data.stock} / {data.edition_total}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-red-200 bg-red-50/30">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                        Danger Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-sm text-red-600 mb-3">
                                        Deleting this edition is permanent and cannot be undone.
                                    </p>
                                    <Button 
                                        type="button"
                                        variant="destructive" 
                                        className="w-full"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Edition
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Edition"
                message={`Are you sure you want to delete "${edition.sku}"? This will permanently remove the edition and cannot be undone.`}
                confirmText="Delete Edition"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}