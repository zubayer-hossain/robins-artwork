import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { ArrowLeft, Save, MapPin } from 'lucide-react';

export default function AddressCreate() {
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
            const response = await fetch(route('addresses.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                window.toast?.success('Address added successfully', 'Address Created');
                router.visit(route('addresses.index'));
            } else {
                window.toast?.error(data.message || 'Failed to create address', 'Error');
            }
        } catch (error) {
            window.toast?.error('Network error occurred', 'Connection Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add New Address" />
            
            <div className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('addresses.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Addresses
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Address</h1>
                            <p className="text-gray-600 mt-1">Create a new shipping or billing address</p>
                        </div>
                    </div>

                    {/* Address Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Address Type and Label */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type">Address Type *</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="shipping">Shipping Address</SelectItem>
                                                <SelectItem value="billing">Billing Address</SelectItem>
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
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company">Company (Optional)</Label>
                                        <Input
                                            id="company"
                                            type="text"
                                            placeholder="Company name"
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
                                        placeholder="Street address, P.O. box, company name"
                                        value={formData.address_line_1}
                                        onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                                    <Input
                                        id="address_line_2"
                                        type="text"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
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
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state_province">State/Province *</Label>
                                        <Input
                                            id="state_province"
                                            type="text"
                                            placeholder="State or province"
                                            value={formData.state_province}
                                            onChange={(e) => handleInputChange('state_province', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postal_code">Postal Code *</Label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            placeholder="Postal code"
                                            value={formData.postal_code}
                                            onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Country and Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="country">Country *</Label>
                                        <Input
                                            id="country"
                                            type="text"
                                            placeholder="Country"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone (Optional)</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Phone number"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Default Address */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_default"
                                        checked={formData.is_default}
                                        onCheckedChange={(checked) => handleInputChange('is_default', checked)}
                                    />
                                    <Label htmlFor="is_default" className="text-sm">
                                        Set as default {formData.type} address
                                    </Label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                    <Link href={route('addresses.index')}>
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
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
                                        {isSubmitting ? 'Creating...' : 'Create Address'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
