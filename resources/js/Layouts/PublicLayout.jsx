import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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

                            {/* Navigation Links */}
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    Home
                                </NavLink>
                                <NavLink href={route('gallery')} active={route().current('gallery')}>
                                    Gallery
                                </NavLink>
                                <NavLink href={route('about')} active={route().current('about')}>
                                    About
                                </NavLink>
                                <NavLink href={route('contact')} active={route().current('contact')}>
                                    Contact
                                </NavLink>
                            </div>
                        </div>

                        {/* Right side - Auth/User Menu */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <>
                                    {/* User is logged in */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-center space-x-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                <span className="hidden sm:inline">{auth.user.name}</span>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('dashboard')}>Dashboard</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('orders')}>My Orders</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('profile.edit')}>Profile</Link>
                                            </DropdownMenuItem>
                                            {auth.user.roles && auth.user.roles.some(role => role.name === 'admin') && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('admin.dashboard')}>Admin Panel</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    {/* User is not logged in */}
                                    <Link href={route('login')}>
                                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm" className="hidden sm:inline-flex">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showingNavigationDropdown ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {showingNavigationDropdown && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                            <MobileNavLink href={route('home')} active={route().current('home')}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink href={route('gallery')} active={route().current('gallery')}>
                                Gallery
                            </MobileNavLink>
                            <MobileNavLink href={route('about')} active={route().current('about')}>
                                About
                            </MobileNavLink>
                            <MobileNavLink href={route('contact')} active={route().current('contact')}>
                                Contact
                            </MobileNavLink>
                            
                            {/* Mobile auth links */}
                            {!auth.user ? (
                                <div className="pt-4 pb-3 border-t border-gray-200">
                                    <div className="flex flex-col space-y-2">
                                        <Link href={route('login')}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button className="w-full justify-start">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 pb-3 border-t border-gray-200">
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        Signed in as <span className="font-medium text-gray-900">{auth.user.name}</span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Link href={route('dashboard')}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href={route('orders')}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                My Orders
                                            </Button>
                                        </Link>
                                        <Link href={route('profile.edit')}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                Profile
                                            </Button>
                                        </Link>
                                        {auth.user.roles && auth.user.roles.some(role => role.name === 'admin') && (
                                            <Link href={route('admin.dashboard')}>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    Admin Panel
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={route('logout')} method="post" as="button">
                                            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                                Log Out
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

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
                            © 2024 Robin's Artwork. All rights reserved. • Created with ❤️ by <a href="https://zubayerhs.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Zubayer Hossain</a>
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

function MobileNavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
                active
                    ? 'bg-purple-50 border-l-4 border-purple-500 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {children}
        </Link>
    );
}
