<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
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

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact.index')
            ->with('success', 'Message deleted successfully.');
    }
}