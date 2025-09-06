import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
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
    FileText
} from 'lucide-react';

export default function AdminArtworkShow({ auth, artwork, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                                                    {artwork.price ? `$${artwork.price.toLocaleString()}` : 'Not for sale'}
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

                        {artwork.story && artwork.story.content && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        Artist's Story
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {artwork.story.content}
                                        </p>
                                    </div>
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Artwork</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>"{artwork.title}"</strong>? 
                                This will permanently remove the artwork and all associated data.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Artwork
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
