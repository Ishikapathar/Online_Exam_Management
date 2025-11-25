# Email Verification Setup Guide

## Overview
The system now requires email verification before users can login. A 6-digit code is sent to the user's email during registration.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or Other)
3. Click "Generate"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```
**Note:** Remove spaces from the app password

## Testing

### 1. Start Backend Server
```bash
cd backend
node index.js
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Registration Flow
1. Go to signup page
2. Enter username, email, password
3. Check your email for 6-digit code
4. Enter code on verification page
5. Login with your credentials

## Email Template
The verification email includes:
- Branded header with gradient background
- Large 6-digit code display
- 10-minute expiration warning
- Security tips
- Professional footer

## API Endpoints

### POST /api/auth/register
Registers user and sends verification email
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /api/auth/verify
Verifies email with code
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

### POST /api/auth/resend-code
Resends verification code
```json
{
  "email": "john@example.com"
}
```

### POST /api/auth/login
Login (requires verified email)
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Ensure app password (not regular password) is used
- Verify 2FA is enabled on Gmail account
- Check backend console for error messages

### Code Expired
- Codes expire after 10 minutes
- Click "Resend Code" to get a new one

### Already Verified Error
- User can only verify once
- Proceed to login page

## Security Features
- ✅ 6-digit random verification code
- ✅ 10-minute code expiration
- ✅ Email must be verified before login
- ✅ One-time verification per user
- ✅ Secure HTML email template
- ✅ Resend code functionality

## Alternative Email Services

### Using Other Providers (Outlook, Yahoo, etc.)
Update `backend/services/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // or smtp.mail.yahoo.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Production Recommendations
1. Use environment-specific email accounts
2. Implement rate limiting on resend code
3. Add CAPTCHA to prevent spam
4. Log all verification attempts
5. Consider SMS verification as backup
6. Use professional email service (SendGrid, AWS SES)
