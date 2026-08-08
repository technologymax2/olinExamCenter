import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [contents, setContents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available exams and contents/homework
    const fetchData = async () => {
      try {
        const [examsRes, contentsRes] = await Promise.all([
          axios.get(`${API_URL}/api/exams`),
          axios.get(`${API_URL}/api/contents`)
        ]);
        setExams(examsRes.data);
        setContents(contentsRes.data);
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Max Student</span>
        </div>
        <span className="text-xs font-semibold text-amber-400">EXAM CENTER</span>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#123758] text-white transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div>
          <div className="p-6 hidden md:block">
            <h1 className="text-xl font-extrabold text-[#d4af37]">Max Student</h1>
            <p className="text-xs text-gray-300 mt-1">Student Portal</p>
          </div>
          <nav className="mt-6 md:mt-2 px-4 space-y-2">
            <a href="#dashboard" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>ዳሽቦርድ</span>
            </a>
          </nav>
        </div>
        <div className="p-4 text-xs text-center text-gray-400 border-t border-blue-900">
          Max Technology &copy; 2026
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Student Portal</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EXAM & ASSIGNMENT CENTER</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            የተማሪ ዳሽቦርድ
          </h3>

          {loading ? (
            <p className="text-gray-500">መረጃ በመጫን ላይ...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Exams Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h4 className="text-lg font-bold text-[#123758] flex items-center justify-between">
                  <span>የሚገኙ ፈተናዎች</span>
                  <span className="text-xs bg-blue-50 text-[#123758] px-2.5 py-1 rounded-full">{exams.length} ፈተናዎች</span>
                </h4>
                
                {exams.length === 0 ? (
                  <p className="text-sm text-gray-500">ገና የተዘጋጀ ፈተና የለም።</p>
                ) : (
                  <div className="space-y-3">
                    {exams.map((exam, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-[#123758]">{exam.title}</h5>
                          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{exam.subject}</span>
                        </div>
                        <p className="text-xs text-gray-500">የፈተና ቀን: {new Date(exam.examDate).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">የቆይታ ጊዜ: {exam.duration} ደቂቃ</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contents / Homework / Messages Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h4 className="text-lg font-bold text-[#123758] flex items-center justify-between">
                  <span>गृहስራ እና መልዕክቶች</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">{contents.length} መረጃዎች</span>
                </h4>

                {contents.length === 0 ? (
                  <p className="text-sm text-gray-500">ምንም የተለቀቀ መረጃ የለም።</p>
                ) : (
                  <div className="space-y-3">
                    {contents.map((content, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-[#123758]">{content.title}</h5>
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{content.type || 'Notice'}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{content.description}</p>
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
