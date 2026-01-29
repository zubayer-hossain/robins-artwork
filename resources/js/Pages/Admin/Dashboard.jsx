import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    Palette, 
    ShoppingBag, 
    Users, 
    MessageSquare, 
    Package, 
    TrendingUp,
    Clock,
    Plus,
    Eye,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Settings,
    BarChart3,
    Layers
} from 'lucide-react';

export default function AdminDashboard({ stats, recentOrders, recentMessages, recentArtworks }) {
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
            case 'unread':
                return 'bg-orange-100 text-orange-800 border-orange-200';
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
            case 'unread':
                return <AlertTriangle className="w-4 h-4" />;
            case 'cancelled':
            case 'refunded':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const quickActions = [
        {
            title: 'Add Artwork',
            description: 'Create new artwork listings with images and details',
            icon: Plus,
            href: route('admin.artworks.create'),
            color: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        },
        {
            title: 'Manage Orders',
            description: 'View and process customer orders and payments',
            icon: ShoppingBag,
            href: route('admin.orders.index'),
            color: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
        },
        {
            title: 'View Messages',
            description: 'Respond to customer inquiries and contact forms',
            icon: MessageSquare,
            href: route('admin.contact-messages.index'),
            color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
        },
    ];

    return (
        <AdminLayout 
            user={user} 
            header="Admin Dashboard" 
            headerIcon={<BarChart3 className="w-8 h-8 text-white" />}
            headerDescription="Monitor your artwork store, manage sales, and track performance"
        >
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50 border border-purple-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Artworks</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            {stats.totalArtworks || 0}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {stats.publishedArtworks || 0} Published
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                                {stats.draftArtworks || 0} Draft
                                            </span>
                                        </div>
                                        {/* <p className={`text-xs mt-1 hidden sm:block ${stats.artworksChange !== null ? (stats.artworksChange > 0 ? 'text-green-600' : stats.artworksChange < 0 ? 'text-red-600' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {stats.artworksChange !== null ? (
                                                stats.artworksChange > 0 ? '↑' : stats.artworksChange < 0 ? '↓' : '→'
                                            ) : '→'} {stats.artworksChange !== null ? (
                                                stats.artworksChange === 100 ? 'New artworks' : 
                                                stats.artworksChange !== 0 ? `${Math.abs(stats.artworksChange)}%` : 'No change'
                                            ) : 'All artworks'} from last month
                                        </p> */}
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
                                        <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 border border-green-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {stats.totalOrders || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                                            <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {stats.paidOrders || 0} Paid
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                                {stats.pendingOrders || 0} Pending
                                            </span>
                                            {(stats.cancelledOrders > 0 || stats.refundedOrders > 0) && (
                                                <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                                                    {(stats.cancelledOrders || 0) + (stats.refundedOrders || 0)} Other
                                                </span>
                                            )}
                                        </div>
                                        {/* <p className={`text-xs mt-1 hidden sm:block ${stats.ordersChange !== null ? (stats.ordersChange > 0 ? 'text-green-600' : stats.ordersChange < 0 ? 'text-red-600' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {stats.ordersChange !== null ? (
                                                stats.ordersChange > 0 ? '↑' : stats.ordersChange < 0 ? '↓' : '→'
                                            ) : '→'} {stats.ordersChange !== null ? (
                                                stats.ordersChange === 100 ? 'New orders' : 
                                                stats.ordersChange !== 0 ? `${Math.abs(stats.ordersChange)}%` : 'No change'
                                            ) : 'All orders'} from last month
                                        </p> */}
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Revenue (Paid)</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            ${stats.totalRevenue || '0.00'}
                                        </p>
                                        {stats.pendingRevenue && parseFloat(stats.pendingRevenue) > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                                    ${stats.pendingRevenue} Pending
                                                </span>
                                            </div>
                                        )}
                                        {/* <p className={`text-xs mt-1 hidden sm:block ${stats.revenueChange !== null ? (stats.revenueChange > 0 ? 'text-green-600' : stats.revenueChange < 0 ? 'text-red-600' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {stats.revenueChange !== null ? (
                                                stats.revenueChange > 0 ? '↑' : stats.revenueChange < 0 ? '↓' : '→'
                                            ) : '→'} {stats.revenueChange !== null ? (
                                                stats.revenueChange === 100 ? 'New revenue' : 
                                                stats.revenueChange !== 0 ? `${Math.abs(stats.revenueChange)}%` : 'No change'
                                            ) : 'Paid orders only'} from last month
                                        </p> */}
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-orange-50/50 border border-orange-200/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Messages</p>
                                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                            {stats.totalMessages || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                                            {stats.unreadMessages > 0 && (
                                                <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">
                                                    {stats.unreadMessages} Unread
                                                </span>
                                            )}
                                            <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {stats.repliedMessages || 0} Replied
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                                {stats.readMessages || 0} Read
                                            </span>
                                        </div>
                                        {/* <p className={`text-xs mt-1 hidden sm:block ${stats.unreadMessages > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {stats.unreadMessages > 0 ? 'Needs attention' : 'All messages handled'}
                                        </p> */}
                                    </div>
                                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                                                action.title === 'Add Artwork' ? 'bg-gradient-to-br from-purple-500 to-blue-500' :
                                                action.title === 'Manage Orders' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                                'bg-gradient-to-br from-orange-500 to-red-500'
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
                                                <Button className={`w-full text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ${action.color}`}>
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity & Management Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b border-blue-100/50">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    Recent Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {recentOrders && recentOrders.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentOrders.map((order) => (
                                            <Link 
                                                key={order.id} 
                                                href={route('admin.orders.show', order.id)}
                                                className="group block"
                                            >
                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                            <Package className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                Order #{order.id}
                                                            </h4>
                                                            <span className="text-sm text-gray-600">
                                                                {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full`}>
                                                                    {getStatusIcon(order.status)}
                                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                </Badge>
                                                                <p className="text-xs text-gray-500">
                                                                    {order.formatted_date}
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
                                        <div className="pt-3">
                                            <Link href={route('admin.orders.index')}>
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
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent orders</h3>
                                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                            New orders will appear here once customers start purchasing.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Management Overview */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/20 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b border-green-100/50">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <span className="font-medium text-gray-900">Total Customers</span>
                                        </div>
                                        <span className="text-lg font-bold text-purple-600">{stats.totalCustomers || 0}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <Layers className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-gray-900">Total Editions</span>
                                        </div>
                                        <span className="text-lg font-bold text-blue-600">{stats.totalEditions || 0}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                                            <span className="font-medium text-gray-900">Low Stock Items</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-orange-600">{stats.lowStockEditions || 0}</span>
                                            {stats.outOfStockEditions > 0 && (
                                                <div className="text-xs text-red-600 font-medium">
                                                    {stats.outOfStockEditions} Out of Stock
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-gray-900">Total Users</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">{stats.totalUsers || 0}</span>
                                    </div>
                                    
                                    {/* Growth Stats */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <h5 className="font-medium text-gray-900 mb-2 text-sm">Monthly Growth</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                                                <div className="text-xs text-gray-600">Artworks</div>
                                                <div className={`text-sm font-bold ${
                                                    stats.artworksChange > 0 ? 'text-green-600' : 
                                                    stats.artworksChange < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {stats.artworksChange > 0 ? '+' : ''}{stats.artworksChange || 0}%
                                                </div>
                                            </div>
                                            <div className="text-center p-2 bg-green-50 rounded-lg">
                                                <div className="text-xs text-gray-600">Orders</div>
                                                <div className={`text-sm font-bold ${
                                                    stats.ordersChange > 0 ? 'text-green-600' : 
                                                    stats.ordersChange < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {stats.ordersChange > 0 ? '+' : ''}{stats.ordersChange || 0}%
                                                </div>
                                            </div>
                                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                                                <div className="text-xs text-gray-600">Revenue</div>
                                                <div className={`text-sm font-bold ${
                                                    stats.revenueChange > 0 ? 'text-green-600' : 
                                                    stats.revenueChange < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange || 0}%
                                                </div>
                                            </div>
                                            <div className="text-center p-2 bg-orange-50 rounded-lg">
                                                <div className="text-xs text-gray-600">Customers</div>
                                                <div className={`text-sm font-bold ${
                                                    stats.customersChange > 0 ? 'text-green-600' : 
                                                    stats.customersChange < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {stats.customersChange > 0 ? '+' : ''}{stats.customersChange || 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {recentMessages && recentMessages.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Recent Messages
                                        </h4>
                                        <div className="space-y-2">
                                            {recentMessages.slice(0, 2).map((message) => (
                                                <Link key={message.id} href={route('admin.contact-messages.show', message.id)}>
                                                    <div className="p-2 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-medium text-sm text-gray-900">{message.name}</span>
                                                            <Badge className={`${getStatusColor(message.status)} text-xs`}>
                                                                {message.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-gray-600 truncate">{message.subject}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

