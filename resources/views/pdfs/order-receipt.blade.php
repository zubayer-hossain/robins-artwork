<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Order Receipt #{{ $order->id }}</title>
    <style>
        /* Page box: leave space for fixed footer */
        @page { margin: 30px 40px 88px 40px; }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            color: #1f2937; /* slate-800 */
            font-size: 12px;
            line-height: 1.45;
        }
        .wrap { width: 100%; }

        /* Utilities */
        .muted { color: #6b7280; }           /* slate-500 */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .fw-600 { font-weight: 600; }
        .small { font-size: 11px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }

        /* Header */
        .header-table { width: 100%; border-collapse: collapse; }
        .header-table td { vertical-align: top; }
        .brand-name { font-size: 18px; font-weight: 700; letter-spacing: 0.2px; }
        .doc-title { font-size: 22px; font-weight: 700; }

        /* Generic boxed table */
        .block {
            width: 100%;
            border: 1px solid #e5e7eb;       /* gray-200 */
            border-collapse: collapse;
        }
        .block th, .block td {
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
            vertical-align: top;
        }
        .block th {
            background: #f3f4f6;             /* gray-100 */
            text-align: left;
            font-weight: 700;
        }

        /* Items */
        .items { width: 100%; border-collapse: collapse; }
        .items th, .items td {
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
        }
        .items th {
            background: #eef2ff;             /* indigo-50 */
            font-weight: 700;
            color: #1f2937;
        }
        .items td { vertical-align: top; }
        .col-qty { width: 50px; text-align: right; }
        .col-price { width: 100px; text-align: right; }
        .col-total { width: 110px; text-align: right; }
        .col-sku { width: 140px; }

        /* Two-column summary (Notes left, Totals right) */
        .summary { width: 100%; border-collapse: separate; border-spacing: 0 0; table-layout: fixed; }
        .summary td { vertical-align: top; }
        .summary .left  { width: 60%; padding-right: 12px; }
        .summary .right { width: 40%; padding-left: 12px; }

        /* Notes box (cleaner look) */
        .notes {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-collapse: collapse;
        }
        .notes th {
            background: #f3f4f6;
            text-align: left;
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 700;
        }
        .notes td { padding: 8px 10px; }

        /* Totals */
        .totals {
            width: 100%;
            border-collapse: collapse;
        }
        .totals td {
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
        }
        .totals .label { background: #f9fafb; font-weight: 600; }
        .totals .num { text-align: right; }
        .grand {
            background: #111827;              /* gray-900 */
            color: #ffffff;
            font-weight: 700;
        }

        /* Thank-you line aligned with totals */
        .thankyou {
            margin-top: 10px;
            font-size: 12px;
            color: #4b5563;                   /* slate-600 */
            text-align: right;
        }

        /* Footer (page number is drawn from controller with Dompdf canvas) */
        .footer {
            position: fixed;
            bottom: 14px;
            left: 40px;
            right: 40px;
            font-size: 11px;
            color: #6b7280;
        }
        .footer table { width: 100%; border-collapse: collapse; }
        .footer td { vertical-align: middle; }
    </style>
</head>
<body>
    <div class="wrap">

        {{-- HEADER --}}
        <table class="header-table mb-8">
            <tr>
                <td style="width: 60%;">
                    @if(!empty($logoUrl))
                        <img src="{{ $logoUrl }}" alt="Logo" style="height: 48px;">
                    @else
                        <div class="brand-name">Robin's Artwork</div>
                    @endif
                    <div class="small muted">
                        {{ rtrim(config('app.url'), '/') }} • hello@robins-artwork.example
                    </div>
                </td>
                <td class="text-right">
                    <div class="doc-title">Order Receipt</div>
                    <div class="muted">Receipt No: RCP-{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
                    <div class="muted">Date: {{ $order->created_at?->timezone(config('app.timezone'))->format('F j, Y') }}</div>
                </td>
            </tr>
        </table>

        {{-- ORDER META --}}
        <table class="block mb-6">
            <tr>
                <th style="width: 25%;">Order #</th>
                <td style="width: 25%;">{{ $order->id }}</td>
                <th style="width: 25%;">Status</th>
                <td style="width: 25%;">{{ ucfirst($order->status) }}</td>
            </tr>
            <tr>
                <th>Payment Method</th>
                <td>{{ $order->payment_method ?? '—' }}</td>
                <th>Currency</th>
                <td>{{ strtoupper($order->currency ?? 'USD') }}</td>
            </tr>
        </table>

        {{-- ADDRESSES --}}
        <table class="block mb-8">
            <tr>
                <th style="width: 50%;">Bill To</th>
                <th style="width: 50%;">Ship To</th>
            </tr>
            <tr>
                <td>
                    @php $b = $order->billingAddress; @endphp
                    @if($b)
                        <div class="fw-600">{{ $b->name }}</div>
                        {{ $b->line1 }}@if($b->line2), {{ $b->line2 }}@endif<br>
                        {{ $b->city }}, {{ $b->state }} {{ $b->postal_code }}<br>
                        {{ $b->country }}<br>
                        @if($b->phone)<span class="muted small">Phone: {{ $b->phone }}</span>@endif
                    @else
                        —
                    @endif
                </td>
                <td>
                    @php $s = $order->shippingAddress; @endphp
                    @if($s)
                        <div class="fw-600">{{ $s->name }}</div>
                        {{ $s->line1 }}@if($s->line2), {{ $s->line2 }}@endif<br>
                        {{ $s->city }}, {{ $s->state }} {{ $s->postal_code }}<br>
                        {{ $s->country }}<br>
                        @if($s->phone)<span class="muted small">Phone: {{ $s->phone }}</span>@endif
                    @else
                        —
                    @endif
                </td>
            </tr>
        </table>

        {{-- ITEMS --}}
        <table class="items mb-6">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th class="col-sku">SKU / Edition</th>
                    <th class="col-qty">Qty</th>
                    <th class="col-price">Unit Price</th>
                    <th class="col-total">Line Total</th>
                </tr>
            </thead>
            <tbody>
            @php
                $currency = strtoupper($order->currency ?? 'USD');
                $idx = 1;
            @endphp
            @foreach($order->items as $item)
                @php
                    $title = $item->title_snapshot ?? ($item->artwork->title ?? 'Item');
                    $sku   = $item->sku ?? ($item->edition->sku ?? '—');
                    $qty   = (int) $item->qty;
                    $unit  = (float) $item->unit_price;
                    $line  = $qty * $unit;
                @endphp
                <tr>
                    <td class="text-center">{{ $idx++ }}</td>
                    <td>
                        <div class="fw-600">{{ $title }}</div>
                        @if(!empty($item->notes))<div class="small muted">{{ $item->notes }}</div>@endif
                    </td>
                    <td class="small">{{ $sku }}</td>
                    <td class="col-qty">{{ number_format($qty) }}</td>
                    <td class="col-price">{{ number_format($unit, 2) }} {{ $currency }}</td>
                    <td class="col-total fw-600">{{ number_format($line, 2) }} {{ $currency }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{-- SUMMARY (Notes + Totals side-by-side, aligned) --}}
        @php
            $subtotal = $order->subtotal ?? $order->items->sum(fn($i) => $i->qty * $i->unit_price);
            $shipping = $order->shipping_total ?? 0;
            $discount = $order->discount_total ?? 0;
            $tax      = $order->tax_total ?? 0;
            $grand    = $order->total ?? max(0, $subtotal + $shipping + $tax - $discount);
        @endphp

        <table class="summary">
            <tr>
                <td class="left">
                    @if(!empty($order->order_notes))
                        <table class="notes">
                            <tr><th>Notes</th></tr>
                            <tr>
                                <td>{{ $order->order_notes }}</td>
                            </tr>
                        </table>
                    @endif
                </td>
                <td class="right">
                    <table class="totals">
                        <tr>
                            <td class="label">Subtotal</td>
                            <td class="num">{{ number_format($subtotal, 2) }} {{ $currency }}</td>
                        </tr>
                        <tr>
                            <td class="label">Shipping</td>
                            <td class="num">{{ number_format($shipping, 2) }} {{ $currency }}</td>
                        </tr>
                        <tr>
                            <td class="label">Discount</td>
                            <td class="num">-{{ number_format($discount, 2) }} {{ $currency }}</td>
                        </tr>
                        <tr>
                            <td class="label">Tax</td>
                            <td class="num">{{ number_format($tax, 2) }} {{ $currency }}</td>
                        </tr>
                        <tr>
                            <td class="grand">Grand Total</td>
                            <td class="grand num">{{ number_format($grand, 2) }} {{ $currency }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    </div>

    {{-- FOOTER (page number drawn in controller via $canvas->page_text) --}}
    <div class="footer">
        <table>
            <tr>
                <td class="small">Robin's Artwork • This is a system-generated receipt.</td>
            </tr>
        </table>
    </div>
</body>
</html>
