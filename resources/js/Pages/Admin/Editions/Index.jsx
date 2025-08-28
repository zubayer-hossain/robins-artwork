import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

export default function AdminEditionsIndex({ auth, editions }) {
    const getStockBadge = (stock) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
        return <Badge variant="default">In Stock</Badge>;
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
                                                £{edition.price.toLocaleString()}
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
                                                {edition.artwork && (
                                                    <Link href={route('artwork.show', edition.artwork.slug)}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={route('admin.editions.edit', edition.id)}>
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
        </AdminLayout>
    );
}