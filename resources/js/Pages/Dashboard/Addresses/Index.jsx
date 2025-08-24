import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AddressModal from '@/Components/AddressModal';
import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Star, Home, Building, AlertTriangle } from 'lucide-react';

export default function AddressesIndex({ addresses }) {
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
    const [addressToSetDefault, setAddressToSetDefault] = useState(null);
    const [existingDefault, setExistingDefault] = useState(null);
    const [isSettingDefault, setIsSettingDefault] = useState(false);

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setDeletingAddress(addressId);
        
        try {
            const response = await fetch(route('addresses.destroy', addressId), {
                method: 'POST',
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
        // Find the address being set as default
        const addressToSet = addresses.find(addr => addr.id === addressId);
        if (!addressToSet) {
            window.toast?.error('Address not found', 'Error');
            return;
        }

        // Check if there's already a default address of the same type
        const existingDefaultAddr = addresses.find(addr => 
            addr.is_default && 
            addr.type === addressToSet.type && 
            addr.id !== addressId
        );

        if (existingDefaultAddr) {
            // Show confirmation modal
            setAddressToSetDefault(addressToSet);
            setExistingDefault(existingDefaultAddr);
            setShowDefaultConfirm(true);
        } else {
            // No existing default, proceed directly
            await setDefaultAddress(addressId);
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            setIsSettingDefault(true);
            const response = await fetch(route('addresses.set-default', addressId), {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (data.success) {
                const addressToSet = addresses.find(addr => addr.id === addressId);
                window.toast?.success(`Default ${addressToSet.type} address updated successfully`, 'Address Updated');
                router.reload();
            } else {
                window.toast?.error(data.message || 'Failed to update default address', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsSettingDefault(false);
        }
    };

    const confirmSetDefault = async () => {
        if (addressToSetDefault) {
            await setDefaultAddress(addressToSetDefault.id);
            setShowDefaultConfirm(false);
            setAddressToSetDefault(null);
            setExistingDefault(null);
        }
    };

    const cancelSetDefault = () => {
        setShowDefaultConfirm(false);
        setAddressToSetDefault(null);
        setExistingDefault(null);
    };

    const getAddressIcon = (type, label) => {
        if (label?.toLowerCase().includes('home')) return <Home className="w-5 h-5" />;
        if (label?.toLowerCase().includes('office') || label?.toLowerCase().includes('work')) return <Building className="w-5 h-5" />;
        return <MapPin className="w-5 h-5" />;
    };

    const getAddressTypeColor = (type) => {
        return type === 'shipping' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200';
    };

    const getAddressIconBg = (type, label) => {
        if (label?.toLowerCase().includes('home')) return 'bg-gradient-to-br from-blue-500 to-blue-600';
        if (label?.toLowerCase().includes('office') || label?.toLowerCase().includes('work')) return 'bg-gradient-to-br from-purple-500 to-purple-600';
        return type === 'shipping' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600';
    };

    const handleAddAddress = () => {
        setIsEditing(false);
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditAddress = (address) => {
        setIsEditing(true);
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setIsEditing(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Addresses" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Your Addresses</h1>
                                <p className="mt-2 text-gray-600">
                                    Manage your shipping and billing addresses for faster checkout and better organization
                                </p>
                            </div>
                            <Button 
                                onClick={handleAddAddress}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Address
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Addresses Grid */}
                    {addresses && addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {addresses.map((address) => (
                                <Card key={address.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                                    {/* Default Badge */}
                                    {address.is_default && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg px-3 py-1.5">
                                                <Star className="w-3 h-3 mr-1 fill-current" />
                                                Default {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                            </Badge>
                                        </div>
                                    )}

                                    

                                    <CardHeader className="pb-4 pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-xl ${getAddressIconBg(address.type, address.label)} shadow-lg flex-shrink-0`}>
                                                {getAddressIcon(address.type, address.label)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                                                    {address.label || `${address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address`}
                                                </CardTitle>
                                                <Badge className={`${getAddressTypeColor(address.type)} border font-medium px-3 py-1`}>
                                                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="space-y-3 mb-6">
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="space-y-2 text-sm">
                                                    <p className="font-semibold text-gray-900 text-base">{address.name}</p>
                                                    {address.company && (
                                                        <p className="text-gray-700 font-medium">{address.company}</p>
                                                    )}
                                                    <div className="space-y-1 text-gray-600">
                                                        <p>{address.address_line_1}</p>
                                                        {address.address_line_2 && <p>{address.address_line_2}</p>}
                                                        <p className="font-medium">
                                                            {address.city}, {address.state_province} {address.postal_code}
                                                        </p>
                                                        <p className="font-medium">{address.country}</p>
                                                    </div>
                                                    {address.phone && (
                                                        <div className="pt-2 mt-2 border-t border-gray-200">
                                                            <p className="text-gray-700 font-medium flex items-center gap-2">
                                                                <span className="text-blue-600">📞</span>
                                                                {address.phone}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            {!address.is_default && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetDefault(address.id)}
                                                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-colors"
                                                >
                                                    <Star className="w-3.5 h-3.5 mr-1.5" />
                                                    Set Default {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                <Edit className="w-3.5 h-3.5 mr-1.5" />
                                                Edit
                                            </Button>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address.id)}
                                                disabled={deletingAddress === address.id}
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                                            >
                                                {deletingAddress === address.id ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-20 border-0 shadow-lg bg-white">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No addresses yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                Add your first address to make checkout faster and easier. Organize your addresses with custom labels like "Home", "Office", or "Summer House".
                            </p>
                            <Button 
                                onClick={handleAddAddress}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Address
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            {/* Address Modal */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                address={editingAddress}
                isEditing={isEditing}
            />

            {/* Default Address Confirmation Modal */}
            {showDefaultConfirm && addressToSetDefault && existingDefault && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Replace Default {addressToSetDefault.type.charAt(0).toUpperCase() + addressToSetDefault.type.slice(1)} Address
                            </h3>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                You already have a default {addressToSetDefault.type} address. Setting this new address as default will replace the current one.
                            </p>
                            
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">Current Default:</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {existingDefault.label || `${existingDefault.type.charAt(0).toUpperCase() + existingDefault.type.slice(1)} Address`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {existingDefault.address_line_1}, {existingDefault.city}
                                </p>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-700">New Default:</span>
                                </div>
                                <p className="text-sm text-blue-600">
                                    {addressToSetDefault.label || `${addressToSetDefault.type.charAt(0).toUpperCase() + addressToSetDefault.type.slice(1)} Address`}
                                </p>
                                <p className="text-xs text-blue-500 mt-1">
                                    {addressToSetDefault.address_line_1}, {addressToSetDefault.city}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={cancelSetDefault}
                                disabled={isSettingDefault}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmSetDefault}
                                disabled={isSettingDefault}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSettingDefault ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Replace Default'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
