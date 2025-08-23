import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch cart count on mount only if user is authenticated
    useEffect(() => {
        // Check if user is authenticated by looking for auth-related elements
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated' ||
                               window.authUser;
        
        if (isAuthenticated) {
            fetchCartCount();
        } else {
            // User not authenticated, set cart count to 0 and don't make API calls
            setCartCount(0);
            setIsLoading(false);
        }
    }, []);

    const fetchCartCount = async () => {
        try {
            // Double-check if user is authenticated
            const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                                   document.querySelector('meta[name="auth-status"]')?.content === 'authenticated' ||
                                   window.authUser;
            
            if (!isAuthenticated) {
                console.log('User not authenticated, skipping cart count fetch');
                setCartCount(0);
                setIsLoading(false);
                return;
            }

            // Check if cart route exists
            if (typeof route === 'undefined' || !route('cart.count')) {
                console.log('Cart route not available');
                setCartCount(0);
                setIsLoading(false);
                return;
            }

            const response = await fetch(route('cart.count'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched cart count:', data.count, 'Response:', data); // Debug log
                setCartCount(data.count || 0);
            } else {
                console.log('Cart count fetch failed with status:', response.status);
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCartCount = (newCount) => {
        setCartCount(newCount);
    };

    const incrementCartCount = (amount = 1) => {
        setCartCount(prev => prev + amount);
    };

    const decrementCartCount = (amount = 1) => {
        setCartCount(prev => Math.max(0, prev - amount));
    };

    const refreshCartCount = () => {
        // Only refresh if user is authenticated
        const isAuthenticated = document.querySelector('[data-auth="true"]') || 
                               document.querySelector('meta[name="auth-status"]')?.content === 'authenticated' ||
                               window.authUser;
        
        if (isAuthenticated) {
            fetchCartCount();
        }
    };

    const value = {
        cartCount,
        isLoading,
        updateCartCount,
        incrementCartCount,
        decrementCartCount,
        refreshCartCount,
        fetchCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
