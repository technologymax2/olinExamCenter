import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [openQuestionBankModal, setOpenQuestionBankModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  const [excelFile, setExcelFile] = useState(null);
  
  const [examForm, setExamForm] = useState({ 
    title: '', 
    subject: '', 
    examDate: '', 
    resultReleaseDate: '', 
    duration: '',
    numberOfQuestions: 10,
    description: '' 
  });

  const [questionForm, setQuestionForm] = useState({
    subject: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: ''
  });

  // State for bulk pasted text questions
  const [bulkTextQuestions, setBulkTextQuestions] = useState('');
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

  // Helper function to parse pasted text block into structured questions array
  const parseBulkQuestions = (text) => {
    // Basic block splitter based on question numbers (e.g., "1. ", "2. ")
    const rawBlocks = text.split(/\n(?=\d+\.\s+)/);
    const parsed = [];

    for (const block of rawBlocks) {
      if (!block.trim()) continue;

      try {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        let qText = '';
        let optA = '', optB = '', optC = '', optD = '';
        let correct = 'A';
        let expl = '';

        let mode = 'question';
        for (let line of lines) {
          // Strip starting number if present in first line
          if (mode === 'question') {
            const cleanedLine = line.replace(/^\d+\.\s*/, '');
            qText += (qText ? ' ' : '') + cleanedLine;
            if (line.match(/^[a-d]\)/i)) {
              mode = 'options';
            }
          }
          
          if (line.toLowerCase().startsWith('a)')) optA = line.replace(/^a\)\s*/i, '');
          else if (line.toLowerCase().startsWith('b)')) optB = line.replace(/^b\)\s*/i, '');
          else if (line.toLowerCase().startsWith('c)')) optC = line.replace(/^c\)\s*/i, '');
          else if (line.toLowerCase().startsWith('d)')) optD = line.replace(/^d\)\s*/i, '');
          else if (line.toLowerCase().startsWith('answer:')) {
            const match = line.match(/answer:\s*([a-d])/i);
            if (match) correct = match[1].toUpperCase();
          } else if (line.toLowerCase().startsWith('explanation:')) {
            expl = line.replace(/^explanation:\s*/i, '');
          } else if (expl) {
            expl += ' ' + line;
          }
        }

        if (qText && optA && optB) {
          parsed.push({
            subject: questionForm.subject || 'General',
            questionText: qText,
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            correctAnswer: correct,
            explanation: expl
          });
        }
      } catch (e) {
        console.error('Error parsing block:', e);
      }
    }
    return parsed;
  };

  const handleQuestionBankSubmit = () => {
    const token = localStorage.getItem('token');
    
    if (bulkTextQuestions.trim()) {
      const questionsArray = parseBulkQuestions(bulkTextQuestions);
      if (questionsArray.length === 0) {
        alert('ጥያቄዎቹን በትክክለኛ ቅርጸት ማንበብ አልተቻለም። እባክዎ ፎርማቱን ያረጋግጡ!');
        return;
      }

      axios.post(`${API_URL}/api/admin/question-bank/bulk-add`, { questions: questionsArray }, getAuthHeader())
        .then(() => {
          alert(`${questionsArray.length} ጥያቄዎች ወደ ፈተና ባንክ ተጭነዋል!`);
          setOpenQuestionBankModal(false);
          setBulkTextQuestions('');
        })
        .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
    } else if (bankFile) {
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
      if (!questionForm.subject || !questionForm.questionText || !questionForm.optionA || !questionForm.optionB) {
        alert('እባክዎ ቢያንስ ትምህርት ዓይነትን፣ ጥያቄውን እና አማራጮችን ይሙሉ!');
        return;
      }

      axios.post(`${API_URL}/api/admin/question-bank/add`, questionForm, getAuthHeader())
        .then(() => {
          alert('ጥያቄው ወደ ፈተና ባንክ በተሳካ ሁኔታ ተመዝግቧል!');
          setQuestionForm({ subject: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' });
          setOpenQuestionBankModal(false);
        })
        .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
    }
  };

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
        </div>
      </main>

      {/* 1. Question Bank Modal (ጥያቄዎችን ወደ ባንክ መጫኛ) */}
      {openQuestionBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
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
                  placeholder="ምሳሌ፦ Nutrition / Mathematics"
                />
              </div>

              {/* Bulk Text Paste Option */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                <label className="block text-xs font-bold text-blue-900 mb-1">📋 ብዙ ጥያቄዎችን በቀጥታ ፔስት (Paste) አድርግ</label>
                <p className="text-xs text-gray-500">እንደ 1. ... a) ... b) ... Answer: ... Explanation: ያሉት ጽሁፎችን በቀጥታ እዚህ ጋር መለጠፍ ይችላሉ።</p>
                <textarea 
                  rows="6"
                  value={bulkTextQuestions} 
                  onChange={e => setBulkTextQuestions(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-xs font-mono"
                  placeholder="1. Which of the following is not a macronutrient?&#10;a) Proteins&#10;...&#10;Answer: d&#10;Explanation: ..."
                />
              </div>

              <div className="text-center text-xs font-semibold text-gray-400">ወይም አንድ ጥያቄ ብቻ በእጅ ለመሙላት</div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ትክክለኛ መልስ</label>
                  <select value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ማብራሪያ (Explanation)</label>
                  <input type="text" value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="የመልሱ ማብራሪያ..." />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenQuestionBankModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleQuestionBankSubmit} className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium shadow">ወደ ባንክ አስቀምጥ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
