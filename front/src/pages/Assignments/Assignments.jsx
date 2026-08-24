import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Assignments() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedId, setSubmittedId] = useState(null);

  // የአሳይመንቶች ናሙና መረጃ
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'የሶፍትዌር ዲዛይን ፓተርን አሳይመንት',
      course: 'Advanced Web Development (SWE301)',
      teacher: 'ዶ/ር ከበደ አሰፋ',
      dueDate: '2026-06-15',
      description: 'Singleton እና Factory pattern በመጠቀም ቀላል የኢኮሜርስ ሲስተም ዲዛይን ሠርተው ዶክመንት አያይዘው ይላኩ።',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'የዳታቤዝ ኖርማላይዜሽን ልምምድ',
      course: 'Database Systems (SWE302)',
      teacher: 'መምህር ዮናስ ታደሰ',
      dueDate: '2026-06-20',
      description: 'የተሰጠውን ያልተስተካከለ ቴብል እስከ 3ኛ ኖርማል 폼 (3NF) ቀይረው ፎርማቱን ይጫኑ።',
      status: 'Pending'
    }
  ]);

  const handleFileChange = (e, id) => {
    setSelectedFile({
      assignmentId: id,
      file: e.target.files[0]
    });
  };

  const handleSubmitAssignment = (id) => {
    if (!selectedFile || selectedFile.assignmentId !== id) {
      alert('እባክዎ መጀመሪያ ፋይል ይምረጡ!');
      return;
    }

    // አሳይመንቱ መላኩን በሲሙሌሽን እናዘምነዋለን
    setAssignments(assignments.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Submitted' };
      }
      return item;
    }));

    setSubmittedId(id);
    setSelectedFile(null);
    alert('አሳይመንቱ በተሳካ ሁኔታ ተልኳል!');
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
            onClick={() => navigate('/student-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
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
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
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
          <h1 className="text-xl font-bold text-gray-800">የአሳይመንት እና የቤት ስራ ማዕከል</h1>
          <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
            ንቁ አሳይመንቶች: {assignments.filter(a => a.status === 'Pending').length}
          </span>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
          {assignments.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                    {item.course}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">{item.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'Submitted' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status === 'Submitted' ? 'ተسርክቧል (Submitted)' : 'በመጠበቅ ላይ (Pending)'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 border-t pt-4 border-gray-100">
                <div>
                  <p>መምህር: <span className="font-medium text-gray-700">{item.teacher}</span></p>
                  <p className="mt-1">የማስረከቢያ ቀን: <strong className="text-red-600">{item.dueDate}</strong></p>
                </div>

                {item.status === 'Pending' ? (
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, item.id)}
                      className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <button 
                      onClick={() => handleSubmitAssignment(item.id)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition shadow"
                    >
                      አስረክብ (Upload)
                    </button>
                  </div>
                ) : (
                  <div className="text-green-600 font-semibold text-sm flex items-center gap-1 mt-4 sm:mt-0">
                    ✅ ስራዎ ተቀባይነት አግኝቷል
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
