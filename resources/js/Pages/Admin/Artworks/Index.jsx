﻿import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Palette } from 'lucide-react';

export default function AdminArtworksIndex({ auth, artworks }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [artworkToDelete, setArtworkToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusBadge = (status) => {
        const variants = {
            draft: 'secondary',
            published: 'default',
            sold: 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const handleDeleteClick = (artwork) => {
        setArtworkToDelete(artwork);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!artworkToDelete) return;
        
        setIsDeleting(true);
        router.delete(route('admin.artworks.destroy', artworkToDelete.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Artwork deleted successfully!', 'Success');
                }
                setShowDeleteModal(false);
                setArtworkToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
                if (window.toast) {
                    window.toast.error('Failed to delete artwork. Please try again.', 'Error');
                }
            }
        });
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="Manage Artworks"
            headerIcon={<Palette className="w-8 h-8 text-white" />}
            headerDescription="Create, edit, and manage your artwork listings"
            headerActions={
                <Link href={route('admin.artworks.create')}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Artwork
                    </Button>
                </Link>
            }
        >
            <Head title="Manage Artworks" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Card>
                    <CardHeader>
                        <CardTitle>Artworks ({artworks.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Medium</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {artworks.data.map((artwork) => (
                                    <TableRow key={artwork.id}>
                                        <TableCell>
                                            {artwork.primaryImage ? (
                                                <img
                                                    src={artwork.primaryImage.thumb}
                                                    alt={artwork.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No image</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{artwork.title}</div>
                                                <div className="text-sm text-gray-600">
                                                    {artwork.year && `${artwork.year} • `}
                                                    {artwork.size_text}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{artwork.medium}</TableCell>
                                        <TableCell>{getStatusBadge(artwork.status)}</TableCell>
                                        <TableCell>
                                            {artwork.price ? (
                                                <span className="font-medium text-green-600">
                                                    ${artwork.price.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Not for sale</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{artwork.created_at}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={route('admin.artworks.show', artwork.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.artworks.edit', artwork.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(artwork)}
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
                        {artworks.links && artworks.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {artworks.links.map((link, index) => (
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
            {showDeleteModal && artworkToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Artwork</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>"{artworkToDelete.title}"</strong>? 
                                This will permanently remove the artwork and all associated data.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setArtworkToDelete(null);
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
                                        Delete Artwork
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

