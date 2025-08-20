<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Edition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'artwork_id' => 'nullable|exists:artworks,id',
            'edition_id' => 'nullable|exists:editions,id',
        ], [
            'artwork_id.required_without' => 'Either artwork_id or edition_id is required.',
            'edition_id.required_without' => 'Either artwork_id or edition_id is required.',
        ]);

        if ($request->artwork_id && $request->edition_id) {
            return back()->withErrors(['message' => 'Cannot purchase both artwork and edition.']);
        }

        Stripe::setApiKey(config('cashier.secret'));

        try {
            if ($request->artwork_id) {
                $artwork = Artwork::findOrFail($request->artwork_id);
                
                if ($artwork->status !== 'published' || !$artwork->price) {
                    return back()->withErrors(['message' => 'Artwork not available for purchase.']);
                }

                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $artwork->title,
                                'description' => $artwork->medium . ($artwork->year ? ' (' . $artwork->year . ')' : ''),
                            ],
                            'unit_amount' => (int) ($artwork->price * 100),
                        ],
                        'quantity' => 1,
                    ]],
                    'mode' => 'payment',
                    'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => route('checkout.cancel'),
                    'metadata' => [
                        'artwork_id' => $artwork->id,
                        'type' => 'artwork',
                    ],
                ]);
            } else {
                $edition = Edition::with('artwork')->findOrFail($request->edition_id);
                
                if ($edition->stock <= 0) {
                    return back()->withErrors(['message' => 'Edition out of stock.']);
                }

                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $edition->artwork->title . ' - Edition',
                                'description' => $edition->artwork->medium . ' Edition #' . $edition->sku,
                            ],
                            'unit_amount' => (int) ($edition->price * 100),
                        ],
                        'quantity' => 1,
                    ]],
                    'mode' => 'payment',
                    'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => route('checkout.cancel'),
                    'metadata' => [
                        'edition_id' => $edition->id,
                        'type' => 'edition',
                    ],
                ]);
            }

            return redirect($session->url);
        } catch (\Exception $e) {
            Log::error('Stripe checkout error: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Unable to create checkout session.']);
        }
    }

    public function success(Request $request): Response
    {
        return Inertia::render('Checkout/Success', [
            'sessionId' => $request->session_id,
        ]);
    }

    public function cancel(): Response
    {
        return Inertia::render('Checkout/Cancel');
    }
}
