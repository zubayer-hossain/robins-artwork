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
    XCircle
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
            icon: User,
            href: route('addresses.index'),
            color: 'bg-purple-500 hover:bg-purple-600',
            iconColor: 'text-purple-500'
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Manage your orders, browse artwork, and update your profile
                            </p>
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
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                        <p className="text-3xl font-bold text-gray-900">${stats.totalSpent}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CreditCard className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Link href={route('favorites')}>
                            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Favorites</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.favoriteArtworks}</p>
                                            <p className="text-xs text-purple-600 group-hover:text-purple-700 transition-colors">Click to explore</p>
                                        </div>
                                        <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                                            <Heart className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={route('recent-views')}>
                            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Recent Views</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.recentViews}</p>
                                            <p className="text-xs text-purple-600 group-hover:text-purple-700 transition-colors">Click to explore</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                                            <Eye className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {quickActions.map((action, index) => (
                                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`p-4 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-200 mb-4`}>
                                                <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {action.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {action.description}
                                            </p>
                                            <Link href={action.href}>
                                                <Button className="w-full group-hover:scale-105 transition-transform duration-200">
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
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {recentOrders && recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <Link 
                                                key={order.id} 
                                                href={route('orders.show', order.id)}
                                                className="group block"
                                            >
                                                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                                                    {/* Order Icon */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                                            <Package className="w-5 h-5 text-white" />
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Order Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                                                Order #{order.id}
                                                            </h4>
                                                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <ShoppingBag className="w-4 h-4" />
                                                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <CreditCard className="w-4 h-4" />
                                                                ${order.total}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* View Button */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200">
                                                            <Eye className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        
                                        {/* View All Button */}
                                        <div className="pt-2">
                                            <Link href={route('orders')}>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
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
                                    <Star className="w-5 h-5" />
                                    Getting Started
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Explore the Gallery</h4>
                                            <p className="text-sm text-gray-600">Browse our collection of unique artworks and limited editions.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Complete Your Profile</h4>
                                            <p className="text-sm text-gray-600">Add your preferences and contact information for a better experience.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Stay Updated</h4>
                                            <p className="text-sm text-gray-600">Follow your favorite artists and get notified about new releases.</p>
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
