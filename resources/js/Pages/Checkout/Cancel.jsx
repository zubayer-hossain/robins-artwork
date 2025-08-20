import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
    return (
        <PublicLayout>
            <Head title="Order Cancelled" />
            
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl">Order Cancelled</CardTitle>
                        <p className="text-gray-600">
                            Your order was not completed. No charges have been made.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-left space-y-3">
                            <h3 className="font-medium">Need help?</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>â€¢ Check your payment method</li>
                                <li>â€¢ Ensure you have sufficient funds</li>
                                <li>â€¢ Try using a different browser</li>
                                <li>â€¢ Contact our support team</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href={route('home')} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Link href={route('gallery')} className="flex-1">
                                <Button className="w-full">
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

