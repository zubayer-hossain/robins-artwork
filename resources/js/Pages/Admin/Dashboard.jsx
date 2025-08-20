import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats }) {
    return (
        <AdminLayout header="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
                            <span className="text-2xl">🎨</span>
                        </CardTitle>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalArtworks || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Published artworks in the store
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <span className="text-2xl">📦</span>
                        </CardTitle>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Completed orders
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardTitle>
                        <CardContent>
                            <div className="text-2xl font-bold">£{stats.totalRevenue || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Total sales revenue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                            <span className="text-2xl">💬</span>
                        </CardTitle>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unreadMessages || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Unread messages
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">➕</span>
                                Add New Artwork
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Create a new artwork listing with images, details, and pricing.
                            </p>
                            <Link href={route('admin.artworks.create')}>
                                <Button className="w-full">Create Artwork</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">📋</span>
                                Manage Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                View and manage customer orders, update status, and process payments.
                            </p>
                            <Link href={route('admin.orders.index')}>
                                <Button className="w-full">View Orders</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">💬</span>
                                Contact Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Respond to customer inquiries and contact form submissions.
                            </p>
                            <Link href={route('admin.contact.index')}>
                                <Button className="w-full">View Messages</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-sm">📦</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New order received</p>
                                    <p className="text-xs text-gray-500">Order #1234 - Highland Sunset</p>
                                </div>
                                <span className="text-xs text-gray-400">2 hours ago</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm">💬</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New contact message</p>
                                    <p className="text-xs text-gray-500">From: sarah.johnson@email.com</p>
                                </div>
                                <span className="text-xs text-gray-400">4 hours ago</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 text-sm">🎨</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Artwork published</p>
                                    <p className="text-xs text-gray-500">"Mountain Stream" is now live</p>
                                </div>
                                <span className="text-xs text-gray-400">1 day ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

