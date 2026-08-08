import React, { useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [contentForm, setContentForm] = useState({ title: '', description: '', type: 'homework' });

  const handleSubmit = () => {
    // ዩአርኤሉ ወደ ላይቭ ሰርቨር አድራሻ ተስተካክሏል
    axios.post('https://olinexamcenter.onrender.com/api/contents', contentForm)
      .then(() => {
        alert('ተለቋል!');
        setOpenModal(false);
        setContentForm({ title: '', description: '', type: 'homework' });
      })
      .catch(err => console.error('Error posting content:', err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#123758] text-white hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-xl font-extrabold text-[#d4af37]">Teacher Panel</h1>
          </div>
          <nav className="mt-2 px-4 space-y-2">
            <a href="#dashboard" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>ዳሽቦርድ</span>
            </a>
            <a href="#homework" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <span>የቤት ስራ / አሳይንመንት</span>
            </a>
            <a href="#messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <span>የወላጅ መልዕክቶች</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Teacher Portal</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EMPOWERING YOUR REACH</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
              እንኳን ደህና መጡ, መምህር!
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ለተማሪዎች እና ለወላጆች የቤት ስራዎችን፣ አሳይንመንቶችን እና መልዕክቶችን ከዚህ በታች ማስተዳደር ይችላሉ።
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-lg font-bold text-[#123758]">
              ፈጣን ማስተካከያዎች
            </h4>
            <button 
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center space-x-2 bg-[#123758] hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>የቤት ስራ፣ አሳይንመንት ወይም መልዕክት ልቀቅ</span>
            </button>
          </div>

          {/* Modal for Posting Content */}
          {openModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
                <h4 className="text-xl font-bold text-[#123758]">አዲስ መረጃ መጫኛ</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">የይዘቱ ዓይነት</label>
                    <select 
                      value={contentForm.type}
                      onChange={e => setContentForm({...contentForm, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758]"
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

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    ይቅር
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium bg-[#123758] hover:bg-blue-900 text-white rounded-lg transition"
                  >
                    ለቀቅ
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
