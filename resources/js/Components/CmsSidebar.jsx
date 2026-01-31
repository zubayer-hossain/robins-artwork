import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    ChevronDown, ChevronRight, Settings, Home, Image, User, Phone, 
    Globe, ImageIcon, Sparkles, Layers
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CmsSidebar({ currentPage, currentSection = null, onSectionChange = null }) {
    const [expandedPages, setExpandedPages] = useState(() => ({
        [currentPage]: true
    }));

    useEffect(() => {
        setExpandedPages(prev => {
            const newState = { ...prev };
            
            if (currentPage) {
                newState[currentPage] = true;
            }
            
            if (currentSection && ['site', 'contact', 'social', 'images'].includes(currentSection)) {
                newState['global_tools'] = true;
            }
            
            return newState;
        });
    }, [currentPage, currentSection]);

    const togglePage = (pageName) => {
        setExpandedPages(prev => ({
            ...prev,
            [pageName]: !prev[pageName]
        }));
    };

    const getSectionUrl = (pageName, sectionKey) => {
        if (pageName === 'global') {
            try {
                return route('admin.cms.global') + `?section=${sectionKey}`;
            } catch (error) {
                return `/admin/cms/global?section=${sectionKey}`;
            }
        } else if (pageName === 'images') {
            return route('admin.cms.images');
        } else {
            try {
                return route('admin.cms.page', { page: pageName }) + `?section=${sectionKey}`;
            } catch (error) {
                return `/admin/cms/${pageName}?section=${sectionKey}`;
            }
        }
    };

    const cmsPages = [
        {
            name: 'home',
            title: 'Home Page',
            icon: Home,
            gradient: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            route: 'admin.cms.page',
            param: 'home',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 5 },
                { key: 'stats', title: 'Statistics', count: 4 },
                { key: 'featured', title: 'Featured', count: 3 },
                { key: 'about', title: 'About Section', count: 4 },
                { key: 'contact_cta', title: 'Contact CTA', count: 4 }
            ]
        },
        {
            name: 'gallery',
            title: 'Gallery Page',
            icon: Image,
            gradient: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-700',
            route: 'admin.cms.page',
            param: 'gallery',
            sections: [
                { key: 'header', title: 'Page Header', count: 2 },
                { key: 'controls', title: 'Gallery Controls', count: 4 },
                { key: 'empty_state', title: 'Empty State', count: 4 },
                { key: 'cta', title: 'Call to Action', count: 13 }
            ]
        },
        {
            name: 'about',
            title: 'About Page',
            icon: User,
            gradient: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-700',
            route: 'admin.cms.page',
            param: 'about',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 2 },
                { key: 'story', title: 'Artist Story', count: 6 },
                { key: 'philosophy', title: 'Philosophy', count: 8 },
                { key: 'process', title: 'Process & Technique', count: 6 },
                { key: 'cta', title: 'Call to Action', count: 4 }
            ]
        },
        {
            name: 'contact',
            title: 'Contact Page',
            icon: Phone,
            gradient: 'from-orange-500 to-amber-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            route: 'admin.cms.page',
            param: 'contact',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 2 },
                { key: 'form', title: 'Contact Form', count: 4 },
                { key: 'info', title: 'Contact Info', count: 7 },
                { key: 'faq', title: 'FAQ Section', count: 10 },
                { key: 'cta', title: 'Call to Action', count: 4 }
            ]
        }
    ];

    const globalSections = [
        { key: 'site', title: 'Website Info', count: 2, icon: Globe },
        { key: 'contact', title: 'Contact Details', count: 3, icon: Phone },
        { key: 'social', title: 'Social Media', count: 6, icon: Layers }
    ];

    return (
        <div className="space-y-4 min-w-[200px]">
            {/* Page Navigation */}
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        Page Navigation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="space-y-1">
                        {cmsPages.map((page) => {
                            const isCurrentPage = currentPage === page.name;
                            const isExpanded = expandedPages[page.name];
                            const IconComponent = page.icon;
                            const totalSettings = page.sections.reduce((sum, s) => sum + s.count, 0);
                            
                            return (
                                <div key={page.name} className="rounded-xl overflow-hidden">
                                    {/* Page Header */}
                                    <button
                                        type="button"
                                        onClick={() => togglePage(page.name)}
                                        className={`w-full flex items-center justify-between p-3 transition-all duration-300 rounded-xl ${
                                            isCurrentPage 
                                                ? `bg-gradient-to-r ${page.bgColor} ${page.borderColor} border-2` 
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                                                isCurrentPage 
                                                    ? `bg-gradient-to-br ${page.gradient}` 
                                                    : 'bg-gray-100'
                                            }`}>
                                                <IconComponent className={`w-5 h-5 ${isCurrentPage ? 'text-white' : 'text-gray-500'}`} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <span className={`text-sm font-semibold block whitespace-nowrap ${isCurrentPage ? page.textColor : 'text-gray-700'}`}>
                                                    {page.title}
                                                </span>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {page.sections.length} sections
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant="secondary" 
                                                className={`text-xs transition-colors ${
                                                    isCurrentPage 
                                                        ? `${page.bgColor} ${page.textColor}` 
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {totalSettings}
                                            </Badge>
                                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Page Sections - Animated */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="ml-4 mr-2 mb-2 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                                            {page.sections.map((section, index) => {
                                                const isCurrentSection = currentPage === page.name && currentSection === section.key;
                                                const sectionUrl = getSectionUrl(page.name, section.key);
                                                
                                                return (
                                                    <Link
                                                        key={section.key}
                                                        href={sectionUrl}
                                                        className={`flex items-center justify-between py-2.5 px-3 text-sm rounded-lg transition-all duration-200 relative group ${
                                                            isCurrentSection 
                                                                ? `bg-gradient-to-r ${page.bgColor} ${page.textColor} font-semibold shadow-sm` 
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {/* Active indicator dot */}
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                                                isCurrentSection 
                                                                    ? `bg-gradient-to-r ${page.gradient}` 
                                                                    : 'bg-gray-300 group-hover:bg-gray-400'
                                                            }`}></div>
                                                            <span>{section.title}</span>
                                                        </div>
                                                        <Badge 
                                                            variant="secondary" 
                                                            className={`text-xs transition-colors ${
                                                                isCurrentSection 
                                                                    ? 'bg-white/70' 
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            {section.count}
                                                        </Badge>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Additional Tools */}
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        Additional Tools
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="space-y-1">
                        {/* Global Settings - Expandable */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => togglePage('global_tools')}
                                className={`w-full flex items-center justify-between p-3 transition-all duration-300 rounded-xl ${
                                    currentPage === 'global' 
                                        ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300' 
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                                        currentPage === 'global' 
                                            ? 'bg-gradient-to-br from-gray-600 to-slate-700' 
                                            : 'bg-gray-100'
                                    }`}>
                                        <Globe className={`w-5 h-5 ${currentPage === 'global' ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <span className={`text-sm font-semibold block whitespace-nowrap ${currentPage === 'global' ? 'text-gray-900' : 'text-gray-700'}`}>
                                            Global Settings
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {globalSections.length} sections
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                        {globalSections.reduce((sum, s) => sum + s.count, 0)}
                                    </Badge>
                                    <div className={`transition-transform duration-300 ${expandedPages['global_tools'] ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </button>

                            {/* Global Settings Sections */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                expandedPages['global_tools'] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                                <div className="ml-4 mr-2 mb-2 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                                    {globalSections.map((section) => {
                                        const isCurrentSection = currentPage === 'global' && currentSection === section.key;
                                        const SectionIcon = section.icon;
                                        
                                        return (
                                            <Link
                                                key={section.key}
                                                href={route('admin.cms.global') + `?section=${section.key}`}
                                                className={`flex items-center justify-between py-2.5 px-3 text-sm rounded-lg transition-all duration-200 relative group ${
                                                    isCurrentSection 
                                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <SectionIcon className={`w-3.5 h-3.5 ${isCurrentSection ? 'text-blue-600' : 'text-gray-400'}`} />
                                                    <span>{section.title}</span>
                                                </div>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`text-xs transition-colors ${
                                                        isCurrentSection 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {section.count}
                                                </Badge>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Image Management - Direct Link */}
                        <Link 
                            href={route('admin.cms.images')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                                currentPage === 'images' 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200' 
                                    : 'hover:bg-gray-50 border-2 border-transparent'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                                currentPage === 'images' 
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                                    : 'bg-gray-100'
                            }`}>
                                <ImageIcon className={`w-5 h-5 ${currentPage === 'images' ? 'text-white' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className={`text-sm font-semibold block whitespace-nowrap ${currentPage === 'images' ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Image Library
                                </span>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    Upload & manage media
                                </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${currentPage === 'images' ? 'text-blue-500' : 'text-gray-400'}`} />
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100 shadow-lg">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Quick Tip</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Use <kbd className="px-1 py-0.5 bg-white rounded text-xs font-mono shadow-sm">Ctrl+S</kbd> to 
                                quickly save your changes on any page.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
