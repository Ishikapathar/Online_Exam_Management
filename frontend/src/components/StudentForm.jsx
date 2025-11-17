import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registration_number: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [sortBy, sortOrder]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students?orderBy=${sortBy}&order=${sortOrder}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/students/${editingId}`, formData);
        setToast({ message: '✓ Student updated successfully!', type: 'success' });
      } else {
        await axios.post(`${API_URL}/students`, formData);
        setToast({ message: '✓ Student added successfully!', type: 'success' });
      }
      setFormData({ name: '', email: '', registration_number: '' });
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      setToast({ message: '✕ Error: ' + (error.response?.data?.error || error.message), type: 'error' });
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      registration_number: student.registration_number
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        setToast({ message: '✓ Student deleted successfully!', type: 'success' });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setToast({ message: '✕ Error deleting student', type: 'error' });
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
      backgroundColor: 'white',
      color: '#333'
    },
    button: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '25px',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
    },
    th: {
      backgroundColor: '#1e3a8a',
      padding: '12px',
      textAlign: 'left',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.85rem'
    },
    td: {
      padding: '12px 14px',
      borderBottom: '1px solid #e8eaff',
      backgroundColor: 'white'
    },
    actionBtn: {
      padding: '8px 16px',
      marginRight: '8px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s'
    },
    editBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Student Management</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Student Name"
          style={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Registration Number"
          style={styles.input}
          value={formData.registration_number}
          onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
          required
        />
        <button type="submit" style={styles.button}>
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', marginTop: '30px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
            Sort By:
          </label>
          <select
            style={styles.input}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="registration">Registration Number</option>
            <option value="id">ID</option>
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
            Order:
          </label>
          <select
            style={styles.input}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending (A-Z / Low to High)</option>
            <option value="desc">Descending (Z-A / High to Low)</option>
          </select>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Registration #</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={styles.td}>{student.name}</td>
              <td style={styles.td}>{student.email}</td>
              <td style={styles.td}>{student.registration_number}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.actionBtn, ...styles.editBtn }}
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default StudentForm;
