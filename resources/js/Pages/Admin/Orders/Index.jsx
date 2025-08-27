import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download } from 'lucide-react';

export default function AdminOrdersIndex({ auth, orders }) {
    const getStatusBadge = (status) => {
        const variants = {
            pending: 'secondary',
            paid: 'default',
            refunded: 'destructive',
            cancelled: 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <AdminLayout user={auth.user} header="Manage Orders">
            <Head title="Manage Orders" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Manage Orders</h1>
                    <p className="text-gray-600">View and manage customer orders</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders ({orders.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <div className="font-medium">#{order.id}</div>
                                            <div className="text-sm text-gray-600 font-mono">
                                                {order.stripe_session_id}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{order.customer_name}</div>
                                                <div className="text-sm text-gray-600">{order.customer_email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{order.items_count} items</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                £{order.total.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {order.currency.toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">{order.created_at}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {orders.links && orders.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {orders.links.map((link, index) => {
                                        // Handle disabled/null links
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 rounded-md text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                preserveState
                                                className={`px-3 py-2 rounded-md text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
