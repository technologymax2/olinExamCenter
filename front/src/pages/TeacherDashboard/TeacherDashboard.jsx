import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. የጎን ሜኑ (Sidebar) */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-blue-800">
          ኮሌጅ ሲስተም
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate('/teacher-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
          >
            ዳሽቦርድ (Dashboard)
          </button>
          <button 
            onClick={() => navigate('/assignments')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            አሳይመንቶች (Assignments)
          </button>
          <button 
            onClick={() => navigate('/notices')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ማስታወቂያዎች (Notices)
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
          <h1 className="text-xl font-bold text-gray-800">የመምህር መቆጣጠሪያ ማዕከል (Teacher Dashboard)</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">ዶ/ር ከበደ (Teacher)</span>
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              KB
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* ስታቲስቲክስ ሳጥኖች */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
              <p className="text-sm text-gray-500 font-medium">የተመደቡ ኮርሶች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">4</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
              <p className="text-sm text-gray-500 font-medium">የሚጠበቁ አሳይመንት ግምገማዎች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">18</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-600">
              <p className="text-sm text-gray-500 font-medium">ንቁ ፈተናዎች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">2</h3>
            </div>
          </div>

          {/* ፈጣን ተግባራት */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ፈጣን ተግባራት</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/assignments')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow"
              >
                📝 አሳይመንት ልቀቅ / ግመግም
              </button>
              <button 
                onClick={() => navigate('/exams')}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow"
              >
                📋 ፈተና አዘጋጅ
              </button>
            </div>
          </div>

          {/* የተመደቡ ኮርሶች ዝርዝር */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-4">የእርስዎ ኮርሶች</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl bg-gray-50">
                <h3 className="font-bold text-blue-800">Advanced Web Development (SWE301)</h3>
                <p className="text-sm text-gray-600 mt-1">ክፍል: ሶፍትዌር ኢንጂነሪንግ 3ኛ ዓመት</p>
                <span className="inline-block mt-3 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Active Semester</span>
              </div>
              <div className="p-4 border rounded-xl bg-gray-50">
                <h3 className="font-bold text-blue-800">Database Systems (SWE302)</h3>
                <p className="text-sm text-gray-600 mt-1">ክፍል: ሶፍትዌር ኢንጂነሪንግ 2ኛ ዓመት</p>
                <span className="inline-block mt-3 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Active Semester</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
