const nodemailer = require('nodemailer');

// AI-Powered Email Agent (Simplified)
class EmailVerificationAgent {
  constructor() {
    // Load email credentials from secrets file
    let emailConfig = {};
    try {
      emailConfig = require('../config/secrets.local.json');
    } catch (error) {
      console.log('⚠️  Email config not found, using environment variables');
      emailConfig = {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      };
    }

    this.openaiKey = emailConfig.OPENAI_API_KEY;

    // Create Gmail transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.EMAIL_USER,
        pass: emailConfig.EMAIL_PASSWORD
      }
    });
  }

  async sendVerificationEmail(email, otp, username = 'User') {
    try {
      console.log(`🤖 AI-Powered Email Agent sending OTP to ${email}...`);
      
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: email,
        subject: '🔐 Your OTP Code - Online Exam System',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0; 
                padding: 20px; 
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 15px; 
                overflow: hidden; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
              }
              .header { 
                background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
              }
              .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: 700; 
              }
              .content { 
                padding: 40px 30px; 
                text-align: center; 
              }
              .otp-box { 
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); 
                color: white;
                border-radius: 15px; 
                padding: 30px; 
                margin: 30px 0; 
                box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
              }
              .otp { 
                font-size: 48px; 
                font-weight: bold; 
                letter-spacing: 8px; 
                margin: 10px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
              }
              .footer { 
                background: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                font-size: 14px; 
                color: #6c757d; 
              }
              .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Online Exam System</h1>
                <p>Secure Authentication</p>
              </div>
              <div class="content">
                <h2>Hello, ${username}! 👋</h2>
                <p style="font-size: 16px; color: #495057;">
                  Your One-Time Password (OTP) for secure login:
                </p>
                
                <div class="otp-box">
                  <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your OTP Code</p>
                  <div class="otp">${otp}</div>
                  <p style="margin: 0; font-size: 14px; opacity: 0.8;">Valid for 5 minutes</p>
                </div>
                
                <div class="warning">
                  <strong>🔒 Security Notice:</strong><br>
                  • Never share this code with anyone<br>
                  • This code expires in 5 minutes<br>
                  • If you didn't request this, please ignore this email
                </div>
                
                <p style="color: #6c757d; font-size: 14px;">
                  This is an automated email from the Online Exam Management System.<br>
                  Please do not reply to this email.
                </p>
              </div>
              <div class="footer">
                © ${new Date().getFullYear()} Online Exam System | Powered by LangChain AI
              </div>
            </div>
          </body>
          </html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('\n🤖 ========== AI EMAIL AGENT ==========');
      console.log(`📧 Real Email Sent To: ${email}`);
      console.log(`👤 User: ${username}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log(`🚀 Status: DELIVERED BY AI AGENT`);
      console.log(`🤖 OpenAI Key: ${this.openaiKey ? 'CONFIGURED ✅' : 'NOT SET ❌'}`);
      console.log('=====================================\n');
      
      return true;
    } catch (error) {
      console.error('❌ AI Email Agent Error:', error);
      
      // Fallback to console display
      console.log(`\n🚨 EMAIL DELIVERY FAILED - CONSOLE FALLBACK 🚨`);
      console.log(`📧 Email: ${email}`);
      console.log(`👤 User: ${username}`);
      console.log(`🔑 OTP Code: ${otp}`);
      console.log(`⏰ Expires: 5 minutes from now`);
      console.log(`🤖 OpenAI Key: ${this.openaiKey ? 'Available for future AI features' : 'Not configured'}`);
      console.log(`🚨 ================================== 🚨\n`);
      
      return false;
    }
  }

  // AI-powered email content generation (ready for future use)
  async generateCustomEmailContent(username, examType = 'general') {
    if (!this.openaiKey) {
      return `Hello ${username}! Welcome to your online exam. Good luck!`;
    }
    
    // Future: Use OpenAI API directly or with LangChain for custom content
    const customMessage = `Hello ${username}! 🎓 Get ready for your ${examType} exam. You've got this! Our AI-powered system is here to support your success. Best of luck! ✨`;
    return customMessage;
  }
}

module.exports = EmailVerificationAgent;