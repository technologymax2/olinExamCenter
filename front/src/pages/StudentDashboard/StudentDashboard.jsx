import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
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
            onClick={() => navigate('/student-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
          >
            ዳሽቦርድ (Dashboard)
          </button>
          <button 
            onClick={() => navigate('/digital-id')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዲጂታል መታወቂያ (Digital ID)
          </button>
          <button 
            onClick={() => navigate('/assignments')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            አሳይመንቶች (Assignments)
          </button>
          <button 
            onClick={() => navigate('/exams')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            የኦንላይን ፈተና (Exams)
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
          <h1 className="text-xl font-bold text-gray-800">የተማሪ መቆጣጠሪያ ማዕከል (Student Dashboard)</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">አበበ ከበደ (Student)</span>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              AK
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* አካዳሚክ ሪከርድ እና ጂፒኤ ሳጥኖች */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
              <p className="text-sm text-gray-500 font-medium">የአሁን ሁኔታ (Status)</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">2ኛ ዓመት (Active)</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600">
              <p className="text-sm text-gray-500 font-medium">ሴሚስተር ጂፒኤ (GPA)</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">3.75</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-600">
              <p className="text-sm text-gray-500 font-medium">አጠቃላይ ሲጂፒኤ (CGPA)</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">3.68</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
              <p className="text-sm text-gray-500 font-medium">የቀሩ አሳይመንቶች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">2</h3>
            </div>
          </div>

          {/* ፈጣን አቋራጮች */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ፈጣን አገልግሎቶች</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/digital-id')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow"
              >
                🪪 ዲጂታል መታወቂያዎን ይመልከቱ
              </button>
              <button 
                onClick={() => navigate('/exams')}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow"
              >
                ✍️ ኦንላይን ፈተና ይውሰዱ
              </button>
              <button 
                onClick={() => navigate('/assignments')}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow"
              >
                📂 አሳይመንት ያስረክቡ
              </button>
            </div>
          </div>

          {/* የኮርሶች እና ውጤቶች ሰንጠረዥ */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-4">የተመዘገቡባቸው ኮርሶች</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4">የኮርስ ኮድ</th>
                    <th className="py-3 px-4">የኮርስ ስም</th>
                    <th className="py-3 px-4">ክሬዲት ሰዓት</th>
                    <th className="py-3 px-4">ሁኔታ</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-medium">SWE301</td>
                    <td className="py-3 px-4">Advanced Web Development</td>
                    <td className="py-3 px-4">5</td>
                    <td className="py-3 px-4"><span className="text-green-600 font-semibold"> እየተማረበት ነው</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-medium">SWE302</td>
                    <td className="py-3 px-4">Database Systems</td>
                    <td className="py-3 px-4">4</td>
                    <td className="py-3 px-4"><span className="text-green-600 font-semibold"> እየተማረበት ነው</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
