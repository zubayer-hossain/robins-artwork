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
    Download
} from 'lucide-react';

export default function OrderDetail({ order }) {
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
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('orders')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Orders
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                            <p className="text-gray-600">Order details and purchase information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                            <span className="text-gray-600">
                                                {order.status === 'paid' && 'Your order has been successfully processed'}
                                                {order.status === 'pending' && 'Your order is being processed'}
                                                {order.status === 'refunded' && 'Your order has been refunded'}
                                                {order.status === 'cancelled' && 'Your order has been cancelled'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">${order.total}</p>
                                            <p className="text-sm text-gray-500">{order.currency?.toUpperCase() || 'USD'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                        {item.artwork?.medium && (
                                                            <span>Medium: {item.artwork.medium}</span>
                                                        )}
                                                        {item.artwork?.year && (
                                                            <span>Year: {item.artwork.year}</span>
                                                        )}
                                                        {item.edition?.name && (
                                                            <span>Edition: {item.edition.name}</span>
                                                        )}
                                                    </div>
                                                    {item.qty > 1 && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Quantity: {item.qty}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">${item.unit_price}</p>
                                                    {item.qty > 1 && (
                                                        <p className="text-sm text-gray-500">
                                                            ${item.unit_price} × {item.qty} = ${(item.unit_price * item.qty).toFixed(2)}
                                                        </p>
                                                    )}
                                                    {item.artwork?.slug && (
                                                        <Link href={route('artwork.show', item.artwork.slug)}>
                                                            <Button variant="ghost" size="sm" className="mt-2">
                                                                <Eye className="w-3 h-3 mr-1" />
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
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order ID</label>
                                        <p className="font-mono text-sm">{order.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order Date</label>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {order.created_at}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                        <p>{order.updated_at}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Payment Method</label>
                                        <p className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            Stripe
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Items ({order.items.length})</span>
                                        <span>${order.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${order.total}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {order.status === 'paid' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button variant="outline" className="w-full">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Receipt
                                        </Button>
                                        <Link href={route('contact')}>
                                            <Button variant="ghost" className="w-full">
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
