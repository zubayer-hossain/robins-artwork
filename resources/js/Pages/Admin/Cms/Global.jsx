import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Save, Settings, Globe } from 'lucide-react';
import { useState } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';

export default function CmsGlobal({ auth, settings, breadcrumbs, pageTitle, activeSection: serverActiveSection }) {
    // Define section order for global settings to match CmsSidebar
    const getSectionOrder = () => {
        return ['site', 'contact', 'social'];
    };
    
    const orderedSections = getSectionOrder();
    // Use server-provided activeSection or fall back to first section
    const initialSection = serverActiveSection || orderedSections.find(section => settings[section]) || Object.keys(settings)[0] || '';
    const [activeSection, setActiveSection] = useState(initialSection);
    
    // Handle section transitions with URL updates
    const handleSectionChange = (newSection) => {
        if (newSection !== activeSection) {
            setActiveSection(newSection);
            // Update URL to reflect the section change
            window.history.pushState({}, '', route('admin.cms.global.section', newSection));
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
                        className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors"
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
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href={route('admin.dashboard')} className="hover:text-purple-600 transition-colors font-medium">
                            Admin
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href={route('admin.cms.index')} className="hover:text-purple-600 transition-colors font-medium">
                            CMS
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {breadcrumbs.filter(crumb => crumb.label.toLowerCase() !== 'cms').map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {crumb.url ? (
                                    <Link href={crumb.url} className="hover:text-purple-600 transition-colors font-medium">
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
                                            className={`border-0 shadow-xl mb-6 transition-all duration-300 hover:shadow-2xl ${
                                                activeSection === section ? 'transform scale-[1.01] opacity-100' : 'opacity-0'
                                            }`}
                                            style={{ 
                                                display: activeSection === section ? 'block' : 'none'
                                            }}
                                        >
                                        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <span className="text-3xl">
                                                        {section === 'site' && '🌐'}
                                                        {section === 'contact' && '📞'}
                                                        {section === 'social' && '📱'}
                                                        {!['site', 'contact', 'social'].includes(section) && '⚙️'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-bold text-gray-900 capitalize">
                                                        {section === 'site' && 'Website Information'}
                                                        {section === 'contact' && 'Contact Information'}
                                                        {section === 'social' && 'Social Media'}
                                                        {!['site', 'contact', 'social'].includes(section) && section.replace('_', ' ')}
                                                    </CardTitle>
                                                    <p className="text-gray-600 mt-1">
                                                        {section === 'site' && 'General website settings and branding'}
                                                        {section === 'contact' && 'Primary contact details displayed across the site'}
                                                        {section === 'social' && 'Social media links and profiles'}
                                                        {!['site', 'contact', 'social'].includes(section) && 'Configure settings for this section'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {sectionSettings.map((setting) => (
                                                    <div key={setting.id} className={`space-y-3 ${setting.type === 'textarea' ? 'md:col-span-2' : ''} ${setting.type === 'boolean' ? 'md:col-span-2' : ''}`}>
                                                        {setting.type !== 'boolean' && (
                                                            <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-800 capitalize flex items-center gap-2">
                                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                                {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </Label>
                                                        )}
                                                        <div className="relative">
                                                            {renderInput(setting)}
                                                            {errors[`settings.${setting.id}`] && (
                                                                <div className="absolute -bottom-6 left-0">
                                                                    <p className="text-sm text-red-600 font-medium">{errors[`settings.${setting.id}`]}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {setting.description && setting.type !== 'boolean' && (
                                                            <p className="text-xs text-gray-500 italic">{setting.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    );
                                })}

                                {/* Save Button */}
                                <div className="sticky bottom-6 z-10">
                                    <Card className="border-0 shadow-2xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {recentlySuccessful && (
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="text-sm font-medium">Global settings saved successfully!</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                                            Saving Changes...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-5 h-5 mr-3" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}