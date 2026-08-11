import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function TeacherDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentForm, setContentForm] = useState({ title: '', description: '', type: 'homework' });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSubmit = () => {
    axios.post(`${API_URL}/api/contents`, contentForm, getAuthHeader())
      .then(() => {
        alert('ተለቋል!');
        setOpenModal(false);
        setContentForm({ title: '', description: '', type: 'homework' });
      })
      .catch(err => {
        console.error('Error posting content:', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        } else {
          alert('መረጃውን መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans relative">
      
      {/* Mobile Top Bar with Menu Toggle */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Max Technology</span>
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
              <h1 className="text-xl font-extrabold text-[#d4af37]">Max Technology</h1>
              <p className="text-xs text-gray-300 mt-1">Teacher Panel</p>
            </div>
            {/* Close button for mobile sidebar */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white text-lg font-bold">
              ✕
            </button>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            <a href="/teacher" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>ዳሽቦርድ</span>
            </a>
            <a href="#homework" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <span>የቤት ስራ / አሳይንመንት</span>
            </a>
            <a href="#messages" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <span>የወላጅ መልዕክቶች</span>
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
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            እንኳን ደህና መጡ, መምህር!
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            ለተማሪዎች እና ለወላጆች የቤት ስራዎችን፣ አሳይንመንቶችን እና መልዕክቶችን ከዚህ በታች ማስተዳደር ይችላሉ።
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h4 className="text-lg font-bold text-[#123758]">
            ፈጣን ማስተካከያዎች
          </h4>
          <button 
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center space-x-2 bg-[#123758] hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm text-sm sm:text-base"
          >
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>የቤት ስራ፣ አሳይንመንት ወይም መልዕክት ልቀቅ</span>
          </button>
        </div>

        {openModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="bg-[#123758] text-white px-6 py-4 flex justify-between items-center">
                <h4 className="font-bold text-lg">አዲስ መረጃ መጫኛ</h4>
                <button onClick={() => setOpenModal(false)} className="text-gray-300 hover:text-white">✕</button>
              </div>
              
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የይዘቱ ዓይነት</label>
                  <select 
                    value={contentForm.type}
                    onChange={e => setContentForm({...contentForm, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758] bg-white"
                  >
                    <option value="homework">የቤት ስራ (Homework)</option>
                    <option value="assignment">አሳይንመንት (Assignment)</option>
                    <option value="message">የወላጅ መልዕክት (Parent Message)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ርዕስ (Title)</label>
                  <input 
                    type="text"
                    placeholder="ርዕስ ያስገቡ"
                    value={contentForm.title}
                    onChange={e => setContentForm({...contentForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">መግለጫ / ዝርዝር (Description)</label>
                  <textarea 
                    rows={4}
                    placeholder="መግለጫ ይጻፉ..."
                    value={contentForm.description}
                    onChange={e => setContentForm({...contentForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758]"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
                <button 
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  ይቅር
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-medium bg-[#123758] hover:bg-blue-900 text-white rounded-lg transition shadow"
                >
                  ለቀቅ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
