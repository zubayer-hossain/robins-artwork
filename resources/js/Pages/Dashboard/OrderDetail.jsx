import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ArrowLeft, 
    Package, 
    Calendar, 
    CreditCard, 
    CheckCircle, 
    Clock, 
    XCircle,
    Eye,
    Download,
    MapPin,
    User,
    FileText,
    ShoppingBag,
    Truck,
    Receipt,
    Loader2
} from 'lucide-react';

export default function OrderDetail({ order }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadReceipt = async () => {
        setIsDownloading(true);
        try {
            // Create a temporary link and trigger download directly
            const link = document.createElement('a');
            link.href = route('orders.receipt', order.id);
            link.download = `receipt-order-${order.id}-${new Date().toISOString().split('T')[0]}.pdf`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Reset loading state after a short delay
            setTimeout(() => {
                setIsDownloading(false);
            }, 1500);
            
        } catch (error) {
            console.error('Download failed:', error);
            setIsDownloading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'refunded':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'refunded':
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Order #${order.id}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Modern Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Receipt className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                                <p className="text-gray-600">Order details and purchase information</p>
                            </div>
                        </div>
                        <Link href={route('orders')}>
                            <Button variant="outline" className="flex items-center gap-2 px-6 py-3 border-gray-300 hover:bg-gray-50">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Orders
                            </Button>
                        </Link>
                    </div>

                    {/* Main Content Row - Order Status, Order Items, and Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Main Content - Order Status and Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status Card */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Package className="w-5 h-5 text-blue-600" />
                                        </div>
                                        Order Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-2 px-3 py-2 text-sm font-medium`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                            <div className="text-gray-600">
                                                {order.status === 'paid' && 'Your order has been successfully processed and is ready for shipping'}
                                                {order.status === 'pending' && 'Your order is being processed and will be updated soon'}
                                                {order.status === 'refunded' && 'Your order has been refunded and processed'}
                                                {order.status === 'cancelled' && 'Your order has been cancelled as requested'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-gray-900">${order.total}</p>
                                            <p className="text-sm text-gray-500 font-medium">{order.currency?.toUpperCase() || 'USD'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items Card */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <ShoppingBag className="w-5 h-5 text-green-600" />
                                        </div>
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-200">
                                                {/* Artwork Image */}   
                                                <div className="flex-shrink-0">
                                                    {item.artwork?.primaryImage?.thumb ? (
                                                        <img
                                                            src={item.artwork.primaryImage.thumb}
                                                            alt={item.title_snapshot || item.artwork?.title}
                                                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                                                            <Eye className="w-6 h-6 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Item Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                                        {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                                                        {item.artwork?.medium && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                {item.artwork.medium}
                                                            </span>
                                                        )}
                                                        {item.artwork?.year && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                                {item.artwork.year}
                                                            </span>
                                                        )}
                                                        {item.edition?.name && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                                {item.edition.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.qty > 1 && (
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            Quantity: {item.qty}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* Price and Actions */}
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-xl font-bold text-gray-900 mb-1">${item.unit_price}</p>
                                                    {item.qty > 1 && (
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            ${item.unit_price} × {item.qty} = ${(item.unit_price * item.qty).toFixed(2)}
                                                        </p>
                                                    )}
                                                    {item.artwork?.slug && (
                                                        <Link href={route('artwork.show', item.artwork.slug)}>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View Artwork
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                             {/* Order Notes and Addresses */}
                    <div className="space-y-6">
                        {/* Order Notes Section */}
                        {order.order_notes && (
                            <Card className="border-0 shadow-sm bg-white">
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

                        {/* Addresses Section */}
                        {(order.shipping_address || order.billing_address) && (
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        Addresses
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
                                                    <p className="font-medium">{order.shipping_address.name}</p>
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
                                                    <p className="font-medium">{order.billing_address.name}</p>
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
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Information */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        Order Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Order ID</span>
                                        <span className="font-mono text-sm font-semibold text-gray-900">{order.id}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Order Date</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-900">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {order.created_at}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                        <span className="text-sm text-gray-900">{order.updated_at}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Email</span>
                                        <span className="text-sm text-gray-900">{order.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Payment Method</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-900">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            Stripe
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <Receipt className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Items ({order.items.length})</span>
                                        <span className="font-semibold text-gray-900">${order.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Shipping</span>
                                        <span className="text-sm text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">${order.total}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {order.status === 'paid' && (
                                <Card className="border-0 shadow-sm bg-white">
                                    <CardHeader className="pb-4 border-b border-gray-100">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Download className="w-5 h-5 text-blue-600" />
                                            </div>
                                            Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className={`w-full h-11 transition-all duration-200 ${
                                                isDownloading 
                                                    ? 'bg-blue-50 border-blue-400 text-blue-800 cursor-not-allowed' 
                                                    : 'border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400'
                                            }`}
                                            onClick={handleDownloadReceipt}
                                            disabled={isDownloading}
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Generating Receipt...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Receipt
                                                </>
                                            )}
                                        </Button>
                                        <Link href={route('contact')}>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full h-11 text-gray-700 hover:bg-gray-50"
                                            >
                                                Need Help?
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
