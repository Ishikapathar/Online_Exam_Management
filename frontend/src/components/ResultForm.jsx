import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';

const API_URL = 'http://localhost:5000/api';

const ResultForm = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    exam_id: '',
    marks_obtained: ''
  });
  const [examForm, setExamForm] = useState({
    subject_id: '',
    exam_date: '',
    max_marks: ''
  });

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchExams();
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [sortBy, sortOrder]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/results?orderBy=${sortBy}&order=${sortOrder}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_URL}/exams`);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/results`, formData);
      setToast({ message: '✓ Result added successfully!', type: 'success' });
      setFormData({ student_id: '', exam_id: '', marks_obtained: '' });
      fetchResults();
    } catch (error) {
      console.error('Error saving result:', error);
      setToast({ message: '✕ Error: ' + (error.response?.data?.error || error.message), type: 'error' });
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/exams`, examForm);
      setToast({ message: '✓ Exam created successfully!', type: 'success' });
      setExamForm({ subject_id: '', exam_date: '', max_marks: '' });
      fetchExams();
    } catch (error) {
      console.error('Error creating exam:', error);
      setToast({ message: '✕ Error creating exam', type: 'error' });
    }
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await axios.delete(`${API_URL}/results/${id}`);
        setToast({ message: '✓ Result deleted successfully!', type: 'success' });
        fetchResults();
      } catch (error) {
        console.error('Error deleting result:', error);
        setToast({ message: '✕ Error deleting result', type: 'error' });
      }
    }
  };

  const styles = {
    container: {
      display: 'grid',
      gap: '35px'
    },
    section: {
      padding: '25px',
      backgroundColor: '#f5f5f7',
      borderRadius: '15px',
      border: 'none'
    },
    heading: {
      color: '#1e3a8a',
      marginBottom: '25px',
      fontSize: '1.2rem',
      fontWeight: '700'
    },
    form: {
      display: 'grid',
      gap: '20px',
      marginBottom: '20px'
    },
    input: {
      padding: '14px 18px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '0.9rem',
      backgroundColor: 'white',
      transition: 'all 0.3s'
    },
    select: {
      padding: '14px 18px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '0.9rem',
      backgroundColor: 'white',
      transition: 'all 0.3s'
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
      boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)',
      transition: 'all 0.3s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    th: {
      backgroundColor: '#1e3a8a',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    td: {
      padding: '12px 14px',
      borderBottom: '1px solid #e8eaff',
      fontSize: '0.9rem'
    },
    deleteBtn: {
      padding: '8px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
      transition: 'all 0.3s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.heading}>Create Exam</h3>
        <form onSubmit={handleExamSubmit} style={styles.form}>
          <select
            style={styles.select}
            value={examForm.subject_id}
            onChange={(e) => setExamForm({ ...examForm, subject_id: e.target.value })}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          <input
            type="date"
            style={styles.input}
            value={examForm.exam_date}
            onChange={(e) => setExamForm({ ...examForm, exam_date: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Max Marks"
            style={styles.input}
            value={examForm.max_marks}
            onChange={(e) => setExamForm({ ...examForm, max_marks: e.target.value })}
            required
          />
          <button type="submit" style={styles.button}>Create Exam</button>
        </form>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>Add Result</h3>
        <form onSubmit={handleResultSubmit} style={styles.form}>
          <select
            style={styles.select}
            value={formData.student_id}
            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.registration_number})
              </option>
            ))}
          </select>
          <select
            style={styles.select}
            value={formData.exam_id}
            onChange={(e) => setFormData({ ...formData, exam_id: e.target.value })}
            required
          >
            <option value="">Select Exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.subject_name} - {exam.exam_date} (Max: {exam.max_marks})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Marks Obtained"
            style={styles.input}
            value={formData.marks_obtained}
            onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
            required
          />
          <button type="submit" style={styles.button}>Add Result</button>
        </form>
      </div>

      <div>
        <h3 style={styles.heading}>All Results</h3>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#1a202c', fontSize: '0.9rem' }}>
              Sort By:
            </label>
            <select
              style={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Exam Date</option>
              <option value="marks">Marks Obtained</option>
              <option value="percentage">Percentage</option>
              <option value="student">Student Name</option>
              <option value="subject">Subject Name</option>
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#1a202c', fontSize: '0.9rem' }}>
              Order:
            </label>
            <select
              style={styles.select}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending (High to Low)</option>
              <option value="asc">Ascending (Low to High)</option>
            </select>
          </div>
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Exam Date</th>
              <th style={styles.th}>Marks</th>
              <th style={styles.th}>Percentage</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td style={styles.td}>{result.student_name}</td>
                <td style={styles.td}>{result.subject_name}</td>
                <td style={styles.td}>{new Date(result.exam_date).toLocaleDateString()}</td>
                <td style={styles.td}>{result.marks_obtained} / {result.max_marks}</td>
                <td style={styles.td}>
                  {((result.marks_obtained / result.max_marks) * 100).toFixed(2)}%
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteResult(result.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ResultForm;
