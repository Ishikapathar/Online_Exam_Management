import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const StudentPerformance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students');
    }
  };

  const fetchPerformance = async (studentId) => {
    if (!studentId) {
      setPerformance(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/students/${studentId}/performance`);
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
      alert('Error loading student performance');
      setPerformance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    fetchPerformance(studentId);
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
    selectContainer: {
      marginBottom: '35px'
    },
    select: {
      width: '100%',
      padding: '18px',
      fontSize: '1.15rem',
      border: '2px solid #d0d5ff',
      borderRadius: '12px',
      backgroundColor: '#f8f9ff',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '35px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '2px solid #e8eaff'
    },
    studentInfo: {
      marginBottom: '35px',
      paddingBottom: '25px',
      borderBottom: '2px solid #e8eaff'
    },
    studentName: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1a202c',
      marginBottom: '12px'
    },
    studentDetail: {
      fontSize: '1.05rem',
      color: '#718096',
      marginBottom: '6px',
      fontWeight: '500'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '25px',
      marginTop: '25px'
    },
    statCard: {
      backgroundColor: '#f8f9ff',
      padding: '25px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      border: '2px solid #e8eaff',
      transition: 'all 0.3s'
    },
    statLabel: {
      fontSize: '0.95rem',
      color: '#718096',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '700'
    },
    statValue: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    percentageCard: {
      gridColumn: '1 / -1',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      color: 'white',
      padding: '40px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(30, 58, 138, 0.4)'
    },
    percentageLabel: {
      fontSize: '1.3rem',
      marginBottom: '15px',
      opacity: 0.95,
      fontWeight: '600'
    },
    percentageValue: {
      fontSize: '3.5rem',
      fontWeight: 'bold'
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
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.3rem',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      padding: '50px',
      fontWeight: '700'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎯 Student Performance</h2>
      
      <div style={styles.selectContainer}>
        <select
          style={styles.select}
          value={selectedStudentId}
          onChange={handleStudentChange}
        >
          <option value="">-- Select a Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.registration_number})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={styles.loading}>Loading performance data...</div>
      )}

      {!loading && performance && (
        <div style={styles.card}>
          <div style={styles.studentInfo}>
            <div style={styles.studentName}>{performance.name}</div>
            <div style={styles.studentDetail}>
              📧 Email: {performance.email}
            </div>
            <div style={styles.studentDetail}>
              🆔 Registration: {performance.registration_number}
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Exams</div>
              <div style={styles.statValue}>{performance.total_exams_taken}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Average Marks</div>
              <div style={styles.statValue}>
                {parseFloat(performance.average_marks).toFixed(2)}
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Marks</div>
              <div style={styles.statValue}>
                {parseFloat(performance.total_marks_obtained).toFixed(2)}
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Max Marks</div>
              <div style={styles.statValue}>
                {parseFloat(performance.total_max_marks).toFixed(0)}
              </div>
            </div>

            <div style={styles.percentageCard}>
              <div style={styles.percentageLabel}>Overall Percentage</div>
              <div style={styles.percentageValue}>
                {parseFloat(performance.overall_percentage).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !performance && selectedStudentId && (
        <div style={styles.noData}>
          No performance data available for this student.
        </div>
      )}

      {!selectedStudentId && !loading && (
        <div style={styles.noData}>
          Please select a student to view their performance.
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;
