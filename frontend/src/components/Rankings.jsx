import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/results/rankings`);
      setRankings(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    heading: {
      color: '#1e3a8a',
      marginBottom: '35px',
      fontSize: '1.3rem',
      textAlign: 'center',
      fontWeight: '700'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '28px',
      marginBottom: '18px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      border: '2px solid #e8eaff'
    },
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(30, 58, 138, 0.2)'
    },
    rank: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginRight: '20px',
      minWidth: '60px'
    },
    studentInfo: {
      flex: 1
    },
    studentName: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '8px'
    },
    regNumber: {
      fontSize: '0.95rem',
      color: '#718096',
      fontWeight: '500'
    },
    stats: {
      display: 'flex',
      gap: '25px',
      marginTop: '12px'
    },
    stat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#718096',
      marginBottom: '6px',
      fontWeight: '600'
    },
    statValue: {
      fontSize: '1.2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    percentage: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      color: '#10b981'
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '25px'
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.3rem',
      color: '#718096',
      padding: '50px',
      fontWeight: '600'
    },
    noData: {
      textAlign: 'center',
      fontSize: '1.15rem',
      color: '#718096',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '15px',
      border: '2px solid #e8eaff',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading rankings... 📊</div>;
  }

  if (rankings.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>🏆 Top Performers</h2>
        <div style={styles.noData}>
          No results available yet. Add some exam results to see rankings!
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏆 Top Performers</h2>
      
      {rankings.map((student, index) => (
        <div
          key={student.id}
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.row}>
            <div style={styles.rank}>{getMedalEmoji(index + 1)}</div>
            
            <div style={styles.studentInfo}>
              <div style={styles.studentName}>{student.name}</div>
              <div style={styles.regNumber}>Reg: {student.registration_number}</div>
              
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <div style={styles.statLabel}>Total Exams</div>
                  <div style={styles.statValue}>{student.total_exams}</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statLabel}>Total Marks</div>
                  <div style={styles.statValue}>{Math.round(student.total_marks)}</div>
                </div>
              </div>
            </div>
            
            <div style={styles.percentage}>
              {parseFloat(student.average_percentage).toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rankings;
