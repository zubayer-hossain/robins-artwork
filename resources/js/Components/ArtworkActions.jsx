import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';

// Complete artwork card actions - includes favorite, add to cart, and view details
export function ArtworkCardActions({ artwork, edition = null, isFavorite = false }) {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(isFavorite);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const { incrementCartCount, refreshCartCount } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is authenticated
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated';
        
        if (!isAuthenticated) {
            window.toast?.info(
                'Please sign in to add items to your cart. Create an account to start building your art collection.',
                'Authentication Required'
            );
            return;
        }
        
        setIsAddingToCart(true);
        
        try {
            const payload = edition 
                ? { edition_id: edition.id, type: 'edition' }
                : { artwork_id: artwork.id, type: 'original' };

            const response = await fetch(route('cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Added to cart successfully!', 'Cart Updated');
                console.log('Cart response data:', data); // Debug log
                // Refresh cart count from server to get accurate count
                refreshCartCount();
            } else if (data.already_in_cart) {
                // Item is already in cart - show info toast
                window.toast?.info(data.message || 'Item is already in your cart', 'Already in Cart');
                // Still refresh cart count to ensure accuracy
                refreshCartCount();
            } else {
                window.toast?.error(data.message || 'Failed to add to cart', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is authenticated
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated';
        
        if (!isAuthenticated) {
            window.toast?.info(
                'Please sign in to save your favorite artworks. Create an account to curate your personal collection.',
                'Authentication Required'
            );
            return;
        }
        
        setIsFavoriteLoading(true);
        
        try {
            const response = await fetch(route('favorites.toggle'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ artwork_id: artwork.id }),
            });

            const data = await response.json();

            if (data.success) {
                setIsFavorited(data.is_favorite);
                const message = data.is_favorite ? 'Added to favorites!' : 'Removed from favorites';
                const title = data.is_favorite ? 'Favorite Added' : 'Favorite Removed';
                window.toast?.success(message, title);
            } else {
                window.toast?.error(data.message || 'Failed to toggle favorite', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-2">
            {/* Left side: Favorite button */}
            <button
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className={`
                    w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all duration-200 ease-in-out transform hover:scale-110
                    ${isFavorited 
                        ? 'bg-red-500 text-white shadow-md hover:bg-red-600' 
                        : 'bg-white text-gray-400 border border-gray-200 hover:text-red-500 hover:border-red-300 shadow-sm hover:shadow-md'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1
                `}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
                {isFavoriteLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                ) : (
                    <svg 
                        className="w-4 h-4" 
                        fill={isFavorited ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                    </svg>
                )}
            </button>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-2">
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="
                        w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center
                        transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-green-600
                        shadow-md hover:shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                        focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1
                    "
                    title="Add to cart"
                >
                    {isAddingToCart ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    )}
                </button>

                {/* View Details Button */}
                <Link href={route('artwork.show', artwork.slug)}>
                    <button
                        className="
                            w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center
                            transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-blue-600
                            shadow-md hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
                        "
                        title="View details"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </Link>
            </div>
        </div>
    );
}

// Standalone Add to Cart Button for individual use
export function AddToCartButton({ 
    artwork, 
    edition = null, 
    className = "", 
    variant = "default",
    size = "default",
    disabled = false 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { incrementCartCount, refreshCartCount } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is authenticated
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated';
        
        if (!isAuthenticated) {
            window.toast?.info(
                'Please sign in to add items to your cart. Create an account to start building your art collection.',
                'Authentication Required'
            );
            return;
        }
        
        setIsLoading(true);
        
        try {
            const payload = edition 
                ? { edition_id: edition.id, type: 'edition' }
                : { artwork_id: artwork.id, type: 'original' };

            const response = await fetch(route('cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Added to cart successfully!', 'Cart Updated');
                console.log('Cart response data:', data); // Debug log
                // Refresh cart count from server to get accurate count
                refreshCartCount();
            } else if (data.already_in_cart) {
                // Item is already in cart - show info toast
                window.toast?.info(data.message || 'Item is already in your cart', 'Already in Cart');
                // Still refresh cart count to ensure accuracy
                refreshCartCount();
            } else {
                window.toast?.error(data.message || 'Failed to add to cart', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        default: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
        default: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white',
        outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isLoading}
            className={`
                ${sizeClasses[size]} ${variantClasses[variant]}
                rounded-lg font-medium transition-all duration-200 ease-in-out
                transform hover:-translate-y-0.5 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
                flex items-center justify-center gap-2
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Adding...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                </>
            )}
        </button>
    );
}

// Standalone Favorite Button for individual use
export function FavoriteButton({ 
    artwork, 
    isFavorite: initialIsFavorite = false, 
    className = "",
    size = "default"
}) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is authenticated
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated';
        
        if (!isAuthenticated) {
            window.toast?.info(
                'Please sign in to save your favorite artworks. Create an account to curate your personal collection.',
                'Authentication Required'
            );
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch(route('favorites.toggle'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ artwork_id: artwork.id }),
            });

            const data = await response.json();

            if (data.success) {
                setIsFavorite(data.is_favorite);
                const message = data.is_favorite ? 'Added to favorites!' : 'Removed from favorites';
                const title = data.is_favorite ? 'Favorite Added' : 'Favorite Removed';
                window.toast?.success(message, title);
            } else {
                window.toast?.error(data.message || 'Failed to toggle favorite', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        default: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]} rounded-full border-2 flex items-center justify-center
                transition-all duration-200 ease-in-out
                ${isFavorite 
                    ? 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'border-gray-300 bg-white text-gray-400 hover:border-red-300 hover:text-red-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                ${className}
            `}
        >
            {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ) : (
                <svg 
                    className="w-5 h-5" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                </svg>
            )}
        </button>
    );
}

// Modern View Details Button
export function ViewDetailsButton({ artwork, className = "", variant = "purple" }) {
    const variantClasses = {
        purple: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
        outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-white'
    };

    return (
        <Link href={route('artwork.show', artwork.slug)}>
            <button
                className={`
                    w-full px-4 py-2.5 rounded-lg font-medium
                    ${variantClasses[variant]}
                    transition-all duration-200 ease-in-out
                    transform hover:-translate-y-0.5 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
                    flex items-center justify-center gap-2
                    ${className}
                `}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">View Details</span>
            </button>
        </Link>
    );
}
