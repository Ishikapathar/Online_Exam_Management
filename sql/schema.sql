-- Online Exam System Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

-- Create users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6),
    is_verified BOOLEAN DEFAULT FALSE,
    code_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL
);

-- Create subjects table
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

-- Create exams table
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT NOT NULL,
    exam_date DATE NOT NULL,
    max_marks INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Create results table
CREATE TABLE results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_exam (student_id, exam_id)
);

-- Insert sample subjects
INSERT INTO subjects (name, code) VALUES
('Mathematics', 'MATH101'),
('Physics', 'PHY101'),
('Chemistry', 'CHEM101'),
('Computer Science', 'CS101'),
('English', 'ENG101');

-- Insert sample students
INSERT INTO students (name, email, registration_number) VALUES
('Rajesh Kumar', 'rajesh.kumar@example.com', 'STU001'),
('Priya Sharma', 'priya.sharma@example.com', 'STU002'),
('Amit Patel', 'amit.patel@example.com', 'STU003'),
('Sneha Reddy', 'sneha.reddy@example.com', 'STU004'),
('Vikram Singh', 'vikram.singh@example.com', 'STU005'),
('Anjali Gupta', 'anjali.gupta@example.com', 'STU006'),
('Arjun Nair', 'arjun.nair@example.com', 'STU007'),
('Kavya Iyer', 'kavya.iyer@example.com', 'STU008'),
('Rohit Verma', 'rohit.verma@example.com', 'STU009'),
('Meera Desai', 'meera.desai@example.com', 'STU010'),
('Karan Malhotra', 'karan.malhotra@example.com', 'STU011'),
('Pooja Joshi', 'pooja.joshi@example.com', 'STU012'),
('Aditya Rao', 'aditya.rao@example.com', 'STU013'),
('Divya Menon', 'divya.menon@example.com', 'STU014'),
('Sanjay Pillai', 'sanjay.pillai@example.com', 'STU015');

-- Insert sample exams
INSERT INTO exams (subject_id, exam_date, max_marks) VALUES
(1, '2025-01-15', 100),
(2, '2025-01-20', 100),
(3, '2025-01-25', 100),
(4, '2025-02-01', 100),
(5, '2025-02-05', 100);

-- Insert sample results
INSERT INTO results (student_id, exam_id, marks_obtained) VALUES
(1, 1, 85.5),
(1, 2, 78.0),
(1, 3, 92.0),
(1, 4, 88.5),
(1, 5, 91.0),
(2, 1, 92.5),
(2, 2, 88.0),
(2, 3, 95.0),
(2, 4, 89.0),
(2, 5, 93.5),
(3, 1, 76.0),
(3, 2, 82.5),
(3, 3, 79.0),
(3, 4, 85.0),
(3, 5, 80.5),
(4, 1, 88.0),
(4, 2, 90.0),
(4, 3, 87.5),
(4, 4, 92.0),
(4, 5, 89.5),
(5, 1, 79.0),
(5, 2, 85.0),
(5, 3, 82.5),
(5, 4, 87.0),
(5, 5, 84.0),
(6, 1, 94.0),
(6, 2, 91.5),
(6, 3, 96.0),
(6, 4, 93.5),
(6, 5, 95.0),
(7, 1, 81.5),
(7, 2, 86.0),
(7, 3, 83.5),
(7, 4, 88.0),
(7, 5, 85.5),
(8, 1, 89.5),
(8, 2, 92.0),
(8, 3, 90.5),
(8, 4, 94.0),
(8, 5, 91.5),
(9, 1, 77.0),
(9, 2, 80.5),
(9, 3, 78.5),
(9, 4, 82.0),
(9, 5, 79.5),
(10, 1, 86.0),
(10, 2, 89.5),
(10, 3, 87.0),
(10, 4, 90.5),
(10, 5, 88.5),
(11, 1, 83.5),
(11, 2, 87.0),
(11, 3, 85.5),
(11, 4, 89.0),
(11, 5, 86.5),
(12, 1, 91.0),
(12, 2, 93.5),
(12, 3, 92.0),
(12, 4, 95.0),
(12, 5, 93.0),
(13, 1, 80.0),
(13, 2, 84.5),
(13, 3, 82.0),
(13, 4, 86.5),
(13, 5, 83.5),
(14, 1, 87.5),
(14, 2, 90.0),
(14, 3, 88.5),
(14, 4, 91.5),
(14, 5, 89.0),
(15, 1, 84.0),
(15, 2, 88.5),
(15, 3, 86.0),
(15, 4, 90.0),
(15, 5, 87.5);

-- Create indexes for better performance
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_subject_code ON subjects(code);
CREATE INDEX idx_exam_date ON exams(exam_date);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_results_exam ON results(exam_id);

