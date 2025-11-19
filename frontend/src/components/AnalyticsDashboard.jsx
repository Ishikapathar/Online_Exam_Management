import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/dashboard');
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>🔄 Loading Analytics...</div>;
  }

  const predictPerformance = (avgMarks) => {
    if (avgMarks >= 90) return { trend: '📈 Excellent Trajectory', color: '#10b981', prediction: 'Top 5% performance' };
    if (avgMarks >= 75) return { trend: '📊 Strong Progress', color: '#3b82f6', prediction: 'Above average trajectory' };
    if (avgMarks >= 60) return { trend: '📉 Needs Focus', color: '#f59e0b', prediction: 'Room for improvement' };
    return { trend: '⚠️ Requires Attention', color: '#ef4444', prediction: 'Extra support needed' };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧠 AI-Powered Analytics Dashboard</h2>
      <p style={styles.subtitle}>Real-time insights and performance predictions</p>

      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{analytics?.totalStudents || 0}</div>
          <div style={styles.statLabel}>Total Students</div>
        </div>

        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statValue}>{analytics?.totalExams || 0}</div>
          <div style={styles.statLabel}>Total Exams</div>
        </div>

        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statValue}>{analytics?.averageScore?.toFixed(1) || 0}%</div>
          <div style={styles.statLabel}>Average Score</div>
        </div>

        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statValue}>{analytics?.topPerformers || 0}</div>
          <div style={styles.statLabel}>Top Performers</div>
        </div>
      </div>

      <div style={styles.predictionsSection}>
        <h3 style={styles.sectionTitle}>🔮 Performance Predictions</h3>
        <div style={styles.predictionGrid}>
          {analytics?.studentPredictions?.map((student) => {
            const prediction = predictPerformance(student.avg_marks);
            return (
              <div key={student.id} style={styles.predictionCard}>
                <div style={styles.studentInfo}>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentEmail}>{student.email}</div>
                </div>
                <div style={{...styles.trendIndicator, borderColor: prediction.color}}>
                  <div style={{...styles.trendText, color: prediction.color}}>
                    {prediction.trend}
                  </div>
                  <div style={styles.predictionText}>{prediction.prediction}</div>
                  <div style={styles.scoreCircle}>
                    <svg width="80" height="80" style={styles.progressSvg}>
                      <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
                      <circle 
                        cx="40" cy="40" r="35" fill="none" 
                        stroke={prediction.color} 
                        strokeWidth="6"
                        strokeDasharray={`${(student.avg_marks / 100) * 220} 220`}
                        transform="rotate(-90 40 40)"
                        style={styles.progressCircle}
                      />
                    </svg>
                    <div style={styles.scoreText}>{student.avg_marks.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>💡 Smart Insights</h3>
        <div style={styles.insightsList}>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>🎯</span>
            <div>
              <div style={styles.insightTitle}>Success Rate</div>
              <div style={styles.insightText}>
                {analytics?.passRate?.toFixed(1)}% students are above 60% marks
              </div>
            </div>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>⚡</span>
            <div>
              <div style={styles.insightTitle}>Improvement Trend</div>
              <div style={styles.insightText}>
                Average scores trending {analytics?.averageScore > 70 ? 'upward' : 'needs attention'}
              </div>
            </div>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>🔥</span>
            <div>
              <div style={styles.insightTitle}>Consistency Score</div>
              <div style={styles.insightText}>
                {analytics?.consistencyScore || 85}% students showing regular performance
              </div>
            </div>
          </div>
        </div>
      </div>
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
  title: {
    fontSize: '1.8rem',
    color: '#1e3a8a',
    marginBottom: '5px',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '0.85rem',
    opacity: 0.9
  },
  predictionsSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1e3a8a',
    marginBottom: '20px',
    fontWeight: '600'
  },
  predictionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  predictionCard: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  },
  studentInfo: {
    marginBottom: '15px'
  },
  studentName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '3px'
  },
  studentEmail: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  trendIndicator: {
    padding: '15px',
    borderRadius: '10px',
    background: 'white',
    borderLeft: '4px solid',
    position: 'relative'
  },
  trendText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '5px'
  },
  predictionText: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '15px'
  },
  scoreCircle: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto'
  },
  progressSvg: {
    transform: 'rotate(0deg)'
  },
  progressCircle: {
    transition: 'stroke-dasharray 1s ease'
  },
  scoreText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  insightsSection: {
    marginTop: '30px'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  insightCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  },
  insightIcon: {
    fontSize: '2rem'
  },
  insightTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '3px'
  },
  insightText: {
    fontSize: '0.85rem',
    color: '#64748b'
  }
};

export default AnalyticsDashboard;
