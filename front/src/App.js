import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// የ ዳሽቦርድ እና የመግቢያ ገጾች
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';

// 1. ጥበቃ የሚያደርግ ኮምፖነንት (Protected Route Component)
// ተጠቃሚው ሎጊን ካላደረገ ወደ /login ገጽ ይመልሰዋል
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-lg sm:text-xl font-extrabold text-[#d4af37] tracking-wider">
              Max Technology Exam System
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-[#d4af37] font-medium transition">መነሻ</Link>
            
            {/* ዳሽቦርዶቹ የሚታዩት ተጠቃሚው ገብቶ ከሆነ ብቻ ነው */}
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/admin" className="hover:text-[#d4af37] font-medium transition">አድሚን</Link>
            )}
            {isLoggedIn && userRole === 'teacher' && (
              <Link to="/teacher" className="hover:text-[#d4af37] font-medium transition">መምህር</Link>
            )}
            {isLoggedIn && userRole === 'student' && (
              <Link to="/student" className="hover:text-[#d4af37] font-medium transition">ተማሪ</Link>
            )}
            
            {/* Conditional Login/Logout Button */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow"
              >
                ውጣ (Logout)
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#d4af37] text-[#123758] px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition"
              >
                ግባ
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 hover:text-white focus:outline-none p-2 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-950 border-t border-blue-900 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition"
          >
            መነሻ
          </Link>

          {isLoggedIn && userRole === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition">አድሚን</Link>
          )}
          {isLoggedIn && userRole === 'teacher' && (
            <Link to="/teacher" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition">መምህር</Link>
          )}
          {isLoggedIn && userRole === 'student' && (
            <Link to="/student" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition">ተማሪ</Link>
          )}

          {isLoggedIn ? (
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white font-bold text-center transition"
            >
              ውጣ (Logout)
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#d4af37] text-[#123758] font-bold text-center transition"
            >
              ግባ
            </Link>
          )}
        </div>
      )}
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
