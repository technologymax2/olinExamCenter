import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
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
            onClick={() => navigate('/admin-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
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
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
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

      {/* 2. ዋናው የማሳያ ክፍል (Main Content Area) */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* የላይኛው አሞሌ (Navbar) */}
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">የአስተዳዳሪ (Admin) መቆጣጠሪያ</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">አድሚን (Registrar)</span>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* ዳሽቦርድ አካል */}
        <main className="p-8">
          {/* ስታቲስቲክስ ሳጥኖች */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
              <p className="text-sm text-gray-500 font-medium">አጠቃላይ ተማሪዎች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">1,450</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600">
              <p className="text-sm text-gray-500 font-medium">አጠቃላይ መምህራን</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">82</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-600">
              <p className="text-sm text-gray-500 font-medium">የነቁ ኮርሶች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">36</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
              <p className="text-sm text-gray-500 font-medium">የተመረቁ ተማሪዎች</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">320</h3>
            </div>
          </div>

          {/* ፈጣን ተግባራት (Quick Actions) */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ፈጣን ተግባራት (Quick Actions)</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/bulk-registration')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow"
              >
                📁 በ Excel ተማሪዎችን መዝግብ
              </button>
              <button 
                onClick={() => navigate('/notices')}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow"
              >
                📢 ማስታወቂያ ልቀቅ
              </button>
              <button 
                onClick={() => navigate('/digital-id')}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow"
              >
                🪪 ዲጂታል መታወቂያዎች
              </button>
            </div>
          </div>

          {/* የቅርብ ጊዜ እንቅስቃሴዎች  جدول (Recent Activities Table) */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-4">የቅርብ ጊዜ ምዝገባዎች</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4">የተማሪ ስም</th>
                    <th className="py-3 px-4">መታወቂያ (ID)</th>
                    <th className="py-3 px-4">ዲፓርትመንት</th>
                    <th className="py-3 px-4">ሁኔታ (Status)</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">አበበ ከበደ</td>
                    <td className="py-3 px-4">COL/2026/001</td>
                    <td className="py-3 px-4">ሶፍትዌር ኢንጂነሪንግ</td>
                    <td className="py-3 px-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">ሰላም ፍቅሩ</td>
                    <td className="py-3 px-4">COL/2026/002</td>
                    <td className="py-3 px-4">አካውንቲንግ</td>
                    <td className="py-3 px-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span></td>
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
