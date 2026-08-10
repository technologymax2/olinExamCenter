import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// የ ዳሽቦርድ እና የመግቢያ ገጾች
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';

// 1. ጥበቃ የሚያደርግ ኮምፖነንት (Protected Route Component)
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
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

function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // ቶከኑን እና ሮሉን በመፈተሽ ሁኔታውን ማስተካከል
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(!!token);
      setUserRole(role || '');
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
    alert('ከአካውንቱ በተሳካ ሁኔታ ወጥተዋል!');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-[#123758] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-2">
          
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-base sm:text-xl font-extrabold text-[#d4af37] tracking-wider truncate">
              Max Technology Exam System
            </Link>
          </div>

          {/* Navigation Links & Actions (Always visible, scrollable if screen is too small) */}
          <div className="flex items-center space-x-4 overflow-x-auto py-2 no-scrollbar">
            <Link to="/" className="hover:text-[#d4af37] font-medium transition whitespace-nowrap">መነሻ</Link>
            
            {/* ዳሽቦርዶቹ የሚታዩት ተጠቃሚው ገብቶ ከሆነ ብቻ ነው */}
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/admin" className="hover:text-[#d4af37] font-medium transition whitespace-nowrap">አድሚን</Link>
            )}
            {isLoggedIn && userRole === 'teacher' && (
              <Link to="/teacher" className="hover:text-[#d4af37] font-medium transition whitespace-nowrap">መምህር</Link>
            )}
            {isLoggedIn && userRole === 'student' && (
              <Link to="/student" className="hover:text-[#d4af37] font-medium transition whitespace-nowrap">ተማሪ</Link>
            )}
            
            {/* Conditional Login/Logout Button */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 transition shadow text-sm whitespace-nowrap"
              >
                ውጣ (Logout)
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#d4af37] text-[#123758] px-3 py-1.5 rounded-lg font-bold hover:bg-amber-400 transition text-sm whitespace-nowrap"
              >
                ግባ
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        
        {/* Navbar Component */}
        <NavigationBar />

        {/* Routes Container with Protected Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes for Admin, Teacher, and Student */}
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
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
