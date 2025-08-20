import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Footer from '@/components/Footer';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminArtworksIndex({ artworks }) {
    const getStatusBadge = (status) => {
        const variants = {
            draft: 'secondary',
            published: 'default',
            sold: 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <>
            <Head title="Manage Artworks" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Artworks</h1>
                        <p className="text-gray-600">Create, edit, and manage your artwork listings</p>
                    </div>
                    <Link href={route('admin.artworks.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Artwork
                        </Button>
                    </Link>
                </div>

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
                                                    {artwork.year && `${artwork.year} â€¢ `}
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
                                                <Link href={route('artwork.show', artwork.slug)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.artworks.edit', artwork.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
            
            <Footer />
        </>
    );
}

