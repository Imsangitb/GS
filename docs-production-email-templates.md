# Production-Ready Email Templates

These templates include proper button links for when your site is deployed to production.

## 1. Password Reset Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Password - Glossify Store</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      text-align: center;
      color: #888888;
      font-size: 12px;
      padding: 20px;
      border-top: 1px solid #eeeeee;
    }
    .notice {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GLOSSIFY STORE</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password for your Glossify Store account. Click the button below:</p>
      
      <!-- Button -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
              <tr>
                <td align="center" style="border-radius: 4px;" bgcolor="#000000">
                  <a href="{{ .ResetURL }}" 
                     target="_blank" 
                     style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #000000; display: inline-block; font-weight: bold;">
                     Reset Password
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <div class="notice">
        <p>This link expires in 24 hours.</p>
      </div>
      
      <p style="font-size: 14px; color: #777777;">If you didn't request this, please disregard this email.</p>
      <p style="font-size: 14px; color: #777777;">Link not working? Copy and paste this URL into your browser:<br>
      {{ .ResetURL }}</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Glossify Store</p>
      <p>This is an automated message.</p>
    </div>
  </div>
</body>
</html>
```

## 2. Confirm Your Signup Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email - Glossify Store</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      text-align: center;
      color: #888888;
      font-size: 12px;
      padding: 20px;
      border-top: 1px solid #eeeeee;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GLOSSIFY STORE</h1>
    </div>
    <div class="content">
      <h2>Welcome to Glossify Store!</h2>
      <p>Thank you for joining us. Please verify your email address:</p>
      
      <!-- Button -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
              <tr>
                <td align="center" style="border-radius: 4px;" bgcolor="#000000">
                  <a href="{{ .ConfirmationURL }}" 
                     target="_blank" 
                     style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #000000; display: inline-block; font-weight: bold;">
                     Verify Email
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <p style="font-size: 14px; color: #777777;">If you didn't create an account, please disregard this email.</p>
      <p style="font-size: 14px; color: #777777;">Link not working? Copy and paste this URL into your browser:<br>
      {{ .ConfirmationURL }}</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Glossify Store</p>
      <p>This is an automated message.</p>
    </div>
  </div>
</body>
</html>
```

## 3. Confirm Email Change Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Email Change - Glossify Store</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      text-align: center;
      color: #888888;
      font-size: 12px;
      padding: 20px;
      border-top: 1px solid #eeeeee;
    }
    .notice {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GLOSSIFY STORE</h1>
    </div>
    <div class="content">
      <h2>Email Change Verification</h2>
      <p>We received a request to change your email address. Please verify this change:</p>
      
      <!-- Button -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
              <tr>
                <td align="center" style="border-radius: 4px;" bgcolor="#000000">
                  <a href="{{ .ConfirmationURL }}" 
                     target="_blank" 
                     style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #000000; display: inline-block; font-weight: bold;">
                     Verify Change
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <div class="notice">
        <p>If you didn't request this change, please contact us.</p>
      </div>
      
      <p style="font-size: 14px; color: #777777;">Link not working? Copy and paste this URL into your browser:<br>
      {{ .ConfirmationURL }}</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Glossify Store</p>
      <p>This is an automated message.</p>
    </div>
  </div>
</body>
</html>
```

## 4. Confirm Reauthentication Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verification Code - Glossify Store</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      text-align: center;
      color: #888888;
      font-size: 12px;
      padding: 20px;
      border-top: 1px solid #eeeeee;
    }
    .code-box {
      background-color: #f5f5f5;
      padding: 15px;
      font-family: monospace;
      font-size: 24px;
      letter-spacing: 5px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GLOSSIFY STORE</h1>
    </div>
    <div class="content">
      <h2>Verification Code</h2>
      <p>Here's your verification code:</p>
      
      <div class="code-box">{{ .Token }}</div>
      
      <p>Enter this code on our website to complete verification.</p>
      <p><strong>Note:</strong> This code expires in 60 minutes.</p>
      
      <p style="font-size: 14px; color: #777777;">If you didn't request this code, please disregard this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Glossify Store</p>
      <p>This is an automated message.</p>
    </div>
  </div>
</body>
</html>
```

## Implementation Instructions

1. When your site is deployed to production:
   - Set your Supabase Site URL to your production domain (e.g., `https://glossifystore.studio`)
   - Update the Redirect URLs to include your production domain

2. Use these templates in your Supabase Authentication → Email Templates sections