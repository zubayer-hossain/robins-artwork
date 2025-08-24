import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { User, Shield, Trash2 } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                                <p className="mt-2 text-gray-600">
                                    Manage your account information, security settings, and preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-8">
                        {/* Profile Information */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-8 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Profile Information
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Update your personal details and contact information
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-2xl"
                                />
                            </CardContent>
                        </Card>

                        {/* Password Update */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-8 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Security Settings
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Change your password and manage account security
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <UpdatePasswordForm className="max-w-2xl" />
                            </CardContent>
                        </Card>

                        {/* Delete Account */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-8 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                                        <Trash2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Danger Zone
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Permanently delete your account and all associated data
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <DeleteUserForm className="max-w-2xl" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
