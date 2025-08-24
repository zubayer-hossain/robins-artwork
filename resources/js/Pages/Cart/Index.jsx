import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, PlusCircle, Edit } from 'lucide-react';
import AddressModal from '@/Components/AddressModal';

export default function CartIndex({ cartItems, totalPrice, itemCount, addresses, defaultShippingAddress, defaultBillingAddress }) {
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [selectedShippingAddress, setSelectedShippingAddress] = useState(defaultShippingAddress?.label || '');
    const [selectedBillingAddress, setSelectedBillingAddress] = useState(defaultBillingAddress?.label || '');
    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { updateCartCount, refreshCartCount } = useCart();

    // Refresh page data after address changes
    const refreshAddresses = () => {
        router.reload({ only: ['addresses', 'defaultShippingAddress', 'defaultBillingAddress'] });
    };

    const handleQuantityUpdate = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(route('cart.update', cartItemId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Quantity updated', 'Cart Updated');
                // Refresh the page to get updated totals
                router.reload({ only: ['cartItems', 'totalPrice', 'itemCount'] });
                refreshCartCount(); // Refresh from server
            } else {
                window.toast?.error(data.message || 'Failed to update quantity', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const response = await fetch(route('cart.destroy', cartItemId), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Item removed from cart', 'Cart Updated');
                // Refresh the page to get updated cart
                router.reload({ only: ['cartItems', 'totalPrice', 'itemCount'] });
                refreshCartCount(); // Refresh from server
            } else {
                window.toast?.error(data.message || 'Failed to remove item', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) return;

        try {
            const response = await fetch(route('cart.clear'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Cart cleared successfully', 'Cart Cleared');
                // Refresh the page
                router.reload({ only: ['cartItems', 'totalPrice', 'itemCount'] });
                updateCartCount(0);
            } else {
                window.toast?.error(data.message || 'Failed to clear cart', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        }
    };

    const handleSubmitOrder = async () => {
        // Validate address selection
        if (!selectedShippingAddress) {
            window.toast?.error('Please select a shipping address', 'Address Required');
            return;
        }

        if (!useShippingAsBilling && !selectedBillingAddress) {
            window.toast?.error('Please select a billing address', 'Address Required');
            return;
        }

        setIsSubmittingOrder(true);
        
        try {
            const orderNotes = document.getElementById('order_notes')?.value || '';
            
            // Find the actual address objects by label
            const shippingAddress = addresses.find(addr => addr.label === selectedShippingAddress);
            const billingAddress = useShippingAsBilling 
                ? addresses.find(addr => addr.label === selectedShippingAddress)
                : addresses.find(addr => addr.label === selectedBillingAddress);
            
            const response = await fetch(route('orders.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    shipping_address_id: shippingAddress?.id,
                    billing_address_id: billingAddress?.id,
                    order_notes: orderNotes,
                }),
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Order submitted successfully! We will contact you shortly.', 'Order Submitted');
                updateCartCount(0);
                // Redirect to orders page
                router.visit(route('orders'));
            } else {
                window.toast?.error(data.message || 'Failed to submit order. Please try again.', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <AuthenticatedLayout>
                <Head title="Shopping Cart" />
                
                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center py-16">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Looks like you haven't added any artworks to your cart yet.</p>
                            <Link href={route('gallery')}>
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Browse Gallery
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Shopping Cart" />
            
            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-gray-600 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
                        </div>
                        {cartItems.length > 0 && (
                            <Button 
                                variant="outline" 
                                onClick={handleClearCart}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Cart
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items and Address Selection */}
                        <div className="lg:col-span-2 space-y-6">
                        {/* Cart Items */}
                            <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {/* Artwork Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.artwork?.primaryImage?.medium || item.edition?.artwork?.primaryImage?.medium || `https://picsum.photos/150/150?random=${item.id}`}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link 
                                                        href={route('artwork.show', item.artwork?.slug || '')} 
                                                        className="hover:opacity-80 transition-opacity"
                                                    >
                                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                                    
                                                    {/* Type Badge */}
                                                    <Badge variant="outline" className="mt-2">
                                                        {item.type === 'original' ? 'Original Artwork' : 'Print Edition'}
                                                    </Badge>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">Quantity:</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">
                                                        ${item.price} × {item.quantity}
                                                    </div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        ${item.total_price}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                            {/* Address Selection */}
                            {addresses.length === 0 ? (
                                <Card className="p-6">
                                    <CardContent className="text-center py-8">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                                        <p className="text-gray-600 mb-4">You need to add at least one shipping and billing address to proceed with your order.</p>
                                        <Button
                                            onClick={() => {
                                                setEditingAddress(null);
                                                setIsAddressModalOpen(true);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Add Your First Address
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    {/* Shipping Address */}
                                    <Card className="p-6">
                                        <CardHeader className="px-0 pt-0">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                                Shipping Address
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-0 pb-0">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Select 
                                                        value={selectedShippingAddress} 
                                                        onValueChange={setSelectedShippingAddress}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select shipping address" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {addresses.filter(addr => addr.type === 'shipping').map((address) => (
                                                                <SelectItem key={address.id} value={address.label}>
                                                                    {address.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingAddress(null);
                                                            setIsAddressModalOpen(true);
                                                        }}
                                                        className="ml-2"
                                                    >
                                                        <PlusCircle className="w-4 h-4 mr-1" />
                                                        Add New
                                                    </Button>
                                                </div>
                                                
                                                {selectedShippingAddress && (
                                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        {(() => {
                                                            const address = addresses.find(addr => addr.label === selectedShippingAddress);
                                                            if (!address) return null;
                                                            return (
                                                                <div className="space-y-1">
                                                                    <div className="font-medium text-blue-900">{address.label}</div>
                                                                    {address.company && <div className="text-sm text-blue-700">{address.company}</div>}
                                                                    <div className="text-sm text-blue-700">{address.address_line_1}</div>
                                                                    {address.address_line_2 && <div className="text-sm text-blue-700">{address.address_line_2}</div>}
                                                                    <div className="text-sm text-blue-700">
                                                                        {address.city}, {address.state_province} {address.postal_code}
                                                                    </div>
                                                                    <div className="text-sm text-blue-700">{address.country}</div>
                                                                    {address.phone && <div className="text-sm text-blue-700">{address.phone}</div>}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Billing Address */}
                                    <Card className="p-6">
                                        <CardHeader className="px-0 pt-0">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                                Billing Address
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-0 pb-0">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <Checkbox
                                                        id="use_shipping_as_billing"
                                                        checked={useShippingAsBilling}
                                                        onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                                    />
                                                    <label htmlFor="use_shipping_as_billing" className="text-sm font-medium text-gray-700">
                                                        Use shipping address as billing address
                                                    </label>
                                                </div>
                                                
                                                {!useShippingAsBilling && (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <Select 
                                                                value={selectedBillingAddress} 
                                                                onValueChange={setSelectedBillingAddress}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select billing address" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {addresses.filter(addr => addr.type === 'billing').map((address) => (
                                                                        <SelectItem key={address.id} value={address.label}>
                                                                            {address.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingAddress(null);
                                                                    setIsAddressModalOpen(true);
                                                                }}
                                                                className="ml-2"
                                                            >
                                                                <PlusCircle className="w-4 h-4 mr-1" />
                                                                Add New
                                                            </Button>
                                                        </div>
                                                        
                                                        {selectedBillingAddress && (
                                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                                {(() => {
                                                                    const address = addresses.find(addr => addr.label === selectedBillingAddress);
                                                                    if (!address) return null;
                                                                    return (
                                                                        <div className="space-y-1">
                                                                            <div className="font-medium text-green-900">{address.label}</div>
                                                                            {address.company && <div className="text-sm text-green-700">{address.company}</div>}
                                                                            <div className="text-sm text-green-700">{address.address_line_1}</div>
                                                                            {address.address_line_2 && <div className="text-sm text-green-700">{address.address_line_2}</div>}
                                                                            <div className="text-sm text-green-700">
                                                                                {address.city}, {address.state_province} {address.postal_code}
                                                                            </div>
                                                                            <div className="text-sm text-green-700">{address.country}</div>
                                                                            {address.phone && <div className="text-sm text-green-700">{address.phone}</div>}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {useShippingAsBilling && selectedShippingAddress && (
                                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="text-sm text-green-700 font-medium mb-2">
                                                            Using shipping address for billing
                                                        </div>
                                                        {(() => {
                                                            const address = addresses.find(addr => addr.label === selectedShippingAddress);
                                                            if (!address) return null;
                                                            return (
                                                                <div className="space-y-1">
                                                                    <div className="font-medium text-green-900">{address.label}</div>
                                                                    {address.company && <div className="text-sm text-green-700">{address.company}</div>}
                                                                    <div className="text-sm text-green-700">{address.address_line_1}</div>
                                                                    {address.address_line_2 && <div className="text-sm text-green-700">{address.address_line_2}</div>}
                                                                    <div className="text-sm text-green-700">
                                                                        {address.city}, {address.state_province} {address.postal_code}
                                                                    </div>
                                                                    <div className="text-sm text-green-700">{address.country}</div>
                                                                    {address.phone && <div className="text-sm text-green-700">{address.phone}</div>}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        {/* Right Sidebar - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <Card className="p-6">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="px-0 pb-0">
                                    {/* Order Notes */}
                                    <div className="mb-6">
                                        <label htmlFor="order_notes" className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            id="order_notes"
                                            name="order_notes"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Any special instructions or notes for your order..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                                            <span className="font-medium">${totalPrice}</span>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span>${totalPrice}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-3">
                                            <Button
                                                onClick={handleSubmitOrder}
                                                    disabled={isSubmittingOrder || !selectedShippingAddress || (!useShippingAsBilling && !selectedBillingAddress)}
                                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                size="lg"
                                            >
                                                {isSubmittingOrder ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Submitting Order...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Order
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                                
                                                {(!selectedShippingAddress || (!useShippingAsBilling && !selectedBillingAddress)) && (
                                                    <p className="text-xs text-red-500 text-center">
                                                        Please select shipping and billing addresses to proceed
                                                    </p>
                                                )}
                                            
                                            <p className="text-xs text-gray-500 text-center pt-2 pb-4">
                                                By submitting your order, we will contact you to arrange payment and delivery.
                                            </p>
                                            
                                            <Link href={route('gallery')}>
                                                <Button variant="outline" className="w-full">
                                                    Continue Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Address Modal */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => {
                    setIsAddressModalOpen(false);
                    setEditingAddress(null);
                    refreshAddresses(); // Refresh addresses when modal closes
                }}
                address={editingAddress}
                isEditing={!!editingAddress}
                onAddressAdded={refreshAddresses}
            />
        </AuthenticatedLayout>
    );
}
