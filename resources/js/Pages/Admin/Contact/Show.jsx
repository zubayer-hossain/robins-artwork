import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { 
    ArrowLeft, 
    Mail, 
    User,
    Calendar,
    Clock,
    Check,
    CheckCheck,
    Trash2,
    MessageSquare,
    ExternalLink,
    Send,
    History
} from 'lucide-react';

export default function AdminContactShow({ auth, message, flash }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
        const config = {
            unread: { 
                variant: 'destructive', 
                icon: <Clock className="w-3 h-3" />,
                className: 'bg-red-100 text-red-800 border-red-200',
                label: 'Unread'
            },
            read: { 
                variant: 'secondary', 
                icon: <Check className="w-3 h-3" />,
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                label: 'Read'
            },
            replied: { 
                variant: 'default', 
                icon: <CheckCheck className="w-3 h-3" />,
                className: 'bg-green-100 text-green-800 border-green-200',
                label: 'Replied'
            },
        };
        const statusConfig = config[status] || config.unread;
        return (
            <Badge className={`${statusConfig.className} flex items-center gap-1 font-medium`}>
                {statusConfig.icon}
                {statusConfig.label}
            </Badge>
        );
    };

    const handleMarkAsRead = () => {
        setProcessing(true);
        router.patch(route('admin.contact-messages.mark-read', message.id), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleMarkAsReplied = () => {
        setProcessing(true);
        router.patch(route('admin.contact-messages.mark-replied', message.id), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('admin.contact-messages.destroy', message.id), {
            onFinish: () => {
                setProcessing(false);
                setShowDeleteDialog(false);
            },
        });
    };

    const handleReply = () => {
        if (!replyText.trim()) return;
        setProcessing(true);
        router.post(route('admin.contact-messages.reply', message.id), {
            reply_message: replyText,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyText('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout 
            user={auth.user} 
            header="View Message"
            headerIcon={<MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
            headerDescription={`Message from ${message.name}`}
            headerActions={
                <Link href={route('admin.contact-messages.index')}>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Messages
                    </Button>
                </Link>
            }
        >
            <Head title={`Message from ${message.name}`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Message Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                    Message Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Subject */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</label>
                                        <h2 className="text-xl font-semibold text-gray-900 mt-1">{message.subject}</h2>
                                    </div>
                                    
                                    {/* Message Body */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
                                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reply History */}
                        {message.replies && message.replies.length > 0 && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-purple-900">
                                        <History className="w-5 h-5" />
                                        Reply History
                                        <Badge variant="secondary" className="ml-2">{message.replies.length}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {message.replies.map((reply, index) => (
                                            <div key={reply.id} className="relative pl-4 border-l-2 border-purple-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <Send className="w-3 h-3 text-purple-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{reply.sent_by}</span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-gray-500">{reply.sent_at}</span>
                                                </div>
                                                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reply from Site Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-green-900">
                                    <Send className="w-5 h-5" />
                                    Reply from Site
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Send a reply directly from this site. The message will be sent to <span className="font-medium text-gray-800">{message.email}</span>.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="reply-text">Your Reply</Label>
                                        <Textarea
                                            id="reply-text"
                                            placeholder="Type your reply here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="mt-1 min-h-[120px]"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
                                    </div>
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reply via Email Client Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <Mail className="w-5 h-5" />
                                    Reply via Email Client
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Prefer using your email client? Click below to open a new email with the subject pre-filled.
                                </p>
                                <a 
                                    href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                                    className="inline-flex"
                                >
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Open Email Client
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Sender Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-purple-900">
                                    <User className="w-5 h-5" />
                                    Sender Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-lg">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                                            <p className="font-semibold text-gray-900">{message.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-lg">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                            <a 
                                                href={`mailto:${message.email}`} 
                                                className="block font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                                {message.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Dates */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-green-900">
                                    <Calendar className="w-5 h-5" />
                                    Status & Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                            <div className="mt-1">{getStatusBadge(message.status)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Received</label>
                                            <p className="font-medium text-gray-900">{message.created_at}</p>
                                        </div>
                                    </div>
                                    {message.replies && message.replies.length > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                                            <Send className="w-4 h-4 text-gray-600" />
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Reply Sent</label>
                                                <p className="font-medium text-gray-900">{message.replies[0].sent_at}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-orange-900">
                                    <MessageSquare className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {message.status === 'unread' && (
                                    <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                                        size="lg"
                                        onClick={handleMarkAsRead}
                                        disabled={processing}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        {processing ? 'Processing...' : 'Mark as Read'}
                                    </Button>
                                )}
                                {message.status !== 'replied' && (
                                    <Button 
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                                        size="lg"
                                        onClick={handleMarkAsReplied}
                                        disabled={processing}
                                    >
                                        <CheckCheck className="w-4 h-4 mr-2" />
                                        {processing ? 'Processing...' : 'Mark as Replied'}
                                    </Button>
                                )}
                                <a 
                                    href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                                    className="block"
                                >
                                    <Button className="w-full" variant="outline" size="lg">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Reply via Email Client
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                </a>
                                <Button 
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={processing}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Message
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Message"
                message={`Are you sure you want to delete this message from ${message.name}? This action cannot be undone.`}
                confirmText="Delete Message"
                isLoading={processing}
                variant="danger"
            />
        </AdminLayout>
    );
}
