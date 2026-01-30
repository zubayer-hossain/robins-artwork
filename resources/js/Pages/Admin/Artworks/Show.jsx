import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Eye,
    Calendar,
    Palette,
    DollarSign,
    Tag,
    Info,
    CheckCircle,
    Clock,
    XCircle,
    FileText,
    Image as ImageIcon,
    Star,
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    Package,
    Plus
} from 'lucide-react';

export default function AdminArtworkShow({ auth, artwork, flash }) {
    const { currency } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Get artwork images
    const images = artwork.images || [];

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setLightboxOpen(false);
            } else if (e.key === 'ArrowLeft') {
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            } else if (e.key === 'ArrowRight') {
                setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, images.length]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success && window.toast) {
            window.toast.success(flash.success, 'Success');
        }
        if (flash?.error && window.toast) {
            window.toast.error(flash.error, 'Error');
        }
    }, [flash]);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.artworks.destroy', artwork.id), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Artwork deleted successfully!', 'Success');
                }
                // Redirect to artworks list
                window.location.href = route('admin.artworks.index');
            },
            onError: () => {
                setIsDeleting(false);
                if (window.toast) {
                    window.toast.error('Failed to delete artwork. Please try again.', 'Error');
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        const config = {
            published: { 
                variant: 'default', 
                icon: <CheckCircle className="w-3 h-3" />,
                className: 'bg-green-100 text-green-800 border-green-200'
            },
            draft: { 
                variant: 'secondary', 
                icon: <Clock className="w-3 h-3" />,
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
            },
            archived: { 
                variant: 'destructive', 
                icon: <XCircle className="w-3 h-3" />,
                className: 'bg-gray-100 text-gray-800 border-gray-200'
            },
        };
        const statusConfig = config[status] || config.draft;
        return (
            <Badge className={`${statusConfig.className} flex items-center gap-1 text-xs px-2 py-1 font-medium`}>
                {statusConfig.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header={artwork.title}
            headerIcon={<Eye className="w-8 h-8 text-white" />}
            headerDescription="View artwork details"
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href={route('admin.artworks.edit', artwork.id)}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Artwork
                        </Button>
                    </Link>
                    <Link href={route('admin.artworks.index')}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Artworks
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`${artwork.title} - Artwork Details`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    Artwork Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Palette className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
                                                <p className="font-semibold text-gray-900">{artwork.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <Palette className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Medium</label>
                                                <p className="font-semibold text-gray-900">{artwork.medium}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Year</label>
                                                <p className="font-semibold text-gray-900">{artwork.year || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <DollarSign className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</label>
                                                <p className="font-semibold text-gray-900">
                                                    {artwork.price ? `${currency?.symbol || '$'}${artwork.price.toLocaleString()}` : 'Not for sale'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</label>
                                                <p className="font-semibold text-gray-900">{artwork.size_text || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Eye className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL Slug</label>
                                                <p className="font-mono text-sm text-gray-900">{artwork.slug}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Artwork Images */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-purple-900">
                                    <ImageIcon className="w-5 h-5" />
                                    Artwork Images
                                    {images.length > 0 && (
                                        <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                                            {images.length}
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {images.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {images.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                                    image.is_primary 
                                                        ? 'border-yellow-400 ring-2 ring-yellow-200' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => {
                                                    setLightboxIndex(index);
                                                    setLightboxOpen(true);
                                                }}
                                            >
                                                <img
                                                    src={image.thumb || image.medium || image.xl}
                                                    alt={`${artwork.title} - Image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                
                                                {/* Primary Badge */}
                                                {image.is_primary && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-yellow-400 text-yellow-900 text-xs gap-1">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Primary
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* View overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="bg-white/90 rounded-lg px-3 py-2 flex items-center gap-2">
                                                        <ZoomIn className="w-4 h-4 text-gray-700" />
                                                        <span className="text-sm font-medium text-gray-700">View</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No images uploaded</p>
                                        <p className="text-sm text-gray-400 mt-1">Add images from the edit page</p>
                                        <Link href={route('admin.artworks.edit', artwork.id)} className="mt-4 inline-block">
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Add Images
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {artwork.story && artwork.story.content && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        Artist's Story
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div 
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:mt-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:mt-3 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-purple-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-3 [&_a]:text-purple-600 [&_a]:underline [&_strong]:font-semibold"
                                        dangerouslySetInnerHTML={{ __html: artwork.story.content }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {artwork.tags && artwork.tags.length > 0 && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-purple-600" />
                                        Tags
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {artwork.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-sm">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Editions Section */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-orange-900">
                                        <Package className="w-5 h-5" />
                                        Print Editions
                                        {artwork.editions && artwork.editions.length > 0 && (
                                            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                                                {artwork.editions.length}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <Link href={route('admin.editions.create') + `?artwork_id=${artwork.id}`}>
                                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Edition
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {artwork.editions && artwork.editions.length > 0 ? (
                                    <div className="space-y-3">
                                        {artwork.editions.map((edition) => (
                                            <div 
                                                key={edition.id}
                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        edition.is_limited 
                                                            ? 'bg-orange-100 text-orange-600' 
                                                            : 'bg-green-100 text-green-600'
                                                    }`}>
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-medium text-gray-900">{edition.sku}</span>
                                                            {edition.is_limited ? (
                                                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                                                    Limited ({edition.edition_total})
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                                                    Open Edition
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3" />
                                                                {currency?.symbol || '$'}{Number(edition.price).toLocaleString()}
                                                            </span>
                                                            <span>•</span>
                                                            <span className={edition.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                                {edition.stock} in stock
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('admin.editions.show', edition.id)}>
                                                        <Button variant="outline" size="sm" title="View Edition">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.editions.edit', edition.id)}>
                                                        <Button variant="outline" size="sm" title="Edit Edition">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-8 h-8 text-orange-400" />
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-700 mb-2">No Editions Yet</h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Create print editions to sell reproductions of this artwork.
                                        </p>
                                        <Link href={route('admin.editions.create') + `?artwork_id=${artwork.id}`}>
                                            <Button className="bg-orange-600 hover:bg-orange-700">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create First Edition
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <Info className="w-5 h-5" />
                                    Status & Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">Status</span>
                                    {getStatusBadge(artwork.status)}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">Original Artwork</span>
                                        <Badge variant={artwork.is_original ? "default" : "secondary"}>
                                            {artwork.is_original ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">Prints Available</span>
                                        <Badge variant={artwork.is_print_available ? "default" : "secondary"}>
                                            {artwork.is_print_available ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-green-900">
                                    <Calendar className="w-5 h-5" />
                                    Timestamps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(artwork.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(artwork.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Edit className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <Link href={route('admin.artworks.edit', artwork.id)}>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Artwork
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Artwork
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </div>
            </div>

            {/* Image Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                                }}
                                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div 
                        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightboxIndex]?.xl || images[lightboxIndex]?.medium || images[lightboxIndex]?.thumb}
                            alt={`${artwork.title} - Image ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Image Counter & Info */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <div className="bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                        {images[lightboxIndex]?.is_primary && (
                            <Badge className="bg-yellow-400 text-yellow-900">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Primary
                            </Badge>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl max-w-[80vw] overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    type="button"
                                    key={image.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(index);
                                    }}
                                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                        index === lightboxIndex 
                                            ? 'border-white scale-110' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={image.thumb}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Artwork"
                message={`Are you sure you want to delete "${artwork.title}"? This will permanently remove the artwork and all associated data.`}
                confirmText="Delete Artwork"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}
