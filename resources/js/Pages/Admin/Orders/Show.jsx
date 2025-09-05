﻿import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ArrowLeft, 
    Download, 
    Mail, 
    User,
    CreditCard,
    Package,
    Calendar,
    MapPin,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    Eye,
    Truck,
    DollarSign
} from 'lucide-react';

export default function AdminOrdersShow({ auth, order, flash }) {
    const { data, setData, patch, processing } = useForm({
        status: ''
    });

    // Handle flash messages from backend
    useEffect(() => {
        if (flash?.success && window.toast) {
            window.toast.success(flash.success, 'Success');
        }
        if (flash?.error && window.toast) {
            window.toast.error(flash.error, 'Error');
        }
    }, [flash]);

    const handleStatusUpdate = (status) => {
        router.patch(route('admin.orders.update-status', order.id), {
            status: status
        }, {
            onSuccess: () => {
                // Success message handled by flash
            },
            onError: (errors) => {
                console.error('Errors:', errors);
                if (window.toast) {
                    window.toast.error('Failed to update order status. Please try again.', 'Error');
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { 
                variant: 'secondary', 
                icon: <Clock className="w-3 h-3" />,
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
            },
            paid: { 
                variant: 'default', 
                icon: <CheckCircle className="w-3 h-3" />,
                className: 'bg-green-100 text-green-800 border-green-200'
            },
            refunded: { 
                variant: 'destructive', 
                icon: <RefreshCw className="w-3 h-3" />,
                className: 'bg-blue-100 text-blue-800 border-blue-200'
            },
            cancelled: { 
                variant: 'destructive', 
                icon: <XCircle className="w-3 h-3" />,
                className: 'bg-red-100 text-red-800 border-red-200'
            },
        };
        const statusConfig = config[status] || config.pending;
        return (
            <Badge className={`${statusConfig.className} flex items-center gap-1 font-medium`}>
                {statusConfig.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={`Order #${order.id}`}
            headerActions={
                <Link href={route('admin.orders.index')}>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                </Link>
            }
        >
            <Head title={`Order #${order.id}`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</label>
                                            <p className="font-semibold text-gray-900">#{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Created</label>
                                            <p className="font-medium text-gray-900">{order.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Currency</label>
                                            <p className="font-medium text-gray-900">{order.currency.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                            <div className="mt-1">{getStatusBadge(order.status)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                                            <p className="font-medium text-gray-900">{order.updated_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <CreditCard className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stripe Session</label>
                                            <p className="font-mono text-sm text-gray-900 break-all">{order.stripe_session_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-purple-600" />
                                Order Items
                                <Badge variant="outline" className="ml-auto">
                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {order.items.map((item, index) => (
                                    <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                                        {/* Mobile Layout */}
                                        <div className="block sm:hidden">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                                                        {item.title_snapshot}
                                                    </h4>
                                                    <div className="text-xl font-bold text-gray-900">
                                                        ${(item.qty * item.unit_price).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <span className="font-medium">Qty:</span>
                                                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                            {item.qty}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        <span className="font-medium">Unit Price:</span>
                                                        <div className="font-mono text-gray-900">${item.unit_price.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {item.artwork && (
                                                        <div className="text-gray-500">
                                                            <div className="flex items-center gap-1 mb-1">
                                                                <Eye className="w-3 h-3" />
                                                                <span className="font-medium text-xs">Artwork</span>
                                                            </div>
                                                            <div className="text-xs truncate">{item.artwork.title}</div>
                                                        </div>
                                                    )}
                                                    {item.edition && (
                                                        <div className="text-gray-500">
                                                            <div className="flex items-center gap-1 mb-1">
                                                                <Package className="w-3 h-3" />
                                                                <span className="font-medium text-xs">Edition</span>
                                                            </div>
                                                            <div className="text-xs">{item.edition.sku}</div>
                                                            <div className="text-xs truncate">{item.edition.artwork_title}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden sm:block">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                                                {item.title_snapshot}
                                                            </h4>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <span className="font-medium">Quantity:</span>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {item.qty}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <span className="font-medium">Unit Price:</span>
                                                                    <span className="font-mono">${item.unit_price.toLocaleString()}</span>
                                                                </div>
                                                                {item.artwork && (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <Eye className="w-3 h-3" />
                                                                        <span>Artwork: {item.artwork.title}</span>
                                                                    </div>
                                                                )}
                                                                {item.edition && (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <Package className="w-3 h-3" />
                                                                        <span>Edition: {item.edition.sku} - {item.edition.artwork_title}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-gray-900">
                                                                ${(item.qty * item.unit_price).toLocaleString()}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                Total for this item
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <User className="w-5 h-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer Name</label>
                                        <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                                        <p className="font-medium text-gray-900 break-all">{order.customer_email}</p>
                                    </div>
                                </div>
                                {order.user_id && (
                                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</label>
                                            <p className="font-mono text-sm text-gray-900">#{order.user_id}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-green-900">
                                <DollarSign className="w-5 h-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">${order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-200">
                                    <span className="font-bold text-lg text-green-900">Total:</span>
                                    <span className="font-bold text-2xl text-green-900">
                                        ${order.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-purple-900">
                                <Package className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            {/* {order.status === 'paid' && (
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                                    <Truck className="w-4 h-4 mr-2" />
                                    Mark as Shipped
                                </Button>
                            )} */}
                            {order.status === 'pending' && (
                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                                    size="lg"
                                    onClick={() => handleStatusUpdate('paid')}
                                    disabled={processing}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {processing ? 'Processing...' : 'Mark as Paid'}
                                </Button>
                            )}
                            <Button className="w-full" variant="outline" size="lg">
                                <Mail className="w-4 h-4 mr-2" />
                                Resend Receipt
                            </Button>
                            <Button className="w-full" variant="outline" size="lg">
                                <Download className="w-4 h-4 mr-2" />
                                Export Invoice
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        </AdminLayout>
    );
}

