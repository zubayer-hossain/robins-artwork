<?php

namespace App\Mail;

use App\Models\Order;
use App\Services\CmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Receipt - ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        $currencyCode = CmsService::getDefaultCurrency();
        $currencySymbol = CmsService::getCurrencySymbol($currencyCode);

        return new Content(
            view: 'emails.order-receipt',
            with: [
                'order' => $this->order,
                'currencyCode' => $currencyCode,
                'currencySymbol' => $currencySymbol,
            ],
        );
    }
}
