<?php

namespace App\Http\Controllers;

use App\Mail\OrderReceipt;
use App\Models\Artwork;
use App\Models\Edition;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Stripe\Event;

class WebhookController extends CashierController
{
    public function stripe(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('cashier.webhook.secret');

        try {
            $event = Event::constructFrom(
                json_decode($payload, true)
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Invalid payload: ' . $e->getMessage());
            return response('Invalid payload', 400);
        }

        if ($endpointSecret) {
            try {
                $event = \Stripe\Webhook::constructEvent(
                    $payload, $sigHeader, $endpointSecret
                );
            } catch (\Exception $e) {
                Log::error('Webhook signature verification failed: ' . $e->getMessage());
                return response('Webhook signature verification failed', 400);
            }
        }

        if ($event->type === 'checkout.session.completed') {
            $this->handleCheckoutSessionCompleted($event->data->object);
        }

        return response('Webhook handled', 200);
    }

    protected function handleCheckoutSessionCompleted($session)
    {
        try {
            $metadata = $session->metadata;
            $total = $session->amount_total / 100; // Convert from cents

            // Create order
            $order = Order::create([
                'stripe_session_id' => $session->id,
                'total' => $total,
                'currency' => $session->currency,
                'status' => 'paid',
                'meta' => [
                    'customer_email' => $session->customer_details->email ?? null,
                    'customer_name' => $session->customer_details->name ?? null,
                ],
            ]);

            // Create order item
            if (isset($metadata->artwork_id)) {
                $artwork = Artwork::find($metadata->artwork_id);
                if ($artwork) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'artwork_id' => $artwork->id,
                        'qty' => 1,
                        'unit_price' => $total,
                        'title_snapshot' => $artwork->title,
                    ]);
                }
            } elseif (isset($metadata->edition_id)) {
                $edition = Edition::find($metadata->edition_id);
                if ($edition) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'edition_id' => $edition->id,
                        'qty' => 1,
                        'unit_price' => $total,
                        'title_snapshot' => $edition->artwork->title . ' - Edition',
                    ]);

                    // Decrease stock
                    $edition->decrement('stock');
                }
            }

            // Send receipt email
            $customerEmail = $session->customer_details->email ?? null;
            if ($customerEmail) {
                Mail::to($customerEmail)->send(new OrderReceipt($order));
            }

            Log::info('Order created successfully', ['order_id' => $order->id, 'session_id' => $session->id]);

        } catch (\Exception $e) {
            Log::error('Failed to process checkout session: ' . $e->getMessage(), [
                'session_id' => $session->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
