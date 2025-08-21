import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Eye, 
    Package, 
    Clock, 
    CheckCircle, 
    XCircle,
    CreditCard,
    Calendar,
    ShoppingBag,
    TrendingUp
} from 'lucide-react';

export default function CustomerOrders({ orders, stats }) {
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
            <Head title="My Orders" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                                <p className="mt-2 text-gray-600">
                                    View your order history and track current orders
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Link href={route('gallery')}>
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Browse Gallery
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats?.paidOrders || 0}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                        <p className="text-3xl font-bold text-gray-900">${stats?.totalSpent || 0}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <CreditCard className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                </div>

                    {/* Orders List */}
                <Card>
                    <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order History
                            </CardTitle>
                    </CardHeader>
                    <CardContent>
                            {orders && orders.data && orders.data.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.data.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </h3>
                                                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">${order.total}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-3">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-900">
                                                                    {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                                </h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {item.edition?.name && `Edition: ${item.edition.name}`}
                                                                    {item.qty > 1 && ` • Quantity: ${item.qty}`}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-gray-900">
                                                                    ${item.unit_price}
                                                                </p>
                                                                {item.qty > 1 && (
                                                                    <p className="text-sm text-gray-500">
                                                                        ${item.unit_price} × {item.qty}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-center py-2">No items found</p>
                                                )}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>Items: {order.items?.length || 0}</span>
                                                    <span>•</span>
                                                    <span>Currency: {order.currency?.toUpperCase() || 'USD'}</span>
                                                </div>
                                                <Link href={route('orders.show', order.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination */}
                                    {orders.links && orders.links.length > 3 && (
                                        <div className="flex justify-center mt-8">
                                            <div className="flex space-x-2">
                                                {orders.links.map((link, index) => (
                                                    link.url ? (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                                link.active
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 bg-gray-100"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 mb-6">
                                        <ShoppingBag className="mx-auto h-16 w-16" />
                            </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        Start shopping to see your orders here. Browse our gallery to find the perfect artwork for your collection.
                            </p>
                            <Link href={route('gallery')}>
                                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                            <Eye className="w-4 h-4 mr-2" />
                                    Browse Gallery
                                </Button>
                            </Link>
                        </div>
                            )}
                    </CardContent>
                </Card>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
