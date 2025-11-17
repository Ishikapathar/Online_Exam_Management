import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const styles = {
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px',
      backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '500'
    },
    icon: {
      fontSize: '1.5rem'
    },
    message: {
      flex: 1
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0',
      opacity: 0.8,
      transition: 'opacity 0.2s'
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '✓';
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={styles.toast}>
        <span style={styles.icon}>{getIcon()}</span>
        <span style={styles.message}>{message}</span>
        <button 
          style={styles.closeBtn} 
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;
