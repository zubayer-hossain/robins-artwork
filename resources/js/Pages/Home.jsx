import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import ArtworkCard from '@/Components/ArtworkCard';

export default function Home({ featuredArtworks, stats }) {
    return (
        <PublicLayout>
            <Head title="Home" />
            
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center max-w-4xl mx-auto px-4">
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                            Discover Robin's
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                Unique Art
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-100">
                            Explore Robin's personal collection of original masterpieces and limited edition prints, each piece crafted with passion and artistic vision
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('gallery')}>
                                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                    Explore Gallery
                                </Button>
                            </Link>
                                                         <Link href="#featured">
                                 <Button variant="outline" size="lg" className="border-2 border-white bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-lg">
                                     View Featured
                                 </Button>
                             </Link>
                        </div>
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">
                                {stats?.totalArtworks || 0}+
                            </div>
                            <div className="text-gray-600">Original Artworks</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {stats?.limitedEditions || 0}+
                            </div>
                            <div className="text-gray-600">Limited Editions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-600 mb-2">
                                {stats?.featuredArtists || 0}+
                            </div>
                            <div className="text-gray-600">Art Mediums</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Artworks */}
            <section id="featured" className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Featured Artworks</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover Robin's handpicked selection of exceptional pieces that showcase the diversity and creativity of contemporary art
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
                            View All Artworks
                        </Button>
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Robin's Artwork</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Robin Aitken is a passionate artist who has rediscovered his love for painting after a distinguished 25-year career in eCommerce technology. Now retired and based in the stunning Cairngorms National Park in Scotland, Robin combines his artistic vision with the breathtaking natural beauty of the Scottish Highlands.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Every artwork in this collection represents Robin's unique perspective, combining his technical background with artistic creativity. Whether you're a seasoned collector or just beginning your art journey, Robin's pieces capture the timeless beauty of Scotland's landscapes and are designed to resonate with your soul and transform your space.
                            </p>
                            <Link href={route('contact')}>
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="https://picsum.photos/600/600?random=robin-art"
                                    alt="Robin's Artwork Sample"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Ready to Start Your Collection?</h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Have questions about our artworks or need assistance with your purchase? Our team is here to help you find the perfect piece for your collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('gallery')}>
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold">
                                Browse Gallery
                            </Button>
                        </Link>
                        <Link href={route('contact')}>
                            <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

