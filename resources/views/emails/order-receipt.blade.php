<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Receipt - Robin's Artwork</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center; 
            padding: 40px 30px;
            margin: 0;
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: 600;
        }
        .header p { 
            margin: 0; 
            opacity: 0.9; 
            font-size: 16px;
        }
        .content { padding: 30px; }
        .order-info { 
            background: #f8f9fa; 
            padding: 25px; 
            margin-bottom: 25px; 
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .order-info h3 { 
            margin: 0 0 20px 0; 
            color: #667eea; 
            font-size: 18px;
        }
        .order-info p { 
            margin: 8px 0; 
            display: flex; 
            justify-content: space-between;
        }
        .order-info strong { color: #555; }
        .items-section h3 { 
            margin: 25px 0 20px 0; 
            color: #333; 
            font-size: 18px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .item { 
            background: #f8f9fa; 
            padding: 20px; 
            margin-bottom: 15px; 
            border-radius: 8px;
            border-left: 3px solid #28a745;
        }
        .item-title { 
            font-weight: 600; 
            color: #333; 
            margin-bottom: 8px;
            font-size: 16px;
        }
        .item-details { 
            color: #666; 
            font-size: 14px;
        }
        .total { 
            background: #667eea; 
            color: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: right; 
            margin-top: 25px;
            font-size: 18px;
            font-weight: 600;
        }
        .footer { 
            text-align: center; 
            padding: 25px; 
            background: #f8f9fa; 
            color: #666;
            border-top: 1px solid #eee;
        }
        .footer p { margin: 5px 0; }
        .company-name { 
            font-weight: 600; 
            color: #667eea; 
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Order Receipt</h1>
            <p>Thank you for choosing Robin's Artwork!</p>
        </div>

        <div class="content">
            <div class="order-info">
                <h3>Order Details</h3>
                <p><strong>Order #:</strong> <span>{{ $order->id }}</span></p>
                <p><strong>Date:</strong> <span>{{ $order->created_at->format('F j, Y') }}</span></p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: 600;">{{ ucfirst($order->status) }}</span></p>
                <p><strong>Total:</strong> <span style="font-weight: 600;">${{ number_format($order->total, 2) }} {{ strtoupper($order->currency) }}</span></p>
            </div>

            <div class="items-section">
                <h3>Order Items</h3>
                @foreach($order->items as $item)
                <div class="item">
                    <div class="item-title">{{ $item->title_snapshot }}</div>
                    <div class="item-details">Quantity: {{ $item->qty }} × ${{ number_format($item->unit_price, 2) }}</div>
                </div>
                @endforeach
            </div>

            <div class="total">
                Total: ${{ number_format($order->total, 2) }} {{ strtoupper($order->currency) }}
            </div>
        </div>

        <div class="footer">
            <p class="company-name">Robin's Artwork</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    </div>
</body>
</html>
