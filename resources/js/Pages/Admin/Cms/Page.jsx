import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Save, Eye, Settings } from 'lucide-react';
import { useState } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';

export default function CmsPage({ auth, page, settings, breadcrumbs, pageTitle }) {
    const [activeSection, setActiveSection] = useState(Object.keys(settings)[0] || '');
    
    // Prepare form data
    const formData = {};
    Object.entries(settings).forEach(([section, sectionSettings]) => {
        sectionSettings.forEach((setting) => {
            formData[setting.id] = setting.value || '';
        });
    });

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
        patch(route('admin.cms.page.update', page));
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
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={setting.id}
                            checked={value === '1' || value === 'true'}
                            onChange={(e) => updateSettingValue(setting.id, e.target.checked ? '1' : '0')}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors"
                        />
                        <Label htmlFor={setting.id} className="text-sm font-medium">
                            Enable this feature
                        </Label>
                    </div>
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        id={setting.id}
                        value={value}
                        onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={setting.description}
                    />
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
        <AdminLayout user={auth.user} header={pageTitle}>
            <Head title={`CMS - ${pageTitle}`} />
            
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

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
                                <p className="text-lg text-gray-600">Manage content and settings for the {page} page</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={route(page)} target="_blank">
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview Page
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* CMS Sidebar */}
                        <div className="lg:col-span-1">
                            <CmsSidebar 
                                currentPage={page} 
                                currentSection={activeSection}
                                onSectionChange={setActiveSection}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <form onSubmit={handleSubmit}>
                                {Object.entries(settings).map(([section, sectionSettings]) => (
                                    <Card 
                                        key={section} 
                                        className={`border-0 shadow-xl mb-6 transition-all duration-300 hover:shadow-2xl ${
                                            activeSection === section ? 'transform scale-[1.01]' : ''
                                        }`}
                                        style={{ display: activeSection === section ? 'block' : 'none' }}
                                    >
                                        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <span className="text-3xl">
                                                        {section === 'hero' && '🦸'}
                                                        {section === 'stats' && '📊'}
                                                        {section === 'featured' && '⭐'}
                                                        {section === 'about' && '👨‍🎨'}
                                                        {section === 'contact_cta' && '📞'}
                                                        {section === 'header' && '📄'}
                                                        {section === 'controls' && '🎮'}
                                                        {section === 'story' && '📖'}
                                                        {section === 'philosophy' && '💭'}
                                                        {!['hero', 'stats', 'featured', 'about', 'contact_cta', 'header', 'controls', 'story', 'philosophy'].includes(section) && '📝'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-bold text-gray-900 capitalize">
                                                        {section.replace('_', ' ')}
                                                    </CardTitle>
                                                    <p className="text-gray-600 mt-1">
                                                        Configure content and settings for this section
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {sectionSettings.map((setting) => (
                                                    <div key={setting.id} className={`space-y-3 ${setting.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                                                        <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-800 capitalize flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                            {setting.key.replace('_', ' ')}
                                                        </Label>
                                                        <div className="relative">
                                                            {renderInput(setting)}
                                                            {errors[`settings.${setting.id}`] && (
                                                                <div className="absolute -bottom-6 left-0">
                                                                    <p className="text-sm text-red-600 font-medium">{errors[`settings.${setting.id}`]}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {setting.description && (
                                                            <p className="text-xs text-gray-500 italic">{setting.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Save Button */}
                                <div className="sticky bottom-6 z-10">
                                    <Card className="border-0 shadow-2xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {recentlySuccessful && (
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="text-sm font-medium">Settings saved successfully!</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-medium">Auto-save enabled</span>
                                                    </div>
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