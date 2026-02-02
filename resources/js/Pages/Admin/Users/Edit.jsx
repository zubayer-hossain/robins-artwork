import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ArrowLeft, Save, Users as UsersIcon, Eye } from 'lucide-react';

export default function AdminUsersEdit({ auth, user, roles = [], flash }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'customer',
    });

    useEffect(() => {
        if (flash?.success && window.toast) window.toast.success(flash.success);
        if (flash?.error && window.toast) window.toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id), {
            onSuccess: () => {},
            onError: () => {
                if (window.toast) window.toast.error('Please fix the form errors.');
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={`Edit ${user.name}`}
            headerIcon={<UsersIcon className="w-8 h-8 text-white" />}
            headerDescription="Update name, email, role. Leave password blank to keep current."
            headerActions={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href={route('admin.users.show', user.id)}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <Eye className="w-4 h-4 mr-2" />
                            View User
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
            <Head title={`Edit ${user.name} - Admin`} />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader className="bg-gray-50/50 border-b">
                                        <CardTitle className="flex items-center gap-2">
                                            <UsersIcon className="w-5 h-5 text-purple-600" />
                                            Edit User
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">Update name, email, role. Leave password blank to keep current.</p>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name">Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Full name"
                                                    required
                                                />
                                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="user@example.com"
                                                    required
                                                />
                                                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="password">New password (optional)</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Leave blank to keep current"
                                                />
                                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="password_confirmation">Confirm new password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Only if changing password"
                                                />
                                                {errors.password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Role</Label>
                                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((r) => (
                                                        <SelectItem key={r} value={r}>
                                                            {r === 'admin' ? 'Admin' : 'Customer'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                                        <CardTitle className="flex items-center gap-2 text-gray-900">
                                            <Save className="w-5 h-5" />
                                            Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-3"
                                            disabled={processing}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Updating...' : 'Update User'}
                                        </Button>
                                        <Link href={route('admin.users.index')}>
                                            <Button type="button" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
