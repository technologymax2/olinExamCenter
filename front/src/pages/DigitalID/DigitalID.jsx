import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalID() {
  const navigate = useNavigate();
  
  // የተማሪው መረጃ (በተጨባጭ ከ Backend API ይመጣል)
  const [student, setStudent] = useState({
    name: 'አበበ ከበደ አሰፋ',
    studentId: 'COL/2026/001',
    department: 'ሶፍትዌር ኢንጂነሪንግ',
    academicYear: '2ኛ ዓመት (2nd Year)',
    status: 'Active',
    admissionYear: '2024',
    email: 'abebe@college.edu',
    photo: 'https://via.placeholder.com/150',
  });

  // የQR ማረጋገጫ ዩአርኤል (ሲቃኝ ወደዚህ ሊንክ ይመራል)
  const verificationUrl = `https://college.edu/verify/${student.studentId}`;

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
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዳሽቦርድ (Dashboard)
          </button>
          <button 
            onClick={() => navigate('/digital-id')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
          >
            ዲጂታል መታወቂያ (Digital ID)
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
          <h1 className="text-xl font-bold text-gray-800">የተማሪ ዲጂታል መታወቂያ (Digital Student ID)</h1>
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow"
          >
            🖨️ መታወቂያውን አትም (Print ID)
          </button>
        </header>

        <main className="p-8 flex justify-center items-center">
          {/* የዲጂታል መታወቂያ ካርድ ዲዛይን */}
          <div className="w-full max-w-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-blue-700">
            
            {/* የካርዱ ራዕይ (Header) */}
            <div className="bg-blue-950 px-6 py-4 flex justify-between items-center border-b border-blue-800">
              <div>
                <h2 className="font-bold text-lg tracking-wider">የኢትዮጵያ ኮሌጅ</h2>
                <p className="text-xs text-blue-300">Official Digital Student ID</p>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-inner">
                {student.status}
              </span>
            </div>

            {/* የካርዱ አካል (Body) */}
            <div className="p-6 flex flex-col items-center text-center">
              {/* የተማሪ ፎቶ */}
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-200">
                <img src={student.photo} alt="Student" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-2xl font-bold tracking-wide">{student.name}</h3>
              <p className="text-blue-200 text-sm font-mono mt-1">{student.studentId}</p>

              <div className="w-full grid grid-cols-2 gap-4 mt-6 text-left bg-blue-950/50 p-4 rounded-xl border border-blue-800/50 text-sm">
                <div>
                  <p className="text-xs text-blue-300">ዲፓርትመንት</p>
                  <p className="font-semibold mt-0.5">{student.department}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300">የአሁን ሁኔታ (Status)</p>
                  <p className="font-semibold text-green-400 mt-0.5">{student.academicYear}</p>
                </div>
              </div>

              {/* የQR ኮድ ክፍል */}
              <div className="mt-6 bg-white p-3 rounded-xl shadow-inner flex items-center justify-center">
                <QRCodeSVG value={verificationUrl} size={110} />
              </div>
              <p className="text-[11px] text-blue-300 mt-2">ለማረጋገጥ (Verify) የQR ኮዱን ይቃኙ</p>
            </div>

            {/* የካርዱ ግርጌ (Footer) */}
            <div className="bg-blue-950 px-6 py-3 text-center text-xs text-blue-400 border-t border-blue-800">
              ይህ መታወቂያ በሲስተሙ በራስ-ሰር የተፈጠረ ነው።
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
