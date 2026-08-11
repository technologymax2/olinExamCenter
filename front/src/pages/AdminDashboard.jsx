import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [openQuestionBankModal, setOpenQuestionBankModal] = useState(false); // አዲስ የጥያቄ ባንክ ሞዳል
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  const [excelFile, setExcelFile] = useState(null);
  
  // የፈተና መርሐ-ግብር እና የጥያቄ ብዛት (NumberOfQuestions) ማስተካከያ
  const [examForm, setExamForm] = useState({ 
    title: '', 
    subject: '', 
    examDate: '', 
    resultReleaseDate: '', 
    duration: '',
    numberOfQuestions: 10,
    description: '' 
  });

  // የጥያቄ ባንክ ፎርም (ለግለሰብ ጥያቄዎች ምዝገባ ወይም ፋይል)
  const [questionForm, setQuestionForm] = useState({
    subject: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  });
  const [bankFile, setBankFile] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ email: '', newPassword: '' });
  const [approvalForm, setApprovalForm] = useState({ email: '', hoursValid: 1 });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/stats`, getAuthHeader())
      .then(response => setStats(response.data))
      .catch(error => {
        console.error('Error fetching stats:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      });
  }, []);

  const handleUserSubmit = () => {
    if (excelFile) {
      const formData = new FormData();
      formData.append('file', excelFile);

      const token = localStorage.getItem('token');
      axios.post(`${API_URL}/api/users/upload-excel`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => { 
          alert('ተጠቃሚዎች ከኤክሴል ፋይል ተጭነው ተመዝግበዋል!'); 
          setOpenUserModal(false); 
          setExcelFile(null); 
        })
        .catch(err => console.error(err));
    } else {
      axios.post(`${API_URL}/api/admin/users`, userForm, getAuthHeader())
        .then(() => { 
          alert('ተጠቃሚው/አድሚኑ በተሳካ ሁኔታ ተመዝግቧል!'); 
          setOpenUserModal(false); 
          setUserForm({ name: '', email: '', role: 'student', password: '' });
        })
        .catch(err => console.error(err));
    }
  };

  // 1. ጥያቄዎችን ወደ Exam Bank መጫኛ
  const handleQuestionBankSubmit = () => {
    const token = localStorage.getItem('token');
    if (bankFile) {
      const formData = new FormData();
      formData.append('file', bankFile);
      axios.post(`${API_URL}/api/admin/question-bank/upload`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
        .then(() => {
          alert('ጥያቄዎች ከፋይሉ ወደ ፈተና ባንክ ተጭነዋል!');
          setOpenQuestionBankModal(false);
          setBankFile(null);
        })
        .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
    } else {
      axios.post(`${API_URL}/api/admin/question-bank/add`, questionForm, getAuthHeader())
        .then(() => {
          alert('ጥያቄው ወደ ፈተና ባንክ ተመዝግቧል!');
          setQuestionForm({ subject: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
        })
        .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
    }
  };

  // 2. ፈተናውን በሰአሌ እና በቁጥር ልክ ከባንክ በማውጣት ማቀናበር
  const handleExamSubmit = () => {
    const token = localStorage.getItem('token');
    axios.post(`${API_URL}/api/admin/exams`, examForm, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => { 
        alert('የፈተና መርሐ-ግብር እና የጥያቄ ገደብ ተሳክቷል!'); 
        setOpenExamModal(false); 
        setExamForm({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '', numberOfQuestions: 10, description: '' });
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.error || 'ፈተናውን በመቅረጽ ላይ ስህተት ተፈጥሯል');
      });
  };

  const handlePasswordSubmit = () => {
    axios.put(`${API_URL}/api/admin/change-password`, passwordForm, getAuthHeader())
      .then(() => {
        alert('የአድሚኑ የይለፍ ቃል ተቀይሯል!');
        setOpenPasswordModal(false);
        setPasswordForm({ email: '', newPassword: '' });
      })
      .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
  };

  const handleApprovalSubmit = () => {
    axios.post(`${API_URL}/api/admin/approve-password-reset`, approvalForm, getAuthHeader())
      .then(res => {
        alert(res.data.message);
        setOpenApprovalModal(false);
        setApprovalForm({ email: '', hoursValid: 1 });
      })
      .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans relative">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Max Admin</span>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-md font-semibold transition">
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#123758] text-white transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky md:top-0 md:h-screen
      `}>
        <div>
          <div className="p-6 border-b border-blue-900/50 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#d4af37]">Max Admin</h1>
              <p className="text-xs text-gray-300 mt-1">Exam Center Control Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white text-lg font-bold">
              ✕
            </button>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            <a href="#dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <span>ዳሽቦርድ</span>
            </a>

            <button 
              onClick={() => { setOpenQuestionBankModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>📚 የፈተና ባንክ (Question Bank)</span>
            </button>

            <button 
              onClick={() => { setOpenExamModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>📝 የፈተና መርሐ-ግብር ማቀናበሪያ</span>
            </button>

            <button 
              onClick={() => { setOpenUserModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>👤 ተጠቃሚ መዝግብ</span>
            </button>

            <button 
              onClick={() => { setOpenPasswordModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>🔑 ፓስወርድ ቀይር</span>
            </button>

            <button 
              onClick={() => { setOpenApprovalModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>✅ ጥያቄ አጽድቅ</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-900 space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold text-sm shadow transition flex items-center justify-center space-x-2"
          >
            <span>Logout</span>
          </button>
          <div className="text-xs text-center text-gray-400">
            Max Technology &copy; 2026
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Exam Center Admin</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EMPOWERING YOUR REACH</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            የአስተዳደር ዳሽቦርድ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#123758]">
              <p className="text-sm font-medium text-gray-500">ጠቅላላ ተማሪዎች</p>
              <h4 className="text-3xl font-bold text-[#123758] mt-1">{stats.totalStudents}</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-600">
              <p className="text-sm font-medium text-gray-500">ጠቅላላ መምህራን</p>
              <h4 className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalTeachers}</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
              <p className="text-sm font-medium text-gray-500">የተዘጋጁ ፈተናዎች</p>
              <h4 className="text-3xl font-bold text-amber-600 mt-1">{stats.totalExams}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-lg font-bold text-[#123758]">ዋና ዋና አስተዳደራዊ ስራዎች</h4>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setOpenQuestionBankModal(true)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm"
              >
                📚 ጥያቄዎችን ወደ ባንክ አስገባ
              </button>
              <button 
                onClick={() => setOpenExamModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm"
              >
                📝 የፈተና መርሐ-ግብር እና የጥያቄ ገደብ አውጣ
              </button>
              <button 
                onClick={() => setOpenUserModal(true)}
                className="bg-[#123758] hover:bg-blue-900 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm"
              >
                ተማሪ/መምህር/አድሚን መዝግብ
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 1. Question Bank Modal (ጥያቄዎችን ወደ ባንክ መጫኛ) */}
      {openQuestionBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የፈተና ጥያቄዎች ባንክ (Exam Bank)</h3>
              <button onClick={() => setOpenQuestionBankModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትምህርት ዓይነት (Subject)</label>
                <input 
                  type="text" 
                  value={questionForm.subject} 
                  onChange={e => setQuestionForm({...questionForm, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="ምሳሌ፦ Mathematics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የጥያቄው ጽሁፍ</label>
                <textarea 
                  rows="2"
                  value={questionForm.questionText} 
                  onChange={e => setQuestionForm({...questionForm, questionText: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="ጥያቄውን እዚህ ይጻፉ..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="አማራጭ A" value={questionForm.optionA} onChange={e => setQuestionForm({...questionForm, optionA: e.target.value})} className="px-3 py-1.5 border rounded text-sm" />
                <input type="text" placeholder="አማራጭ B" value={questionForm.optionB} onChange={e => setQuestionForm({...questionForm, optionB: e.target.value})} className="px-3 py-1.5 border rounded text-sm" />
                <input type="text" placeholder="አማራጭ C" value={questionForm.optionC} onChange={e => setQuestionForm({...questionForm, optionC: e.target.value})} className="px-3 py-1.5 border rounded text-sm" />
                <input type="text" placeholder="አማራጭ D" value={questionForm.optionD} onChange={e => setQuestionForm({...questionForm, optionD: e.target.value})} className="px-3 py-1.5 border rounded text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትክክለኛ መልስ</label>
                <select value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div className="border-t pt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">ወይም ብዙ ጥያቄዎችን በፋይል ጫን (Excel/JSON)</label>
                <input 
                  type="file" 
                  onChange={e => setBankFile(e.target.files[0])} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenQuestionBankModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleQuestionBankSubmit} className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium shadow">ወደ ባንክ አስቀምጥ</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Exam Schedule & Question Limit Modal (መርሃ-ግብር እና የጥያቄ ብዛት ማቀናበሪያ) */}
      {openExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-amber-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የፈተና መርሐ-ግብር እና የጥያቄ ገደብ ማቀናበሪያ</h3>
              <button onClick={() => setOpenExamModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና ርዕስ</label>
                <input 
                  type="text" 
                  value={examForm.title} 
                  onChange={e => setExamForm({...examForm, title: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="ምሳሌ፦ የሂሳብ የመጨረሻ ፈተና"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትምህርት ዓይነት (ከባንክ ጋር የሚገናኝበት)</label>
                <input 
                  type="text" 
                  value={examForm.subject} 
                  onChange={e => setExamForm({...examForm, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="Mathematics"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና ቀን እና ሰዓት</label>
                  <input 
                    type="datetime-local" 
                    value={examForm.examDate} 
                    onChange={e => setExamForm({...examForm, examDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ውጤት የሚገለጽበት ቀን</label>
                  <input 
                    type="datetime-local" 
                    value={examForm.resultReleaseDate} 
                    onChange={e => setExamForm({...examForm, resultReleaseDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የቆይታ ጊዜ (በደቂቃ)</label>
                  <input 
                    type="number" 
                    value={examForm.duration} 
                    onChange={e => setExamForm({...examForm, duration: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ለተማሪው የሚፈቀደው የጥያቄ ብዛት (Number of Questions)</label>
                  <input 
                    type="number" 
                    value={examForm.numberOfQuestions} 
                    onChange={e => setExamForm({...examForm, numberOfQuestions: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">መግለጫ / መመሪያ (Description)</label>
                <textarea 
                  rows="2"
                  value={examForm.description} 
                  onChange={e => setExamForm({...examForm, description: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="ፈተናውን ከመጀመርዎ በፊት መመሪያውን ያንብቡ..."
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenExamModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleExamSubmit} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow">መርሃ-ግብሩን አውጣ (Publish Schedule)</button>
            </div>
          </div>
        </div>
      )}

      {/* User Registration Modal */}
      {openUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#123758] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">አዲስ ተጠቃሚ ወይም አድሚን መዝግብ</h3>
              <button onClick={() => setOpenUserModal(false)} className="text-gray-300 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ሙሉ ስም</label>
                <input type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="ሙሉ ስም" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ኢሜል</label>
                <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="example@mail.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የሚስጥር ቁጥር (Password)</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="******" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የተጠቃሚው ሚና (Role)</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="student">ተማሪ (Student)</option>
                  <option value="teacher">መምህር (Teacher)</option>
                  <option value="admin">አስተዳዳሪ (Admin)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ወይም ከኤክሴል ፋይል ጫን</label>
                <input type="file" accept=".xlsx, .xls" onChange={e => setExcelFile(e.target.files[0])} className="w-full text-sm text-gray-500" />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenUserModal(false)} className="px-4 py-2 text-gray-600 text-sm">ይቅር</button>
              <button onClick={handleUserSubmit} className="px-5 py-2 bg-[#123758] text-white rounded-lg text-sm shadow">መዝግብ</button>
            </div>
          </div>
        </div>
      )}

      {/* Password & Approval Modals remain standard */}
    </div>
  );
}

export default AdminDashboard;
