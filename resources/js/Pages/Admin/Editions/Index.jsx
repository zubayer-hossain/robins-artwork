import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

export default function AdminEditionsIndex({ auth, editions }) {
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Artwork</TableHead>
                                    <TableHead>Edition Size</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {editions.data.map((edition) => (
                                    <TableRow key={edition.id}>
                                        <TableCell>
                                            <div className="font-medium font-mono">{edition.sku}</div>
                                        </TableCell>
                                        <TableCell>
                                            {edition.artwork ? (
                                                <div>
                                                    <div className="font-medium">{edition.artwork.title}</div>
                                                    <div className="text-sm text-gray-600">ID: {edition.artwork.id}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No artwork</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {edition.is_limited ? (
                                                <span>Limited: {edition.edition_total}</span>
                                            ) : (
                                                <span>Unlimited</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-green-600">
                                                ${edition.price.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{edition.stock}</span>
                                                {getStockBadge(edition.stock)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {edition.is_limited && (
                                                <Badge variant="outline">Limited</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{edition.created_at}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                 <Link href={route('admin.editions.show', edition.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.editions.edit', edition.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(edition)}
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
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && editionToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Edition</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>"{editionToDelete.sku}"</strong>? 
                                This will permanently remove the edition and all associated data.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setEditionToDelete(null);
                                }}
                                disabled={isDeleting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Edition
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}