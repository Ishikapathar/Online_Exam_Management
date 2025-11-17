# Online Exam System

A full-stack web application for managing students, exams, subjects, and results with ranking capabilities.

## 🚀 Features

- **Student Management**: Add, edit, and delete student records
- **Exam Management**: Create exams for different subjects with custom max marks
- **Results Management**: Record and track student exam results
- **Rankings**: View top performers based on average performance
- **Real-time Updates**: Dynamic interface with instant feedback

## 📁 Project Structure

```
online-exam-project/
├─ backend/          # Node.js + Express API
├─ frontend/         # React + Vite application
└─ sql/             # Database schema and sample data
```

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

### Frontend
- React 18
- Vite
- Axios
- Modern CSS-in-JS

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8 or higher)
- npm or yarn

## ⚙️ Installation & Setup

### 1. Database Setup

```bash
# Create the database
mysql -u root -p

CREATE DATABASE online_exam_db;
USE online_exam_db;

# Import the schema
SOURCE sql/schema.sql;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_exam_db
PORT=5000" > .env

# Start the server
npm start

# Or use nodemon for development
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create new exam

### Results
- `GET /api/results` - Get all results
- `GET /api/results/student/:studentId` - Get results by student
- `GET /api/results/exam/:examId` - Get results by exam
- `GET /api/results/rankings` - Get top performers
- `POST /api/results` - Create new result
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result

## 🎨 Features Overview

### Student Form
- Add new students with name, email, and registration number
- Edit existing student information
- Delete students from the system
- View all students in a table format

### Result Form
- Create exams for different subjects
- Record student marks for exams
- View all results with calculated percentages
- Delete incorrect results

### Rankings
- View top 10 performing students
- See average percentage, total exams taken, and total marks
- Medal system (🥇🥈🥉) for top 3 performers
- Interactive cards with hover effects

## 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=online_exam_db
PORT=5000
```

## 🚀 Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
npm start
```

## 📝 Sample Data

The schema.sql file includes sample data:
- 5 subjects (Math, Physics, Chemistry, CS, English)
- 5 students
- 5 exams
- Multiple result records

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Built with ❤️ using React, Node.js, and MySQL

---

**Note**: Make sure to update the database credentials in the `.env` file before running the application.
