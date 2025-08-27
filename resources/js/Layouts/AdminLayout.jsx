import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100" data-admin-context="true">
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
                                    <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
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
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Back to Store */}
                            <Link href={route('home')}>
                                <Button variant="outline" size="sm">
                                    🏠 Back to Store
                                </Button>
                            </Link>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.profile.edit')}>Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button"
                                            className="w-full text-left"
                                        >
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="py-8">
                {header && (
                    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{header}</h2>
                    </header>
                )}

                {children}
            </main>

            {/* Admin Footer */}
            <footer className="bg-gray-900 text-white mt-auto">
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
