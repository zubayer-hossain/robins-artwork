import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    Eye, 
    Download, 
    ShoppingBag, 
    CheckCircle, 
    Clock, 
    XCircle, 
    RefreshCw,
    Loader2
} from 'lucide-react';

export default function AdminOrdersIndex({ auth, orders }) {
    const { currency } = usePage().props;
    const [downloadingId, setDownloadingId] = useState(null);

    const getStatusBadge = (status) => {
        const config = {
            pending: { 
                icon: <Clock className="w-3 h-3" />,
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
            },
            paid: { 
                icon: <CheckCircle className="w-3 h-3" />,
                className: 'bg-green-100 text-green-800 border-green-200'
            },
            refunded: { 
                icon: <RefreshCw className="w-3 h-3" />,
                className: 'bg-blue-100 text-blue-800 border-blue-200'
            },
            cancelled: { 
                icon: <XCircle className="w-3 h-3" />,
                className: 'bg-red-100 text-red-800 border-red-200'
            },
        };
        const statusConfig = config[status] || config.pending;
        return (
            <Badge className={`${statusConfig.className} flex items-center gap-1 font-medium text-xs`}>
                {statusConfig.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleDownloadInvoice = (orderId) => {
        setDownloadingId(orderId);
        const link = document.createElement('a');
        link.href = route('admin.orders.invoice', orderId);
        link.download = `invoice-order-${orderId}.pdf`;
        link.click();
        setTimeout(() => setDownloadingId(null), 1500);
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="Manage Orders"
            headerIcon={<ShoppingBag className="w-8 h-8 text-white" />}
            headerDescription="View and manage customer orders and payments"
        >
            <Head title="Manage Orders" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                            Orders
                            <Badge variant="secondary" className="ml-2">
                                {orders.total} total
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {orders.data && orders.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="font-semibold">Order</TableHead>
                                                <TableHead className="font-semibold">Customer</TableHead>
                                                <TableHead className="font-semibold text-center">Items</TableHead>
                                                <TableHead className="font-semibold text-right">Total</TableHead>
                                                <TableHead className="font-semibold text-center">Status</TableHead>
                                                <TableHead className="font-semibold">Date</TableHead>
                                                <TableHead className="font-semibold text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.data.map((order) => (
                                                <TableRow key={order.id} className="hover:bg-gray-50/50">
                                                    <TableCell>
                                                        <div className="font-semibold text-gray-900">#{order.id}</div>
                                                        <div className="text-xs text-gray-500 font-mono truncate max-w-[120px]" title={order.stripe_session_id}>
                                                            {order.stripe_session_id?.substring(0, 20)}...
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                                                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="font-medium">
                                                            {order.items_count}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="font-semibold text-gray-900">
                                                            {currency?.symbol || '$'}{Number(order.total).toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {currency?.code || 'USD'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getStatusBadge(order.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-900">{order.created_at}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center gap-2">
                                                            <Link href={route('admin.orders.show', order.id)}>
                                                                <Button variant="outline" size="sm" title="View Order">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                title="Download Invoice"
                                                                onClick={() => handleDownloadInvoice(order.id)}
                                                                disabled={downloadingId === order.id}
                                                            >
                                                                {downloadingId === order.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Download className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {orders.links && orders.links.length > 3 && (
                                    <div className="flex justify-center p-6 border-t">
                                        <div className="flex gap-2">
                                            {orders.links.map((link, index) => {
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
                                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? 'bg-purple-600 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <ShoppingBag className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
