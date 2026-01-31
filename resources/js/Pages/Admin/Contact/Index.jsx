import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Eye, Mail, Check, CheckCheck, Trash2, MessageSquare, Send, ExternalLink } from 'lucide-react';

export default function AdminContactIndex({ auth, messages = { data: [], total: 0 }, flash }) {
    const [deleteId, setDeleteId] = useState(null);
    const [replyMessage, setReplyMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [processing, setProcessing] = useState(false);

    // Handle flash messages and show toast notifications
    useEffect(() => {
        if (flash?.success && window.toast) {
            window.toast.success(flash.success, 'Success');
        }
        if (flash?.error && window.toast) {
            window.toast.error(flash.error, 'Error');
        }
    }, [flash?.success, flash?.error]);

    const getStatusBadge = (status) => {
        const variants = {
            unread: 'destructive',
            read: 'secondary',
            replied: 'default',
        };
        const labels = {
            unread: 'Unread',
            read: 'Read',
            replied: 'Replied',
        };
        return <Badge variant={variants[status]}>{labels[status] || status}</Badge>;
    };

    const handleMarkAsRead = (id) => {
        setProcessing(true);
        router.patch(route('admin.contact-messages.mark-read', id), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleMarkAsReplied = (id) => {
        setProcessing(true);
        router.patch(route('admin.contact-messages.mark-replied', id), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.contact-messages.destroy', deleteId), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    const handleReply = () => {
        if (!replyMessage || !replyText.trim()) return;
        setProcessing(true);
        router.post(route('admin.contact-messages.reply', replyMessage.id), {
            reply_message: replyText,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyMessage(null);
                setReplyText('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const openReplyDialog = (message) => {
        setReplyMessage(message);
        setReplyText('');
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="Contact Messages"
            headerIcon={<MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
            headerDescription="Manage customer inquiries and contact form submissions"
        >
            <Head title="Contact Messages" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Messages ({messages.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {messages.data && messages.data.length > 0 ? (
                            <div className="overflow-x-auto">
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
                                            <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50/50' : ''}>
                                                <TableCell>
                                                    <div className="font-medium">{message.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <a href={`mailto:${message.email}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                                        {message.email}
                                                    </a>
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
                                                    <div className="flex gap-2 flex-wrap">
                                                        {/* View Message */}
                                                        <Link href={route('admin.contact-messages.show', message.id)}>
                                                            <Button variant="outline" size="sm" title="View Message">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        
                                                        {/* Reply from Site */}
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            title="Reply from Site"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => openReplyDialog(message)}
                                                            disabled={processing}
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </Button>
                                                        
                                                        {/* Reply via Email Client */}
                                                        <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}>
                                                            <Button variant="outline" size="sm" title="Reply via Email Client">
                                                                <Mail className="w-4 h-4" />
                                                                <ExternalLink className="w-3 h-3 ml-1" />
                                                            </Button>
                                                        </a>
                                                        
                                                        {/* Mark as Read (only for unread) */}
                                                        {message.status === 'unread' && (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                title="Mark as Read"
                                                                onClick={() => handleMarkAsRead(message.id)}
                                                                disabled={processing}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        
                                                        {/* Mark as Replied (for unread or read) */}
                                                        {message.status !== 'replied' && (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                title="Mark as Replied"
                                                                onClick={() => handleMarkAsReplied(message.id)}
                                                                disabled={processing}
                                                            >
                                                                <CheckCheck className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        
                                                        {/* Delete */}
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            title="Delete Message"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => setDeleteId(message.id)}
                                                            disabled={processing}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
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
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete Message"
                isLoading={processing}
                variant="danger"
            />

            {/* Reply Dialog */}
            <Dialog open={replyMessage !== null} onOpenChange={(open) => !open && setReplyMessage(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-green-600" />
                            Reply to {replyMessage?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Send a reply to <span className="font-medium text-gray-700">{replyMessage?.email}</span>
                            <br />
                            <span className="text-gray-500">Subject: Re: {replyMessage?.subject}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        {/* Original Message Preview */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Original Message</Label>
                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">{replyMessage?.message}</p>
                        </div>
                        
                        {/* Reply Text Area */}
                        <div>
                            <Label htmlFor="reply-text">Your Reply</Label>
                            <Textarea
                                id="reply-text"
                                placeholder="Type your reply here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="mt-1 min-h-[150px]"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
                        </div>
                    </div>
                    
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setReplyMessage(null)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleReply}
                            disabled={processing || replyText.trim().length < 10}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processing ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Reply
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}