const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', async (req, res) => {
  try {
    const { orderBy = 'name', order = 'asc' } = req.query;
    
    let orderClause = 'ORDER BY name ASC';
    
    if (orderBy === 'name') {
      orderClause = `ORDER BY name ${order.toUpperCase()}`;
    } else if (orderBy === 'email') {
      orderClause = `ORDER BY email ${order.toUpperCase()}`;
    } else if (orderBy === 'registration') {
      orderClause = `ORDER BY registration_number ${order.toUpperCase()}`;
    } else if (orderBy === 'id') {
      orderClause = `ORDER BY id ${order.toUpperCase()}`;
    }
    
    const [rows] = await db.query(`SELECT * FROM students ${orderClause}`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  const { name, email, registration_number } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO students (name, email, registration_number) VALUES (?, ?, ?)',
      [name, email, registration_number]
    );
    res.status(201).json({ id: result.insertId, name, email, registration_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const { name, email, registration_number } = req.body;
  try {
    await db.query(
      'UPDATE students SET name = ?, email = ?, registration_number = ? WHERE id = ?',
      [name, email, registration_number, req.params.id]
    );
    res.json({ id: req.params.id, name, email, registration_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student performance (average marks, total marks, percentage)
router.get('/:id/performance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.registration_number,
        COUNT(r.id) as total_exams_taken,
        COALESCE(SUM(r.marks_obtained), 0) as total_marks_obtained,
        COALESCE(SUM(e.max_marks), 0) as total_max_marks,
        COALESCE(AVG(r.marks_obtained), 0) as average_marks,
        COALESCE((SUM(r.marks_obtained) / SUM(e.max_marks)) * 100, 0) as overall_percentage
      FROM students s
      LEFT JOIN results r ON s.id = r.student_id
      LEFT JOIN exams e ON r.exam_id = e.id
      WHERE s.id = ?
      GROUP BY s.id, s.name, s.email, s.registration_number
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
