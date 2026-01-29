import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { 
    Package, 
    Edit, 
    Trash2, 
    ArrowLeft, 
    DollarSign, 
    Hash, 
    Calendar,
    Clock,
    XCircle,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Palette
} from 'lucide-react';

export default function AdminEditionShow({ auth, edition, flash }) {
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

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.editions.destroy', edition.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Edition deleted successfully!', 'Success');
                }
                // Redirect to editions list
                window.location.href = route('admin.editions.index');
            },
            onError: () => {
                setIsDeleting(false);
                if (window.toast) {
                    window.toast.error('Failed to delete edition. Please try again.', 'Error');
                }
            }
        });
    };

    const getStockBadge = (stock) => {
        if (stock === 0) {
            return <Badge variant="destructive" className="text-xs px-2 py-1">Out of Stock</Badge>;
        }
        if (stock <= 5) {
            return <Badge variant="secondary" className="text-xs px-2 py-1">Low Stock</Badge>;
        }
        return <Badge variant="default" className="text-xs px-2 py-1">In Stock</Badge>;
    };

    const getEditionTypeBadge = (isLimited) => {
        if (isLimited) {
            return <Badge variant="outline" className="text-xs px-2 py-1">Limited Edition</Badge>;
        }
        return <Badge variant="secondary" className="text-xs px-2 py-1">Unlimited</Badge>;
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={`Edition: ${edition.sku}`}
            headerIcon={<Package className="w-8 h-8 text-white" />}
            headerDescription="View and manage edition details"
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {edition.artwork && (
                        <Link href={route('admin.artworks.show', edition.artwork.id)}>
                            <Button variant="outline" className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50">
                                <Palette className="w-4 h-4 mr-2" />
                                Back to Artwork
                            </Button>
                        </Link>
                    )}
                    <Link href={route('admin.editions.index')}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Editions
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Edition: ${edition.sku}`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Edition Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Edition Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">SKU</span>
                                        <span className="font-mono text-sm font-semibold">{edition.sku}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Price</span>
                                        <span className="text-lg font-bold text-green-600">${edition.price.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Stock</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold">{edition.stock}</span>
                                            {getStockBadge(edition.stock)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Edition Type</span>
                                        {getEditionTypeBadge(edition.is_limited)}
                                    </div>
                                </div>

                                {edition.is_limited && edition.edition_total && (
                                    <div className="flex items-center justify-between p-3 bg-yellow-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Edition Total</span>
                                        <span className="text-lg font-semibold">{edition.edition_total}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Associated Artwork */}
                        {edition.artwork && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5 text-purple-600" />
                                        Associated Artwork
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {edition.artwork.title}
                                                </h3>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Medium:</span>
                                                        <span>{edition.artwork.medium}</span>
                                                    </div>
                                                    {edition.artwork.year && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Year:</span>
                                                            <span>{edition.artwork.year}</span>
                                                        </div>
                                                    )}
                                                    {edition.artwork.size_text && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Size:</span>
                                                            <span>{edition.artwork.size_text}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Link href={route('admin.artworks.show', edition.artwork.id)}>
                                                <Button variant="outline" size="sm">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    View Artwork
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="w-5 h-5 text-blue-600" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <Link href={route('admin.editions.edit', edition.id)}>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Edition
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Edition
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Edition Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-green-600" />
                                    Edition Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Edition ID:</span>
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            #{edition.id}
                                        </span>
                                    </div>
                                    
                                    {edition.is_limited && edition.edition_total && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Edition Size:</span>
                                                <span className="font-semibold">{edition.edition_total}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Remaining:</span>
                                                <span className={`font-semibold ${
                                                    edition.stock > 5 ? 'text-green-600' : 
                                                    edition.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                    {edition.stock} / {edition.edition_total}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Current Stock:</span>
                                        <span className={`font-semibold ${
                                            edition.stock > 5 ? 'text-green-600' : 
                                            edition.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {edition.stock}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                    Timestamps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-mono text-xs">
                                        {new Date(edition.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Updated:</span>
                                    <span className="font-mono text-xs">
                                        {new Date(edition.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmDialog
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Edition"
                    message={`Are you sure you want to delete "${edition.sku}"? This will permanently remove the edition and all associated data.`}
                    confirmText="Delete Edition"
                    isLoading={isDeleting}
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
