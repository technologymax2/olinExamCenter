import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

// ==========================================
// PAGES
// ==========================================

import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HREmployeeDashboard from './pages/HREmployeeDashboard';
import StudentPrintCartPage from './pages/StudentPrintCartPage';
import Login from './pages/Login';
import TakeExam from './pages/TakeExam';

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // User ካልገባ
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role ካልተፈቀደ
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ==========================================
// HOME PAGE
// ==========================================

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

// ==========================================
// MAIN APP
// ==========================================

function App() {
  return (
    <Router>

      <div className="min-h-screen bg-gray-950 flex flex-col font-sans text-gray-100">

        <main className="flex-1">

          <Routes>

            {/* ==========================================
                HOME
            ========================================== */}

            <Route
              path="/"
              element={<Home />}
            />

            {/* ==========================================
                LOGIN
            ========================================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            {/* ==========================================
                ADMIN DASHBOARD
            ========================================== */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==========================================
                TEACHER DASHBOARD
            ========================================== */}

            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==========================================
                HR DASHBOARD
            ========================================== */}

            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRole="hr">
                  <HREmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==========================================
                STUDENT EXAM
            ========================================== */}

            <Route
              path="/student/exam/:examId"
              element={
                <ProtectedRoute allowedRole="student">
                  <TakeExam />
                </ProtectedRoute>
              }
            />

            {/* ==========================================
                STUDENT ID CARD PRINTING
            ========================================== */}

            <Route
              path="/student/print"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentPrintCartPage />
                </ProtectedRoute>
              }
            />

            {/* ==========================================
                UNKNOWN PAGE
            ========================================== */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </main>

      </div>

    </Router>
  );
}

export default App;
