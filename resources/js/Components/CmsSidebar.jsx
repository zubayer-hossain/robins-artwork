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
            const newState = { ...prev };
            
            // Auto-expand current page
            if (currentPage) {
                newState[currentPage] = true;
            }
            
            // Auto-expand Global Settings if any of its sections are selected
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

    // Handle page navigation and ensure proper expansion
    const handlePageNavigation = (pageName) => {
        // If navigating to a different page, expand it and collapse others
        if (currentPage !== pageName) {
            setExpandedPages(prev => {
                const newState = { ...prev };
                // Collapse all other pages
                Object.keys(newState).forEach(key => {
                    if (key !== pageName && key !== 'global_tools') {
                        newState[key] = false;
                    }
                });
                // Expand the target page
                newState[pageName] = true;
                return newState;
            });
        }
    };

    // Helper function to generate section URLs
    const getSectionUrl = (pageName, sectionKey) => {
        if (pageName === 'global') {
            // Use query parameter approach for Global Settings to be consistent with other CMS pages
            try {
                return route('admin.cms.global') + `?section=${sectionKey}`;
            } catch (error) {
                // Fallback: generate URL manually if route helper fails
                console.warn('Route helper failed, using manual URL generation:', error);
                return `/admin/cms/global?section=${sectionKey}`;
            }
        } else if (pageName === 'images') {
            return route('admin.cms.images');
        } else {
            // For regular pages - use query parameter approach
            try {
                return route('admin.cms.page', { page: pageName }) + `?section=${sectionKey}`;
            } catch (error) {
                // Fallback: generate URL manually if route helper fails
                console.warn('Route helper failed, using manual URL generation:', error);
                return `/admin/cms/${pageName}?section=${sectionKey}`;
            }
        }
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
                { key: 'site', title: 'Website Info', count: 2 },
                { key: 'contact', title: 'Contact Details', count: 3 },
                { key: 'social', title: 'Social Media', count: 6 },
                { key: 'images', title: 'Image Management', count: 5 }
            ]
        },
        {
            name: 'images',
            title: 'Image Management',
            icon: ImageIcon,
            route: 'admin.cms.images',
            param: null,
            sections: []
        }
    ];

    const getPageIcon = (pageName) => {
        const page = cmsPages.find(p => p.name === pageName);
        if (!page) return Settings;
        
        const IconComponent = page.icon;
        return <IconComponent className="w-4 h-4" />;
    };

    const getPageColor = (pageName) => {
        const colors = {
            home: 'bg-blue-50 border-blue-200 text-blue-700',
            gallery: 'bg-purple-50 border-purple-200 text-purple-700',
            about: 'bg-green-50 border-green-200 text-green-700',
            contact: 'bg-orange-50 border-orange-200 text-orange-700',
            global: 'bg-gray-50 border-gray-200 text-gray-700',
            images: 'bg-blue-50 border-blue-200 text-blue-700'
        };
        return colors[pageName] || 'bg-gray-50 border-gray-200 text-gray-700';
    };

    return (
        <div className="space-y-4">
            {/* Page Navigation */}
            <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-semibold text-gray-900">Page Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-1">
                        {cmsPages.filter(page => page.name !== 'global' && page.name !== 'images').map((page) => {
                            const isCurrentPage = currentPage === page.name;
                            const isExpanded = expandedPages[page.name];
                            
                            return (
                                <div key={page.name} className="border-b border-gray-100 last:border-b-0">
                                    <div
                                        className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${isCurrentPage && !isExpanded ? 'bg-blue-50 text-blue-700' : ''}`}
                                        onClick={() => togglePage(page.name)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-6 h-6 flex items-center justify-center rounded-md ${getPageColor(page.name)}`}>
                                                {getPageIcon(page.name)}
                                            </div>
                                            <span className={`text-sm font-medium ${isCurrentPage && !isExpanded ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {page.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {page.sections && page.sections.reduce((total, section) => total + section.count, 0) > 0 && (
                                                <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                                    {page.sections.reduce((total, section) => total + section.count, 0)}
                                                </Badge>
                                            )}
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Page Sections */}
                                    {isExpanded && page.sections.length > 0 && (
                                        <div className="bg-gray-50 border-t border-gray-100">
                                            {page.sections.map((section) => {
                                                const isCurrentSection = currentSection === section.key;
                                                const sectionUrl = getSectionUrl(page.name, section.key);
                                                
                                                return (
                                                    <Link
                                                        key={section.key}
                                                        href={sectionUrl}
                                                        className={`flex items-center p-3 pl-10 text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative ${isCurrentSection ? 'font-semibold text-blue-600 bg-blue-100' : ''}`}

                                                    >
                                                        {/* Blue left border for selected section */}
                                                        {isCurrentSection && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                                                        )}
                                                        
                                                        {section.title}
                                                        {section.count > 0 && (
                                                            <Badge variant="secondary" className="ml-auto bg-gray-200 text-gray-700">
                                                                {section.count}
                                                            </Badge>
                                                        )}
                                                    </Link>
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

            {/* Global Settings and Image Management - Separated at bottom */}
            <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-semibold text-gray-900">Additional Tools</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-1">
                        {/* Global Settings - Expandable with sub-sections */}
                        <div className="border-b border-gray-100 last:border-b-0">
                            <div className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors duration-200 relative ${currentPage === 'global' ? 'bg-blue-50 text-blue-700' : ''}`}>

                                <button
                                    onClick={() => togglePage('global_tools')}
                                    className="flex items-center gap-3 flex-1 text-left"
                                >
                                    <div className="w-8 h-8 rounded-md border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                                        <Globe className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <span className={`text-sm font-medium ${currentPage === 'global' ? 'text-blue-700' : 'text-gray-700'}`}>
                                        Global Settings
                                    </span>
                                    <div className="flex items-center space-x-2 ml-auto">
                                        {/* Total settings count badge */}
                                        <Badge variant="outline" className="text-xs">
                                            {cmsPages.find(p => p.name === 'global')?.sections.reduce((total, section) => total + section.count, 0) || 0}
                                        </Badge>
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => togglePage('global_tools')}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                                >
                                    {expandedPages['global_tools'] ? (
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            </div>

                            {/* Global Settings Sub-sections */}
                            {expandedPages['global_tools'] && (
                                <div className="bg-gray-50 border-t border-gray-100">
                                    <Link
                                        href={route('admin.cms.global') + '?section=site'}
                                        className={`flex items-center justify-between p-3 pl-11 text-sm transition-colors duration-200 relative ${currentSection === 'site' ? 'font-semibold text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {/* Blue left border for selected Website Info section */}
                                        {currentSection === 'site' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                                        )}
                                        
                                        <span className="text-sm capitalize">Website Info</span>
                                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">2</Badge>
                                    </Link>
                                    <Link
                                        href={route('admin.cms.global') + '?section=contact'}
                                        className={`flex items-center justify-between p-3 pl-11 text-sm transition-colors duration-200 relative ${currentSection === 'contact' ? 'font-semibold text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {/* Blue left border for selected Contact Details section */}
                                        {currentSection === 'contact' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                                        )}
                                        
                                        <span className="text-sm capitalize">Contact Details</span>
                                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">3</Badge>
                                    </Link>
                                    <Link
                                        href={route('admin.cms.global') + '?section=social'}
                                        className={`flex items-center justify-between p-3 pl-11 text-sm transition-colors duration-200 relative ${currentSection === 'social' ? 'font-semibold text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {/* Blue left border for selected Social Media section */}
                                        {currentSection === 'social' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                                        )}
                                        
                                        <span className="text-sm capitalize">Social Media</span>
                                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">6</Badge>
                                    </Link>
                                    <Link
                                        href={route('admin.cms.global') + '?section=images'}
                                        className={`flex items-center justify-between p-3 pl-11 text-sm transition-colors duration-200 relative ${currentSection === 'images' ? 'font-semibold text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {/* Blue left border for selected Image Management section */}
                                        {currentSection === 'images' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                                        )}
                                        
                                        <span className="text-sm capitalize">Image Settings</span>
                                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">5</Badge>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Image Management */}
                        <Link 
                            href={route('admin.cms.images')}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-200 relative"
                        >
                            {/* Blue left border for selected Image Management */}
                            {currentPage === 'images' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-sm"></div>
                            )}
                            <div className="w-8 h-8 rounded-md border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-blue-700" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Image Management</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}