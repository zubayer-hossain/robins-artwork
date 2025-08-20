import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

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

    return (
        <PublicLayout>
            <Head title={artwork.title} />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-lg border">
                            <img
                                src={artwork.images[selectedImage]?.xl || artwork.images[selectedImage]?.medium}
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {artwork.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {artwork.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                                            selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={image.thumb}
                                            alt={`${artwork.title} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Artwork Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <span>{artwork.medium}</span>
                                {artwork.year && <span>â€¢ {artwork.year}</span>}
                                {artwork.size_text && <span>â€¢ {artwork.size_text}</span>}
                            </div>
                            
                            <div className="flex gap-2 mb-4">
                                {artwork.tags?.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {artwork.price && (
                                <div className="text-3xl font-bold text-green-600 mb-4">
                                    ${artwork.price.toLocaleString()}
                                </div>
                            )}
                        </div>

                        {/* Purchase Options */}
                        {canPurchase && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Purchase Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {artwork.price && (
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <div className="font-medium">Original Artwork</div>
                                                <div className="text-sm text-gray-600">
                                                    {artwork.is_original ? 'Original piece' : 'Print'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold">${artwork.price.toLocaleString()}</div>
                                                <Button 
                                                    onClick={handlePurchase}
                                                    disabled={selectedEdition !== null}
                                                >
                                                    Buy Original
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {artwork.editions && artwork.editions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium">Available Editions</h4>
                                            {artwork.editions.map((edition) => (
                                                <div
                                                    key={edition.id}
                                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedEdition?.id === edition.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setSelectedEdition(edition)}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {edition.is_limited ? 'Limited Edition' : 'Open Edition'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            SKU: {edition.sku}
                                                            {edition.is_limited && ` â€¢ ${edition.stock} available`}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold">${edition.price.toLocaleString()}</div>
                                                        <Button 
                                                            onClick={handlePurchase}
                                                            disabled={selectedEdition?.id !== edition.id}
                                                        >
                                                            Buy Edition
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Story */}
                        {artwork.story && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Artist's Story</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        {artwork.story.content}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Medium:</span> {artwork.medium}
                                    </div>
                                    {artwork.year && (
                                        <div>
                                            <span className="font-medium">Year:</span> {artwork.year}
                                        </div>
                                    )}
                                    {artwork.size_text && (
                                        <div>
                                            <span className="font-medium">Dimensions:</span> {artwork.size_text}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-medium">Type:</span> {artwork.is_original ? 'Original' : 'Print'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

