import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import ArtworkCard from '@/Components/ArtworkCard';
import { Eye, Clock } from 'lucide-react';

export default function RecentViews({ recentViews }) {
    return (
        <AuthenticatedLayout>
            <Head title="Recent Views" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Recent Views
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Track your browsing history and rediscover artworks you've viewed
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
                                        {recentViews && recentViews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentViews.map((view, index) => {
                                // Transform view data to match ArtworkCard expectations
                                const artworkData = {
                                    id: view.id,
                                    title: view.title,
                                    slug: view.slug,
                                    price: view.price,
                                    medium: view.medium,
                                    year: view.year,
                                    primaryImage: view.primaryImage,
                                    isFavorite: view.isFavorite,
                                    // Use tags from backend, fallback to medium/year if no tags exist
                                    tags: view.tags && view.tags.length > 0 
                                        ? view.tags 
                                        : [view.medium, view.year?.toString()].filter(Boolean)
                                };
                                
                                return (
                                    <div key={view.id} className="relative group">
                        
                                        {/* Viewed Time Badge - same position as favorites */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-600 font-medium shadow-sm">
                                                {(() => {
                                                    const viewedDate = new Date(view.viewed_at);
                                                    const now = new Date();
                                                    const diffTime = Math.abs(now - viewedDate);
                                                    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
                                                    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    
                                                    if (diffMinutes < 60) {
                                                        return `Viewed ${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
                                                    } else if (diffHours < 24) {
                                                        return `Viewed ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                                                    } else if (diffDays === 1) {
                                                        return 'Viewed yesterday';
                                                    } else if (diffDays <= 7) {
                                                        return `Viewed ${diffDays} days ago`;
                                                    } else {
                                                        return `Viewed ${viewedDate.toLocaleDateString('en-US', {
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
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Eye className="w-12 h-12 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                No recent views yet
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Start browsing our gallery to build your viewing history. We'll track the artworks you explore to help you rediscover them later.
                            </p>
                            <Link href={route('gallery')}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                                    <Eye className="w-5 h-5 mr-2" />
                                    Start Browsing
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
