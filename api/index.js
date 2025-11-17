const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'online_exam_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Students routes
app.get('/api/students', async (req, res) => {
  try {
    const { orderBy = 'name', order = 'asc' } = req.query;
    const validColumns = ['name', 'email', 'registration_number', 'id'];
    const validOrders = ['asc', 'desc'];
    
    const column = validColumns.includes(orderBy) ? orderBy : 'name';
    const direction = validOrders.includes(order.toLowerCase()) ? order : 'asc';
    
    const [students] = await pool.query(`SELECT * FROM students ORDER BY ${column} ${direction}`);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const [students] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(students[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students/:id/performance', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        COUNT(r.id) as total_exams_taken,
        SUM(r.marks_obtained) as total_marks_obtained,
        AVG(r.marks_obtained) as average_marks,
        AVG((r.marks_obtained / e.max_marks) * 100) as overall_percentage
      FROM results r
      JOIN exams e ON r.exam_id = e.id
      WHERE r.student_id = ?
    `, [req.params.id]);
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, email, registration_number } = req.body;
    const [result] = await pool.query(
      'INSERT INTO students (name, email, registration_number) VALUES (?, ?, ?)',
      [name, email, registration_number]
    );
    res.status(201).json({ id: result.insertId, name, email, registration_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, registration_number } = req.body;
    await pool.query(
      'UPDATE students SET name = ?, email = ?, registration_number = ? WHERE id = ?',
      [name, email, registration_number, req.params.id]
    );
    res.json({ id: req.params.id, name, email, registration_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subjects routes
app.get('/api/subjects', async (req, res) => {
  try {
    const [subjects] = await pool.query('SELECT * FROM subjects');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const { name, code } = req.body;
    const [result] = await pool.query('INSERT INTO subjects (name, code) VALUES (?, ?)', [name, code]);
    res.status(201).json({ id: result.insertId, name, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exams routes
app.get('/api/exams', async (req, res) => {
  try {
    const [exams] = await pool.query(`
      SELECT e.*, s.name as subject_name, s.code as subject_code
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      ORDER BY e.exam_date DESC
    `);
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exams', async (req, res) => {
  try {
    const { subject_id, exam_date, max_marks } = req.body;
    const [result] = await pool.query(
      'INSERT INTO exams (subject_id, exam_date, max_marks) VALUES (?, ?, ?)',
      [subject_id, exam_date, max_marks]
    );
    res.status(201).json({ id: result.insertId, subject_id, exam_date, max_marks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/exams/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM exams WHERE id = ?', [req.params.id]);
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Results routes
app.get('/api/results', async (req, res) => {
  try {
    const { orderBy = 'date', order = 'desc' } = req.query;
    
    let orderClause = 'e.exam_date DESC';
    if (orderBy === 'marks') orderClause = `r.marks_obtained ${order}`;
    else if (orderBy === 'percentage') orderClause = `(r.marks_obtained / e.max_marks) ${order}`;
    else if (orderBy === 'student') orderClause = `s.name ${order}`;
    else if (orderBy === 'subject') orderClause = `sub.name ${order}`;
    else if (orderBy === 'date') orderClause = `e.exam_date ${order}`;
    
    const [results] = await pool.query(`
      SELECT r.*, s.name as student_name, s.registration_number,
             e.exam_date, e.max_marks, sub.name as subject_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      JOIN exams e ON r.exam_id = e.id
      JOIN subjects sub ON e.subject_id = sub.id
      ORDER BY ${orderClause}
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/results/rankings', async (req, res) => {
  try {
    const [rankings] = await pool.query(`
      SELECT 
        s.id as student_id,
        s.name as student_name,
        s.registration_number,
        COUNT(r.id) as total_exams,
        SUM(r.marks_obtained) as total_marks,
        AVG((r.marks_obtained / e.max_marks) * 100) as average_percentage
      FROM students s
      JOIN results r ON s.id = r.student_id
      JOIN exams e ON r.exam_id = e.id
      GROUP BY s.id, s.name, s.registration_number
      ORDER BY average_percentage DESC
      LIMIT 10
    `);
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { student_id, exam_id, marks_obtained } = req.body;
    const [result] = await pool.query(
      'INSERT INTO results (student_id, exam_id, marks_obtained) VALUES (?, ?, ?)',
      [student_id, exam_id, marks_obtained]
    );
    res.status(201).json({ id: result.insertId, student_id, exam_id, marks_obtained });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/results/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM results WHERE id = ?', [req.params.id]);
    res.json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Online Exam System API is running' });
});

module.exports = app;
