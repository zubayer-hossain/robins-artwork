<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .order-details { background: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Receipt</h1>
            <p>Thank you for your purchase!</p>
        </div>

        <div class="order-details">
            <h3>Order #{{ $order->id }}</h3>
            <p><strong>Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
            <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
            <p><strong>Total:</strong> ${{ number_format($order->total, 2) }} {{ strtoupper($order->currency) }}</p>
        </div>

        <h3>Items:</h3>
        @foreach($order->items as $item)
        <div class="item">
            <p><strong>{{ $item->title_snapshot }}</strong></p>
            <p>Quantity: {{ $item->qty }} × ${{ number_format($item->unit_price, 2) }}</p>
        </div>
        @endforeach

        <div class="total">
            Total: ${{ number_format($order->total, 2) }} {{ strtoupper($order->currency) }}
        </div>

        <div class="footer">
            <p>If you have any questions, please contact us.</p>
            <p>{{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>
