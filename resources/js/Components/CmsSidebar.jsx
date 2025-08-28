import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Settings, Home, Image, User, Phone, Globe, ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CmsSidebar({ currentPage, currentSection = null, onSectionChange = null }) {
    const [expandedPages, setExpandedPages] = useState(() => ({
        [currentPage]: true // Auto-expand current page on initial load
    }));

    // Ensure current page is expanded on initial load or page change
    useEffect(() => {
        setExpandedPages(prev => {
            // Only expand if not already set to avoid interfering with user toggles
            if (prev[currentPage] === undefined) {
                return {
                    ...prev,
                    [currentPage]: true
                };
            }
            return prev;
        });
    }, [currentPage]);

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
                { key: 'controls', title: 'Gallery Controls', count: 4 },
                { key: 'empty_state', title: 'Empty State', count: 4 },
                { key: 'cta', title: 'Call to Action', count: 3 },
                { key: 'features', title: 'Feature Cards', count: 6 },
                { key: 'footer_info', title: 'Footer Info', count: 3 }
            ]
        },
        {
            name: 'about',
            title: 'About Page',
            icon: User,
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
            route: 'admin.cms.page',
            param: 'contact',
            sections: [
                { key: 'hero', title: 'Hero Section', count: 2 },
                { key: 'form', title: 'Contact Form', count: 4 },
                { key: 'info', title: 'Contact Info', count: 13 },
                { key: 'faq', title: 'FAQ Section', count: 10 },
                { key: 'cta', title: 'Call to Action', count: 4 }
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
        },
        {
            name: 'images',
            title: 'Image Management',
            icon: ImageIcon,
            route: 'admin.cms.images',
            param: null,
            sections: [
                { key: 'upload', title: 'Upload & Library', count: 1 },
                { key: 'settings', title: 'Image Settings', count: 4 }
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
                                <div className={`${isCurrentPage ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : ''}`}>
                                    <button
                                        onClick={() => togglePage(page.name)}
                                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-opacity-80 ${
                                            isCurrentPage
                                                ? 'text-purple-700 hover:bg-purple-100'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${isCurrentPage ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span>{page.title}</span>
                                        </div>
                                        <div className={`p-1 rounded-md transition-colors ${
                                            isCurrentPage 
                                                ? 'text-purple-700' 
                                                : 'text-gray-400'
                                        }`}>
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Regular pages and global settings with expandable sections */}
                                {isExpanded && (
                                    <div className="bg-gray-50 border-t border-gray-100">
                                        {page.sections.map((section) => {
                                            // Fix the currentSection comparison by including page context
                                            const isCurrentSection = currentPage === page.name && currentSection === section.key;
                                            
                                            // Handle different route types
                                            let sectionHref;
                                            if (page.name === 'global') {
                                                sectionHref = route('admin.cms.global.section', section.key);
                                            } else if (page.name === 'images') {
                                                // Images page doesn't support section-wise URLs yet
                                                sectionHref = route(page.route);
                                            } else if (page.param) {
                                                sectionHref = route('admin.cms.page.section', { page: page.param, section: section.key });
                                            } else {
                                                sectionHref = route('admin.cms.page.section', { page: page.name, section: section.key });
                                            }
                                            
                                            const handleSectionClick = (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                
                                                if (page.name === 'images') {
                                                    // For images, just navigate normally since it doesn't support sections yet
                                                    window.location.href = sectionHref;
                                                } else if (isCurrentPage && onSectionChange) {
                                                    // If we're already on the same page, just change the section immediately
                                                    onSectionChange(section.key);
                                                    // Also update the URL
                                                    window.history.pushState({}, '', sectionHref);
                                                } else {
                                                    // If we're on a different page, navigate to the page with section
                                                    window.location.href = sectionHref;
                                                }
                                            };
                                            
                                            return (
                                                <button
                                                    key={section.key}
                                                    onClick={handleSectionClick}
                                                    className={`block w-full text-left px-8 py-3 text-sm transition-all duration-300 border-l-4 hover:translate-x-1 ${
                                                        isCurrentSection
                                                            ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-500 font-medium shadow-sm'
                                                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 border-transparent hover:border-purple-200'
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