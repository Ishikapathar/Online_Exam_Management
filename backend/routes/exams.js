const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all exams
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as subject_name 
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      ORDER BY e.exam_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as subject_name 
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      WHERE e.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new exam
router.post('/', async (req, res) => {
  const { subject_id, exam_date, max_marks } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO exams (subject_id, exam_date, max_marks) VALUES (?, ?, ?)',
      [subject_id, exam_date, max_marks]
    );
    res.status(201).json({ id: result.insertId, subject_id, exam_date, max_marks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exam
router.put('/:id', async (req, res) => {
  const { subject_id, exam_date, max_marks } = req.body;
  try {
    await db.query(
      'UPDATE exams SET subject_id = ?, exam_date = ?, max_marks = ? WHERE id = ?',
      [subject_id, exam_date, max_marks, req.params.id]
    );
    res.json({ id: req.params.id, subject_id, exam_date, max_marks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exam
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM exams WHERE id = ?', [req.params.id]);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
