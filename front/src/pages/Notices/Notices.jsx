import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notices() {
  const navigate = useNavigate();
  
  // የማስታወቂያዎች ናሙና መረጃ
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'የ2018 ዓ.ም የትምህርት ዘመን ሁለተኛ ሴሚስተር ምዝገባ ማስታወሻ',
      content: 'ሁሉም ተማሪዎች እስከ ሰኔ 30/2018 ዓ.ም ድረስ ምዝገባችሁን እንድታጠናቅቁ እናሳስባለን።',
      targetAudience: 'Students',
      date: '2026-06-10',
      postedBy: 'የሬጅስትራር ቢሮ'
    },
    {
      id: 2,
      title: 'የመምህራን አስቸኳይ ስብሰባ ጥሪ',
      content: 'የዲፓርትመንት ኃላፊዎች እና መምህራን ሁሉ ነገ ከሰዓት በኋላ በዋናው መሰብሰቢያ አዳራሽ በሰዓቱ እንድትገኙ።',
      targetAudience: 'Teachers',
      date: '2026-06-12',
      postedBy: 'የኮሌጁ ዲን ጽህፈት ቤት'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      alert('እባክዎ ርዕስ እና ይዘት ይሙሉ!');
      return;
    }

    const newNoticeObj = {
      id: notices.length + 1,
      title: newTitle,
      content: newContent,
      targetAudience: targetAudience,
      date: new Date().toISOString().split('T')[0],
      postedBy: 'አድሚን (Admin)'
    };

    setNotices([newNoticeObj, ...notices]);
    setNewTitle('');
    setNewContent('');
    alert('ማስታወቂያው በተሳካ ሁኔታ ተለጥፏል!');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. የጎን ሜኑ (Sidebar) */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-blue-800">
          ኮሌጅ ሲስተም
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate('/admin-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዳሽቦርድ (Dashboard)
          </button>
          <button 
            onClick={() => navigate('/bulk-registration')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            በጅምላ መመዝገቢያ (Bulk Reg)
          </button>
          <button 
            onClick={() => navigate('/notices')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
          >
            ማስታወቂያዎች (Notices)
          </button>
          <button 
            onClick={() => navigate('/digital-id')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዲጂታል መታወቂያ (Digital ID)
          </button>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-2 bg-red-600 rounded text-center font-semibold hover:bg-red-700 transition"
          >
            ውጣ (Logout)
          </button>
        </div>
      </aside>

      {/* 2. ዋናው የማሳያ ክፍል */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">የማስታወቂያ ሰሌዳ (Notice Board)</h1>
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="text-sm bg-gray-200 px-4 py-2 rounded font-medium hover:bg-gray-300 transition"
          >
            ← ወደ ዳሽቦርድ ተመለስ
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full space-y-8">
          {/* ማስታወቂያ መለጠፊያ ፎርም (ለአድሚን) */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">አዲስ ማስታወቂያ መለጠፊያ</h2>
            <form onSubmit={handlePostNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">የማስታወቂያ ርዕስ</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="የማስታወቂያውን ርዕስ ያስገቡ..."
                  className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ለማን ይደርስ?</label>
                  <select 
                    value={targetAudience} 
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  >
                    <option value="All">ለሁሉም (All Users)</option>
                    <option value="Students">ለተማሪዎች ብቻ (Students)</option>
                    <option value="Teachers">ለመምህራን ብቻ (Teachers)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">የማስታወቂያው ይዘት</label>
                <textarea 
                  rows="3" 
                  value={newContent} 
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="ዝርዝር መረጃ እዚህ ይጻፉ..."
                  className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow"
              >
                ማስታወቂያውን ልቀቅ (Publish Notice)
              </button>
            </form>
          </div>

          {/* የተለጠፉ ማስታወቂያዎች ዝርዝር */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">የቅርብ ጊዜ ማስታወቂያዎች</h2>
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{notice.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                    {notice.targetAudience}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{notice.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3 border-gray-100">
                  <span>አቅራቢ: <strong className="text-gray-600">{notice.postedBy}</strong></span>
                  <span>ቀን: {notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
