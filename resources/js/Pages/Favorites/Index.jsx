import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import ArtworkCard from '@/Components/ArtworkCard';
import { Eye, Heart } from 'lucide-react';

export default function Favorites({ favorites }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Favorites" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    My Favorites
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Your collection of loved artworks and limited editions
                                </p>
                            </div>
                            <Link href={route('gallery')}>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Browse Gallery
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {favorites && favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((favorite) => {
                                // Transform favorite data to match ArtworkCard expectations
                                const artworkData = {
                                    ...favorite.artwork,
                                    isFavorite: true, // Since this is the favorites page
                                    // Use tags from backend, fallback to medium/year if no tags exist
                                    tags: favorite.artwork.tags && favorite.artwork.tags.length > 0 
                                        ? favorite.artwork.tags 
                                        : [favorite.artwork.medium, favorite.artwork.year?.toString()].filter(Boolean)
                                };
                                
                                return (
                                    <div key={favorite.id} className="relative group">                                        
                                        {/* Added Date Badge */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-600 font-medium shadow-sm">
                                                {(() => {
                                                    const addedDate = new Date(favorite.added_at);
                                                    const now = new Date();
                                                    const diffTime = Math.abs(now - addedDate);
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    
                                                    if (diffDays === 1) {
                                                        return 'Added today';
                                                    } else if (diffDays === 2) {
                                                        return 'Added yesterday';
                                                    } else if (diffDays <= 7) {
                                                        return `Added ${diffDays - 1} days ago`;
                                                    } else if (diffDays <= 30) {
                                                        const weeks = Math.ceil(diffDays / 7);
                                                        return `Added ${weeks} week${weeks > 1 ? 's' : ''} ago`;
                                                    } else {
                                                        return `Added ${addedDate.toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}`;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                        
                                        <ArtworkCard artwork={artworkData} showFavoriteButton={true} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-12 h-12 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                No favorites yet
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Start building your collection by browsing our gallery and adding artworks you love to your favorites.
                            </p>
                            <Link href={route('gallery')}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                                    <Eye className="w-5 h-5 mr-2" />
                                    Explore Gallery
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
