const nodemailer = require('nodemailer');

class SimpleEmailAgent {
  constructor() {
    // Load email credentials from secrets file
    let emailConfig = {};
    try {
      emailConfig = require('../config/secrets.local.json');
    } catch (error) {
      console.log('⚠️  Email config not found, using environment variables');
      emailConfig = {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
      };
    }

    // Create Gmail transporter
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: emailConfig.EMAIL_USER,
        pass: emailConfig.EMAIL_PASSWORD
      }
    });
  }

  async sendVerificationEmail(email, otp, username = 'User') {
    try {
      console.log(`📧 Sending OTP to ${email}...`);
      
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: email,
        subject: '🔐 Your OTP Code - Online Exam System',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
                color: white;
                border-radius: 12px;
                overflow: hidden;
              }
              .header {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                text-align: center;
              }
              .content {
                padding: 40px 30px;
                background: white;
                color: #1e3a8a;
              }
              .otp-box {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                margin: 25px 0;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                box-shadow: 0 8px 32px rgba(30, 58, 138, 0.3);
              }
              .footer {
                background: #0f172a;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #94a3b8;
              }
              .warning {
                background: #fef3c7;
                color: #92400e;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #f59e0b;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🎓 Online Exam System</h1>
                <p>Secure Authentication</p>
              </div>
              
              <div class="content">
                <h2>Hello ${username}! 👋</h2>
                <p>You have requested to log in to your Online Exam System account. Please use the verification code below to complete your authentication:</p>
                
                <div class="otp-box">
                  ${otp}
                </div>
                
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This code expires in <strong>5 minutes</strong></li>
                    <li>Never share this code with anyone</li>
                    <li>Our team will never ask for this code</li>
                  </ul>
                </div>
                
                <p>If you didn't request this code, please ignore this email or contact our support team immediately.</p>
                
                <p style="margin-top: 30px;">
                  Best regards,<br>
                  <strong>Online Exam System Team</strong>
                </p>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Online Exam System. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`🔑 OTP Code: ${otp} (Expires in 5 minutes)`);
      
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      
      // Fallback to console display if email fails
      console.log(`\n🚨 EMAIL DELIVERY FAILED - CONSOLE FALLBACK 🚨`);
      console.log(`📧 Email: ${email}`);
      console.log(`👤 User: ${username}`);
      console.log(`🔑 OTP Code: ${otp}`);
      console.log(`⏰ Expires: 5 minutes from now`);
      console.log(`🚨 ================================== 🚨\n`);
      
      return false;
    }
  }
}

module.exports = SimpleEmailAgent;