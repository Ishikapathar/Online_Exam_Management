const nodemailer = require('nodemailer');

// Load optional local secrets (Option 2) without requiring .env
let localSecrets = {};
try {
  // Do not fail if file does not exist
  // eslint-disable-next-line global-require, import/no-dynamic-require
  localSecrets = require('../config/secrets.local.json');
} catch (_) {
  localSecrets = {};
}

// Resolve credentials from environment first, then local secrets, then placeholder
const EMAIL_USER = process.env.EMAIL_USER || localSecrets.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || localSecrets.EMAIL_PASSWORD || 'your-app-password';

// Create transporter - Using Gmail as example
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, code, username) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: '🔐 Your Verification Code - Online Exam System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .code-box { background: #f0f4ff; border: 2px dashed #1e3a8a; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px; }
          .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Online Exam System</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${username}! 👋</h2>
            <p>Thank you for signing up. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="code-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
              <div class="code">${code}</div>
            </div>
            
            <p><strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px;">
              <strong>Security Tips:</strong><br>
              • Never share your verification code with anyone<br>
              • Our team will never ask for your code via email or phone<br>
              • If you suspect unauthorized access, contact us immediately
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Online Exam System. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
};
