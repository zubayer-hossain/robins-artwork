<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Artwork;
use App\Models\Edition;
use App\Models\Address;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users, artworks, and editions
        $users = User::all();
        $artworks = Artwork::all();
        $editions = Edition::all();

        if ($users->isEmpty() || $artworks->isEmpty()) {
            $this->command->warn('No users or artworks found. Please run UserSeeder and ArtworkSeeder first.');
            return;
        }

        $orderStatuses = ['pending', 'paid', 'refunded', 'cancelled'];

        foreach ($users as $user) {
            // Get user's default shipping address
            $shippingAddress = $user->addresses()->shipping()->default()->first();
            
            if (!$shippingAddress) {
                // Create a default shipping address if none exists
                $shippingAddress = Address::create([
                    'user_id' => $user->id,
                    'type' => 'shipping',
                    'label' => 'Home',
                    'name' => $user->name . ' Smith',
                    'address_line_1' => '123 Highland Road',
                    'city' => 'Edinburgh',
                    'state_province' => 'Scotland',
                    'postal_code' => 'EH1 1AA',
                    'country' => 'United Kingdom',
                    'is_default' => true,
                ]);
            }

            // Create 2-5 orders per user
            $numOrders = rand(2, 5);
            
            for ($i = 0; $i < $numOrders; $i++) {
                $status = $orderStatuses[array_rand($orderStatuses)];
                
                // Random order total between $100 and $5000
                $total = rand(10000, 500000) / 100;
                
                // Create order
                $order = Order::create([
                    'user_id' => $user->id,
                    'stripe_session_id' => 'seeded_' . time() . '_' . $user->id . '_' . $i,
                    'total' => $total,
                    'currency' => 'usd',
                    'status' => $status,
                    'order_notes' => $this->getRandomOrderNotes(),
                    'shipping_address_id' => $shippingAddress->id,
                    'billing_address_id' => $shippingAddress->id,
                    'meta' => [
                        'source' => 'seeder',
                        'created_at' => now()->toISOString(),
                    ],
                ]);

                // Create 1-3 order items per order
                $numItems = rand(1, 3);
                $usedArtworks = [];
                
                for ($j = 0; $j < $numItems; $j++) {
                    // Select random artwork (avoid duplicates in same order)
                    $availableArtworks = $artworks->whereNotIn('id', $usedArtworks);
                    if ($availableArtworks->isEmpty()) break;
                    
                    $artwork = $availableArtworks->random();
                    $usedArtworks[] = $artwork->id;
                    
                    // Random quantity between 1 and 3
                    $quantity = rand(1, 3);
                    
                    // Random unit price between $50 and $2000
                    $unitPrice = rand(5000, 200000) / 100;
                    
                    // Decide if this is an artwork or edition
                    $isEdition = rand(0, 1) && !$editions->isEmpty();
                    
                    if ($isEdition) {
                        // Find editions for this artwork
                        $artworkEditions = $editions->where('artwork_id', $artwork->id);
                        if ($artworkEditions->isNotEmpty()) {
                            $edition = $artworkEditions->random();
                            
                            OrderItem::create([
                                'order_id' => $order->id,
                                'artwork_id' => $artwork->id,
                                'edition_id' => $edition->id,
                                'qty' => $quantity,
                                'unit_price' => $unitPrice,
                                'title_snapshot' => $artwork->title . ' - ' . $edition->name,
                            ]);
                        } else {
                            // Fallback to artwork only
                            OrderItem::create([
                                'order_id' => $order->id,
                                'artwork_id' => $artwork->id,
                                'edition_id' => null,
                                'qty' => $quantity,
                                'unit_price' => $unitPrice,
                                'title_snapshot' => $artwork->title,
                            ]);
                        }
                    } else {
                        // Artwork only
                        OrderItem::create([
                            'order_id' => $order->id,
                            'artwork_id' => $artwork->id,
                            'edition_id' => null,
                            'qty' => $quantity,
                            'unit_price' => $unitPrice,
                            'title_snapshot' => $artwork->title,
                        ]);
                    }
                }

                // Update order total based on actual items
                $actualTotal = $order->items->sum(function($item) {
                    return $item->qty * $item->unit_price;
                });
                
                $order->update(['total' => $actualTotal]);
            }
        }

        $this->command->info('Orders seeded successfully!');
    }

    private function getRandomOrderNotes(): ?string
    {
        $notes = [
            'Please handle with care - fragile artwork',
            'Gift wrapping requested',
            'Delivery preferred in the morning',
            'Leave with neighbor if not home',
            'Special instructions for delivery',
            'Please include certificate of authenticity',
            'Rush order - needed by weekend',
            'Contact before delivery',
            null, // Some orders have no notes
            null,
        ];

        return $notes[array_rand($notes)];
    }
}
