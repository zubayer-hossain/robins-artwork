import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
import ArtworkCard from '@/Components/ArtworkCard';

export default function GalleryIndex({ artworks, filters, totalArtworks, stats, cmsSettings = {} }) {
    // Helper function to get CMS value
    const getCmsValue = (section, key, defaultValue = '') => {
        return cmsSettings[section]?.[key] || defaultValue;
    };
    
    // Helper function to get boolean CMS value with proper casting
    const getCmsBoolean = (section, key, defaultValue = false) => {
        const value = cmsSettings[section]?.[key];
        if (value === undefined || value === null) return defaultValue;
        
        // Handle various boolean representations
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            return lowerValue === '1' || lowerValue === 'true' || lowerValue === 'yes' || lowerValue === 'on';
        }
        if (typeof value === 'number') return value !== 0;
        
        return defaultValue;
    };
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedium, setSelectedMedium] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    
    const mediums = ['Oil', 'Watercolor', 'Acrylic', 'Gouache', 'Ink', 'Mixed Media'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    const applyFilters = () => {
        const params = {};
        
        // Search by title
        if (searchTerm && searchTerm.trim()) {
            params.title = searchTerm.trim();
        }
        
        // Filter by medium
        if (selectedMedium && selectedMedium !== 'all') {
            params.medium = selectedMedium;
        }
        
        // Filter by year
        if (selectedYear && selectedYear !== 'all') {
            params.year = selectedYear;
        }
        
        // Filter by price range
        if (priceRange.min && priceRange.min > 0) {
            params.price_min = priceRange.min;
        }
        if (priceRange.max && priceRange.max > 0) {
            params.price_max = priceRange.max;
        }

        // Apply filters with preserveState to maintain scroll position and no page reload
        router.get(route('gallery'), params, { 
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedMedium('all');
        setSelectedYear('all');
        setPriceRange({ min: '', max: '' });
        
        // Clear URL parameters without page reload
        router.get(route('gallery'), {}, { 
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(applyFilters, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedMedium, selectedYear, priceRange.min, priceRange.max]);

    return (
        <PublicLayout>
            <Head title="Gallery" />
            
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🎨</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                            {getCmsValue('header', 'title', 'Art Gallery')}
                        </h1>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        {getCmsValue('header', 'description', 'Discover extraordinary artworks that tell stories, evoke emotions, and transform spaces. Each piece is carefully curated to bring beauty and inspiration to your life.')}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{stats?.totalArtworks || totalArtworks || 0}</div>
                            <div className="text-sm text-gray-600">Artworks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats?.totalYears || 0}</div>
                            <div className="text-sm text-gray-600">Years</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{stats?.totalMediums || 0}</div>
                            <div className="text-sm text-gray-600">Mediums</div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters - Only show if enabled in CMS */}
                {getCmsBoolean('controls', 'show_filters') && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-purple-100 mb-12 relative">
                        {/* Subtle Loading Indicator */}
                        <div className="absolute top-4 right-4">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        </div>
                        {/* Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">🔍</span>
                                Refine Your Search
                            </h3>
                            <p className="text-gray-600 mb-6">Find the perfect artwork that speaks to your soul</p>
                        
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search - Only show if enabled in CMS */}
                                {getCmsBoolean('controls', 'show_search') && (
                                    <div>
                                        <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Search artworks...
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="search"
                                                type="text"
                                                placeholder="Search artworks..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Medium Filter */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        <span className="mr-2">🎨</span>
                                        Medium
                                    </Label>
                                    <Select value={selectedMedium} onValueChange={(value) => setSelectedMedium(value)}>
                                        <SelectTrigger placeholder="All mediums">
                                            <SelectValue value={selectedMedium} placeholder="All mediums" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All mediums</SelectItem>
                                            {mediums.map((medium) => (
                                                <SelectItem key={medium} value={medium}>
                                                    {medium}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Year Filter */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        <span className="mr-2">📅</span>
                                        Year
                                    </Label>
                                    <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
                                        <SelectTrigger placeholder="All years">
                                            <SelectValue value={selectedYear} placeholder="All years" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All years</SelectItem>
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        <span className="mr-2">💰</span>
                                        Price Range
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="text-sm"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters and Clear Button */}
                            {(searchTerm || selectedMedium !== 'all' || selectedYear !== 'all' || priceRange.min || priceRange.max) && (
                                <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">🔍 Active Filters:</span>
                                            {searchTerm && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">"{searchTerm}"</span>}
                                            {selectedMedium !== 'all' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{selectedMedium}</span>}
                                            {selectedYear !== 'all' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{selectedYear}</span>}
                                            {priceRange.min && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Min: ${priceRange.min}</span>}
                                            {priceRange.max && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Max: ${priceRange.max}</span>}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={clearFilters}
                                            size="sm"
                                            className="border-purple-300 text-purple-600 hover:bg-purple-50 px-4 py-2 text-sm font-medium transition-all duration-300"
                                        >
                                            🗑️ Clear All
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                                {/* Enhanced Artworks Grid */}
                {artworks.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {artworks.data.map((artwork) => (
                            <ArtworkCard key={artwork.id} artwork={artwork} />
                        ))}
                    </div>
                ) : (
                    /* Enhanced No Artworks Found Message */
                    <div className="text-center py-20">
                        <div className="max-w-2xl mx-auto">
                            {/* Enhanced Empty State Icon */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-30"></div>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <span className="text-5xl">🎨</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced Message */}
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">{getCmsValue('empty_state', 'title', 'No Artworks Found')}</h3>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
                                {getCmsValue('empty_state', 'description', 'We couldn\'t find any artworks matching your current filters. Don\'t worry though - our collection is always growing!')}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Button 
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {getCmsValue('empty_state', 'primary_button_text', '🔍 Browse All Artworks')}
                                </Button>
                                <Link href={route('contact')}>
                                    <Button 
                                        variant="outline" 
                                        className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                                    >
                                        {getCmsValue('empty_state', 'secondary_button_text', '💬 Ask About Commissions')}
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* Helpful Tips */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center justify-center">
                                    <span className="mr-2">💡</span>
                                    Helpful Tips
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                        <span>Try broader search terms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                        <span>Remove some filters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                        <span>Check your spelling</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Pagination - Only show when there are artworks */}
                {artworks.data.length > 0 && artworks.links && artworks.links.length > 3 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex gap-2">
                            {artworks.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 hover:shadow-md'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Enhanced Call to Action Section - Only show if enabled in CMS */}
                {getCmsBoolean('cta', 'show_cta', true) && (
                    <div className="mt-16 py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl border border-purple-100 shadow-lg">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        {/* Decorative Elements */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-3xl">✨</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main Content */}
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                            {getCmsValue('cta', 'title', 'Can\'t Find What You\'re Looking For?')}
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            {getCmsValue('cta', 'description', 'Our collection is constantly growing with new pieces inspired by the stunning Scottish Highlands. Let us know what you\'re looking for, and we\'ll help you find the perfect artwork for your space.')}
                        </p>
                        
                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">🎨</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{getCmsValue('features', 'feature1_title', 'Custom Commissions')}</h4>
                                <p className="text-sm text-gray-600">{getCmsValue('features', 'feature1_description', 'Personalized artwork tailored to your vision')}</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">🏔️</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{getCmsValue('features', 'feature2_title', 'Scottish Landscapes')}</h4>
                                <p className="text-sm text-gray-600">{getCmsValue('features', 'feature2_description', 'Inspired by the beautiful Cairngorms')}</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">🏠</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{getCmsValue('features', 'feature3_title', 'Studio Visits')}</h4>
                                <p className="text-sm text-gray-600">{getCmsValue('features', 'feature3_description', 'Visit Robin\'s studio in the Highlands')}</p>
                            </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex justify-center">
                            <Link href={route('contact')}>
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-16 py-6 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-xl">
                                    {getCmsValue('cta', 'button_text', '💌 Get in Touch')}
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-purple-200">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{getCmsValue('footer_info', 'info1_text', 'Free consultation')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{getCmsValue('footer_info', 'info2_text', 'Worldwide shipping')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{getCmsValue('footer_info', 'info3_text', 'Secure payments')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </PublicLayout>
    );
}

