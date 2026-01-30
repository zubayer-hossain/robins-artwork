import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
    DollarSign,
    FileText,
    ShoppingBag,
    Printer,
    Receipt
} from 'lucide-react';

export default function AdminOrdersShow({ auth, order, flash }) {
    const { currency } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

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
        setProcessing(true);
        router.patch(route('admin.orders.update-status', order.id), {
            status: status
        }, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                console.error('Errors:', errors);
                setProcessing(false);
                if (window.toast) {
                    window.toast.error('Failed to update order status. Please try again.', 'Error');
                }
            }
        });
    };

    const handleDownloadInvoice = () => {
        setIsDownloading(true);
        // Create a link to download the invoice
        const link = document.createElement('a');
        link.href = route('admin.orders.invoice', order.id);
        link.download = `invoice-order-${order.id}.pdf`;
        link.click();
        setTimeout(() => setIsDownloading(false), 1500);
    };

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
            <Badge className={`${statusConfig.className} flex items-center gap-1 font-medium px-3 py-1`}>
                {statusConfig.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const currencySymbol = currency?.symbol || '$';

    return (
        <AdminLayout 
            user={auth.user} 
            header={`Order #${order.id}`}
            headerIcon={<Receipt className="w-8 h-8 text-white" />}
            headerDescription="View order details and manage status"
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
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Order Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        {getStatusBadge(order.status)}
                                        <div className="text-sm text-gray-600">
                                            {order.status === 'paid' && 'Payment received and order is ready for fulfillment'}
                                            {order.status === 'pending' && 'Awaiting payment confirmation'}
                                            {order.status === 'refunded' && 'Order has been refunded'}
                                            {order.status === 'cancelled' && 'Order has been cancelled'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-900">{currencySymbol}{Number(order.total).toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 font-medium">{currency?.code || 'USD'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <ShoppingBag className="w-5 h-5 text-green-600" />
                                    </div>
                                    Order Items
                                    <Badge variant="outline" className="ml-auto">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            {/* Artwork Image */}
                                            <div className="flex-shrink-0">
                                                {item.artwork?.primaryImage?.thumb ? (
                                                    <img
                                                        src={item.artwork.primaryImage.thumb}
                                                        alt={item.title_snapshot || item.artwork?.title}
                                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                                                        <Package className="w-8 h-8 text-purple-600" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg">
                                                            {item.title_snapshot}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.edition ? 'Print Edition' : 'Original Artwork'}
                                                            </Badge>
                                                            {item.edition && (
                                                                <span className="text-sm text-gray-500">
                                                                    SKU: {item.edition.sku}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <Package className="w-3 h-3" />
                                                                Qty: {item.qty}
                                                            </span>
                                                            <span>
                                                                {currencySymbol}{Number(item.unit_price).toLocaleString()} each
                                                            </span>
                                                        </div>
                                                        {item.artwork?.slug && (
                                                            <Link 
                                                                href={route('artwork.show', item.artwork.slug)}
                                                                className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center gap-1"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View Artwork
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            {currencySymbol}{(item.qty * item.unit_price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.order_notes && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        Order Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <p className="text-gray-800 leading-relaxed">{order.order_notes}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Addresses */}
                        {(order.shipping_address || order.billing_address) && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        Delivery Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Shipping Address */}
                                        {order.shipping_address && (
                                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Truck className="w-5 h-5 text-blue-600" />
                                                    <h4 className="font-semibold text-blue-900">Shipping Address</h4>
                                                </div>
                                                <div className="space-y-1 text-sm text-blue-800">
                                                    <p className="font-medium text-blue-900">{order.shipping_address.name}</p>
                                                    {order.shipping_address.company && (
                                                        <p>{order.shipping_address.company}</p>
                                                    )}
                                                    <p>{order.shipping_address.address_line_1}</p>
                                                    {order.shipping_address.address_line_2 && (
                                                        <p>{order.shipping_address.address_line_2}</p>
                                                    )}
                                                    <p>{order.shipping_address.city}, {order.shipping_address.state_province} {order.shipping_address.postal_code}</p>
                                                    <p>{order.shipping_address.country}</p>
                                                    {order.shipping_address.phone && (
                                                        <p className="mt-2 pt-2 border-t border-blue-200">
                                                            📞 {order.shipping_address.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Billing Address */}
                                        {order.billing_address && (
                                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CreditCard className="w-5 h-5 text-green-600" />
                                                    <h4 className="font-semibold text-green-900">Billing Address</h4>
                                                </div>
                                                <div className="space-y-1 text-sm text-green-800">
                                                    <p className="font-medium text-green-900">{order.billing_address.name}</p>
                                                    {order.billing_address.company && (
                                                        <p>{order.billing_address.company}</p>
                                                    )}
                                                    <p>{order.billing_address.address_line_1}</p>
                                                    {order.billing_address.address_line_2 && (
                                                        <p>{order.billing_address.address_line_2}</p>
                                                    )}
                                                    <p>{order.billing_address.city}, {order.billing_address.state_province} {order.billing_address.postal_code}</p>
                                                    <p>{order.billing_address.country}</p>
                                                    {order.billing_address.phone && (
                                                        <p className="mt-2 pt-2 border-t border-green-200">
                                                            📞 {order.billing_address.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Information */}
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
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                                            <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
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

                        {/* Order Details */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <FileText className="w-5 h-5" />
                                    Order Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Order ID</span>
                                    <span className="font-mono font-semibold text-gray-900">#{order.id}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Date Created</span>
                                    <span className="text-sm text-gray-900">{order.created_at}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                    <span className="text-sm text-gray-900">{order.updated_at}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Payment</span>
                                    <span className="flex items-center gap-2 text-sm text-gray-900">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        Stripe
                                    </span>
                                </div>
                                {order.stripe_session_id && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stripe Session</span>
                                        <p className="font-mono text-xs text-gray-700 break-all mt-1">{order.stripe_session_id}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
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
                                        <span className="text-gray-600">Items ({order.items.length})</span>
                                        <span className="font-semibold text-gray-900">{currencySymbol}{Number(order.total).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-200">
                                        <span className="font-bold text-lg text-green-900">Total</span>
                                        <span className="font-bold text-2xl text-green-900">
                                            {currencySymbol}{Number(order.total).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-purple-900">
                                    <Package className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {order.status === 'pending' && (
                                    <Button 
                                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                        size="lg"
                                        onClick={() => handleStatusUpdate('paid')}
                                        disabled={processing}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {processing ? 'Processing...' : 'Mark as Paid'}
                                    </Button>
                                )}
                                {order.status === 'paid' && (
                                    <>
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                                            size="lg"
                                            onClick={() => handleStatusUpdate('refunded')}
                                            disabled={processing}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            {processing ? 'Processing...' : 'Mark as Refunded'}
                                        </Button>
                                    </>
                                )}
                                {(order.status === 'pending' || order.status === 'paid') && (
                                    <Button 
                                        className="w-full" 
                                        variant="outline" 
                                        size="lg"
                                        onClick={() => handleStatusUpdate('cancelled')}
                                        disabled={processing}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel Order
                                    </Button>
                                )}
                                <Button 
                                    className="w-full" 
                                    variant="outline" 
                                    size="lg"
                                    onClick={handleDownloadInvoice}
                                    disabled={isDownloading}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {isDownloading ? 'Generating...' : 'Download Invoice'}
                                </Button>
                                <a 
                                    href={`mailto:${order.customer_email}?subject=Regarding Your Order %23${order.id} - Robin's Artwork`}
                                    className="w-full"
                                >
                                    <Button className="w-full" variant="outline" size="lg" type="button">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email Customer
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
