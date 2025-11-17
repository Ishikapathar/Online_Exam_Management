const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all results
router.get('/', async (req, res) => {
  try {
    const { orderBy = 'date', order = 'desc' } = req.query;
    
    let orderClause = 'ORDER BY r.id DESC';
    
    if (orderBy === 'date') {
      orderClause = `ORDER BY e.exam_date ${order.toUpperCase()}`;
    } else if (orderBy === 'marks') {
      orderClause = `ORDER BY r.marks_obtained ${order.toUpperCase()}`;
    } else if (orderBy === 'percentage') {
      orderClause = `ORDER BY (r.marks_obtained / e.max_marks) ${order.toUpperCase()}`;
    } else if (orderBy === 'student') {
      orderClause = `ORDER BY s.name ${order.toUpperCase()}`;
    } else if (orderBy === 'subject') {
      orderClause = `ORDER BY sub.name ${order.toUpperCase()}`;
    }
    
    const [rows] = await db.query(`
      SELECT r.*, s.name as student_name, s.registration_number,
             e.exam_date, sub.name as subject_name, e.max_marks
      FROM results r
      JOIN students s ON r.student_id = s.id
      JOIN exams e ON r.exam_id = e.id
      JOIN subjects sub ON e.subject_id = sub.id
      ${orderClause}
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, e.exam_date, sub.name as subject_name, e.max_marks
      FROM results r
      JOIN exams e ON r.exam_id = e.id
      JOIN subjects sub ON e.subject_id = sub.id
      WHERE r.student_id = ?
      ORDER BY e.exam_date DESC
    `, [req.params.studentId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results by exam ID
router.get('/exam/:examId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, s.name as student_name, s.registration_number
      FROM results r
      JOIN students s ON r.student_id = s.id
      WHERE r.exam_id = ?
      ORDER BY r.marks_obtained DESC
    `, [req.params.examId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rankings (top performers)
router.get('/rankings', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.name, s.registration_number,
             COUNT(r.id) as total_exams,
             AVG((r.marks_obtained / e.max_marks) * 100) as average_percentage,
             SUM(r.marks_obtained) as total_marks
      FROM students s
      LEFT JOIN results r ON s.id = r.student_id
      LEFT JOIN exams e ON r.exam_id = e.id
      GROUP BY s.id
      HAVING total_exams > 0
      ORDER BY average_percentage DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new result
router.post('/', async (req, res) => {
  const { student_id, exam_id, marks_obtained } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO results (student_id, exam_id, marks_obtained) VALUES (?, ?, ?)',
      [student_id, exam_id, marks_obtained]
    );
    res.status(201).json({ id: result.insertId, student_id, exam_id, marks_obtained });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update result
router.put('/:id', async (req, res) => {
  const { marks_obtained } = req.body;
  try {
    await db.query(
      'UPDATE results SET marks_obtained = ? WHERE id = ?',
      [marks_obtained, req.params.id]
    );
    res.json({ id: req.params.id, marks_obtained });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete result
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM results WHERE id = ?', [req.params.id]);
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