-- Drop existing views if they exist
DROP VIEW IF EXISTS student_performance;
DROP VIEW IF EXISTS exam_statistics;

-- View to get student performance summary
CREATE VIEW student_performance AS
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.registration_number,
    COUNT(r.id) as total_exams,
    AVG((r.marks_obtained / e.max_marks) * 100) as average_percentage,
    SUM(r.marks_obtained) as total_marks_obtained,
    SUM(e.max_marks) as total_max_marks
FROM students s
LEFT JOIN results r ON s.id = r.student_id
LEFT JOIN exams e ON r.exam_id = e.id
GROUP BY s.id, s.name, s.registration_number;

-- View to get exam statistics
CREATE VIEW exam_statistics AS
SELECT 
    e.id as exam_id,
    sub.name as subject_name,
    sub.code as subject_code,
    e.exam_date,
    e.max_marks,
    COUNT(r.id) as total_students,
    AVG(r.marks_obtained) as average_marks,
    MAX(r.marks_obtained) as highest_marks,
    MIN(r.marks_obtained) as lowest_marks
FROM exams e
JOIN subjects sub ON e.subject_id = sub.id
LEFT JOIN results r ON e.id = r.exam_id
GROUP BY e.id, sub.name, sub.code, e.exam_date, e.max_marks;

-- ========================================
-- ORDER BY Query Examples
-- ========================================

-- 1. Get all students sorted by name (ascending)
-- SELECT * FROM students ORDER BY name ASC;

-- 2. Get all students sorted by name (descending)
-- SELECT * FROM students ORDER BY name DESC;

-- 3. Get all students sorted by email
-- SELECT * FROM students ORDER BY email ASC;

-- 4. Get all students sorted by registration number
-- SELECT * FROM students ORDER BY registration_number ASC;

-- 5. Get all students sorted by ID (newest first)
-- SELECT * FROM students ORDER BY id DESC;

-- 6. Get all results sorted by exam date (newest first)
-- SELECT r.*, s.name as student_name, s.registration_number,
--        e.exam_date, sub.name as subject_name, e.max_marks
-- FROM results r
-- JOIN students s ON r.student_id = s.id
-- JOIN exams e ON r.exam_id = e.id
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY e.exam_date DESC;

-- 7. Get all results sorted by marks obtained (highest first)
-- SELECT r.*, s.name as student_name, s.registration_number,
--        e.exam_date, sub.name as subject_name, e.max_marks
-- FROM results r
-- JOIN students s ON r.student_id = s.id
-- JOIN exams e ON r.exam_id = e.id
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY r.marks_obtained DESC;

-- 8. Get all results sorted by percentage (highest first)
-- SELECT r.*, s.name as student_name, s.registration_number,
--        e.exam_date, sub.name as subject_name, e.max_marks,
--        (r.marks_obtained / e.max_marks * 100) as percentage
-- FROM results r
-- JOIN students s ON r.student_id = s.id
-- JOIN exams e ON r.exam_id = e.id
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY (r.marks_obtained / e.max_marks) DESC;

-- 9. Get all results sorted by student name
-- SELECT r.*, s.name as student_name, s.registration_number,
--        e.exam_date, sub.name as subject_name, e.max_marks
-- FROM results r
-- JOIN students s ON r.student_id = s.id
-- JOIN exams e ON r.exam_id = e.id
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY s.name ASC;

-- 10. Get all results sorted by subject name
-- SELECT r.*, s.name as student_name, s.registration_number,
--        e.exam_date, sub.name as subject_name, e.max_marks
-- FROM results r
-- JOIN students s ON r.student_id = s.id
-- JOIN exams e ON r.exam_id = e.id
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY sub.name ASC;

-- 11. Get top 5 students by marks
-- SELECT s.name, SUM(r.marks_obtained) as total_marks
-- FROM students s
-- JOIN results r ON s.id = r.student_id
-- GROUP BY s.id, s.name
-- ORDER BY total_marks DESC
-- LIMIT 5;

-- 12. Get all exams sorted by date (oldest first)
-- SELECT e.*, sub.name as subject_name
-- FROM exams e
-- JOIN subjects sub ON e.subject_id = sub.id
-- ORDER BY e.exam_date ASC;

-- 13. Get all subjects sorted alphabetically
-- SELECT * FROM subjects ORDER BY name ASC;

-- 14. Get student performance sorted by average percentage (highest first)
-- SELECT * FROM student_performance ORDER BY average_percentage DESC;

-- 15. Get exam statistics sorted by average marks (highest first)
-- SELECT * FROM exam_statistics ORDER BY average_marks DESC;
