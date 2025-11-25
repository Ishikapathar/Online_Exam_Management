// Ultra-fast OTP service - NO EMAIL DEPENDENCY
class OTPService {
  constructor() {
    // Always instant - no email services
    this.otpStore = new Map(); // Store OTPs temporarily
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Instant OTP delivery - NO EMAIL AT ALL
  async sendOTP(email, otp, username) {
    // Store OTP for instant retrieval
    this.otpStore.set(email, {
      otp,
      username,
      timestamp: new Date()
    });

    // Instant console display - NO DELAYS
    console.log('\n🚀 ========== INSTANT OTP ==========');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 User: ${username}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`⏰ Valid for: 5 minutes`);
    console.log(`⚡ Status: READY NOW!`);
    console.log('===================================\n');
    
    // Return immediately - NO WAITING
    return Promise.resolve(true);
  }

  // Get OTP for development (helper method)
  getStoredOTP(email) {
    return this.otpStore.get(email);
  }

  // Verify OTP (check if code matches and hasn't expired)
  verifyOTP(storedOTP, providedOTP, expiresAt) {
    if (!storedOTP || !providedOTP) {
      return { valid: false, reason: 'Missing OTP code' };
    }

    if (storedOTP !== providedOTP) {
      return { valid: false, reason: 'Invalid OTP code' };
    }

    if (new Date() > new Date(expiresAt)) {
      return { valid: false, reason: 'OTP has expired' };
    }

    return { valid: true, reason: 'OTP verified successfully' };
  }
}

module.exports = new OTPService();