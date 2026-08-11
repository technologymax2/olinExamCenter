import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function StudentDashboard() {
  const [contents, setContents] = useState([]);
  const [exams, setExams] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ቶከኑን ከ localStorage ማግኘት
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    // Fetching contents and exams with authorization header
    const fetchStudentData = async () => {
      try {
        const [contentsRes, examsRes] = await Promise.all([
          axios.get(`${API_URL}/api/contents`, getAuthHeader()),
          axios.get(`${API_URL}/api/exams`, getAuthHeader())
        ]);
        setContents(contentsRes.data);
        setExams(examsRes.data);
      } catch (err) {
        console.error('Error fetching student data:', err);
        if (err.response?.status === 401) {
          // ቶከኑ ካለፈ ወይም ትክክል ካለፈ ወደ ሎጊን መመለስ
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Helper to color-code content types
  const getBadgeColor = (type) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'message': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartExam = (examId) => {
    // እዚህጋ ወደ ፈተና መውሰጃ ገጽ ማዞር (Navigation) ወይም ሎጂክ ማስገባት ይቻላል
    alert(`ፈተና ቁጥር ${examId} መውሰድ ጀምረዋል!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans relative">
      
      {/* Mobile Top Bar with Menu Toggle */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Student Portal</span>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-md font-semibold transition">
          Logout
        </button>
      </header>

      {/* Sidebar (Displays over the page on mobile, normal sticky on desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#123758] text-white transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky md:top-0 md:h-screen
      `}>
        <div>
          <div className="p-6 border-b border-blue-900/50 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#d4af37]">Student Panel</h1>
              <p className="text-xs text-gray-300 mt-1">Max Technology</p>
            </div>
            {/* Close button for mobile sidebar */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white text-lg font-bold">
              ✕
            </button>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            <a href="/student" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>ዳሽቦርድ</span>
            </a>
            <a href="#homework" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <span>የቤት ስራዎች</span>
            </a>
            <a href="#exams" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              <span>ፈተናዎች</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer with Logout Button */}
        <div className="p-4 border-t border-blue-900 space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold text-sm shadow transition flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Logout</span>
          </button>
          <div className="text-xs text-center text-gray-400">
            Max Technology &copy; 2026
          </div>
        </div>
      </aside>

      {/* Backdrop overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Student Portal</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EMPOWERING YOUR REACH</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
              እንኳን ደህና መጡ, ተማሪ!
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              መምህራን ያስቀመጧቸውን የቤት ስራዎች፣ አሳይንመንቶች እና የሚገኙ ፈተናዎችን ከዚህ በታች መከታተል ይችላሉ።
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500 mt-4">መረጃዎችን በመጫን ላይ...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Contents Section (Homework, Assignments, Messages) */}
              <div id="homework" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h4 className="text-lg font-bold text-[#123758]">
                    የቤት ስራዎች እና መልዕክቶች
                  </h4>
                  <span className="text-xs bg-blue-50 text-[#123758] px-2.5 py-1 rounded-full font-semibold">
                    {contents.length} መረጃዎች
                  </span>
                </div>

                {contents.length === 0 ? (
                  <p className="text-sm text-gray-500">ምንም የተለቀቀ መረጃ የለም።</p>
                ) : (
                  <div className="space-y-3">
                    {contents.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-[#123758]">{item.title}</h5>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${getBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exams Section */}
              <div id="exams" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h4 className="text-lg font-bold text-[#123758]">
                    የሚገኙ ፈተናዎች
                  </h4>
                  <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                    {exams.length} ፈተናዎች
                  </span>
                </div>

                {exams.length === 0 ? (
                  <p className="text-sm text-gray-500">ገና የተዘጋጀ ፈተና የለም።</p>
                ) : (
                  <div className="space-y-3">
                    {exams.map((exam, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-[#123758]">{exam.title}</h5>
                          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded">
                            {exam.subject || 'ፈተና'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>የፈተና ቀን: {exam.examDate ? new Date(exam.examDate).toLocaleString() : 'ጊዜው አልተወሰነም'}</p>
                          <p>የቆይታ ጊዜ: {exam.duration || 'ምንም'} ደቂቃ</p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button 
                            onClick={() => handleStartExam(exam._id || index)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                          >
                            ፈተና ጀምር (Start Exam)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
