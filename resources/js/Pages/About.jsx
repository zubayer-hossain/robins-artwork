import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function About({ cmsSettings = {} }) {
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

    return (
        <PublicLayout>
            <Head title="About" />
            
            {/* Hero Section - Only show if enabled in CMS */}
            {getCmsBoolean('hero', 'show_hero') && (
                <section className="relative py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                {getCmsValue('hero', 'title', 'About Robin')}
                            </h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                {getCmsValue('hero', 'description', 'Discover the artist behind the canvas and the passion that drives every brushstroke')}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Artist Story - Only show if enabled in CMS */}
            {getCmsBoolean('story', 'show_story') && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                    {getCmsValue('story', 'title', 'The Artist\'s Journey')}
                                </h2>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {getCmsValue('story', 'paragraph1', 'Robin Aitken\'s artistic journey is a beautiful story of rediscovery and passion. After a distinguished 25-year career in eCommerce technology, working with major retailers and leading innovative search solutions, Robin has embraced retirement as an opportunity to return to his artistic roots.')}
                                </p>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {getCmsValue('story', 'paragraph2', 'Now based in the stunning Cairngorms National Park in Cromdale, Scotland, Robin combines his love for painting with running a charming Bed & Breakfast. The breathtaking Scottish landscapes and serene Highland atmosphere provide endless inspiration for his artwork.')}
                                </p>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {getCmsValue('story', 'paragraph3', 'Robin\'s technical background and "can do" attitude from his professional life translates beautifully into his artistic practice, where he approaches each canvas with the same dedication and problem-solving mindset that made him successful in eCommerce solutions.')}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={getCmsValue('story', 'image_url', 'https://picsum.photos/600/600?random=robin-portrait')}
                                        alt={getCmsValue('story', 'image_alt', 'Robin\'s Studio in the Cairngorms')}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Artistic Philosophy - Only show if enabled in CMS */}
            {getCmsBoolean('philosophy', 'show_philosophy') && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {getCmsValue('philosophy', 'title', 'Artistic Philosophy')}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                {getCmsValue('philosophy', 'description', 'Every artwork tells a story, every color evokes an emotion, and every brushstroke carries intention')}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎨</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                    {getCmsValue('philosophy', 'card1_title', 'Emotional Connection')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {getCmsValue('philosophy', 'card1_description', 'Art should move beyond the visual and create an emotional response that resonates with the viewer\'s own experiences and feelings.')}
                                </p>
                            </div>
                            
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                    {getCmsValue('philosophy', 'card2_title', 'Authentic Expression')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {getCmsValue('philosophy', 'card2_description', 'Every piece is created with genuine passion and authenticity, reflecting Robin\'s true artistic voice and personal experiences.')}
                                </p>
                            </div>
                            
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                    {getCmsValue('philosophy', 'card3_title', 'Timeless Beauty')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {getCmsValue('philosophy', 'card3_description', 'Creating art that transcends trends and speaks to universal human experiences, ensuring each piece remains relevant and meaningful.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Process & Technique - Only show if enabled in CMS */}
            {getCmsBoolean('process', 'show_process') && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative order-2 lg:order-1">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={getCmsValue('process', 'image_url', 'https://picsum.photos/600/600?random=robin-process')}
                                        alt={getCmsValue('process', 'image_alt', 'Artistic Process')}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-2xl"></div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                    {getCmsValue('process', 'title', 'Process & Technique')}
                                </h2>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {getCmsValue('process', 'paragraph1', 'Robin\'s creative process is uniquely influenced by his technical background in eCommerce solutions. He approaches each artwork with the same systematic thinking and attention to detail that made him successful in product management and sales.')}
                                </p>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {getCmsValue('process', 'paragraph2', 'Living in the Cairngorms National Park provides Robin with endless natural inspiration - from the dramatic mountain landscapes to the changing seasons and wildlife. His paintings capture the essence of Scotland\'s natural beauty, combining traditional techniques with contemporary perspectives.')}
                                </p>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {getCmsValue('process', 'paragraph3', 'Robin\'s "can do" attitude from his professional life translates into his artistic practice, where he\'s not afraid to experiment with new techniques and push creative boundaries. Each piece reflects his deep connection to the Scottish Highlands and his passion for capturing its timeless beauty.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action - Only show if enabled in CMS */}
            {getCmsBoolean('cta', 'show_cta') && (
                <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            {getCmsValue('cta', 'title', 'Ready to Experience Robin\'s Art?')}
                        </h2>
                        <p className="text-xl mb-10 leading-relaxed">
                            {getCmsValue('cta', 'description', 'Explore the gallery and discover pieces that speak to your soul, or get in touch to learn more about Robin\'s artistic journey.')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('gallery')}>
                                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                    {getCmsValue('cta', 'primary_button_text', 'Explore Gallery')}
                                </Button>
                            </Link>
                            <Link href={route('contact')}>
                                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                    {getCmsValue('cta', 'secondary_button_text', 'Get in Touch')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
