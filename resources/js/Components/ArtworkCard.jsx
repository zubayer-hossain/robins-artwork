import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArtworkCardActions } from '@/Components/ArtworkActions';
import { Link } from '@inertiajs/react';

export default function ArtworkCard({ artwork, className = "" }) {
    return (
        <Card className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg ${className}`}>
            {/* Image Section */}
            {artwork.primaryImage && (
                <div className="aspect-square overflow-hidden">
                    <img
                        src={artwork.primaryImage.medium}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
            )}
            
            {/* Content Section */}
            <CardContent className="p-4">
                {/* Header with title, details and price */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <Link 
                            href={route('artwork.show', artwork.slug)} 
                            className="hover:opacity-80 transition-opacity"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight hover:text-purple-600 transition-colors cursor-pointer">
                                {artwork.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">{artwork.medium}</span>
                            {artwork.year && <span>• {artwork.year}</span>}
                        </div>
                    </div>
                    {artwork.price && (
                        <div className="text-right flex-shrink-0 ml-3">
                            <span className="text-xl font-bold text-green-600">
                                ${artwork.price.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags and Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                        {artwork.tags && artwork.tags.length > 0 ? (
                            // Show actual artwork tags, but filter out duplicates with medium/year
                            artwork.tags
                                .filter(tag => tag !== artwork.medium && tag !== artwork.year?.toString())
                                .slice(0, 2)
                                .map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border-0">
                                        {tag}
                                    </Badge>
                                ))
                        ) : null}
                        
                        {/* Always show medium and year as base tags if no custom tags exist */}
                        {(!artwork.tags || artwork.tags.length === 0) && (
                            <>
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border-0">
                                    {artwork.medium}
                                </Badge>
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border-0">
                                    {artwork.year}
                                </Badge>
                            </>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-shrink-0">
                        <ArtworkCardActions 
                            artwork={artwork}
                            isFavorite={artwork.isFavorite}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
