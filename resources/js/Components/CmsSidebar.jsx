import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Settings, Home, Image, User, Phone, Globe } from 'lucide-react';
import { useState } from 'react';

export default function CmsSidebar({ currentPage, currentSection = null, onSectionChange = null }) {
    const [expandedPages, setExpandedPages] = useState({
        [currentPage]: true // Auto-expand current page
    });

    const togglePage = (pageName) => {
        setExpandedPages(prev => ({
            ...prev,
            [pageName]: !prev[pageName]
        }));
    };

    const cmsPages = [
        {
            name: 'home',
            title: 'Home Page',
            icon: Home,
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
            route: 'admin.cms.page',
            param: 'gallery',
            sections: [
                { key: 'header', title: 'Page Header', count: 2 },
                { key: 'controls', title: 'Gallery Controls', count: 4 }
            ]
        },
        {
            name: 'about',
            title: 'About Page',
            icon: User,
            route: 'admin.cms.page',
            param: 'about',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 5 },
                { key: 'story', title: 'Artist Story', count: 4 },
                { key: 'philosophy', title: 'Philosophy', count: 3 },
                { key: 'contact_cta', title: 'Contact CTA', count: 4 }
            ]
        },
        {
            name: 'contact',
            title: 'Contact Page',
            icon: Phone,
            route: 'admin.cms.page',
            param: 'contact',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 5 },
                { key: 'form', title: 'Contact Form', count: 3 },
                { key: 'info', title: 'Contact Info', count: 4 },
                { key: 'faq', title: 'FAQ Section', count: 4 }
            ]
        },
        {
            name: 'global',
            title: 'Global Settings',
            icon: Globe,
            route: 'admin.cms.global',
            param: null,
            sections: [
                { key: 'site', title: 'Website Info', count: 3 },
                { key: 'contact', title: 'Contact Details', count: 4 },
                { key: 'social', title: 'Social Media', count: 2 }
            ]
        }
    ];

    return (
        <Card className="border-0 shadow-xl sticky top-4 h-fit">
            <CardContent className="p-0">
                <div className="space-y-1">
                    {cmsPages.map((page) => {
                        const Icon = page.icon;
                        const isCurrentPage = currentPage === page.name;
                        const isExpanded = expandedPages[page.name];
                        const href = page.param 
                            ? route(page.route, page.param) 
                            : route(page.route);
                        
                        return (
                            <div key={page.name} className="border-b border-gray-100 last:border-b-0">
                                {/* Page Header */}
                                <div className={`flex items-center ${
                                    isCurrentPage
                                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50'
                                        : ''
                                }`}>
                                    <div className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 flex-1 ${
                                        isCurrentPage
                                            ? 'text-purple-700'
                                            : 'text-gray-600'
                                    }`}>
                                        <Icon className={`w-5 h-5 ${isCurrentPage ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <span className="flex-1">{page.title}</span>
                                    </div>
                                    <button
                                        onClick={() => togglePage(page.name)}
                                        className={`p-2 mr-2 rounded-md transition-colors ${
                                            isCurrentPage 
                                                ? 'text-purple-700 hover:text-purple-800 hover:bg-purple-100' 
                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Sections (Collapsible) */}
                                {isExpanded && (
                                    <div className="bg-gray-50 border-t border-gray-100">
                                        {page.sections.map((section) => {
                                            const isCurrentSection = currentSection === section.key;
                                            const sectionHref = page.param 
                                                ? route(page.route, page.param) 
                                                : route(page.route);
                                            
                                            const handleSectionClick = (e) => {
                                                e.preventDefault();
                                                if (isCurrentPage) {
                                                    // If we're already on the same page, just change the section
                                                    onSectionChange && onSectionChange(section.key);
                                                } else {
                                                    // If we're on a different page, navigate to the page
                                                    window.location.href = sectionHref;
                                                }
                                            };
                                            
                                            return (
                                                <button
                                                    key={section.key}
                                                    onClick={handleSectionClick}
                                                    className={`block w-full text-left px-8 py-2 text-sm transition-all duration-200 border-l-4 ${
                                                        isCurrentSection
                                                            ? 'bg-purple-100 text-purple-700 border-purple-500 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{section.title}</span>
                                                        <Badge 
                                                            variant={isCurrentSection ? "default" : "secondary"} 
                                                            className={`text-xs ${
                                                                isCurrentSection ? 'bg-purple-600' : ''
                                                            }`}
                                                        >
                                                            {section.count}
                                                        </Badge>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}