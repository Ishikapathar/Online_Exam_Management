const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const examsRouter = require('./routes/exams');
const subjectsRouter = require('./routes/subjects');
const resultsRouter = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/results', resultsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Online Exam System API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
