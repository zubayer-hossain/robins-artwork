﻿import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Mail } from 'lucide-react';

export default function AdminOrdersShow({ auth, order }) {
    const getStatusBadge = (status) => {
        const variants = {
            pending: 'secondary',
            paid: 'default',
            refunded: 'destructive',
            cancelled: 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <AdminLayout user={auth.user} header={`Order #${order.id}`}>
            <Head title={`Order #${order.id}`} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('admin.orders.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Orders
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                        <p className="text-gray-600">Order details and customer information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order ID</label>
                                        <p className="font-medium">#{order.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date Created</label>
                                        <p>{order.created_at}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                        <p>{order.updated_at}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Stripe Session</label>
                                        <p className="font-mono text-sm">{order.stripe_session_id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Currency</label>
                                        <p>{order.currency.toUpperCase()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.title_snapshot}</div>
                                                <div className="text-sm text-gray-600">
                                                    Qty: {item.qty} × £{item.unit_price.toLocaleString()}
                                                </div>
                                                {item.artwork && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Artwork: {item.artwork.title}
                                                    </div>
                                                )}
                                                {item.edition && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Edition: {item.edition.sku} - {item.edition.artwork_title}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">
                                                    £{(item.qty * item.unit_price).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Name</label>
                                    <p className="font-medium">{order.customer_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p>{order.customer_email}</p>
                                </div>
                                {order.user_id && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">User ID</label>
                                        <p className="font-mono text-sm">{order.user_id}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>£{order.total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-3">
                                        <span>Total:</span>
                                        <span>£{order.total.toLocaleString()} {order.currency.toUpperCase()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" variant="outline">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Resend Receipt
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Invoice
                                </Button>
                                {order.status === 'paid' && (
                                    <Button className="w-full" variant="outline">
                                        Mark as Shipped
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

