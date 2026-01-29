<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ContactReply;
use App\Models\ContactMessage;
use App\Models\ContactMessageReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($message) {
                return [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'subject' => $message->subject,
                    'message' => $message->message,
                    'status' => $message->status ?? 'unread',
                    'created_at' => $message->created_at?->format('M j, Y H:i') ?? 'N/A',
                ];
            });

        return Inertia::render('Admin/Contact/Index', [
            'messages' => $messages,
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        // Mark as read when viewed
        if ($contactMessage->status === 'unread') {
            $contactMessage->update(['status' => 'read']);
        }

        // Load replies with user information
        $replies = $contactMessage->replies()->with('user')->get()->map(function ($reply) {
            return [
                'id' => $reply->id,
                'message' => $reply->message,
                'sent_at' => $reply->sent_at?->format('M j, Y H:i') ?? 'N/A',
                'sent_by' => $reply->user?->name ?? 'Admin',
            ];
        });

        return Inertia::render('Admin/Contact/Show', [
            'message' => [
                'id' => $contactMessage->id,
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
                'subject' => $contactMessage->subject,
                'message' => $contactMessage->message,
                'status' => $contactMessage->status ?? 'unread',
                'created_at' => $contactMessage->created_at?->format('M j, Y H:i') ?? 'N/A',
                'updated_at' => $contactMessage->updated_at?->format('M j, Y H:i') ?? 'N/A',
                'replies' => $replies,
            ],
        ]);
    }

    public function markAsRead(ContactMessage $contactMessage)
    {
        $contactMessage->update(['status' => 'read']);
        
        return back()->with('success', 'Message marked as read.');
    }

    public function markAsReplied(ContactMessage $contactMessage)
    {
        $contactMessage->update(['status' => 'replied']);
        
        return back()->with('success', 'Message marked as replied.');
    }

    public function reply(Request $request, ContactMessage $contactMessage)
    {
        $request->validate([
            'reply_message' => 'required|string|min:10',
        ]);

        try {
            // Send the email
            Mail::to($contactMessage->email)
                ->send(new ContactReply($contactMessage, $request->reply_message));

            // Save the reply to database
            ContactMessageReply::create([
                'contact_message_id' => $contactMessage->id,
                'user_id' => Auth::id(),
                'message' => $request->reply_message,
                'sent_at' => now(),
            ]);

            // Update message status
            $contactMessage->update(['status' => 'replied']);

            return back()->with('success', 'Reply sent successfully to ' . $contactMessage->email);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send reply: ' . $e->getMessage());
        }
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')
            ->with('success', 'Message deleted successfully.');
    }
}