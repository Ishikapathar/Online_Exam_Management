import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('Error loading subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/subjects`, formData);
      setToast({ message: '✓ Subject added successfully!', type: 'success' });
      setFormData({ name: '', code: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      setToast({ message: '✕ Error: ' + (error.response?.data?.error || error.message), type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`${API_URL}/subjects/${id}`);
        setToast({ message: '✓ Subject deleted successfully!', type: 'success' });
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        setToast({ message: '✕ Error deleting subject', type: 'error' });
      }
    }
  };

  const styles = {
    section: {
      marginBottom: '30px'
    },
    heading: {
      color: '#1e3a8a',
      marginBottom: '30px',
      fontSize: '1.3rem',
      fontWeight: '700'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '18px',
      marginBottom: '35px',
      padding: '25px',
      backgroundColor: '#f5f5f7',
      borderRadius: '15px',
      border: 'none'
    },
    input: {
      padding: '14px 18px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
      outline: 'none',
      backgroundColor: 'white'
    },
    button: {
      gridColumn: '1 / -1',
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      transition: 'all 0.3s',
      boxShadow: '0 6px 20px rgba(107, 115, 255, 0.4)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '25px'
    },
    card: {
      padding: '25px',
      backgroundColor: 'white',
      borderRadius: '15px',
      border: '2px solid #e8eaff',
      position: 'relative',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '5px'
    },
    cardCode: {
      fontSize: '0.9rem',
      color: '#718096',
      marginBottom: '15px'
    },
    deleteBtn: {
      padding: '8px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
      transition: 'all 0.3s'
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Subject Management</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Subject Name (e.g., Mathematics)"
          style={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Subject Code (e.g., MATH101)"
          style={styles.input}
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <button type="submit" style={styles.button}>
          Add Subject
        </button>
      </form>

      <div style={styles.grid}>
        {subjects.map((subject) => (
          <div key={subject.id} style={styles.card}>
            <div style={styles.cardTitle}>{subject.name}</div>
            <div style={styles.cardCode}>{subject.code}</div>
            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(subject.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubjectForm;
