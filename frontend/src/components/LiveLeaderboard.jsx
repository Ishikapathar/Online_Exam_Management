import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setAnimating(true);
      const response = await axios.get('http://localhost:5000/api/students');
      
      // Calculate rankings with performance data
      const studentsWithScores = await Promise.all(
        response.data.map(async (student) => {
          try {
            const perfResponse = await axios.get(`http://localhost:5000/api/students/${student.id}/performance`);
            return {
              ...student,
              avgMarks: perfResponse.data.average_marks || 0,
              totalExams: perfResponse.data.total_exams || 0,
              badges: calculateBadges(perfResponse.data.average_marks, perfResponse.data.total_exams)
            };
          } catch {
            return { ...student, avgMarks: 0, totalExams: 0, badges: [] };
          }
        })
      );

      const sorted = studentsWithScores
        .filter(s => s.totalExams > 0)
        .sort((a, b) => b.avgMarks - a.avgMarks);
      
      setLeaderboard(sorted);
      setLoading(false);
      setTimeout(() => setAnimating(false), 500);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const calculateBadges = (avgMarks, totalExams) => {
    const badges = [];
    if (avgMarks >= 95) badges.push({ icon: '🏆', name: 'Gold Star', color: '#fbbf24' });
    else if (avgMarks >= 85) badges.push({ icon: '🥈', name: 'Silver Medal', color: '#94a3b8' });
    else if (avgMarks >= 75) badges.push({ icon: '🥉', name: 'Bronze Medal', color: '#cd7f32' });
    
    if (totalExams >= 10) badges.push({ icon: '🔥', name: 'Streak Master', color: '#ef4444' });
    if (totalExams >= 5) badges.push({ icon: '⚡', name: 'Active Learner', color: '#3b82f6' });
    
    return badges;
  };

  const getRankStyle = (index) => {
    if (index === 0) return { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', scale: 1.05 };
    if (index === 1) return { background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', scale: 1.02 };
    if (index === 2) return { background: 'linear-gradient(135deg, #cd7f32 0%, #92400e 100%)', scale: 1 };
    return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', scale: 0.98 };
  };

  if (loading) {
    return <div style={styles.loading}>🏁 Loading Live Leaderboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏆 Live Leaderboard</h2>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot}></span>
          <span style={styles.liveText}>LIVE</span>
        </div>
      </div>
      <p style={styles.subtitle}>Real-time rankings updated every 10 seconds</p>

      {leaderboard.length === 0 ? (
        <div style={styles.noData}>No ranking data available yet</div>
      ) : (
        <div style={styles.leaderboardList}>
          {leaderboard.map((student, index) => {
            const rankStyle = getRankStyle(index);
            return (
              <div
                key={student.id}
                style={{
                  ...styles.leaderboardCard,
                  transform: animating ? 'scale(0.95)' : `scale(${rankStyle.scale})`,
                  opacity: animating ? 0.7 : 1
                }}
              >
                <div style={styles.rankBadge}>
                  {index === 0 && <span style={styles.crownIcon}>👑</span>}
                  <div style={{...styles.rankNumber, ...rankStyle}}>
                    {index + 1}
                  </div>
                </div>

                <div style={styles.studentDetails}>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentEmail}>{student.email}</div>
                  <div style={styles.badgesContainer}>
                    {student.badges.map((badge, idx) => (
                      <div key={idx} style={{...styles.badge, borderColor: badge.color}}>
                        <span style={styles.badgeIcon}>{badge.icon}</span>
                        <span style={{...styles.badgeName, color: badge.color}}>{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.scoreSection}>
                  <div style={styles.scoreValue}>{student.avgMarks.toFixed(1)}%</div>
                  <div style={styles.examCount}>{student.totalExams} exams</div>
                  <div style={styles.progressBarContainer}>
                    <div 
                      style={{
                        ...styles.progressBar, 
                        width: `${student.avgMarks}%`,
                        background: index < 3 ? rankStyle.background : '#3b82f6'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '0'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '50px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5px'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1e3a8a',
    fontWeight: '700',
    margin: 0
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#fee',
    borderRadius: '20px',
    border: '2px solid #ef4444'
  },
  liveDot: {
    width: '10px',
    height: '10px',
    background: '#ef4444',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite'
  },
  liveText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#ef4444'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '30px'
  },
  noData: {
    textAlign: 'center',
    padding: '50px',
    color: '#94a3b8',
    fontSize: '1rem'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  leaderboardCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'white',
    borderRadius: '15px',
    border: '2px solid #e2e8f0',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  rankBadge: {
    position: 'relative',
    minWidth: '60px',
    textAlign: 'center'
  },
  crownIcon: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '1.5rem'
  },
  rankNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  studentDetails: {
    flex: 1
  },
  studentName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '3px'
  },
  studentEmail: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '8px'
  },
  badgesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '12px',
    background: 'white',
    border: '2px solid',
    fontSize: '0.75rem'
  },
  badgeIcon: {
    fontSize: '1rem'
  },
  badgeName: {
    fontWeight: '600',
    fontSize: '0.7rem'
  },
  scoreSection: {
    textAlign: 'right',
    minWidth: '120px'
  },
  scoreValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '3px'
  },
  examCount: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginBottom: '8px'
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.8s ease'
  }
};

// Add keyframe animation for live indicator
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
`, styleSheet.cssRules.length);

export default LiveLeaderboard;
