import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Edit, Trash2, Eye, Package, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AdminEditionsIndex({ auth, editions }) {
    const { currency } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editionToDelete, setEditionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStockBadge = (stock) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
        return <Badge variant="default">In Stock</Badge>;
    };

    const handleDeleteClick = (edition) => {
        setEditionToDelete(edition);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!editionToDelete) return;
        
        setIsDeleting(true);
        router.delete(route('admin.editions.destroy', editionToDelete.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Edition deleted successfully!', 'Success');
                }
                setShowDeleteModal(false);
                setEditionToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
                if (window.toast) {
                    window.toast.error('Failed to delete edition. Please try again.', 'Error');
                }
            }
        });
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="Manage Editions"
            headerIcon={<Package className="w-8 h-8 text-white" />}
            headerDescription="Create and manage print editions for your artworks"
            headerActions={
                <Link href={route('admin.editions.create')}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Edition
                    </Button>
                </Link>
            }
        >
            <Head title="Manage Editions" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Card>
                    <CardHeader>
                        <CardTitle>Editions ({editions.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editions.data && editions.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20">Image</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Artwork</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {editions.data.map((edition) => (
                                            <TableRow key={edition.id}>
                                                <TableCell>
                                                    {edition.artwork?.image ? (
                                                        <img
                                                            src={edition.artwork.image}
                                                            alt={edition.artwork.title}
                                                            className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium font-mono text-purple-600">{edition.sku}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {edition.artwork ? (
                                                        <div>
                                                            <Link 
                                                                href={route('admin.artworks.show', edition.artwork.id)}
                                                                className="font-medium text-gray-900 hover:text-purple-600 transition-colors flex items-center gap-1"
                                                            >
                                                                {edition.artwork.title}
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No artwork linked</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {edition.is_limited ? (
                                                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                                            Limited ({edition.edition_total})
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                                            Open Edition
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-green-600">
                                                        {currency?.symbol || '$'}{Number(edition.price).toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{edition.stock}</span>
                                                        {getStockBadge(edition.stock)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-sm">{edition.created_at}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Link href={route('admin.editions.show', edition.id)}>
                                                            <Button variant="outline" size="sm" title="View">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.editions.edit', edition.id)}>
                                                            <Button variant="outline" size="sm" title="Edit">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick(edition)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {editions.links && editions.links.length > 3 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="flex gap-2">
                                            {editions.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 rounded-md text-sm ${
                                                        link.active
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No Editions Yet</h3>
                                    <p className="mb-4">Create print editions for your artworks to sell limited or open editions.</p>
                                    <Link href={route('admin.editions.create')}>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Edition
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={showDeleteModal && editionToDelete}
                onClose={() => {
                    setShowDeleteModal(false);
                    setEditionToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Edition"
                message={`Are you sure you want to delete "${editionToDelete?.sku}"? This will permanently remove the edition and all associated data.`}
                confirmText="Delete Edition"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}