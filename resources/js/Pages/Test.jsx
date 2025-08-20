import { Head } from '@inertiajs/react';

export default function Test({ message }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Head title="Test Page" />
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Test Page</h1>
                <p className="text-gray-600">Message: {message}</p>
                <p className="text-sm text-gray-500 mt-4">If you can see this, Inertia is working!</p>
            </div>
        </div>
    );
}
