import { Head, Link, usePage } from '@inertiajs/react';
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
    TrendingUp,
    ArrowRight
} from 'lucide-react';

export default function CustomerOrders({ orders, stats }) {
    const { currency } = usePage().props;
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
            <Head title="Orders" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
                {/* Hero Section - Mobile First */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-900 bg-clip-text text-transparent">
                                    Orders
                                </h1>
                                <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl sm:mx-0 mx-auto">
                                    View your order history and track current orders
                                </p>
                            </div>
                            <div className="flex justify-center sm:justify-end">
                                <Link href={route('gallery')}>
                                    <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Browse Gallery
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Stats Grid - Mobile First */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
                        <Card className="hover:shadow-lg transition-all duration-300 border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/50">
                            <CardContent className="p-3 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                                    </div>
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                        <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border border-green-200/50 bg-gradient-to-br from-white to-green-50/50">
                            <CardContent className="p-3 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Completed</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.paidOrders || 0}</p>
                                    </div>
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border border-yellow-200/50 bg-gradient-to-br from-white to-yellow-50/50">
                            <CardContent className="p-3 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Pending</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
                                    </div>
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border border-purple-200/50 bg-gradient-to-br from-white to-purple-50/50">
                            <CardContent className="p-3 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{currency?.symbol || '$'}{stats?.totalSpent || 0}</p>
                                    </div>
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Orders List - Mobile First */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm">
                        <CardHeader className="pb-4 border-b border-blue-100/50">
                            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-gray-900">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                Order History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            {orders && orders.data && orders.data.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {orders.data.map((order) => (
                                        <div key={order.id} className="border border-gray-200/50 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-300 bg-white/90">
                                            {/* Order Header - Compact */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                                        Order #{order.id}
                                                    </h3>
                                                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit text-xs px-2 py-1`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg sm:text-xl font-bold text-gray-900">{currency?.symbol || '$'}{order.total}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Items - Compact */}
                                            <div className="space-y-2">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-md">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                    {item.title_snapshot || item.artwork?.title || 'Artwork'}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                                                    {item.edition?.name && (
                                                                        <span className="text-blue-600 font-medium">
                                                                            {item.edition.name}
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center gap-1">
                                                                        <Package className="w-3 h-3" />
                                                                        Qty: {item.qty}
                                                                    </span>
                                                                    {item.qty > 1 && (
                                                                        <span className="text-gray-500">
                                                                            {currency?.symbol || '$'}{item.unit_price} each
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right ml-3">
                                                                <p className="font-bold text-gray-900 text-sm sm:text-base">
                                                                    {currency?.symbol || '$'}{(item.unit_price * item.qty).toFixed(2)}
                                                                </p>
                                                                {item.qty > 1 && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {currency?.symbol || '$'}{item.unit_price} × {item.qty}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-center py-3 text-sm">No items found</p>
                                                )}
                                            </div>

                                            {/* Order Footer - Compact */}
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/50">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Package className="w-3 h-3" />
                                                    {order.items?.length || 0} items • {order.currency?.toUpperCase() || 'USD'}
                                                </div>
                                                
                                                <Link href={route('orders.show', order.id)}>
                                                    <Button 
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-4 py-2 font-medium rounded-lg text-sm"
                                                    >
                                                        <Eye className="w-3 h-3 mr-1.5" />
                                                        Details
                                                        <ArrowRight className="w-3 h-3 ml-1.5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination - Mobile Friendly */}
                                    {orders.links && orders.links.length > 3 && (
                                        <div className="flex justify-center mt-6 sm:mt-8">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {orders.links.map((link, index) => (
                                                    link.url ? (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                link.active
                                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 bg-gray-100"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 sm:py-16">
                                    <div className="text-gray-400 mb-6">
                                        <ShoppingBag className="mx-auto h-16 w-16 sm:h-20 sm:w-20" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
                                    <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                                        Start shopping to see your orders here. Browse our gallery to find the perfect artwork for your collection.
                                    </p>
                                    <Link href={route('gallery')}>
                                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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
