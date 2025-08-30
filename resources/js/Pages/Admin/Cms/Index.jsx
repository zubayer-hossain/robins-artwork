import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ChevronRight, Home, Image, User, Phone, Globe, ImageIcon, FileText, Palette } from 'lucide-react';

export default function CmsIndex({ auth, pages }) {
    // Helper function to generate section URLs
    const getSectionUrl = (pageName, sectionKey) => {
        try {
            return route('admin.cms.page', { page: pageName }) + `?section=${sectionKey}`;
        } catch (error) {
            // Fallback: generate URL manually if route helper fails
            console.warn('Route helper failed, using manual URL generation:', error);
            return `/admin/cms/${pageName}?section=${sectionKey}`;
        }
    };

    const cmsPages = [
        {
            name: 'home',
            title: 'Home Page',
            description: 'Manage homepage hero, featured artworks, and call-to-action content',
            icon: <Home className="w-5 h-5" />,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            url: getSectionUrl('home', 'hero'),
            settings_count: pages.find(p => p.name === 'home')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'home')?.sections_count || 0
        },
        {
            name: 'gallery',
            title: 'Gallery Page',
            description: 'Configure gallery layout, filters, and artwork display settings',
            icon: <Image className="w-5 h-5" />,
            color: 'bg-purple-50 border-purple-200 text-purple-700',
            url: getSectionUrl('gallery', 'header'),
            settings_count: pages.find(p => p.name === 'gallery')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'gallery')?.sections_count || 0
        },
        {
            name: 'about',
            title: 'About Page',
            description: 'Manage artist story, philosophy, and personal information content',
            icon: <User className="w-5 h-5" />,
            color: 'bg-green-50 border-green-200 text-green-700',
            url: getSectionUrl('about', 'hero'),
            settings_count: pages.find(p => p.name === 'about')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'about')?.sections_count || 0
        },
        {
            name: 'contact',
            title: 'Contact Page',
            description: 'Configure contact form, information, and call-to-action sections',
            icon: <Phone className="w-5 h-5" />,
            color: 'bg-orange-50 border-orange-200 text-orange-700',
            url: getSectionUrl('contact', 'hero'),
            settings_count: pages.find(p => p.name === 'contact')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'contact')?.sections_count || 0
        }
    ];

    return (
        <AdminLayout user={auth.user} header="Content Management" headerDescription="Manage website content and settings">
            <Head title="CMS - Content Management" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-blue-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-semibold">CMS</span>
                    </nav>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{cmsPages.length}</p>
                                        <p className="text-sm text-gray-600">Pages</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <Palette className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cmsPages.reduce((total, page) => total + page.sections_count, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Sections</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                        <Settings className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cmsPages.reduce((total, page) => total + page.settings_count, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Settings</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                        <ImageIcon className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">∞</p>
                                        <p className="text-sm text-gray-600">Images</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Page Management Grid */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Page Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cmsPages.map((page) => (
                                <Link key={page.name} href={page.url} className="block">
                                    <Card className="group bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200 hover:border-2">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${page.color}`}>
                                                        {page.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                            {page.title}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                                                {page.sections_count} sections
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {page.settings_count} settings
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                                {page.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Additional Tools */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Management */}
                            <Link href={route('admin.cms.images')} className="block">
                                <Card className="group bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200 hover:border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-blue-700" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                        Image Management
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                            Media library
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                            Upload, organize, and manage all website images in one central location
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Global Settings */}
                            <Link href={route('admin.cms.global') + '?section=site'} className="block">
                                <Card className="group bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200 hover:border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                                    <Globe className="w-5 h-5 text-gray-700" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                        Global Settings
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                                            Site-wide
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                            Site-wide settings, contact information, and global configurations
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}