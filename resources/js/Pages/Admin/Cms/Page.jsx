import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { 
    ChevronRight, Save, Eye, Settings, AlertCircle, 
    CheckCircle, RotateCcw, Sparkles, LayoutList, Info, FileText,
    AlertTriangle, Trash2, X, Plus, Building2, Mail, Phone, Share2,
    HelpCircle, MessageSquare
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import CmsSidebar from '@/Components/CmsSidebar';
import ImagePicker from '@/Components/ImagePicker';
import RichTextEditor from '@/Components/RichTextEditor';

export default function CmsPage({ auth, page, settings, breadcrumbs, pageTitle, activeSection: serverActiveSection }) {
    // Define section order based on page to match CmsSidebar
    const getSectionOrder = (pageName) => {
        const sectionOrders = {
            home: ['hero', 'stats', 'featured', 'about', 'contact_cta'],
            gallery: ['header', 'controls', 'empty_state', 'cta'],
            about: ['hero', 'story', 'philosophy', 'process', 'cta'],
            contact: ['hero', 'form', 'info', 'faq', 'cta']
        };
        return sectionOrders[pageName] || Object.keys(settings);
    };
    
    const orderedSections = getSectionOrder(page);
    
    // Get section from URL or server, with fallback to first available section
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
    const [showDeleteFaqModal, setShowDeleteFaqModal] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState(null);
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
    
    // Handle section transitions with URL updates
    const handleSectionChange = (newSection) => {
        if (newSection !== activeSection) {
            setActiveSection(newSection);
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('section', newSection);
            window.history.pushState({}, '', currentUrl.toString());
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

    // Prepare form data
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

    // Sync form data when settings change (e.g., after adding/deleting FAQ)
    useEffect(() => {
        const newSettings = Object.entries(settings).flatMap(([section, sectionSettings]) =>
            sectionSettings.map(setting => ({
                id: setting.id,
                value: setting.value || ''
            }))
        );
        
        // Check if there are new settings that aren't in the form data
        const currentIds = new Set(data.settings.map(s => s.id));
        const newSettingsExist = newSettings.some(s => !currentIds.has(s.id));
        
        // Also check if some settings were removed
        const newIds = new Set(newSettings.map(s => s.id));
        const settingsRemoved = data.settings.some(s => !newIds.has(s.id));
        
        if (newSettingsExist || settingsRemoved) {
            setData('settings', newSettings);
        }
    }, [settings]);

    // Show success message when save is successful
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
                    document.getElementById('cms-form')?.requestSubmit();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, processing]);

    // Warn before leaving with unsaved changes
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
        patch(route('admin.cms.page.update', page));
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

    const renderInput = (setting) => {
        const value = getSettingValue(setting.id);
        const maxLength = setting.type === 'textarea' ? 1000 : 255;
        
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
            case 'boolean':
                return (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                        <div className="flex-1">
                            <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 cursor-pointer block">
                                {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                            {setting.description && (
                                <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                            )}
                        </div>
                        {/* Modern Toggle Switch */}
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
            case 'number':
                return (
                    <Input
                        type="number"
                        id={setting.id}
                        value={value}
                        onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder={setting.description || 'Enter number...'}
                    />
                );
            default:
                // Check if this is an image URL field (specifically image_url, not image_alt)
                const keyLower = setting.key.toLowerCase();
                const isImageUrlField = (keyLower.includes('image_url') || keyLower === 'image' || keyLower.endsWith('_image')) 
                    && !keyLower.includes('alt');
                
                if (isImageUrlField) {
                    return (
                        <ImagePicker
                            value={value}
                            onChange={(newValue) => updateSettingValue(setting.id, newValue)}
                            label=""
                            placeholder={setting.description || 'Enter image URL or select from library'}
                            helpText={setting.description}
                        />
                    );
                }
                
                return (
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                type="text"
                                id={setting.id}
                                value={value}
                                onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                                className="pr-16 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                placeholder={setting.description || 'Enter text...'}
                            />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
                                value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'
                            }`}>
                                {value.length}/{maxLength}
                            </span>
                        </div>
                        {setting.description && setting.type !== 'boolean' && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {setting.description}
                            </p>
                        )}
                    </div>
                );
        }
    };

    // Helper function to render section content with proper grouping and sorting
    const renderSectionContent = (sectionSettings) => {
        // Check if this section has card or FAQ grouped fields
        const hasCardFields = sectionSettings.some(s => /^card\d+_/.test(s.key));
        const hasFaqFields = sectionSettings.some(s => /^faq\d+_/.test(s.key));
        const hasFeatureFields = sectionSettings.some(s => /^feature\d+_/.test(s.key));

        // Separate fields into categories
        const toggleFields = [];      // show_* fields
        const headerFields = [];      // title, subtitle
        const contentFields = [];     // description, content
        const imageFields = [];       // image_url, image_alt
        const buttonFields = [];      // *button* fields
        const statFields = [];        // stat*_label fields
        const infoFields = [];        // info*_text fields
        const otherFields = [];       // everything else
        const cardGroups = {};
        const faqGroups = {};
        const featureGroups = {};

        sectionSettings.forEach(setting => {
            const keyLower = setting.key.toLowerCase();
            const cardMatch = setting.key.match(/^card(\d+)_(.+)$/);
            const faqMatch = setting.key.match(/^faq(\d+)_(.+)$/);
            const featureMatch = setting.key.match(/^feature(\d+)_(.+)$/);
            const statMatch = setting.key.match(/^stat(\d+)_/);
            const infoMatch = setting.key.match(/^info(\d+)_/);

            if (cardMatch) {
                const [, num, field] = cardMatch;
                if (!cardGroups[num]) cardGroups[num] = {};
                cardGroups[num][field] = setting;
            } else if (faqMatch) {
                const [, num, field] = faqMatch;
                if (!faqGroups[num]) faqGroups[num] = {};
                faqGroups[num][field] = setting;
            } else if (featureMatch) {
                const [, num, field] = featureMatch;
                if (!featureGroups[num]) featureGroups[num] = {};
                featureGroups[num][field] = setting;
            } else if (statMatch) {
                statFields.push(setting);
            } else if (infoMatch) {
                infoFields.push(setting);
            } else if (keyLower.startsWith('show_')) {
                toggleFields.push(setting);
            } else if (keyLower === 'title' || keyLower === 'subtitle') {
                headerFields.push(setting);
            } else if (keyLower === 'description' || keyLower === 'content') {
                contentFields.push(setting);
            } else if (keyLower.includes('image')) {
                imageFields.push(setting);
            } else if (keyLower.includes('button')) {
                buttonFields.push(setting);
            } else {
                otherFields.push(setting);
            }
        });

        // Sort stat fields by number
        statFields.sort((a, b) => {
            const numA = parseInt(a.key.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.key.match(/\d+/)?.[0] || '0');
            return numA - numB;
        });

        // Sort info fields by number
        infoFields.sort((a, b) => {
            const numA = parseInt(a.key.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.key.match(/\d+/)?.[0] || '0');
            return numA - numB;
        });

        // Sort header fields (title first, then subtitle)
        headerFields.sort((a, b) => {
            if (a.key.toLowerCase() === 'title') return -1;
            if (b.key.toLowerCase() === 'title') return 1;
            return 0;
        });

        // Sort image fields (url first, then alt)
        imageFields.sort((a, b) => {
            if (a.key.toLowerCase().includes('url')) return -1;
            if (b.key.toLowerCase().includes('url')) return 1;
            return 0;
        });

        // Render a single field with label
        const renderFieldWithLabel = (setting) => (
            <div key={setting.id} className="space-y-2">
                {setting.type !== 'boolean' && (
                    <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                )}
                {renderInput(setting)}
            </div>
        );

        // Render grouped items (cards, features) - NOT for FAQs
        const renderGroupedItems = (groups, type, colors) => {
            const groupKeys = Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b));
            if (groupKeys.length === 0) return null;

            return (
                <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span className={`w-2 h-2 ${colors.dot} rounded-full`}></span>
                        {type === 'card' ? 'Philosophy Cards' : 'Feature Cards'}
                    </h4>
                    <div className={`grid grid-cols-1 ${groupKeys.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
                        {groupKeys.map((num) => {
                            const group = groups[num];
                            const titleField = group.title;
                            const descField = group.description;

                            return (
                                <div 
                                    key={num} 
                                    className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg} space-y-3`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-6 h-6 ${colors.badge} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                                            {num}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {type === 'card' ? `Card ${num}` : `Feature ${num}`}
                                        </span>
                                    </div>
                                    
                                    {titleField && (
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-600">Title</Label>
                                            {renderInput(titleField)}
                                        </div>
                                    )}
                                    
                                    {descField && (
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-600">Description</Label>
                                            {renderInput(descField)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };

        // Render FAQ items with CRUD functionality
        const renderFaqItems = () => {
            // Sort FAQs in descending order (newest first for better UX)
            const groupKeys = Object.keys(faqGroups).sort((a, b) => parseInt(b) - parseInt(a));
            
            const handleAddFaq = () => {
                router.post(route('admin.cms.faq.add', { page, section: activeSection }), {}, {
                    preserveState: false,
                    preserveScroll: false,
                    onSuccess: () => {
                        // Scroll to the FAQ section after adding
                        setTimeout(() => {
                            const faqSection = document.getElementById('faq-items-section');
                            if (faqSection) {
                                faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }, 100);
                    }
                });
            };

            const handleDeleteFaq = (faqNum) => {
                setFaqToDelete(faqNum);
                setShowDeleteFaqModal(true);
            };

            const confirmDeleteFaq = () => {
                if (faqToDelete) {
                    router.delete(route('admin.cms.faq.delete', { page, section: activeSection, faqNum: faqToDelete }), {
                        preserveState: false,
                        preserveScroll: true,
                        onSuccess: () => {
                            setShowDeleteFaqModal(false);
                            setFaqToDelete(null);
                        }
                    });
                }
            };

            return (
                <div id="faq-items-section" className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            FAQ Items
                            <Badge variant="outline" className="ml-2 text-xs">
                                {groupKeys.length} {groupKeys.length === 1 ? 'item' : 'items'}
                            </Badge>
                        </h4>
                        <Button
                            type="button"
                            onClick={handleAddFaq}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add FAQ
                        </Button>
                    </div>
                    
                    {groupKeys.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-3">No FAQs yet</p>
                            <Button
                                type="button"
                                onClick={handleAddFaq}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add your first FAQ
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {groupKeys.map((num, index) => {
                                const group = faqGroups[num];
                                const questionField = group.question;
                                const answerField = group.answer;
                                const isNewest = index === 0;

                                return (
                                    <div 
                                        key={num}
                                        id={`faq-item-${num}`}
                                        className={`p-4 rounded-xl border-2 space-y-3 transition-all duration-300 ${
                                            isNewest 
                                                ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-cyan-100 shadow-md ring-2 ring-blue-300 ring-opacity-50' 
                                                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-7 h-7 text-white rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isNewest ? 'bg-blue-600' : 'bg-blue-500'
                                                }`}>
                                                    {num}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-700">FAQ {num}</span>
                                                {isNewest && (
                                                    <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                                                        Latest
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => handleDeleteFaq(num)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        
                                        {questionField && (
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-blue-700 flex items-center gap-1">
                                                    <HelpCircle className="w-3 h-3" />
                                                    Question
                                                </Label>
                                                {renderInput(questionField)}
                                            </div>
                                        )}
                                        
                                        {answerField && (
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-blue-700 flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    Answer
                                                </Label>
                                                {renderInput(answerField)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Delete FAQ Confirmation Modal */}
                    <Dialog open={showDeleteFaqModal} onOpenChange={setShowDeleteFaqModal}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </div>
                                    Delete FAQ {faqToDelete}?
                                </DialogTitle>
                                <DialogDescription className="pt-3">
                                    Are you sure you want to delete this FAQ? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-700">
                                        <p className="font-medium">This will permanently remove:</p>
                                        <ul className="list-disc list-inside mt-1 text-red-600">
                                            <li>The FAQ question</li>
                                            <li>The FAQ answer</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteFaqModal(false);
                                        setFaqToDelete(null);
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={confirmDeleteFaq}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete FAQ
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        };

        // Render contact info fields in grouped sections
        const renderContactInfoGroups = () => {
            // Group contact info fields by category
            const studioFields = otherFields.filter(f => 
                f.key.startsWith('studio_')
            );
            const emailFields = otherFields.filter(f => 
                f.key.startsWith('email_')
            );
            const phoneFields = otherFields.filter(f => 
                f.key.startsWith('phone_')
            );
            const socialFields = otherFields.filter(f => 
                f.key.startsWith('social_') || f.key.includes('_url')
            );
            
            // Remove grouped fields from otherFields
            const remainingOtherFields = otherFields.filter(f => 
                !studioFields.includes(f) && 
                !emailFields.includes(f) && 
                !phoneFields.includes(f) && 
                !socialFields.includes(f)
            );

            const renderInfoGroup = (fields, title, icon, colors) => {
                if (fields.length === 0) return null;
                return (
                    <div className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg} space-y-3`}>
                        <h5 className={`text-sm font-semibold ${colors.text} flex items-center gap-2`}>
                            {icon}
                            {title}
                        </h5>
                        <div className="space-y-3">
                            {fields.map((setting) => (
                                <div key={setting.id} className="space-y-1">
                                    <Label htmlFor={setting.id} className="text-xs font-medium text-gray-600">
                                        {setting.key.replace(/^(studio_|email_|phone_|social_)/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Label>
                                    {renderInput(setting)}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            };

            return {
                studioSection: renderInfoGroup(studioFields, 'Studio Information', <Building2 className="w-4 h-4" />, {
                    border: 'border-emerald-200',
                    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
                    text: 'text-emerald-700'
                }),
                emailSection: renderInfoGroup(emailFields, 'Email Contact', <Mail className="w-4 h-4" />, {
                    border: 'border-blue-200',
                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    text: 'text-blue-700'
                }),
                phoneSection: renderInfoGroup(phoneFields, 'Phone Contact', <Phone className="w-4 h-4" />, {
                    border: 'border-orange-200',
                    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
                    text: 'text-orange-700'
                }),
                socialSection: renderInfoGroup(socialFields, 'Social Media', <Share2 className="w-4 h-4" />, {
                    border: 'border-purple-200',
                    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
                    text: 'text-purple-700'
                }),
                remainingOtherFields
            };
        };

        // Check if this is the contact info section
        const isContactInfoSection = page === 'contact' && activeSection === 'info';
        const contactInfoGroups = isContactInfoSection ? renderContactInfoGroups() : null;

        // Render header fields (title, subtitle) in a styled group
        const renderHeaderFields = () => {
            if (headerFields.length === 0) return null;
            
            return (
                <div className="p-5 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 space-y-4">
                    <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Header Content
                    </h4>
                    <div className="space-y-4">
                        {headerFields.map((setting) => (
                            <div key={setting.id} className="space-y-1">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                {renderInput(setting)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        // Render image fields in a styled group
        const renderImageFields = () => {
            if (imageFields.length === 0) return null;
            
            return (
                <div className="p-5 rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 space-y-4">
                    <h4 className="text-sm font-semibold text-pink-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        Image Settings
                    </h4>
                    <div className={`grid grid-cols-1 ${imageFields.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                        {imageFields.map((setting) => (
                            <div key={setting.id} className="space-y-1">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                {renderInput(setting)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        // Render button fields in a grid
        const renderButtonFields = () => {
            if (buttonFields.length === 0) return null;
            
            return (
                <div className="p-5 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 space-y-4">
                    <h4 className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Button Settings
                    </h4>
                    <div className={`grid grid-cols-1 ${buttonFields.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                        {buttonFields.map((setting) => (
                            <div key={setting.id} className="space-y-1">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
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

        // Render stat fields in a grid
        const renderStatFields = () => {
            if (statFields.length === 0) return null;
            
            return (
                <div className="p-5 rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 space-y-4">
                    <h4 className="text-sm font-semibold text-cyan-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        Statistics Labels
                    </h4>
                    <div className={`grid grid-cols-1 ${statFields.length > 1 ? 'md:grid-cols-3' : ''} gap-4`}>
                        {statFields.map((setting, index) => (
                            <div key={setting.id} className="space-y-1">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    Stat {index + 1} Label
                                </Label>
                                {renderInput(setting)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        // Render info fields in a grid
        const renderInfoFields = () => {
            if (infoFields.length === 0) return null;
            
            return (
                <div className="p-5 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 space-y-4">
                    <h4 className="text-sm font-semibold text-violet-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                        Info Items
                    </h4>
                    <div className={`grid grid-cols-1 ${infoFields.length > 1 ? 'md:grid-cols-3' : ''} gap-4`}>
                        {infoFields.map((setting, index) => (
                            <div key={setting.id} className="space-y-1">
                                <Label htmlFor={setting.id} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    Info {index + 1}
                                </Label>
                                {renderInput(setting)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                {/* Toggle fields (show/hide) */}
                {toggleFields.map((setting) => (
                    <div key={setting.id}>{renderInput(setting)}</div>
                ))}
                
                {/* Header fields (title, subtitle) */}
                {renderHeaderFields()}
                
                {/* Content fields (description, content) */}
                {contentFields.length > 0 && (
                    <div className="space-y-4">
                        {contentFields.map((setting) => renderFieldWithLabel(setting))}
                    </div>
                )}
                
                {/* Image fields */}
                {renderImageFields()}
                
                {/* Stat fields */}
                {renderStatFields()}
                
                {/* Info fields (gallery footer info items) */}
                {renderInfoFields()}
                
                {/* Contact Info grouped sections */}
                {isContactInfoSection && contactInfoGroups && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contactInfoGroups.studioSection}
                        {contactInfoGroups.emailSection}
                        {contactInfoGroups.phoneSection}
                        {contactInfoGroups.socialSection}
                    </div>
                )}
                
                {/* Other/misc fields - use remaining fields for contact info section */}
                {isContactInfoSection ? (
                    contactInfoGroups.remainingOtherFields.length > 0 && (
                        <div className="space-y-4">
                            {contactInfoGroups.remainingOtherFields.map((setting) => renderFieldWithLabel(setting))}
                        </div>
                    )
                ) : (
                    otherFields.length > 0 && (
                        <div className="space-y-4">
                            {otherFields.map((setting) => renderFieldWithLabel(setting))}
                        </div>
                    )
                )}
                
                {/* Button fields */}
                {renderButtonFields()}
                
                {/* Grouped card fields */}
                {hasCardFields && renderGroupedItems(cardGroups, 'card', {
                    border: 'border-purple-200',
                    bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
                    badge: 'bg-purple-500',
                    dot: 'bg-purple-500'
                })}
                
                {/* FAQ items with CRUD */}
                {hasFaqFields && renderFaqItems()}
                
                {/* Grouped feature fields */}
                {hasFeatureFields && renderGroupedItems(featureGroups, 'feature', {
                    border: 'border-emerald-200',
                    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
                    badge: 'bg-emerald-500',
                    dot: 'bg-emerald-500'
                })}
            </div>
        );
    };

    const getGradientForPage = () => {
        const gradients = {
            home: 'from-blue-500 to-indigo-600',
            gallery: 'from-purple-500 to-pink-600',
            about: 'from-emerald-500 to-teal-600',
            contact: 'from-orange-500 to-amber-600'
        };
        return gradients[page] || 'from-gray-500 to-slate-600';
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={pageTitle}
            headerIcon={<Settings className="w-8 h-8 text-white" />}
            headerDescription={`Manage content and settings for the ${page} page`}
            headerActions={
                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Unsaved changes
                        </Badge>
                    )}
                    <a href={route(page)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Page
                        </Button>
                    </a>
                </div>
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
                            <div className="sticky top-24 space-y-4">
                                <CmsSidebar 
                                    currentPage={page} 
                                    currentSection={activeSection}
                                    onSectionChange={handleSectionChange}
                                />
                                
                                {/* Quick Navigation Card */}
                                <Card className="bg-white shadow-lg border-0 hidden lg:block">
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                            <LayoutList className="w-4 h-4 text-blue-500" />
                                            Quick Jump
                                        </h4>
                                        <div className="space-y-1">
                                            {orderedSections.filter(section => settings[section]).map((section) => (
                                                <button
                                                    key={section}
                                                    type="button"
                                                    onClick={() => handleSectionChange(section)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                        activeSection === section
                                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border border-blue-200'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <form id="cms-form" onSubmit={handleSubmit}>
                                {orderedSections.filter(section => settings[section]).map((section) => {
                                    const sectionSettings = settings[section];
                                    return (
                                        <Card 
                                            key={section} 
                                            className={`bg-white border-0 shadow-lg mb-6 transition-all duration-500 overflow-hidden ${
                                                activeSection === section ? 'opacity-100 ring-2 ring-blue-100' : 'opacity-0 hidden'
                                            }`}
                                        >
                                            <CardHeader className={`border-b border-gray-100 pb-6 bg-gradient-to-r from-gray-50 to-white`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 bg-gradient-to-br ${getGradientForPage()} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                        <Sparkles className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold text-gray-900 capitalize">
                                                            {section.replace(/_/g, ' ')}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Manage {section.replace(/_/g, ' ')} content and settings
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

                                {/* Desktop Save Button (always visible) */}
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

            {/* Sticky Save Bar (Mobile + when has unsaved changes) */}
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
                            form="cms-form"
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
                            <p className="font-semibold">Changes saved!</p>
                            <p className="text-sm text-white/80">Your content has been updated</p>
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
