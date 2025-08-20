import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { Eye } from 'lucide-react';

export default function CustomerOrders() {
    return (
        <PublicLayout>
            <Head title="My Orders" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-gray-600">View your order history and track current orders</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">
                                Start shopping to see your orders here. Browse our gallery to find the perfect artwork.
                            </p>
                            <Link href={route('gallery')}>
                                <Button>
                                    Browse Gallery
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
