import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Users as UsersIcon, Search, Ban, ShieldCheck, ShieldOff, Loader2, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminUsersIndex({ auth, users, currentUserId, filters = {}, flash }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.filter || 'all');
    const [banUser, setBanUser] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [unbanUser, setUnbanUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success && window.toast) window.toast.success(flash.success);
        if (flash?.error && window.toast) window.toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const applyFilters = () => {
        router.get(route('admin.users.index'), { search: search || undefined, filter: filter || 'all' }, { preserveState: false });
    };

    const handleBan = () => {
        if (!banUser) return;
        setProcessing(true);
        router.patch(route('admin.users.ban', banUser.id), { reason: banReason }, {
            preserveScroll: true,
            onSuccess: () => {
                setBanUser(null);
                setBanReason('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleUnban = () => {
        if (!unbanUser) return;
        setProcessing(true);
        router.patch(route('admin.users.unban', unbanUser.id), {}, {
            preserveScroll: true,
            onSuccess: () => setUnbanUser(null),
            onFinish: () => setProcessing(false),
        });
    };

    const canBan = (user) => {
        if (user.id === currentUserId) return false;
        if (user.roles?.includes('admin')) return false;
        return true;
    };

    const canUnban = (user) => {
        if (user.roles?.includes('admin')) return false;
        return user.is_shadow_banned === true;
    };

    const handleDelete = () => {
        if (!deleteUser) return;
        setProcessing(true);
        router.delete(route('admin.users.destroy', deleteUser.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteUser(null),
            onFinish: () => setProcessing(false),
        });
    };

    const canDelete = (user) => user.id !== currentUserId;

    const data = users?.data ?? [];
    const total = users?.total ?? 0;

    return (
        <AdminLayout
            user={auth.user}
            header="User Management"
            headerIcon={<UsersIcon className="w-8 h-8 text-white" />}
            headerDescription="Manage users, ban and unban"
            headerActions={
                <Link href={route('admin.users.create')}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </Link>
            }
        >
            <Head title="User Management - Admin" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Users ({total})</CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="pl-9 w-48 sm:w-56"
                                    />
                                </div>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="all">All users</option>
                                    <option value="banned">Banned</option>
                                    <option value="not_banned">Not banned</option>
                                </select>
                                <Button onClick={applyFilters} size="sm">Apply</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="font-medium">{user.name}</div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{user.email}</TableCell>
                                                <TableCell>
                                                    {user.roles?.map((role) => (
                                                        <Badge
                                                            key={role}
                                                            variant={role === 'admin' ? 'default' : 'secondary'}
                                                            className="mr-1"
                                                        >
                                                            {role}
                                                        </Badge>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_shadow_banned ? (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <Ban className="w-3 h-3" />
                                                            Banned
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>{user.created_at}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Link href={route('admin.users.show', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.users.edit', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        {canUnban(user) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setUnbanUser(user)}
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                                title="Unban"
                                                            >
                                                                <ShieldCheck className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {user.is_shadow_banned !== true && canBan(user) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setBanUser(user);
                                                                    setBanReason('');
                                                                }}
                                                                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                                                title="Ban"
                                                            >
                                                                <ShieldOff className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {canDelete(user) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDeleteUser(user)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No Users Yet</h3>
                                    <p className="mb-4">No users match your filters. Clear filters or add a new user.</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { setSearch(''); setFilter('all'); applyFilters(); }}>
                                            Clear filters
                                        </Button>
                                        <Link href={route('admin.users.create')}>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add User
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination - same as Artworks */}
                        {data.length > 0 && users?.links && users.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 rounded-md text-sm ${
                                                link.active
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Ban dialog with optional reason */}
            <Dialog open={!!banUser} onOpenChange={(open) => !open && setBanUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban user</DialogTitle>
                        <DialogDescription>
                            {banUser && (
                                <>User <strong>{banUser.name}</strong> ({banUser.email}) will be banned. They will not be able to log in and will see a message to contact you via the contact page. Optional reason (stored for your records):</>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    {banUser && (
                        <div className="space-y-2 py-2">
                            <Label htmlFor="ban-reason">Reason (optional)</Label>
                            <Input
                                id="ban-reason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="e.g. Spam, abuse"
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBanUser(null)} disabled={processing}>Cancel</Button>
                        <Button onClick={handleBan} disabled={processing} className="bg-amber-600 hover:bg-amber-700">
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
                            Ban
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unban confirmation */}
            <ConfirmDialog
                isOpen={!!unbanUser}
                onClose={() => !processing && setUnbanUser(null)}
                onConfirm={handleUnban}
                title="Unban user"
                message={unbanUser ? `Unban ${unbanUser.name} (${unbanUser.email})? They will be able to log in again.` : ''}
                confirmText="Unban"
                cancelText="Cancel"
                isLoading={processing}
                variant="warning"
            />

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={!!deleteUser}
                onClose={() => !processing && setDeleteUser(null)}
                onConfirm={handleDelete}
                title="Delete user"
                message={deleteUser ? `Delete ${deleteUser.name} (${deleteUser.email})? This cannot be undone. Users with orders cannot be deleted.` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={processing}
                variant="danger"
            />
        </AdminLayout>
    );
}
