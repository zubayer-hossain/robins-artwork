import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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
    Loader2,
    Settings
} from 'lucide-react';

export default function OrderDetail({ order }) {
    const { currency } = usePage().props;
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                                <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                                <p className="text-sm sm:text-base text-gray-600">Order details and purchase information</p>
                            </div>
                        </div>
                        <Link href={route('orders')}>
                            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-gray-300 hover:bg-gray-50">
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
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-2 px-3 py-2 text-sm font-medium w-fit`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                            <div className="text-sm sm:text-base text-gray-600 max-w-sm lg:max-w-md">
                                                {order.status === 'paid' && 'Your order has been successfully processed and is ready for shipping'}
                                                {order.status === 'pending' && 'Your order is being processed and will be updated soon'}
                                                {order.status === 'refunded' && 'Your order has been refunded and processed'}
                                                {order.status === 'cancelled' && 'Your order has been cancelled as requested'}
                                            </div>
                                        </div>
                                        <div className="text-center lg:text-right">
                                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{currency?.symbol || '$'}{order.total}</p>
                                            <p className="text-sm text-gray-500 font-medium">{currency?.code || 'USD'}</p>
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
                                    <div className="space-y-1.5 sm:space-y-3">
                                        {order.items.map((item, index) => (
                                            <Card key={index} className="p-2 sm:p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                                                {/* Responsive Layout - Mobile: Image Left + Content Right, Desktop: Horizontal */}
                                                <div className="flex items-start gap-3 sm:gap-4">
                                                    {/* Artwork Image - Always left */}
                                                    <div className="flex-shrink-0">
                                                        {item.artwork?.primaryImage?.thumb ? (
                                                            <img
                                                                src={item.artwork.primaryImage.thumb}
                                                                alt={item.title_snapshot || item.artwork?.title}
                                                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                                                                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                                                                        {/* Item Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                {item.artwork?.slug ? (
                                                                    <Link 
                                                                        href={route('artwork.show', item.artwork.slug)} 
                                                                        className="hover:opacity-80 transition-opacity"
                                                                    >
                                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer truncate">
                                                                            {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                                        </h3>
                                                                    </Link>
                                                                ) : (
                                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                                                        {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                                    </h3>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Price Section */}
                                                            <div className="text-left sm:text-right">
                                                                {item.qty > 1 && (
                                                                    <div className="text-sm text-gray-500">
                                                                        {currency?.symbol || '$'}{item.unit_price} × {item.qty}
                                                                    </div>
                                                                )}
                                                                <div className="text-base font-semibold text-gray-900">
                                                                    {currency?.symbol || '$'}{(item.unit_price * item.qty).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Type Badge and Quantity */}
                                                        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <Badge variant="outline" className="text-xs px-3 py-1 bg-gray-50 border-gray-200">
                                                                    {item.edition?.name ? 'Print Edition' : 'Original Artwork'}
                                                                </Badge>
                                                                
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-500 font-medium">Quantity:</span>
                                                                    <span className="text-sm font-medium text-gray-700">{item.qty}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
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
                                                            <div className="font-medium text-blue-900">{order.shipping_address.label || 'Shipping Address'}</div>
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
                                                            <div className="font-medium text-green-900">{order.billing_address.label || 'Billing Address'}</div>
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
                                        <span className="font-semibold text-gray-900">{currency?.symbol || '$'}{order.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Shipping</span>
                                        <span className="text-sm text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">{currency?.symbol || '$'}{order.total}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                        </div>
                                        Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-3">
                                    {order.status === 'paid' && (
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
                                    )}
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
