import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login - Send OTP
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.requiresOTP) {
          // Show OTP verification form
          setOtpEmail(response.data.email);
          setShowOTPVerification(true);
          setSuccess(response.data.message + ' 📧');
        }
      } else {
        // Signup - Send OTP
        const response = await axios.post(`${API_URL}/auth/register`, formData);
        if (response.data.requiresOTP) {
          // Show OTP verification form
          setOtpEmail(response.data.email);
          setShowOTPVerification(true);
          setSuccess(response.data.message + ' 📧');
          setFormData({ username: '', email: '', password: '' });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: otpEmail,
        otp: otp
      });
      
      if (response.data.loginSuccess) {
        // Store user data and login
        localStorage.setItem('user', JSON.stringify(response.data));
        setSuccess(response.data.message + ' 🎉');
        setTimeout(() => {
          onLogin(response.data);
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/auth/resend-otp`, {
        email: otpEmail
      });
      setSuccess('OTP resent! Check your email. 📧');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    }
  };



  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      maxWidth: '450px',
      width: '100%'
    },
    icon: {
      fontSize: '3rem',
      textAlign: 'center',
      marginBottom: '10px'
    },
    title: {
      color: '#1e3a8a',
      fontSize: '2rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '10px'
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '30px',
      fontSize: '0.95rem'
    },
    form: {
      display: 'grid',
      gap: '20px'
    },
    inputGroup: {
      display: 'grid',
      gap: '8px'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#1a202c'
    },
    input: {
      padding: '14px 18px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '0.95rem',
      transition: 'all 0.3s',
      outline: 'none',
      backgroundColor: 'white'
    },
    button: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      marginTop: '10px',
      transition: 'all 0.3s'
    },
    switchText: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '0.9rem',
      color: '#64748b'
    },
    switchLink: {
      color: '#1e3a8a',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    error: {
      backgroundColor: '#fee',
      color: '#c00',
      border: '1px solid #fcc'
    },
    success: {
      backgroundColor: '#efe',
      color: '#080',
      border: '1px solid #cfc'
    }
  };

  // OTP verification form
  if (showOTPVerification) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>🔐</div>
          <h1 style={styles.title}>Enter OTP</h1>
          <p style={styles.subtitle}>
            OTP sent to <strong>{otpEmail}</strong>
          </p>
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '0.95rem',
            color: '#1565c0',
            textAlign: 'center'
          }}>
            📧 <strong>Check Your Email:</strong> We've sent a 6-digit verification code to your email address.
          </div>

          {error && (
            <div style={{ ...styles.alert, ...styles.error }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ ...styles.alert, ...styles.success }}>
              {success}
            </div>
          )}

          <form onSubmit={handleOTPVerification} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP Code</label>
              <input
                type="text"
                style={{...styles.input, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem'}}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Verify OTP
            </button>
          </form>

          <div style={styles.switchText}>
            Didn't receive the OTP?{' '}
            <span 
              style={styles.switchLink}
              onClick={handleResendOTP}
            >
              Resend OTP
            </span>
          </div>

          <div style={styles.switchText}>
            <span 
              style={styles.switchLink}
              onClick={() => {
                setShowOTPVerification(false);
                setOtp('');
                setError('');
                setSuccess('');
              }}
            >
              ← Back to Login
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>📚</div>
        <h1 style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Sign in to access the exam system' : 'Sign up to get started'}
        </p>

        {error && (
          <div style={{ ...styles.alert, ...styles.error }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ ...styles.alert, ...styles.success }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                style={styles.input}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required={!isLogin}
                placeholder="Enter your username"
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" style={styles.button}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            style={styles.switchLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setFormData({ username: '', email: '', password: '' });
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
