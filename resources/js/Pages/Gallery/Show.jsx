import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';

export default function GalleryShow({ artwork }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedEdition, setSelectedEdition] = useState(null);
    




    const handlePurchase = () => {
        if (selectedEdition) {
            router.post(route('checkout.create'), { edition_id: selectedEdition.id });
        } else if (artwork.price) {
            router.post(route('checkout.create'), { artwork_id: artwork.id });
        }
    };

    const canPurchase = artwork.price || (artwork.editions && artwork.editions.length > 0);
    
    // Ensure images array exists and has at least one image
    const images = Array.isArray(artwork.images) && artwork.images.length > 0 ? artwork.images : [
        {
            id: 0,
            is_primary: true,
            thumb: `https://picsum.photos/400/400?random=${artwork.id}`,
            medium: `https://picsum.photos/1000/1000?random=${artwork.id}`,
            xl: `https://picsum.photos/2000/2000?random=${artwork.id}`,
            original: `https://picsum.photos/2000/2000?random=${artwork.id}`,
        }
    ];
    const currentImage = images[selectedImage] || images[0] || null;

    // If no artwork data, show loading or error
    if (!artwork) {
        return (
            <PublicLayout>
                <Head title="Artwork Not Found" />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Artwork Not Found</h1>
                    <p className="text-gray-600 mb-8">The artwork you're looking for doesn't exist or has been removed.</p>
                    <a href={route('gallery')} className="text-purple-600 hover:text-purple-700 font-medium">
                        ← Back to Gallery
                    </a>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={artwork.title} />
            
            {/* Hero Section with Breadcrumb */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href={route('home')} className="hover:text-purple-600 transition-colors">
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <Link href={route('gallery')} className="hover:text-purple-600 transition-colors">
                            Gallery
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-900 font-medium">{artwork.title}</span>
                    </nav>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Enhanced Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative group">
                            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200">
                                {currentImage ? (
                                    <img
                                        src={currentImage.xl || currentImage.medium || currentImage.thumb}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                
                                {/* Fallback when no image or image fails to load */}
                                <div className={`w-full h-full flex items-center justify-center ${currentImage ? 'hidden' : 'flex'}`}>
                                    <div className="text-center p-8">
                                        <div className="text-8xl mb-6 opacity-60">🎨</div>
                                        <div className="text-2xl font-bold text-gray-700 mb-2">{artwork.title}</div>
                                        <div className="text-gray-500">{artwork.medium} • {artwork.year}</div>
                                    </div>
                                </div>
                                
                                {/* Image Controls Overlay */}
                                {images.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                                            className="w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                                            className="w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                
                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Gallery</h3>
                                    <span className="text-sm text-gray-500">({images.length} images)</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`group aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                                selectedImage === index 
                                                    ? 'border-purple-500 shadow-lg scale-105' 
                                                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                                            }`}
                                        >
                                            <img
                                                src={image.thumb}
                                                alt={`${artwork.title} - Image ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback for thumbnails */}
                                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${image.thumb ? 'hidden' : 'flex'}`}>
                                                <div className="text-center p-2">
                                                    <div className="text-2xl mb-1">🎨</div>
                                                    <div className="text-xs text-gray-500 font-medium">{index + 1}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Artwork Details */}
                    <div className="space-y-6">
                        {/* Title and Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">{artwork.title}</h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    A stunning {artwork.medium.toLowerCase()} artwork that captures the essence of {artwork.title.toLowerCase()}, 
                                    created with meticulous attention to detail and artistic passion.
                                </p>
                            </div>
                            
                            {/* Tags */}
                            {artwork.tags && artwork.tags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {artwork.tags.map((tag) => (
                                        <Badge 
                                            key={tag} 
                                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-colors"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Price Display */}
                            {artwork.price && (
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-green-700 mb-1">Starting Price</div>
                                            <div className="text-4xl font-bold text-green-600">
                                                ${artwork.price.toLocaleString()}
                                                <span className="text-lg font-normal text-green-500 ml-2">USD</span>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Purchase Options */}
                        {canPurchase && (
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20 backdrop-blur-sm">
                                <CardHeader className="pb-6 border-b border-purple-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a1 1 0 001 1h9M16 8v8m0 0v1a1 1 0 001 1h1M9 21v-1a1 1 0 011-1h1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-gray-800">
                                                Purchase Options
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-1">Choose your preferred artwork format</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {artwork.price && (
                                        <div className="group relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="p-4 sm:p-6">
                                                {/* Mobile-first responsive layout */}
                                                <div className="space-y-4">
                                                    {/* Header section - always full width */}
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Original Artwork</h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs w-fit">
                                                                    {artwork.is_original ? 'Original Piece' : 'High-Quality Print'}
                                                                </Badge>
                                                                <span className="text-gray-500 text-sm hidden sm:inline">• One of a kind</span>
                                                                <span className="text-gray-500 text-sm sm:hidden">One of a kind</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Price and Button section - responsive layout */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-purple-100">
                                                        <div className="text-center sm:text-left">
                                                            <div className="text-2xl sm:text-3xl font-bold text-green-600">
                                                                ${artwork.price.toLocaleString()}
                                                            </div>
                                                            <div className="text-sm text-gray-500">USD</div>
                                                        </div>
                                                        <Button 
                                                            onClick={handlePurchase}
                                                            disabled={selectedEdition !== null}
                                                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a1 1 0 001 1h9M16 8v8m0 0v1a1 1 0 001 1h1M9 21v-1a1 1 0 011-1h1" />
                                                            </svg>
                                                            Buy Original
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {artwork.editions && artwork.editions.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-800">Available Editions</h4>
                                                    <p className="text-sm text-gray-600">Choose from multiple print options</p>
                                                </div>
                                            </div>
                                            
                                            {artwork.editions.map((edition) => (
                                                <div
                                                    key={edition.id}
                                                    className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                        selectedEdition?.id === edition.id
                                                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                                                    }`}
                                                    onClick={() => setSelectedEdition(edition)}
                                                >
                                                    <div className="p-5">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                                        edition.is_limited 
                                                                            ? 'bg-orange-500' 
                                                                            : 'bg-green-500'
                                                                    }`}>
                                                                        <span className="text-white text-xs font-bold">
                                                                            {edition.is_limited ? 'L' : 'O'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-800">
                                                                            {edition.is_limited ? 'Limited Edition' : 'Open Edition'}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                                                SKU: {edition.sku}
                                                                            </span>
                                                                            {edition.is_limited && (
                                                                                <>
                                                                                    <span className="text-gray-400">•</span>
                                                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                                                        {edition.stock} available
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Edition features */}
                                                                <div className="grid grid-cols-2 gap-2 mt-3">
                                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        <span>High quality print</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        <span>Archival materials</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="text-right ml-6">
                                                                <div className="mb-2">
                                                                    <div className="text-2xl font-bold text-blue-600">
                                                                        ${edition.price.toLocaleString()}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">USD</div>
                                                                </div>
                                                                <Button 
                                                                    onClick={handlePurchase}
                                                                    disabled={selectedEdition?.id !== edition.id}
                                                                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                                                                        selectedEdition?.id === edition.id
                                                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                                >
                                                                    {selectedEdition?.id === edition.id ? 'Selected' : 'Select'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* What's Included Section */}
                                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">What's Included</h4>
                                                <p className="text-sm text-green-700">Everything you need for a perfect experience</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">Certificate of Authenticity</div>
                                                    <div className="text-xs text-gray-600">Signed and verified</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">Professional Packaging</div>
                                                    <div className="text-xs text-gray-600">Museum-quality protection</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">Worldwide Shipping</div>
                                                    <div className="text-xs text-gray-600">Fully insured delivery</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">30-Day Returns</div>
                                                    <div className="text-xs text-gray-600">Satisfaction guaranteed</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Purchase Summary */}
                                    {(artwork.price || selectedEdition) && (
                                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm">✓</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">Ready to Purchase</div>
                                                        <div className="text-sm text-gray-600">
                                                            {selectedEdition 
                                                                ? `Selected: ${selectedEdition.is_limited ? 'Limited' : 'Open'} Edition`
                                                                : 'Original artwork selected'
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        ${(selectedEdition?.price || artwork.price).toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">Total price</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}


                    </div>
                </div>
                
                {/* Artist's Story and Artwork Details in a Row */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Enhanced Story Section */}
                    {artwork.story && (
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                    <span className="mr-3">📖</span>
                                    Artist's Story
                                </CardTitle>
                                <p className="text-gray-600 text-sm">The inspiration behind this masterpiece</p>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                                    <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                        <p className="text-lg font-medium text-gray-800 mb-4">
                                            {artwork.story.content}
                                        </p>
                                        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-3 text-purple-700">
                                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✨</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold">About the Artist</div>
                                                    <div className="text-sm text-purple-600">Robin creates artwork inspired by the Scottish Highlands</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Enhanced Additional Information */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                <span className="mr-3">ℹ️</span>
                                Artwork Details
                            </CardTitle>
                            <p className="text-gray-600 text-sm">Technical specifications and information</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 font-medium">Medium</div>
                                        <div className="text-lg font-semibold text-gray-800">{artwork.medium}</div>
                                    </div>
                                </div>
                                
                                {artwork.year && (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 font-medium">Year Created</div>
                                            <div className="text-lg font-semibold text-gray-800">{artwork.year}</div>
                                        </div>
                                    </div>
                                )}
                                
                                {artwork.size_text && (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 font-medium">Dimensions</div>
                                            <div className="text-lg font-semibold text-gray-800">{artwork.size_text}</div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 font-medium">Type</div>
                                        <div className="text-lg font-semibold text-gray-800">
                                            {artwork.is_original ? 'Original Artwork' : 'High-Quality Print'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quality Guarantee */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Quality Guarantee</h4>
                                        <p className="text-sm text-green-700">Authenticity and satisfaction assured</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Call to Action Section */}
                <div className="mt-20 py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl border border-purple-100 shadow-lg">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        {/* Decorative Elements */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-3xl">🎨</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main Content */}
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                            Discover More Artworks
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Explore Robin's complete collection of stunning artworks inspired by the Scottish Highlands. 
                            Each piece tells a unique story and brings natural beauty into your space.
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href={route('gallery')}>
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <span className="mr-2">🖼️</span>
                                    Browse Gallery
                                </Button>
                            </Link>
                            <Link href={route('contact')}>
                                <Button 
                                    variant="outline" 
                                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                                >
                                    <span className="mr-2">💬</span>
                                    Commission Artwork
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Trust Indicators */}
                        <div className="pt-8 border-t border-purple-200">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Worldwide shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>30-day returns</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Authenticity guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

