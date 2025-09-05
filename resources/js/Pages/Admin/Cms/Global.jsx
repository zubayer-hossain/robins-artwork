import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Save, Settings, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';

export default function CmsGlobal({ auth, settings, breadcrumbs, pageTitle, activeSection: serverActiveSection }) {
    // Define section order for global settings to match CmsSidebar
    const getSectionOrder = () => {
        return ['site', 'contact', 'social', 'images'];
    };
    
    const orderedSections = getSectionOrder();
    
    // Get section from URL or server, with fallback to first available section
    const getInitialSection = () => {
        // First try to get from server
        if (serverActiveSection) {
            return serverActiveSection;
        }
        
        // Then try to get from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlSection = urlParams.get('section');
        if (urlSection && orderedSections.includes(urlSection)) {
            return urlSection;
        }
        
        // Finally fall back to first available section
        return orderedSections.find(section => settings[section]) || Object.keys(settings)[0] || '';
    };
    
    const [activeSection, setActiveSection] = useState(getInitialSection);
    
    // Sync with URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSection = urlParams.get('section');
        if (urlSection && urlSection !== activeSection && orderedSections.includes(urlSection)) {
            setActiveSection(urlSection);
        }
    }, [window.location.search]);
    
    // Handle section transitions with URL updates
    const handleSectionChange = (newSection) => {
        if (newSection !== activeSection) {
            setActiveSection(newSection);
            // Update URL to reflect the section change using query parameters
            const newUrl = route('admin.cms.global') + `?section=${newSection}`;
            window.history.pushState({}, '', newUrl);
        }
    };
    
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        settings: Object.entries(settings).flatMap(([section, sectionSettings]) =>
            sectionSettings.map(setting => ({
                id: setting.id,
                value: setting.value || ''
            }))
        )
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.cms.global.update'));
    };

    const updateSettingValue = (settingId, value) => {
        setData('settings', data.settings.map(setting =>
            setting.id === settingId ? { ...setting, value } : setting
        ));
    };

    const getSettingValue = (settingId) => {
        const setting = data.settings.find(s => s.id === settingId);
        return setting ? setting.value : '';
    };

    const renderInput = (setting) => {
        const value = getSettingValue(setting.id);
        
        switch (setting.type) {
            case 'textarea':
                return (
                    <Textarea
                        id={setting.id}
                        value={value}
                        onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                        className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={setting.description}
                    />
                );
            case 'boolean':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id={setting.id}
                                checked={value === '1' || value === 'true'}
                                onChange={(e) => updateSettingValue(setting.id, e.target.checked ? '1' : '0')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                            />
                            <Label htmlFor={setting.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                                {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                        </div>
                        {setting.description && (
                            <p className="text-xs text-gray-500 ml-7">{setting.description}</p>
                        )}
                    </div>
                );
            default:
                return (
                    <Input
                        type="text"
                        id={setting.id}
                        value={value}
                        onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={setting.description}
                    />
                );
        }
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={pageTitle}
            headerIcon={<Globe className="w-8 h-8 text-white" />}
            headerDescription="Configure site-wide settings and information"
        >
            <Head title={`${pageTitle} - CMS`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-blue-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href={route('admin.cms.index')} className="hover:text-blue-600 transition-colors font-medium">
                            CMS
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {breadcrumbs.filter(crumb => crumb.label.toLowerCase() !== 'cms').map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {crumb.url ? (
                                    <Link href={crumb.url} className="hover:text-blue-600 transition-colors font-medium">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-semibold">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.filter(crumb => crumb.label.toLowerCase() !== 'cms').length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* CMS Sidebar */}
                        <div className="lg:col-span-1">
                            <CmsSidebar 
                                currentPage="global" 
                                currentSection={activeSection}
                                onSectionChange={handleSectionChange}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <form onSubmit={handleSubmit}>
                                {orderedSections.filter(section => settings[section]).map((section) => {
                                    const sectionSettings = settings[section];
                                    return (
                                        <Card 
                                            key={section} 
                                            className={`bg-white border-0 shadow-sm mb-6 transition-all duration-300 ${
                                                activeSection === section ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            style={{ 
                                                display: activeSection === section ? 'block' : 'none'
                                            }}
                                        >
                                            <CardHeader className="border-b border-gray-100 pb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center">
                                                        <Settings className="w-5 h-5 text-blue-700" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-semibold text-gray-900 capitalize">
                                                            {section === 'site' ? 'Website Information' : 
                                                             section === 'contact' ? 'Contact Information' : 
                                                             section === 'social' ? 'Social Media' : 
                                                             section.replace('_', ' ')}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {section === 'site' ? 'General website settings and branding' : 
                                                             section === 'contact' ? 'Primary contact details displayed across the site' : 
                                                             section === 'social' ? 'Social media links and profiles' : 
                                                             `Configure settings for ${section.replace('_', ' ')}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent className="p-6">
                                                <div className="space-y-6">
                                                    {sectionSettings.map((setting) => (
                                                        <div key={setting.id} className="space-y-2">
                                                            {setting.type !== 'boolean' && (
                                                                <Label htmlFor={setting.id} className="text-sm font-medium text-gray-900">
                                                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                </Label>
                                                            )}
                                                            {renderInput(setting)}
                                                            {/* Only show description for non-checkbox inputs since checkbox inputs already show description */}
                                                            {setting.description && setting.type !== 'boolean' && (
                                                                <p className="text-xs text-gray-500">{setting.description}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-colors duration-200"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                        <Save className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}