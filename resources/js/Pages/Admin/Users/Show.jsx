import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import ConfirmDialog from '@/Components/ConfirmDialog';
import {
    ArrowLeft,
    Users as UsersIcon,
    Mail,
    Calendar,
    Ban,
    ShieldCheck,
    ShieldOff,
    ShoppingBag,
    MapPin,
    Edit,
    Trash2,
    Info,
    CheckCircle,
    XCircle,
} from 'lucide-react';

export default function AdminUsersShow({ auth, user, currentUserId, flash }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success && window.toast) window.toast.success(flash.success);
        if (flash?.error && window.toast) window.toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const isSelf = user.id === currentUserId;
    const isAdmin = user.roles?.includes('admin');
    const canEdit = true;
    const canDelete = !isSelf && (user.orders_count ?? 0) === 0;
    const canBan = !isSelf && !isAdmin;
    const canUnban = !isAdmin && user.is_shadow_banned;

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                if (window.toast) window.toast.success('User deleted successfully!', 'Success');
                window.location.href = route('admin.users.index');
            },
            onError: () => setProcessing(false),
            onFinish: () => {
                setShowDeleteDialog(false);
                setProcessing(false);
            },
        });
    };

    const handleBan = () => {
        setProcessing(true);
        router.patch(route('admin.users.ban', user.id), { reason: '' }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleUnban = () => {
        setProcessing(true);
        router.patch(route('admin.users.unban', user.id), {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={user.name}
            headerIcon={<UsersIcon className="w-8 h-8 text-white" />}
            headerDescription={user.email}
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href={route('admin.users.edit', user.id)}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                        </Button>
                    </Link>
                    <Link href={route('admin.users.index')}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Users
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`${user.name} - User - Admin`} />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-600" />
                                        Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                                <p className="font-semibold text-gray-900">{user.email}</p>
                                                {user.email_verified_at && (
                                                    <p className="text-xs text-green-600 mt-1">Verified</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <UsersIcon className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {user.roles?.map((r) => (
                                                        <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'}>
                                                            {r}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</label>
                                                <p className="font-semibold text-gray-900">{user.created_at}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-lg">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last updated</label>
                                                <p className="font-semibold text-gray-900">{user.updated_at}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        {user.is_shadow_banned ? (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        )}
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {user.is_shadow_banned ? (
                                        <div className="space-y-3">
                                            <Badge variant="destructive" className="gap-1">
                                                <Ban className="w-3 h-3" />
                                                Banned
                                            </Badge>
                                            <p className="text-sm text-gray-600">User cannot log in. They will see a message to contact you via the contact page.</p>
                                            {user.shadow_banned_at && (
                                                <p className="text-sm text-gray-600">Since {user.shadow_banned_at}</p>
                                            )}
                                            {user.shadow_ban_reason && (
                                                <p className="text-sm text-gray-600">Reason: {user.shadow_ban_reason}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Active
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-purple-900">
                                        <ShoppingBag className="w-5 h-5" />
                                        Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <ShoppingBag className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-gray-900">{user.orders_count ?? 0}</p>
                                                <p className="text-sm text-gray-500">Orders</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-gray-900">{user.addresses_count ?? 0}</p>
                                                <p className="text-sm text-gray-500">Addresses</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Edit className="w-5 h-5" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Link href={route('admin.users.edit', user.id)}>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit User
                                        </Button>
                                    </Link>
                                    {canBan && !user.is_shadow_banned && (
                                        <Button
                                            variant="outline"
                                            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                                            onClick={handleBan}
                                            disabled={processing}
                                        >
                                            <ShieldOff className="w-4 h-4 mr-2" />
                                            Ban User
                                        </Button>
                                    )}
                                    {canUnban && (
                                        <Button
                                            variant="outline"
                                            className="w-full border-green-300 text-green-700 hover:bg-green-50"
                                            onClick={handleUnban}
                                            disabled={processing}
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Unban User
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                            onClick={() => setShowDeleteDialog(true)}
                                            disabled={processing}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete User
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => !processing && setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${user.name}" (${user.email})? This cannot be undone. Related data (addresses, cart, favorites) will be removed. Users with orders cannot be deleted.`}
                confirmText="Delete User"
                cancelText="Cancel"
                isLoading={processing}
                variant="danger"
            />
        </AdminLayout>
    );
}
