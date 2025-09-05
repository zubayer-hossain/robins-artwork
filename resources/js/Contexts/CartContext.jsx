import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

    // Fetch cart count on mount and when user changes
    useEffect(() => {
        // Check if we're in admin context
        const isAdminContext = window.location.pathname.startsWith('/admin') || 
                               document.querySelector('[data-admin-context="true"]') ||
                               window.route?.current?.()?.startsWith('admin.');
        
        if (isAdminContext) {
            setCartCount(0);
            setIsLoading(false);
            return;
        }
        
        // Check if user is authenticated and has customer role using DOM attributes
        const isAuthenticated = document.querySelector('[data-auth="true"]') !== null;
        const userRoles = document.querySelector('[data-user-roles]')?.getAttribute('data-user-roles') || '';
        const hasCustomerRole = userRoles.includes('customer');
        
        if (isAuthenticated && hasCustomerRole) {
            fetchCartCount();
        } else {
            // User not authenticated or doesn't have customer role, set cart count to 0 and don't make API calls
            setCartCount(0);
            setIsLoading(false);
        }
    }, []);

    // Listen for user changes via custom events or DOM mutations
    useEffect(() => {
        const handleUserChange = () => {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                const isAdminContext = window.location.pathname.startsWith('/admin') || 
                                       document.querySelector('[data-admin-context="true"]') ||
                                       window.route?.current?.()?.startsWith('admin.');
                
                if (isAdminContext) {
                    setCartCount(0);
                    setIsLoading(false);
                    return;
                }
                
                const isAuthenticated = document.querySelector('[data-auth="true"]') !== null;
                const userRoles = document.querySelector('[data-user-roles]')?.getAttribute('data-user-roles') || '';
                const hasCustomerRole = userRoles.includes('customer');
                
                if (isAuthenticated && hasCustomerRole) {
                    fetchCartCount();
                } else {
                    setCartCount(0);
                    setIsLoading(false);
                }
            }, 100);
        };

        // Listen for custom events that might indicate user changes
        window.addEventListener('user-logged-in', handleUserChange);
        window.addEventListener('user-logged-out', handleUserChange);
        
        // Also listen for DOM mutations on the body element (when auth attributes change)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-auth' || mutation.attributeName === 'data-user-roles')) {
                    handleUserChange();
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-auth', 'data-user-roles']
        });

        return () => {
            window.removeEventListener('user-logged-in', handleUserChange);
            window.removeEventListener('user-logged-out', handleUserChange);
            observer.disconnect();
        };
    }, []);

    const fetchCartCount = useCallback(async () => {
        try {
            // Check if we're in admin context first
            const isAdminContext = window.location.pathname.startsWith('/admin') || 
                                   document.querySelector('[data-admin-context="true"]') ||
                                   window.route?.current?.()?.startsWith('admin.');
            
            if (isAdminContext) {
                console.log('Admin context detected, skipping cart API call');
                setCartCount(0);
                setIsLoading(false);
                return;
            }
            
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

            const response = await axios.get(route('cart.count'));
            setCartCount(response.data.count || 0);
        } catch (error) {
            // Handle axios errors gracefully
            if (error.response?.status === 419) {
                console.log('CSRF token expired, cart count set to 0');
                setCartCount(0);
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('User not authenticated or lacks permission, cart count set to 0');
                setCartCount(0);
            } else {
                console.error('Error fetching cart count:', error);
                setCartCount(0);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

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
        // Check if we're in admin context first
        const isAdminContext = window.location.pathname.startsWith('/admin') || 
                               document.querySelector('[data-admin-context="true"]') ||
                               window.route?.current?.()?.startsWith('admin.');
        
        if (isAdminContext) {
            console.log('Admin context detected, skipping cart refresh');
            return;
        }
        
        // Only refresh if user is authenticated and has customer role using DOM attributes
        const isAuthenticated = document.querySelector('[data-auth="true"]') !== null;
        const userRoles = document.querySelector('[data-user-roles]')?.getAttribute('data-user-roles') || '';
        const hasCustomerRole = userRoles.includes('customer');
        
        if (isAuthenticated && hasCustomerRole) {
            fetchCartCount();
        }
    };

    // Function to update cart count based on user status (can be called from components with Inertia access)
    const updateCartForUser = useCallback((user) => {
        const isAuthenticated = user !== null;
        const hasCustomerRole = user?.roles?.includes('customer');
        
        // console.log('updateCartForUser called:', { isAuthenticated, hasCustomerRole, user });
        
        if (isAuthenticated && hasCustomerRole) {
            // Force refresh cart count for logged-in customers
            setIsLoading(true);
            fetchCartCount();
        } else {
            setCartCount(0);
            setIsLoading(false);
        }
    }, [fetchCartCount]);

    // Function to force refresh cart count (useful for after login)
    const forceRefreshCart = useCallback(() => {
        // console.log('forceRefreshCart called');
        const isAdminContext = window.location.pathname.startsWith('/admin') || 
                               document.querySelector('[data-admin-context="true"]') ||
                               window.route?.current?.()?.startsWith('admin.');
        
        if (isAdminContext) {
            setCartCount(0);
            setIsLoading(false);
            return;
        }
        
        const isAuthenticated = document.querySelector('[data-auth="true"]') !== null;
        const userRoles = document.querySelector('[data-user-roles]')?.getAttribute('data-user-roles') || '';
        const hasCustomerRole = userRoles.includes('customer');
        
        if (isAuthenticated && hasCustomerRole) {
            setIsLoading(true);
            fetchCartCount();
        } else {
            setCartCount(0);
            setIsLoading(false);
        }
    }, [fetchCartCount]);

    const value = {
        cartCount,
        isLoading,
        updateCartCount,
        incrementCartCount,
        decrementCartCount,
        refreshCartCount,
        fetchCartCount,
        updateCartForUser,
        forceRefreshCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
