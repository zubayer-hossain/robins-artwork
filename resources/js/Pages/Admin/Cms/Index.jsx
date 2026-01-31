import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Settings, ChevronRight, Home, Image, User, Phone, Globe, 
    ImageIcon, FileText, Sparkles, LayoutGrid, ExternalLink,
    Eye, Clock, Palette, TrendingUp, Zap
} from 'lucide-react';

export default function CmsIndex({ auth, pages }) {
    // Helper function to generate section URLs
    const getSectionUrl = (pageName, sectionKey) => {
        try {
            return route('admin.cms.page', { page: pageName }) + `?section=${sectionKey}`;
        } catch (error) {
            console.warn('Route helper failed, using manual URL generation:', error);
            return `/admin/cms/${pageName}?section=${sectionKey}`;
        }
    };

    const cmsPages = [
        {
            name: 'home',
            title: 'Home Page',
            description: 'Hero section, featured artworks, and call-to-action',
            icon: Home,
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            borderColor: 'border-blue-200 hover:border-blue-400',
            previewRoute: 'home',
            lastEdited: 'Recently',
            sections: ['Hero', 'Stats', 'Featured', 'About', 'CTA'],
            url: getSectionUrl('home', 'hero'),
            settings_count: pages.find(p => p.name === 'home')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'home')?.sections_count || 0
        },
        {
            name: 'gallery',
            title: 'Gallery Page',
            description: 'Artwork display, filters, and gallery controls',
            icon: Image,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-50 to-pink-50',
            borderColor: 'border-purple-200 hover:border-purple-400',
            previewRoute: 'gallery',
            lastEdited: 'Recently',
            sections: ['Header', 'Controls', 'Empty State', 'CTA', 'Features'],
            url: getSectionUrl('gallery', 'header'),
            settings_count: pages.find(p => p.name === 'gallery')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'gallery')?.sections_count || 0
        },
        {
            name: 'about',
            title: 'About Page',
            description: 'Artist story, philosophy, and creative process',
            icon: User,
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-50 to-teal-50',
            borderColor: 'border-emerald-200 hover:border-emerald-400',
            previewRoute: 'about',
            lastEdited: 'Recently',
            sections: ['Hero', 'Story', 'Philosophy', 'Process', 'CTA'],
            url: getSectionUrl('about', 'hero'),
            settings_count: pages.find(p => p.name === 'about')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'about')?.sections_count || 0
        },
        {
            name: 'contact',
            title: 'Contact Page',
            description: 'Contact form, info, and FAQ sections',
            icon: Phone,
            gradient: 'from-orange-500 to-amber-600',
            bgGradient: 'from-orange-50 to-amber-50',
            borderColor: 'border-orange-200 hover:border-orange-400',
            previewRoute: 'contact',
            lastEdited: 'Recently',
            sections: ['Hero', 'Form', 'Info', 'FAQ', 'CTA'],
            url: getSectionUrl('contact', 'hero'),
            settings_count: pages.find(p => p.name === 'contact')?.settings_count || 0,
            sections_count: pages.find(p => p.name === 'contact')?.sections_count || 0
        }
    ];

    const totalSettings = cmsPages.reduce((total, page) => total + page.settings_count, 0);
    const totalSections = cmsPages.reduce((total, page) => total + page.sections_count, 0);

    return (
        <AdminLayout 
            user={auth.user} 
            header="Content Management" 
            headerIcon={<LayoutGrid className="w-8 h-8 text-white" />}
            headerDescription="Customize every aspect of your website content"
        >
            <Head title="CMS - Content Management" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-blue-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-semibold">CMS</span>
                    </nav>

                    {/* Hero Banner with Quick Actions */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-10 shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="text-white text-center lg:text-left">
                                <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-yellow-300" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Welcome to CMS</h2>
                                </div>
                                <p className="text-white/80 text-lg max-w-xl">
                                    Manage your website content with ease. Edit text, images, and settings in real-time. 
                                    Changes are reflected instantly across your site.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href={route('home')} target="_blank">
                                    <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 w-full sm:w-auto">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Website
                                    </Button>
                                </Link>
                                <Link href={route('admin.cms.global') + '?section=site'}>
                                    <Button className="bg-white text-purple-700 hover:bg-gray-100 w-full sm:w-auto shadow-lg">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Global Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{cmsPages.length}</p>
                                    <p className="text-sm text-gray-500">Pages</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Palette className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{totalSections}</p>
                                    <p className="text-sm text-gray-500">Sections</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{totalSettings}</p>
                                    <p className="text-sm text-gray-500">Settings</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">∞</p>
                                    <p className="text-sm text-gray-500">Images</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Management Grid - Enhanced Cards */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-purple-500" />
                                Page Management
                            </h2>
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-white">
                                {cmsPages.length} Pages Available
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cmsPages.map((page) => (
                                <Card 
                                    key={page.name} 
                                    className={`group relative overflow-hidden border-2 ${page.borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white`}
                                >
                                    {/* Gradient Background Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${page.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                    
                                    <CardContent className="relative p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${page.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                                    <page.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-800">
                                                        {page.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>Edited {page.lastEdited}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Preview Button */}
                                            <Link href={route(page.previewRoute)} target="_blank">
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/50">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-4 group-hover:text-gray-700">
                                            {page.description}
                                        </p>

                                        {/* Section Pills */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {page.sections.map((section, idx) => (
                                                <Badge 
                                                    key={idx} 
                                                    variant="secondary" 
                                                    className="bg-white/80 text-gray-700 text-xs border border-gray-200"
                                                >
                                                    {section}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-4 mb-5 text-sm">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Palette className="w-4 h-4" />
                                                <span>{page.sections_count} sections</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Settings className="w-4 h-4" />
                                                <span>{page.settings_count} settings</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link href={page.url}>
                                            <Button className={`w-full bg-gradient-to-r ${page.gradient} text-white hover:opacity-90 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                                                Edit Page Content
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Tools Section - Redesigned */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-blue-500" />
                                Additional Tools
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Global Settings */}
                            <Link href={route('admin.cms.global') + '?section=site'}>
                                <Card className="group h-full border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-slate-100 hover:-translate-y-1">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-slate-700 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            <Globe className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Global Settings</h3>
                                        <p className="text-sm text-gray-600 mb-4">Site info, contact details & social links</p>
                                        <Badge variant="outline" className="bg-white">4 Sections</Badge>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Image Management */}
                            <Link href={route('admin.cms.images')}>
                                <Card className="group h-full border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 hover:-translate-y-1">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            <ImageIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Image Library</h3>
                                        <p className="text-sm text-gray-600 mb-4">Upload & manage all website images</p>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Media Library</Badge>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Quick Stats Card */}
                            <Card className="h-full border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-100">
                                <CardContent className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Content Stats</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/70 rounded-xl p-3 text-center border border-purple-100">
                                            <div className="text-2xl font-bold text-purple-600">{cmsPages.length}</div>
                                            <div className="text-xs text-gray-600">Pages</div>
                                        </div>
                                        <div className="bg-white/70 rounded-xl p-3 text-center border border-pink-100">
                                            <div className="text-2xl font-bold text-pink-600">{totalSections}</div>
                                            <div className="text-xs text-gray-600">Sections</div>
                                        </div>
                                        <div className="bg-white/70 rounded-xl p-3 text-center border border-indigo-100">
                                            <div className="text-2xl font-bold text-indigo-600">{totalSettings}</div>
                                            <div className="text-xs text-gray-600">Settings</div>
                                        </div>
                                        <div className="bg-white/70 rounded-xl p-3 text-center border border-violet-100">
                                            <div className="text-2xl font-bold text-violet-600">∞</div>
                                            <div className="text-xs text-gray-600">Images</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd>
                            {' + '}
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">S</kbd>
                            {' to save changes quickly on any page'}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
