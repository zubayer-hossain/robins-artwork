<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Re: {{ $contactMessage->subject }} - Robin's Artwork</title>
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
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        .message-box { 
            background: #f8f9fa; 
            padding: 25px; 
            margin-bottom: 25px; 
            border-radius: 8px;
            border-left: 4px solid #667eea;
            line-height: 1.7;
            white-space: pre-wrap;
        }
        .original-message {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        .original-message h4 {
            color: #666;
            font-size: 14px;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .original-content {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
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
            <h1>📧 Message from Robin's Artwork</h1>
            <p>Re: {{ $contactMessage->subject }}</p>
        </div>

        <div class="content">
            <p class="greeting">Hi {{ $contactMessage->name }},</p>
            
            <div class="message-box">{{ $replyMessage }}</div>

            <div class="original-message">
                <h4>Your Original Message</h4>
                <div class="original-content">{{ $contactMessage->message }}</div>
            </div>
        </div>

        <div class="footer">
            <p class="company-name">Robin's Artwork</p>
            <p>Thank you for contacting us!</p>
        </div>
    </div>
</body>
</html>
