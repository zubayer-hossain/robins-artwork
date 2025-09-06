import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, Menu, X, Home, LayoutDashboard, Palette, ShoppingBag, Layers, Settings as SettingsIcon, User, LogOut } from 'lucide-react';

export default function AdminLayout({ user, header, headerIcon, headerDescription, headerActions, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    // Custom logout function using axios
    const handleLogout = async (e) => {
        e.preventDefault();
        
        // Disable the button to prevent double clicks
        const button = e.target;
        button.disabled = true;
        
        try {
            await axios.post(route('admin.logout'));
            // Redirect to admin login page after successful logout
            router.visit(route('admin.login'));
        } catch (error) {
            console.error('Logout error:', error);
            // For any error, redirect to admin login page
            router.visit(route('admin.login'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col" data-admin-context="true">
            {/* Admin Header */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={route('admin.dashboard')} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">A</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900">Admin</span>
                                </Link>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
                                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('admin.artworks.index')} active={route().current('admin.artworks.*')}>
                                    Artworks
                                </NavLink>
                                <NavLink href={route('admin.orders.index')} active={route().current('admin.orders.*')}>
                                    Orders
                                </NavLink>
                                <NavLink href={route('admin.editions.index')} active={route().current('admin.editions.*')}>
                                    Editions
                                </NavLink>
                                <NavLink href={route('admin.cms.index')} active={route().current('admin.cms.*')}>
                                    CMS
                                </NavLink>
                            </div>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Back to Store */}
                            <Link href={route('home')}>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Back to Store
                                </Button>
                            </Link>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <User className="w-5 h-5" />
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.profile.edit')} className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left py-1.5 text-sm flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                                className="flex items-center space-x-2"
                            >
                                {showingMobileMenu ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {showingMobileMenu && (
                        <div className="md:hidden border-t border-gray-200 bg-white">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {/* Mobile Navigation Links */}
                                <MobileNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon={<LayoutDashboard className="w-4 h-4" />}>
                                    Dashboard
                                </MobileNavLink>
                                <MobileNavLink href={route('admin.artworks.index')} active={route().current('admin.artworks.*')} icon={<Palette className="w-4 h-4" />}>
                                    Artworks
                                </MobileNavLink>
                                <MobileNavLink href={route('admin.orders.index')} active={route().current('admin.orders.*')} icon={<ShoppingBag className="w-4 h-4" />}>
                                    Orders
                                </MobileNavLink>
                                <MobileNavLink href={route('admin.editions.index')} active={route().current('admin.editions.*')} icon={<Layers className="w-4 h-4" />}>
                                    Editions
                                </MobileNavLink>
                                <MobileNavLink href={route('admin.cms.index')} active={route().current('admin.cms.*')} icon={<SettingsIcon className="w-4 h-4" />}>
                                    CMS
                                </MobileNavLink>
                                
                                {/* Mobile Back to Store */}
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <MobileNavLink href={route('home')} icon={<Home className="w-4 h-4" />}>
                                        Back to Store
                                    </MobileNavLink>
                                </div>
                                
                                {/* Mobile User Actions */}
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <MobileNavLink href={route('admin.profile.edit')} icon={<User className="w-4 h-4" />}>
                                        Profile
                                    </MobileNavLink>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 py-8">
                {header && (
                    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                    {headerIcon || <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2 truncate">{header}</h1>
                                    {headerDescription && (
                                        <p className="text-sm lg:text-lg text-gray-600 truncate">{headerDescription}</p>
                                    )}
                                </div>
                            </div>
                            {headerActions && (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                                    {headerActions}
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {children}
            </main>

            {/* Admin Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="border-gray-800 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 Robin's Artwork Admin Panel. All rights reserved. • Created with ❤️ by <a href="https://www.linkedin.com/in/zubayerhs/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Zubayer Hossain</a>
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
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                active
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                active
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
            {icon && <span className="mr-3">{icon}</span>}
            {children}
        </Link>
    );
}
