import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// የ ዳሽቦርድ ገጾች (አስቀድመው የፈጠርናቸው)
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

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
            to="/admin" 
            className="w-full sm:w-auto bg-[#123758] hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-xl transition shadow-sm text-center"
          >
            የአድሚን ፖርታል
          </Link>
          <Link 
            to="/teacher" 
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-sm text-center"
          >
            የመምህር ፖርታል
          </Link>
          <Link 
            to="/student" 
            className="w-full sm:w-auto border-2 border-[#123758] text-[#123758] hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition text-center"
          >
            የተማሪ ፖርታል
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        
        {/* Navbar */}
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
                <Link to="/admin" className="hover:text-[#d4af37] font-medium transition">አድሚን</Link>
                <Link to="/teacher" className="hover:text-[#d4af37] font-medium transition">መምህር</Link>
                <Link to="/student" className="hover:text-[#d4af37] font-medium transition">ተማሪ</Link>
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
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition"
              >
                አድሚን
              </Link>
              <Link 
                to="/teacher" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition"
              >
                መምህር
              </Link>
              <Link 
                to="/student" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-900 transition"
              >
                ተማሪ
              </Link>
            </div>
          )}
        </nav>

        {/* Routes Container */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
