import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import SubjectForm from './components/SubjectForm';
import ResultForm from './components/ResultForm';
import Rankings from './components/Rankings';
import StudentPerformance from './components/StudentPerformance';
import Auth from './components/Auth';

const App = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const styles = {
    container: {
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '30px 20px'
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '40px',
      paddingTop: '30px',
      position: 'relative'
    },
    userInfo: {
      position: 'absolute',
      top: '30px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      fontSize: '0.85rem'
    },
    username: {
      fontWeight: '600',
      opacity: 0.9
    },
    logoutBtn: {
      padding: '8px 20px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)'
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '10px'
    },
    icon: {
      fontSize: '2rem',
      filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.2))'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '0',
      textShadow: '2px 2px 10px rgba(0,0,0,0.2)',
      fontWeight: '700',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '0.85rem',
      opacity: 0.9,
      fontWeight: '300',
      letterSpacing: '1px',
      marginTop: '5px'
    },
    tabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '12px 28px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
      color: 'white',
      backdropFilter: 'blur(5px)'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#1e3a8a',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      border: '2px solid white'
    },
    content: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '25px',
      padding: '35px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      minHeight: '600px',
      backdropFilter: 'blur(10px)'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.userInfo}>
          <span style={styles.username}>👤 {user.username}</span>
          <button 
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            Logout
          </button>
        </div>
        <div style={styles.titleWrapper}>
          <span style={styles.icon}>📚</span>
          <h1 style={styles.title}>Online Exam System</h1>
        </div>
        <p style={styles.subtitle}>Manage Students, Exams, and Results</p>
      </header>

      <div style={styles.tabs}>
        <button
          style={{...styles.tab, ...(activeTab === 'students' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'subjects' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('subjects')}
        >
          Subjects
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'exams' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('exams')}
        >
          Exams & Results
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'performance' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'rankings' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('rankings')}
        >
          Rankings
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'students' && <StudentForm />}
        {activeTab === 'subjects' && <SubjectForm />}
        {activeTab === 'exams' && <ResultForm />}
        {activeTab === 'performance' && <StudentPerformance />}
        {activeTab === 'rankings' && <Rankings />}
      </div>
    </div>
  );
};

export default App;
