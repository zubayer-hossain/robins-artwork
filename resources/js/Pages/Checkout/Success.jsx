import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess({ sessionId }) {
    return (
        <PublicLayout>
            <Head title="Order Confirmed" />
            
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Thank You!</CardTitle>
                        <p className="text-gray-600">
                            Your order has been confirmed and is being processed.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">Order Reference</p>
                            <p className="font-mono text-sm">{sessionId}</p>
                        </div>
                        
                        <div className="text-left space-y-3">
                            <h3 className="font-medium">What happens next?</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>â€¢ You'll receive an email confirmation shortly</li>
                                <li>â€¢ Our team will process your order</li>
                                <li>â€¢ You'll be notified when your order ships</li>
                                <li>â€¢ Track your order status in your account</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href={route('home')} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Link href={route('orders')} className="flex-1">
                                <Button className="w-full">
                                    View Orders
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}

