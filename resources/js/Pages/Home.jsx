﻿import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import ArtworkCard from '@/Components/ArtworkCard';

export default function Home({ featuredArtworks, stats, cmsSettings = {} }) {
    // Helper function to get CMS value
    const getCmsValue = (section, key, defaultValue = 'N/A') => {
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
    
    return (
        <PublicLayout>
            <Head title="Home" />
            
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center max-w-4xl mx-auto px-4">
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                            {getCmsValue('hero', 'title')}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                {getCmsValue('hero', 'subtitle')}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-100">
                            {getCmsValue('hero', 'description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('gallery')}>
                                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                    {getCmsValue('hero', 'primary_button_text')}
                                </Button>
                            </Link>
                            <Link href="#featured">
                                <Button variant="outline" size="lg" className="border-2 border-white bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-lg">
                                    {getCmsValue('hero', 'secondary_button_text')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Stats Section - Only show if enabled in CMS */}
            {getCmsBoolean('stats', 'show_stats') && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-purple-600 mb-2">
                                    {stats?.totalArtworks || 0}+
                                </div>
                                <div className="text-gray-600">
                                    {getCmsValue('stats', 'stat1_label')}
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-indigo-600 mb-2">
                                    {stats?.limitedEditions || 0}+
                                </div>
                                <div className="text-gray-600">
                                    {getCmsValue('stats', 'stat2_label')}
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-pink-600 mb-2">
                                    {stats?.featuredArtists || 0}+
                                </div>
                                <div className="text-gray-600">
                                    {getCmsValue('stats', 'stat3_label')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Artworks */}
            <section id="featured" className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {getCmsValue('featured', 'title')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {getCmsValue('featured', 'description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {featuredArtworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href={route('gallery')}>
                        <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-10 py-4 text-lg font-semibold transition-all duration-300">
                            {getCmsValue('featured', 'button_text')}
                        </Button>
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {getCmsValue('about', 'title')}
                            </h2>
                            <div 
                                className="text-lg text-gray-600 mb-8 leading-relaxed cms-content"
                                dangerouslySetInnerHTML={{ 
                                    __html: getCmsValue('about', 'content', '<p>Robin Aitken is a passionate artist who has rediscovered his love for painting after a distinguished 25-year career in eCommerce technology.</p>') 
                                }}
                            />
                            <Link href={route('contact')}>
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold">
                                    {getCmsValue('about', 'button_text')}
                                </Button>
                            </Link>
                        </div>
                        <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src={getCmsValue('about', 'image_url', 'https://picsum.photos/600/600?random=robin-art')}
                                alt={getCmsValue('about', 'image_alt', 'Robin\'s Artwork Sample')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {getCmsValue('contact_cta', 'title')}
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        {getCmsValue('contact_cta', 'description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('gallery')}>
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold">
                                {getCmsValue('contact_cta', 'primary_button_text')}
                            </Button>
                        </Link>
                        <Link href={route('contact')}>
                            <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold">
                                {getCmsValue('contact_cta', 'secondary_button_text')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

