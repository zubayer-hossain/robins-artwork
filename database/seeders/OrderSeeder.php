<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Artwork;
use App\Models\Edition;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::role('customer')->get();
        $artworks = Artwork::published()->take(3)->get();
        $editions = Edition::take(2)->get();

        // Create demo orders
        for ($i = 0; $i < 3; $i++) {
            $customer = $customers->random();
            $total = 0;
            $items = [];

            // Add random artwork or edition
            if (rand(0, 1) && $artworks->count() > 0) {
                $artwork = $artworks->random();
                $total += $artwork->price;
                $items[] = [
                    'artwork_id' => $artwork->id,
                    'title_snapshot' => $artwork->title,
                    'unit_price' => $artwork->price,
                ];
            }

            if (rand(0, 1) && $editions->count() > 0) {
                $edition = $editions->random();
                $total += $edition->price;
                $items[] = [
                    'edition_id' => $edition->id,
                    'title_snapshot' => $edition->artwork->title . ' - Edition',
                    'unit_price' => $edition->price,
                ];
            }

            if (count($items) > 0) {
                $order = Order::create([
                    'user_id' => $customer->id,
                    'email' => $customer->email,
                    'stripe_session_id' => 'demo_session_' . uniqid(),
                    'total' => $total,
                    'currency' => 'usd',
                    'status' => 'paid',
                    'meta' => [
                        'customer_name' => $customer->name,
                        'demo_order' => true,
                    ],
                ]);

                // Create order items
                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'artwork_id' => $item['artwork_id'] ?? null,
                        'edition_id' => $item['edition_id'] ?? null,
                        'qty' => 1,
                        'unit_price' => $item['unit_price'],
                        'title_snapshot' => $item['title_snapshot'],
                    ]);
                }
            }
        }
    }
}
