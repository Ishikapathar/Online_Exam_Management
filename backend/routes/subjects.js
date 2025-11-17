const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subject
router.post('/', async (req, res) => {
  const { name, code } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO subjects (name, code) VALUES (?, ?)',
      [name, code]
    );
    res.status(201).json({ id: result.insertId, name, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject
router.put('/:id', async (req, res) => {
  const { name, code } = req.body;
  try {
    await db.query(
      'UPDATE subjects SET name = ?, code = ? WHERE id = ?',
      [name, code, req.params.id]
    );
    res.json({ id: req.params.id, name, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subject
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
