<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@email.com',
                'subject' => 'Custom Commission Inquiry',
                'message' => 'Hi Robin, I love your landscape paintings! I\'m interested in commissioning a custom piece featuring the Cairngorms mountains. Could you tell me more about your commission process and pricing?',
                'status' => 'unread',
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@email.com',
                'subject' => 'Studio Visit Request',
                'message' => 'Hello Robin, I\'m planning a trip to Scotland next month and would love to visit your studio. I\'m also interested in staying at your B&B. What dates would work best for a studio visit?',
                'status' => 'read',
            ],
            [
                'name' => 'Emma Thompson',
                'email' => 'emma.thompson@email.com',
                'subject' => 'Artwork Availability',
                'message' => 'Hi there! I saw your "Highland Sunset" piece on your website and absolutely love it. Is it still available for purchase? Also, do you ship to the United States?',
                'status' => 'replied',
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }
    }
}
