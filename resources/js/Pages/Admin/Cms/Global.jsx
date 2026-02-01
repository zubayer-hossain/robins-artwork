import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { 
    ChevronRight, Save, Globe, Building2, Mail, Phone, MapPin,
    Facebook, Twitter, Instagram, Youtube, Linkedin, Link as LinkIcon,
    Image, AlertCircle, CheckCircle, RotateCcw, Sparkles, Info,
    FileText, AtSign, MessageSquare, Share2, AlertTriangle, Trash2, X,
    DollarSign
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';
import ImagePicker from '@/Components/ImagePicker';
import RichTextEditor from '@/Components/RichTextEditor';

export default function CmsGlobal({ auth, settings, breadcrumbs, pageTitle, activeSection: serverActiveSection }) {
    // Define section order for global settings
    const getSectionOrder = () => {
        return ['site', 'contact', 'social', 'images'];
    };
    
    const orderedSections = getSectionOrder();
    
    // Get section from URL or server
    const getInitialSection = () => {
        if (serverActiveSection) {
            return serverActiveSection;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlSection = urlParams.get('section');
        if (urlSection && orderedSections.includes(urlSection)) {
            return urlSection;
        }
        
        return orderedSections.find(section => settings[section]) || Object.keys(settings)[0] || '';
    };
    
    const [activeSection, setActiveSection] = useState(getInitialSection);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const isInitialized = useRef(false);
    
    // Mark as initialized after a short delay to skip initial onChange events
    useEffect(() => {
        const timer = setTimeout(() => {
            isInitialized.current = true;
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    
    // Sync with URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSection = urlParams.get('section');
        if (urlSection && urlSection !== activeSection && orderedSections.includes(urlSection)) {
            setActiveSection(urlSection);
        }
    }, []);
    
    // Handle section transitions
    const handleSectionChange = (newSection) => {
        if (newSection !== activeSection) {
            setActiveSection(newSection);
            const newUrl = route('admin.cms.global') + `?section=${newSection}`;
            window.history.pushState({}, '', newUrl);
        }
    };
    
    // Store original values for comparison
    const [originalValues] = useState(() => {
        const values = {};
        Object.entries(settings).forEach(([section, sectionSettings]) => {
            sectionSettings.forEach(setting => {
                values[setting.id] = setting.value || '';
            });
        });
        return values;
    });

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        settings: Object.entries(settings).flatMap(([section, sectionSettings]) =>
            sectionSettings.map(setting => ({
                id: setting.id,
                value: setting.value || ''
            }))
        )
    });

    // Helper to normalize HTML for comparison (handles TipTap quirks)
    const normalizeForComparison = (str) => {
        if (!str) return '';
        return str.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    };

    // Show success message
    useEffect(() => {
        if (recentlySuccessful) {
            setShowSuccessMessage(true);
            setHasUnsavedChanges(false);
            const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    // Keyboard shortcut for save
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsavedChanges && !processing) {
                    document.getElementById('cms-global-form')?.requestSubmit();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, processing]);

    // Warn before leaving
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.cms.global.update'));
    };

    const updateSettingValue = useCallback((settingId, value) => {
        // Only detect changes after initialization (skip RichTextEditor's initial onChange)
        if (isInitialized.current) {
            // Compare with original value (normalized for HTML comparison)
            const originalValue = originalValues[settingId] || '';
            const hasActualChange = normalizeForComparison(value) !== normalizeForComparison(originalValue);
            
            if (hasActualChange) {
                setHasUnsavedChanges(true);
            }
        }
        
        setData('settings', data.settings.map(setting =>
            setting.id === settingId ? { ...setting, value } : setting
        ));
    }, [data.settings, setData, originalValues]);

    const getSettingValue = (settingId) => {
        const setting = data.settings.find(s => s.id === settingId);
        return setting ? setting.value : '';
    };

    const discardChanges = () => {
        setShowDiscardModal(true);
    };

    const confirmDiscard = () => {
        setShowDiscardModal(false);
        setHasUnsavedChanges(false); // Disable beforeunload warning
        setTimeout(() => window.location.reload(), 0);
    };

    // Get icon for setting
    const getSettingIcon = (key) => {
        const iconMap = {
            // Site
            site_name: Building2,
            site_title: FileText,
            site_description: MessageSquare,
            site_tagline: Sparkles,
            // Contact
            email: Mail,
            phone: Phone,
            address: MapPin,
            contact_email: AtSign,
            // Social
            facebook: Facebook,
            twitter: Twitter,
            instagram: Instagram,
            youtube: Youtube,
            linkedin: Linkedin,
            social_link: Share2,
            // Images
            logo: Image,
            favicon: Image,
            og_image: Image,
        };
        
        // Try to match the key
        const lowerKey = key.toLowerCase();
        for (const [pattern, icon] of Object.entries(iconMap)) {
            if (lowerKey.includes(pattern)) {
                return icon;
            }
        }
        return LinkIcon;
    };

    // Helper function to render section content with proper grouping
    const renderSectionContent = (sectionSettings) => {
        // Separate button fields from regular fields
        const regularFields = [];
        const buttonFields = [];

        sectionSettings.forEach(setting => {
            const isButtonField = setting.key.toLowerCase().includes('button');
            if (isButtonField) {
                buttonFields.push(setting);
            } else {
                regularFields.push(setting);
            }
        });

        // Render button fields in a grid
        const renderButtonFields = () => {
            if (buttonFields.length === 0) return null;
            
            return (
                <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Button Settings
                    </h4>
                    <div className={`grid grid-cols-1 ${buttonFields.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                        {buttonFields.map((setting) => (
                            <div 
                                key={setting.id}
                                className="p-4 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50"
                            >
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                {renderInput(setting)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-4">
                {/* Regular fields */}
                {regularFields.map((setting) => (
                    <div key={setting.id}>
                        {renderInput(setting)}
                    </div>
                ))}
                
                {/* Button fields in grid */}
                {renderButtonFields()}
            </div>
        );
    };

    // Get section metadata
    const getSectionMeta = (section) => {
        const meta = {
            site: {
                title: 'Website Information',
                description: 'General website settings and branding',
                icon: Building2,
                gradient: 'from-blue-500 to-indigo-600',
                bgColor: 'from-blue-50 to-indigo-50'
            },
            contact: {
                title: 'Contact Information',
                description: 'Primary contact details displayed across the site',
                icon: Phone,
                gradient: 'from-emerald-500 to-teal-600',
                bgColor: 'from-emerald-50 to-teal-50'
            },
            social: {
                title: 'Social Media',
                description: 'Social media links and profiles',
                icon: Share2,
                gradient: 'from-purple-500 to-pink-600',
                bgColor: 'from-purple-50 to-pink-50'
            },
            images: {
                title: 'Image Settings',
                description: 'Configure site images and media settings',
                icon: Image,
                gradient: 'from-orange-500 to-amber-600',
                bgColor: 'from-orange-50 to-amber-50'
            }
        };
        return meta[section] || { 
            title: section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Configure ${section} settings`,
            icon: Globe,
            gradient: 'from-gray-500 to-slate-600',
            bgColor: 'from-gray-50 to-slate-50'
        };
    };

    const renderInput = (setting) => {
        const value = getSettingValue(setting.id);
        const maxLength = setting.type === 'textarea' ? 1000 : 255;
        const SettingIcon = getSettingIcon(setting.key);
        
        switch (setting.type) {
            case 'textarea':
                // Only use RichTextEditor for 'content' fields that need rich formatting
                if (setting.key === 'content') {
                    return (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-gray-500">{setting.description}</span>
                            </div>
                            <RichTextEditor
                                key={setting.id}
                                content={value}
                                onChange={(newValue) => updateSettingValue(setting.id, newValue)}
                                placeholder={setting.description || 'Write your content here...'}
                            />
                        </div>
                    );
                }
                // Regular textarea for description and other short text fields
                return (
                    <div className="space-y-2">
                        <Textarea
                            id={setting.id}
                            value={value}
                            onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                            className="min-h-[100px] resize-y transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            placeholder={setting.description || 'Enter text...'}
                        />
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{setting.description}</span>
                            <span className={`font-medium ${value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {value.length}/{maxLength}
                            </span>
                        </div>
                    </div>
                );
            case 'select':
                // Get options based on the setting key
                const getSelectOptions = (key) => {
                    if (key === 'default_currency') {
                        return [
                            { value: 'USD', label: '$ USD - US Dollar' },
                            { value: 'GBP', label: '£ GBP - British Pound' },
                            { value: 'EUR', label: '€ EUR - Euro' },
                        ];
                    }
                    return [];
                };
                
                const options = getSelectOptions(setting.key);
                const SelectIcon = setting.key === 'default_currency' ? DollarSign : SettingIcon;
                
                return (
                    <div className="group relative p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <SelectIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 mb-2 block">
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                <Select 
                                    value={value || options[0]?.value} 
                                    onValueChange={(newValue) => updateSettingValue(setting.id, newValue)}
                                >
                                    <SelectTrigger className="w-full bg-white border-green-300 focus:ring-green-500">
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[9999]" position="popper" sideOffset={5}>
                                        {options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {setting.description && (
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        {setting.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'boolean':
                return (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <SettingIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 cursor-pointer block">
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                {setting.description && (
                                    <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={value === '1' || value === 'true'}
                            onClick={() => updateSettingValue(setting.id, (value === '1' || value === 'true') ? '0' : '1')}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                (value === '1' || value === 'true') 
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                                    : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                (value === '1' || value === 'true') ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                );
            default:
                // Check if this is an image URL field (specifically image_url, logo_url, not image_alt)
                const keyLower = setting.key.toLowerCase();
                const isImageUrlField = (keyLower.includes('image_url') || keyLower === 'image' || keyLower.endsWith('_image') || keyLower.includes('logo')) 
                    && !keyLower.includes('alt');
                
                if (isImageUrlField) {
                    return (
                        <div className="group relative p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Label>
                                    <ImagePicker
                                        value={value}
                                        onChange={(newValue) => updateSettingValue(setting.id, newValue)}
                                        label=""
                                        placeholder={setting.description || 'Enter image URL or select from library'}
                                        helpText={setting.description}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="group relative p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                                <SettingIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 mb-2 block">
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        id={setting.id}
                                        value={value}
                                        onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                                        className="pr-16 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder={setting.description || 'Enter value...'}
                                    />
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
                                        value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'
                                    }`}>
                                        {value.length}/{maxLength}
                                    </span>
                                </div>
                                {setting.description && (
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        {setting.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={pageTitle}
            headerIcon={<Globe className="w-8 h-8 text-white" />}
            headerDescription="Configure site-wide settings and information"
            headerActions={
                hasUnsavedChanges && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unsaved changes
                    </Badge>
                )
            }
        >
            <Head title={`${pageTitle} - CMS`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 pb-24">
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
                        <span className="text-gray-900 font-semibold">Global Settings</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* CMS Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <CmsSidebar 
                                    currentPage="global" 
                                    currentSection={activeSection}
                                    onSectionChange={handleSectionChange}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <form id="cms-global-form" onSubmit={handleSubmit}>
                                {orderedSections.filter(section => settings[section]).map((section) => {
                                    const sectionSettings = settings[section];
                                    const meta = getSectionMeta(section);
                                    const IconComponent = meta.icon;
                                    
                                    return (
                                        <Card 
                                            key={section} 
                                            className={`bg-white border-0 shadow-lg mb-6 transition-all duration-500 ${
                                                activeSection === section ? 'opacity-100 ring-2 ring-blue-100' : 'opacity-0 hidden'
                                            }`}
                                        >
                                            <CardHeader className={`border-b border-gray-100 pb-6 bg-gradient-to-r ${meta.bgColor}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 bg-gradient-to-br ${meta.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                        <IconComponent className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold text-gray-900">
                                                            {meta.title}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {meta.description}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="ml-auto bg-white">
                                                        {sectionSettings.length} fields
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent className="p-6">
                                                {renderSectionContent(sectionSettings)}
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                {/* Desktop Save Button */}
                                <div className="hidden lg:flex justify-end gap-3">
                                    {hasUnsavedChanges && (
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={discardChanges}
                                            className="border-gray-300"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Discard
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !hasUnsavedChanges}
                                        className={`px-8 py-3 transition-all duration-300 ${
                                            hasUnsavedChanges 
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg' 
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Save Bar */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 transition-all duration-300 ${
                hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full lg:translate-y-full'
            }`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">
                            You have unsaved changes
                        </span>
                        <span className="text-xs text-gray-400 hidden sm:inline">
                            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+S</kbd> to save
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={discardChanges}
                            className="border-gray-300 text-gray-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Discard</span>
                        </Button>
                        <Button 
                            type="submit"
                            form="cms-global-form"
                            disabled={processing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Save Changes</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Success Message Toast */}
            {showSuccessMessage && (
                <div className="fixed bottom-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold">Settings saved!</p>
                            <p className="text-sm text-white/80">Your global settings have been updated</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Discard Changes Confirmation Modal */}
            <Dialog open={showDiscardModal} onOpenChange={setShowDiscardModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center sm:text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-orange-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Discard unsaved changes?
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            You have unsaved changes that will be lost. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-orange-800">Your changes include:</p>
                                <ul className="mt-1 text-orange-700 space-y-0.5">
                                    <li>• Modified content and settings</li>
                                    <li>• Unsaved text and configuration</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDiscardModal(false)}
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Keep Editing
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmDiscard}
                            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Discard Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
