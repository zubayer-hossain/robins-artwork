import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminEditionCreate({ auth, artworks }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        artwork_id: '',
        sku: '',
        edition_total: '',
        price: '',
        stock: '',
        is_limited: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.editions.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const generateSKU = (artworkId) => {
        const artwork = artworks.find(a => a.id == artworkId);
        if (artwork) {
            const cleanTitle = artwork.title
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 10);
            return `${cleanTitle}-print-${Date.now().toString().slice(-4)}`;
        }
        return '';
    };

    const handleArtworkChange = (artworkId) => {
        setData('artwork_id', artworkId);
        if (!data.sku) {
            setData('sku', generateSKU(artworkId));
        }
    };

    return (
        <AdminLayout user={auth.user} header="Create New Edition">
            <Head title="Create Edition" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('admin.editions.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Editions
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Edition</h1>
                        <p className="text-gray-600">Add a new print edition for an artwork</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edition Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="artwork_id">Artwork *</Label>
                                        <Select value={data.artwork_id} onValueChange={handleArtworkChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an artwork" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {artworks.map((artwork) => (
                                                    <SelectItem key={artwork.id} value={artwork.id.toString()}>
                                                        {artwork.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.artwork_id && <p className="text-sm text-red-600 mt-1">{errors.artwork_id}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="sku">SKU *</Label>
                                            <Input
                                                id="sku"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                placeholder="edition-sku-identifier"
                                                required
                                            />
                                            {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="price">Price (£) *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                required
                                            />
                                            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="stock">Initial Stock *</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                required
                                            />
                                            {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="edition_total">Edition Total</Label>
                                            <Input
                                                id="edition_total"
                                                type="number"
                                                value={data.edition_total}
                                                onChange={(e) => setData('edition_total', e.target.value)}
                                                placeholder="Limited edition size"
                                                min="1"
                                                disabled={!data.is_limited}
                                            />
                                            {errors.edition_total && <p className="text-sm text-red-600 mt-1">{errors.edition_total}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edition Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_limited"
                                            checked={data.is_limited}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setData('is_limited', checked);
                                                if (!checked) {
                                                    setData('edition_total', '');
                                                }
                                            }}
                                        />
                                        <Label htmlFor="is_limited">Limited Edition</Label>
                                    </div>
                                    {data.is_limited && (
                                        <p className="text-sm text-gray-600">
                                            This edition will have a limited number of prints available.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Creating...' : 'Create Edition'}
                                    </Button>
                                    <Link href={route('admin.editions.index')}>
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Help */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Help</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p><strong>SKU:</strong> A unique identifier for this edition</p>
                                        <p><strong>Price:</strong> The selling price for each print</p>
                                        <p><strong>Stock:</strong> Number of prints currently available</p>
                                        <p><strong>Edition Total:</strong> Maximum number of prints that will ever be made (if limited)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}