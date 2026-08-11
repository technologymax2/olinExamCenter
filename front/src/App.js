import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// የ ዳሽቦርድ እና የመግቢያ ገጾች
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HREmployeeDashboard from './pages/HREmployeeDashboard'; 
import Login from './pages/Login';
import TakeExam from './pages/TakeExam';

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
    <div className="min-h-[80vh] bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6 bg-gray-900 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 leading-tight">
          እንኳን ወደ ማክ ቴክኖሎጂ ማዕከል በደህና መጡ
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          እባክዎ ለመግባት የሚፈልጉትን ፖርታል ይምረጡ፡
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-sm text-center"
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
      <div className="min-h-screen bg-gray-950 flex flex-col font-sans text-gray-100">
        
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
            {/* የ HR ሰራተኛው ራውት */}
            <Route 
              path="/hr" 
              element={
                <ProtectedRoute allowedRole="hr">
                  <HREmployeeDashboard />
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
