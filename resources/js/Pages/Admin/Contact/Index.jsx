import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Mail, Check } from 'lucide-react';

export default function AdminContactIndex({ auth, messages = { data: [], total: 0 } }) {
    const getStatusBadge = (status) => {
        const variants = {
            unread: 'destructive',
            read: 'secondary',
            replied: 'default',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <AdminLayout user={auth.user} header="Contact Messages">
            <Head title="Contact Messages" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Contact Messages</h1>
                    <p className="text-gray-600">Manage customer inquiries and contact form submissions</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Messages ({messages.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {messages.data && messages.data.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {messages.data.map((message) => (
                                        <TableRow key={message.id}>
                                            <TableCell>
                                                <div className="font-medium">{message.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{message.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{message.subject}</div>
                                                <div className="text-sm text-gray-600 truncate max-w-xs">
                                                    {message.message}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(message.status)}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">{message.created_at}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    {message.status === 'unread' && (
                                                        <Button variant="outline" size="sm">
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No Messages Yet</h3>
                                    <p>Contact form submissions will appear here when customers send messages.</p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {messages.links && messages.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {messages.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded-md text-sm ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}