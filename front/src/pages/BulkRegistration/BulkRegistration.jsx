import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BulkRegistration() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [successSummary, setSuccessSummary] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert('እባክዎ መጀመሪያ የ Excel ፋይል ይምረጡ!');
      return;
    }

    setUploading(true);
    setMessage('');

    // የሰርቨር ሂደትን በሲሙሌሽን እንሰራለን (Frontend completeness)
    setTimeout(() => {
      setUploading(false);
      setSuccessSummary({
        totalRegistered: 120,
        defaultPassword: 'ChangeMe123',
        failedCount: 0
      });
      setMessage('ተማሪዎች በ Excel ፋይል በተሳካ ሁኔታ ተመዝግበዋል!');
    }, 1500);
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
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
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

      {/* 2. ዋናው የማሳያ ክፍል */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">በ Excel ፋይል ተማሪዎችን በጅምላ መመዝገብ</h1>
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="text-sm bg-gray-200 px-4 py-2 rounded font-medium hover:bg-gray-300 transition"
          >
            ← ወደ ዳሽቦርድ ተመለስ
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full">
          <div className="bg-white p-8 rounded-xl shadow mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">የ Excel ፋይል መጫኛ (Excel Upload)</h2>
            <p className="text-sm text-gray-500 mb-6">
              ተማሪዎችን ለመመዝገብ የተዘጋጀውን የ Excel ቴምፕሌት (Template) በመጠቀም ስም፣ ኢሜይል እና ዲፓርትመንት በማስገባት እዚህ ላይ ይጫኑ። ለሁሉም ተማሪዎች በነባሪ (Default) ሚስጥር ቃል ይሰጣቸዋል።
            </p>

            <div className="mb-6">
              <a 
                href="#download-template" 
                onClick={(e) => { e.preventDefault(); alert('የ Excel ቴምፕሌት ፋይል ወርዷል!'); }}
                className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
              >
                📥 የ Excel ቴምፕሌት ፋይል (Template) አውርድ
              </a>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2">የሚደገፉ ቅርጸቶች: .xlsx, .xls, .csv</p>
              </div>

              {file && (
                <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-sm text-blue-800">
                  <span>መረጡት ፋይል: <strong>{file.name}</strong></span>
                  <span className="text-xs bg-blue-200 px-2.5 py-1 rounded-full font-semibold">ዝግጁ</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow disabled:opacity-50"
              >
                {uploading ? 'እየጫነ እና እየመዘገበ ይገኛል...' : 'ፋይሉን ጫንና ተማሪዎችን መዝግብ (Upload & Register)'}
              </button>
            </form>

            {message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                <p className="font-bold">{message}</p>
                {successSummary && (
                  <div className="mt-2 text-sm space-y-1">
                    <p>• የተመዘገቡ ተማሪዎች ብዛት: <strong>{successSummary.totalRegistered}</strong></p>
                    <p>• የተሰጣቸው ጊዜያዊ ፓስወርድ: <strong className="bg-green-200 px-1.5 py-0.5 rounded">{successSummary.defaultPassword}</strong> (ተማሪዎቹ በመጀመሪያ ግቢያቸው እንዲቀይሩት ይደረጋል)</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
