import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
    User, 
    Settings, 
    LogOut, 
    Package, 
    LayoutDashboard, 
    Shield,
    Menu,
    X,
    Heart,
    Eye,
    MapPin
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Custom logout function using axios
    const handleLogout = async (e) => {
        e.preventDefault();
        
        // Disable the button to prevent double clicks
        const button = e.target;
        button.disabled = true;
        
        try {
            await axios.post(route('logout'));
            // Stay on current page after successful logout
            router.reload();
        } catch (error) {
            console.error('Logout error:', error);
            // If 419 error, try once more with a fresh page reload
            if (error.response?.status === 419) {
                window.location.reload();
            } else {
                // For other errors, just reload the current page
                router.reload();
            }
        }
    };

    // Laravel 12: Strict role checking - user should ONLY have customer role for this layout
    const isStrictCustomer = user.roles && user.roles.length === 1 && user.roles.includes('customer');
    const hasAdminRole = user.roles && user.roles.includes('admin');
    
    // Laravel 12: Security - If user has admin role, they shouldn't see customer layout
    if (hasAdminRole) {
        // Redirect admin users to admin dashboard
        window.location.href = route('admin.dashboard');
        return null;
    }

    // Laravel 12: Only show this layout to verified customer users
    if (!isStrictCustomer) {
        // Redirect to home if user doesn't have proper customer role
        window.location.href = route('home');
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={route('home')} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">R</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900">Robin's Artwork</span>
                                </Link>
                            </div>

                            {/* Dashboard Navigation Links - Customer Only */}
                            <div className="hidden md:ml-8 md:flex md:space-x-8">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('favorites')} active={route().current('favorites')}>
                                    Favorites
                                </NavLink>
                                <NavLink href={route('recent-views')} active={route().current('recent-views')}>
                                    Recent Views
                                </NavLink>
                                <NavLink href={route('orders')} active={route().current('orders')}>
                                    Orders
                                </NavLink>
                                <NavLink href={route('addresses.index')} active={route().current('addresses.*')}>
                                    Addresses
                                </NavLink>
                                <NavLink href={route('profile.edit')} active={route().current('profile.*')}>
                                    Profile
                                </NavLink>
                                
                                {/* Back to Website */}
                                <div className="ml-8 pl-8 border-gray-200">
                                    <Link href={route('home')}>
                                        <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            Back to Website
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right side - User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* User Dropdown - Hidden on mobile */}
                            <div className="hidden md:block">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                        {/* User Avatar */}
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        {/* Chevron */}
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    {/* User Info Header */}
                                    <div className="px-3 py-2 border-b">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Menu Items */}
                                    <DropdownMenuItem>
                                        <Link href={route('dashboard')} className="flex items-center space-x-2 w-full">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={route('favorites')} className="flex items-center space-x-2 w-full">
                                            <Heart className="w-4 h-4" />
                                            <span>Favorites</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={route('recent-views')} className="flex items-center space-x-2 w-full">
                                            <Eye className="w-4 h-4" />
                                            <span>Recent Views</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={route('orders')} className="flex items-center space-x-2 w-full">
                                            <Package className="w-4 h-4" />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={route('addresses.index')} className="flex items-center space-x-2 w-full">
                                            <MapPin className="w-4 h-4" />
                                            <span>Addresses</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={route('profile.edit')} className="flex items-center space-x-2 w-full">
                                            <User className="w-4 h-4" />
                                            <span>Profile Settings</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <button onClick={handleLogout} className="flex items-center space-x-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 text-sm">
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="p-2"
                                >
                                    {showingNavigationDropdown ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {showingNavigationDropdown && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                            {/* Dashboard Navigation */}
                            <MobileNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </MobileNavLink>
                            <MobileNavLink href={route('favorites')} active={route().current('favorites')}>
                                Favorites
                            </MobileNavLink>
                            <MobileNavLink href={route('recent-views')} active={route().current('recent-views')}>
                                Recent Views
                            </MobileNavLink>
                            <MobileNavLink href={route('orders')} active={route().current('orders')}>
                                Orders
                            </MobileNavLink>
                            <MobileNavLink href={route('addresses.index')} active={route().current('addresses.*')}>
                                Addresses
                            </MobileNavLink>
                            <MobileNavLink href={route('profile.edit')} active={route().current('profile.*')}>
                                Profile
                            </MobileNavLink>
                            
                            {/* Back to Website */}
                            <div className="pt-2 border-t border-gray-100 mt-2">
                                <Link href={route('home')}>
                                    <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Website
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* User Info and Sign Out */}
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="px-4 py-2 text-sm text-gray-500 flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span>Signed in as <span className="font-medium text-gray-900">{user.name}</span></span>
                                </div>
                                <div className="px-2">
                                    <Button 
                                        variant="ghost" 
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Remove the old header section since we don't need it anymore */}
            {/* Page Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-lg font-bold">R</span>
                                </div>
                                <span className="text-xl font-bold">Robin's Artwork</span>
                            </div>
                            <p className="text-gray-300 mb-4 max-w-md">
                                Discover unique artworks inspired by the stunning Scottish Highlands. 
                                Each piece tells a story and brings beauty to your space.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.linkedin.com/in/robin-aitken-56180410/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com/robin.aitken.woodley" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href={route('gallery')} className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
                                <li><Link href={route('about')} className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                                <li><Link href={route('contact')} className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>Cromdale, Scotland</li>
                                <li>United Kingdom</li>
                                <li>info@robinsartwork.com</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 Robin's Artwork. All rights reserved. • Created with ❤️ by <a href="https://www.linkedin.com/in/zubayerhs/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Zubayer Hossain</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                active
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                active
                    ? 'bg-purple-50 border-l-4 border-purple-500 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {children}
        </Link>
    );
}
