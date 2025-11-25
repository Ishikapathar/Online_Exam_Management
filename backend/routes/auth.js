const express = require('express');
const router = express.Router();
const db = require('../db');
const otpService = require('../services/otpService');
const EmailVerificationAgent = require('../services/langchainEmailAgent');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Generate OTP for new user
    const otp = otpService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Insert new user with OTP
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, otp_code, otp_expires_at) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, otp, otpExpiresAt]
    );
    
    // Send OTP via LangChain Email Agent with AI capabilities
    const emailAgent = new EmailVerificationAgent();
    const otpSent = await emailAgent.sendVerificationEmail(email, otp, username);
    
    if (!otpSent) {
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
    
    res.status(201).json({ 
      message: 'Registration successful! Please check your email for OTP to complete registration.',
      requiresOTP: true,
      email: email,
      tempUserId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});



// Login user - Send OTP for verification
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    console.log('Users found:', users.length);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Generate new OTP for login
    const otp = otpService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Update user with new OTP
    await db.query(
      'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
      [otp, otpExpiresAt, user.id]
    );
    
    // Send OTP via LangChain Email Agent with AI capabilities
    const emailAgent = new EmailVerificationAgent();
    await emailAgent.sendVerificationEmail(email, otp, user.username);
    
    res.json({ 
      message: 'OTP sent to your email address. Please check your inbox.',
      requiresOTP: true,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// Verify OTP and complete authentication
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('OTP verification attempt for:', email);
    
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Verify OTP
    const verification = otpService.verifyOTP(user.otp_code, otp, user.otp_expires_at);
    
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason });
    }
    
    // Clear OTP after successful verification
    await db.query(
      'UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
      [user.id]
    );
    
    console.log('✅ OTP verified successfully for:', user.username);
    
    // Return user data for successful login
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      message: 'OTP verified successfully! Welcome back!',
      loginSuccess: true
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Generate new OTP
    const otp = otpService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Update user with new OTP
    await db.query(
      'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
      [otp, otpExpiresAt, user.id]
    );
    
    // Send new OTP via LangChain Email Agent with AI capabilities
    const emailAgent = new EmailVerificationAgent();
    const otpSent = await emailAgent.sendVerificationEmail(email, otp, user.username);
    
    if (!otpSent) {
      return res.status(500).json({ error: 'Failed to resend OTP' });
    }
    
    res.json({ message: 'OTP resent successfully! Check your email.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Secure OTP system - OTP codes are only available via email

module.exports = router;
