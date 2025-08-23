import { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { MapPin, Save, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AddressModal({ 
    isOpen, 
    onClose, 
    address = null, 
    isEditing = false 
}) {
    const [formData, setFormData] = useState({
        type: 'shipping',
        label: '',
        name: '',
        company: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: 'United Kingdom',
        phone: '',
        is_default: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when editing
    useEffect(() => {
        if (address && isEditing) {
            setFormData({
                type: address.type || 'shipping',
                label: address.label || '',
                name: address.name || '',
                company: address.company || '',
                address_line_1: address.address_line_1 || '',
                address_line_2: address.address_line_2 || '',
                city: address.city || '',
                state_province: address.state_province || '',
                postal_code: address.postal_code || '',
                country: address.country || 'United Kingdom',
                phone: address.phone || '',
                is_default: address.is_default || false,
            });
        } else {
            // Reset form for new address
            setFormData({
                type: 'shipping',
                label: '',
                name: '',
                company: '',
                address_line_1: '',
                address_line_2: '',
                city: '',
                state_province: '',
                postal_code: '',
                country: 'United Kingdom',
                phone: '',
                is_default: false,
            });
        }
    }, [address, isEditing, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = isEditing 
                ? route('addresses.update', address.id)
                : route('addresses.store');
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                const message = isEditing ? 'Address updated successfully' : 'Address added successfully';
                const title = isEditing ? 'Address Updated' : 'Address Created';
                window.toast?.success(message, title);
                onClose();
                router.reload();
            } else {
                window.toast?.error(data.message || 'Failed to save address', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        {isEditing ? 'Edit Address' : 'Add New Address'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing 
                            ? 'Update your address information below.' 
                            : 'Fill in the form below to add a new address to your account.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Address Type and Label */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="type">Address Type *</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(value) => handleInputChange('type', value)}
                            >
                                <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="shipping">Shipping</SelectItem>
                                    <SelectItem value="billing">Billing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="label">Label (Optional)</Label>
                            <Input
                                id="label"
                                type="text"
                                placeholder="e.g., Home, Office, Work"
                                value={formData.label}
                                onChange={(e) => handleInputChange('label', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Name and Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="company">Company (Optional)</Label>
                            <Input
                                id="company"
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Address Lines */}
                    <div>
                        <Label htmlFor="address_line_1">Address Line 1 *</Label>
                        <Input
                            id="address_line_1"
                            type="text"
                            required
                            value={formData.address_line_1}
                            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                        <Input
                            id="address_line_2"
                            type="text"
                            value={formData.address_line_2}
                            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                        />
                    </div>

                    {/* City, State, Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="state_province">State/Province *</Label>
                            <Input
                                id="state_province"
                                type="text"
                                required
                                value={formData.state_province}
                                onChange={(e) => handleInputChange('state_province', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="postal_code">Postal Code *</Label>
                            <Input
                                id="postal_code"
                                type="text"
                                required
                                value={formData.postal_code}
                                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Country and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country">Country *</Label>
                            <Select 
                                value={formData.country} 
                                onValueChange={(value) => handleInputChange('country', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                    <SelectItem value="France">France</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_default"
                            checked={formData.is_default}
                            onChange={(e) => handleInputChange('is_default', e.target.checked)}
                        />
                        <Label htmlFor="is_default" className="text-sm">
                            Set as default {formData.type} address
                        </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isEditing ? 'Update Address' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
