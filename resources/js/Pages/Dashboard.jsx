import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    ShoppingBag, 
    User, 
    Eye, 
    Package, 
    CreditCard, 
    Clock,
    TrendingUp,
    Heart,
    Star,
    CheckCircle,
    XCircle,
    MapPin
} from 'lucide-react';

export default function Dashboard({ stats, recentOrders }) {
    const { auth } = usePage().props;
    const user = auth.user;

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

    const quickActions = [
        {
            title: 'Browse Gallery',
            description: 'Discover new artwork and limited editions',
            icon: Eye,
            href: route('gallery'),
            color: 'bg-blue-500 hover:bg-blue-600',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Orders',
            description: 'Track your purchases and order history',
            icon: Package,
            href: route('orders'),
            color: 'bg-green-500 hover:bg-green-600',
            iconColor: 'text-green-500'
        },
        {
            title: 'Addresses',
            description: 'Manage your shipping and billing addresses',
            icon: MapPin,
            href: route('addresses.index'),
            color: 'bg-purple-500 hover:bg-purple-600',
            iconColor: 'text-purple-500'
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
                {/* Hero Section */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-900 bg-clip-text text-transparent leading-tight">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl sm:mx-0 mx-auto">
                                Manage your orders, browse artwork, and update your profile
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {stats.totalOrders}
                                        </p>
                                        <p className={`text-xs mt-1 hidden sm:block ${stats.ordersChange !== null ? (stats.ordersChange > 0 ? 'text-green-600' : stats.ordersChange < 0 ? 'text-red-600' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {stats.ordersChange !== null ? (
                                                stats.ordersChange > 0 ? '↑' : stats.ordersChange < 0 ? '↓' : '→'
                                            ) : '→'} {stats.ordersChange !== null ? (
                                                stats.ordersChange === 100 ? 'New activity' : 
                                                stats.ordersChange !== 0 ? `${Math.abs(stats.ordersChange)}%` : 'No change'
                                            ) : 'New user'} from last month
                                        </p>
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 border border-green-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            ${stats.totalSpent}
                                        </p>
                                        <p className={`text-xs mt-1 hidden sm:block ${stats.spendingChange !== null ? (stats.spendingChange > 0 ? 'text-green-600' : stats.spendingChange < 0 ? 'text-red-600' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {stats.spendingChange !== null ? (
                                                stats.spendingChange > 0 ? '↑' : stats.spendingChange < 0 ? '↓' : '→'
                                            ) : '→'} {stats.spendingChange !== null ? (
                                                stats.spendingChange === 100 ? 'New spending' : 
                                                stats.spendingChange !== 0 ? `${Math.abs(stats.spendingChange)}%` : 'No change'
                                            ) : 'New user'} from last month
                                        </p>
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Link href={route('favorites')}>
                            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-red-50/50 border border-red-200/50 shadow-lg">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Favorites</p>
                                            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                {stats.favoriteArtworks}
                                            </p>
                                            <p className="text-xs text-red-600 group-hover:text-red-700 transition-colors hidden sm:block">Click to explore</p>
                                        </div>
                                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={route('recent-views')}>
                            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-purple-50/50 border border-purple-200/50 shadow-lg">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Recent Views</p>
                                            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                {stats.recentViews}
                                            </p>
                                            <p className="text-xs text-purple-600 group-hover:text-purple-700 transition-colors hidden sm:block">Click to explore</p>
                                        </div>
                                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                            <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {quickActions.map((action, index) => (
                                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 shadow-lg">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`p-4 sm:p-5 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 mb-4 sm:mb-6 ${
                                                action.title === 'Browse Gallery' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                                                action.title === 'Orders' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                                                'bg-gradient-to-br from-pink-500 to-rose-500'
                                            }`}>
                                                <action.icon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                                {action.description}
                                            </p>
                                            <Link href={action.href}>
                                                <Button className={`w-full text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ${
                                                    action.title === 'Browse Gallery' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' :
                                                    action.title === 'Orders' ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' :
                                                    'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
                                                }`}>
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity & Getting Started */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b border-blue-100/50">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {recentOrders && recentOrders.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentOrders.map((order) => (
                                            <Link 
                                                key={order.id} 
                                                href={route('orders.show', order.id)}
                                                className="group block"
                                            >
                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                                                    {/* Order Icon */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                            <Package className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Order Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                Order #{order.id}
                                                            </h4>
                                                            <span className="text-sm text-gray-600">
                                                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full`}>
                                                                    {getStatusIcon(order.status)}
                                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                </Badge>
                                                                
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                <span className="font-semibold text-gray-900">
                                                                    ${order.total}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        
                                        {/* View All Button */}
                                        <div className="pt-3">
                                            <Link href={route('orders')}>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full h-10 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    View All Orders
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                            Your recent orders and interactions will appear here once you start shopping.
                                        </p>
                                        <Link href={route('gallery')}>
                                            <Button 
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Start Browsing
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Getting Started */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    Getting Started
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5"></div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">Discover Your Style</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Browse our curated collections and use the heart icon to save artworks that resonate with you. We'll use this to recommend similar pieces.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5"></div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">Limited Editions & Exclusives</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Many of our artworks are limited editions. Set up notifications to be first to know when new pieces are released.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5"></div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">Art Investment Tips</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Learn about art collecting, authentication, and how to care for your pieces. Check our blog for expert insights and market trends.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
