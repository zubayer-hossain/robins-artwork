import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/Contexts/CartContext';
import { ShoppingCart, Trash2, Eye, ShoppingBag } from 'lucide-react';

export default function CartDropdown({ isOpen, onClose, triggerRef }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const { cartCount, refreshCartCount } = useCart();

    // Fetch cart items when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && 
                triggerRef.current && 
                !triggerRef.current.contains(event.target) &&
                !event.target.closest('[data-cart-dropdown]')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, triggerRef]);

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route('cart'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems || []);
                setTotalPrice(data.totalPrice || 0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
            setTotalPrice(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const response = await fetch(route('cart.destroy', cartItemId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Item removed from cart', 'Cart Updated');
                fetchCartItems(); // Refresh dropdown items
                refreshCartCount(); // Update cart badge
            } else {
                window.toast?.error(data.message || 'Failed to remove item', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            data-cart-dropdown
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 md:w-80 lg:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col
                       max-w-[calc(100vw-2rem)] sm:max-w-none" // Ensure it doesn't overflow on very small screens
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart Items ({cartCount})
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium mb-1">No items in cart</p>
                        <p className="text-sm text-gray-400">Add some artworks to get started</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        {cartItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="relative flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                {/* Remove Button - Top Right Corner */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemoveItem(item.id);
                                    }}
                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-full z-10"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Item Image */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.artwork?.primaryImage?.thumb || 
                                             item.edition?.artwork?.primaryImage?.thumb || 
                                             `https://picsum.photos/60/60?random=${item.id}`}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                    <Link 
                                        href={route('artwork.show', item.artwork?.slug || '')} 
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <h4 className="text-sm font-medium text-gray-900 truncate hover:text-purple-600 transition-colors cursor-pointer">
                                            {item.name}
                                        </h4>
                                    </Link>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="text-xs">
                                                {item.type === 'original' ? 'Artwork' : 'Print'}
                                            </Badge>
                                            <span className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ${item.total_price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Show more items indicator */}
                        {cartItems.length > 3 && (
                            <div className="text-center py-2">
                                <p className="text-sm text-gray-500">
                                    +{cartItems.length - 3} more item{cartItems.length - 3 !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    {/* Total */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">${totalPrice}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Link href={route('cart')} onClick={onClose} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Eye className="w-4 h-4 mr-2" />
                                View Cart
                            </Button>
                        </Link>
                        
                        <Link href={route('gallery')} onClick={onClose} className="flex-1">
                            <Button variant="outline" className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
