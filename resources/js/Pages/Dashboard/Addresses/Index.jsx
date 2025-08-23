import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Star, Home, Building } from 'lucide-react';

export default function AddressesIndex({ addresses }) {
    const [deletingAddress, setDeletingAddress] = useState(null);

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setDeletingAddress(addressId);
        
        try {
            const response = await fetch(route('addresses.destroy', addressId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Address deleted successfully', 'Address Deleted');
                router.reload();
            } else {
                window.toast?.error(data.message || 'Failed to delete address', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setDeletingAddress(null);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const response = await fetch(route('addresses.set-default', addressId), {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Default address updated successfully', 'Address Updated');
                router.reload();
            } else {
                window.toast?.error(data.message || 'Failed to update default address', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        }
    };

    const getAddressIcon = (type, label) => {
        if (label?.toLowerCase().includes('home')) return <Home className="w-4 h-4" />;
        if (label?.toLowerCase().includes('office') || label?.toLowerCase().includes('work')) return <Building className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    const getAddressTypeColor = (type) => {
        return type === 'shipping' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Addresses" />
            
            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Addresses</h1>
                            <p className="text-gray-600 mt-1">Manage your shipping and billing addresses</p>
                        </div>
                        <Link href={route('addresses.create')}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Address
                            </Button>
                        </Link>
                    </div>

                    {/* Addresses Grid */}
                    {addresses && addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {addresses.map((address) => (
                                <Card key={address.id} className="relative hover:shadow-lg transition-shadow duration-200">
                                    {/* Default Badge */}
                                    {address.is_default && (
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                <Star className="w-3 h-3 mr-1" />
                                                Default
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-full">
                                                {getAddressIcon(address.type, address.label)}
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    {address.label || `${address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address`}
                                                </CardTitle>
                                                <Badge className={getAddressTypeColor(address.type)}>
                                                    {address.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p className="font-medium text-gray-900">{address.name}</p>
                                            {address.company && <p>{address.company}</p>}
                                            <p>{address.address_line_1}</p>
                                            {address.address_line_2 && <p>{address.address_line_2}</p>}
                                            <p>{address.city}, {address.state_province} {address.postal_code}</p>
                                            <p>{address.country}</p>
                                            {address.phone && <p className="text-gray-500">📞 {address.phone}</p>}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                            {!address.is_default && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetDefault(address.id)}
                                                    className="flex-1"
                                                >
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Set Default
                                                </Button>
                                            )}
                                            
                                            <Link href={route('addresses.edit', address.id)} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address.id)}
                                                disabled={deletingAddress === address.id}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            >
                                                {deletingAddress === address.id ? (
                                                    <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3 h-3" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <MapPin className="mx-auto h-16 w-16" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                            <p className="text-gray-500 mb-6">
                                Add your first address to make checkout faster and easier.
                            </p>
                            <Link href={route('addresses.create')}>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Address
                                </Button>
                            </Link>
                        </Card>
                    )}
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
