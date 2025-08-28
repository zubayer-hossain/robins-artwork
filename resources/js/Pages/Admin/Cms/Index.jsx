import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ChevronRight, Home, Image, User, Phone, Globe, ImageIcon } from 'lucide-react';

export default function CmsIndex({ auth, pages }) {
    const cmsPages = [
        {
            name: 'home',
            title: 'Home Page',
            description: 'Manage homepage hero, featured artworks, about section, and call-to-action content',
            icon: <Home className="w-6 h-6 text-white" />,
            color: 'from-blue-500 to-indigo-600',
            url: route('admin.cms.page.section', { page: 'home', section: 'hero' }),
            settings_count: pages.find(p => p.name === 'home')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'home')?.sections_count || 0
        },
        {
            name: 'gallery',
            title: 'Gallery Page',
            description: 'Configure gallery layout, filters, controls, and artwork display settings',
            icon: <Image className="w-6 h-6 text-white" />,
            color: 'from-purple-500 to-pink-600',
            url: route('admin.cms.page.section', { page: 'gallery', section: 'header' }),
            settings_count: pages.find(p => p.name === 'gallery')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'gallery')?.sections_count || 0
        },
        {
            name: 'about',
            title: 'About Page',
            description: 'Manage artist story, philosophy, process, and personal information content',
            icon: <User className="w-6 h-6 text-white" />,
            color: 'from-green-500 to-emerald-600',
            url: route('admin.cms.page.section', { page: 'about', section: 'hero' }),
            settings_count: pages.find(p => p.name === 'about')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'about')?.sections_count || 0
        },
        {
            name: 'contact',
            title: 'Contact Page',
            description: 'Configure contact form, information, FAQ, and call-to-action sections',
            icon: <Phone className="w-6 h-6 text-white" />,
            color: 'from-orange-500 to-red-600',
            url: route('admin.cms.page.section', { page: 'contact', section: 'hero' }),
            settings_count: pages.find(p => p.name === 'contact')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'contact')?.sections_count || 0
        }
    ];

    return (
        <AdminLayout user={auth.user} header="Content Management" headerDescription="Manage website content, settings, and functionality">
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-purple-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-semibold">CMS</span>
                    </nav>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Pages</p>
                                        <p className="text-3xl font-bold text-blue-600">{cmsPages.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Content Sections</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {cmsPages.reduce((total, page) => total + page.sections_count, 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Settings</p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {cmsPages.reduce((total, page) => total + page.settings_count, 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">⚙️</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Page Management Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {cmsPages.map((page) => (
                            <Card key={page.name} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r to-gray-50 from-white border-b border-gray-100 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 bg-gradient-to-r ${page.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                {page.icon}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    {page.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {page.settings_count} settings
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {page.sections_count} sections
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                        {page.description}
                                    </p>
                                    <Link href={page.url}>
                                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-200 transform hover:scale-105">
                                            Manage Content
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Global Settings and Image Management Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Image Management Card */}
                        <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-white to-blue-50 border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Image Management
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    Media library
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    Upload & organize
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                    Upload, organize, and manage all website images in one central location
                                </p>
                                <Link href={route('admin.cms.images')}>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 transform hover:scale-105">
                                        Manage Images
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Global Settings Card */}
                        <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r to-gray-50 from-white border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                                            <Globe className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Global Settings
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    Site-wide
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    Global config
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                    Site-wide settings, contact information, and global configurations
                                </p>
                                <Link href={route('admin.cms.global.section', 'site')}>
                                    <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-200 transform hover:scale-105">
                                        Manage Global Settings
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}