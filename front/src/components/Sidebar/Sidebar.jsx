import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ role = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col h-screen shadow-xl">
      <div className="p-5 text-2xl font-bold border-b border-blue-800 tracking-wide">
        ኮሌጅ ሲስተም
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {role === 'admin' && (
          <>
            <button 
              onClick={() => navigate('/admin-dashboard')} 
              className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/admin-dashboard') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
            >
              ዳሽቦርድ (Dashboard)
            </button>
            <button 
              onClick={() => navigate('/bulk-registration')} 
              className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/bulk-registration') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
            >
              በጅምላ መመዝገቢያ (Bulk Reg)
            </button>
          </>
        )}

        {role === 'teacher' && (
          <button 
            onClick={() => navigate('/teacher-dashboard')} 
            className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/teacher-dashboard') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
          >
            ዳሽቦርድ (Dashboard)
          </button>
        )}

        {role === 'student' && (
          <>
            <button 
              onClick={() => navigate('/student-dashboard')} 
              className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/student-dashboard') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
            >
              ዳሽቦርድ (Dashboard)
            </button>
            <button 
              onClick={() => navigate('/digital-id')} 
              className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/digital-id') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
            >
              ዲጂታል መታወቂያ (Digital ID)
            </button>
          </>
        )}

        <button 
          onClick={() => navigate('/assignments')} 
          className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/assignments') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
        >
          አሳይመንቶች (Assignments)
        </button>
        <button 
          onClick={() => navigate('/exams')} 
          className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/exams') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
        >
          የኦንላይን ፈተና (Exams)
        </button>
        <button 
          onClick={() => navigate('/notices')} 
          className={`w-full text-left px-4 py-2.5 rounded transition font-medium ${isActive('/notices') ? 'bg-blue-800 shadow' : 'hover:bg-blue-800'}`}
        >
          ማስታወቂያዎች (Notices)
        </button>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button 
          onClick={() => navigate('/')} 
          className="w-full py-2.5 bg-red-600 rounded text-center font-semibold hover:bg-red-700 transition shadow"
        >
          ውጣ (Logout)
        </button>
      </div>
    </aside>
  );
}
