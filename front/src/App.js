import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// የ ዳሽቦርድ እና የመግቢያ ገጾች
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';
import TakeExam from './pages/TakeExam'; // TakeExam ኮምፖነንቱን ማስገባት

// ጥበቃ የሚያደርግ ኮምፖነንት (Protected Route Component)
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Home() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123758] leading-tight">
          እንኳን ወደ ማክ ቴክኖሎጂ የፈተና ማዕከል በደህና መጡ
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          እባክዎ ለመግባት የሚፈልጉትን ፖርታል ይምረጡ፡
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-[#123758] hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-xl transition shadow-sm text-center"
          >
            ወደ መለያዎ ይግቡ
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        
        {/* Routes Container */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/exam/:examId" 
              element={
                <ProtectedRoute allowedRole="student">
                  <TakeExam />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
