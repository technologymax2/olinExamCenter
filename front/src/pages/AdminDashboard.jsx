import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduledExamsTable from '../components/ScheduledExamsTable';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0, totalEmployees: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [openQuestionBankModal, setOpenQuestionBankModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false); // 🆕 HR Employee Modal State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [questionBankList, setQuestionBankList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  const [excelFile, setExcelFile] = useState(null);
  
  const [examForm, setExamForm] = useState({ 
    title: '', 
    subject: '', 
    examDate: '', 
    resultReleaseDate: '', 
    duration: '',
    numberOfQuestions: 10,
    studentGroup: 'ALL',
    examType: 'Multiple Choice',
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

  const [bulkTextQuestions, setBulkTextQuestions] = useState('');
  const [bankFile, setBankFile] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ email: '', newPassword: '' });
  const [approvalForm, setApprovalForm] = useState({ email: '', hoursValid: 1 });

  // 🆕 HR Employee Form State
  const [employeeForm, setEmployeeForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    salary: ''
  });

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

    fetchQuestionBank();
  }, []);

  const fetchQuestionBank = () => {
    setLoadingQuestions(true);
    axios.get(`${API_URL}/api/admin/question-bank`, getAuthHeader())
      .then(res => setQuestionBankList(res.data))
      .catch(err => console.error('Error fetching question bank:', err))
      .finally(() => setLoadingQuestions(false));
  };

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

  // 🆕 HR Employee Submit Handler
  const handleEmployeeSubmit = () => {
    axios.post(`${API_URL}/api/admin/employees`, employeeForm, getAuthHeader())
      .then(() => {
        alert('የሰራተኛው መረጃ በ HR ስር በተሳካ ሁኔታ ተመዝግቧል!');
        setOpenEmployeeModal(false);
        setEmployeeForm({ fullName: '', email: '', phone: '', department: '', position: '', hireDate: '', salary: '' });
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.error || 'ሰራተኛውን በመመዝገብ ላይ ስህተት ተፈጥሯል');
      });
  };

  const parseBulkQuestions = (text) => {
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
          fetchQuestionBank();
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
          fetchQuestionBank();
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
          fetchQuestionBank();
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
        setExamForm({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '', numberOfQuestions: 10, studentGroup: 'ALL', examType: 'Multiple Choice', description: '' });
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

  const handleDeleteQuestion = (questionId) => {
    if (!window.confirm('ይህን ጥያቄ ማጥፋት ይፈልጋሉ?')) return;

    axios.delete(`${API_URL}/api/admin/question-bank/${questionId}`, getAuthHeader())
      .then(() => {
        alert('ጥያቄው በተሳካ ሁኔታ ተሰርዟል!');
        fetchQuestionBank();
      })
      .catch(err => alert(err.response?.data?.error || 'ጥያቄውን በመሰረዝ ላይ ስህተት ተፈጥሯል'));
  };

  const handleDeleteAllQuestions = () => {
    if (!window.confirm('ማስጠንቀቂያ: ሁሉንም የፈተና ጥያቄዎች ማጥፋት ይፈልጋሉ? ይህ ድርጊት ሊመለስ አይችልም!')) return;

    axios.delete(`${API_URL}/api/admin/question-bank/all`, getAuthHeader())
      .then(() => {
        alert('ሁሉም ጥያቄዎች ተሰርዘዋል!');
        fetchQuestionBank();
      })
      .catch(err => alert(err.response?.data?.error || 'ጥያቄዎችን በመሰረዝ ላይ ስህተት ተፈጥሯል'));
  };

  const handleDeleteBySubject = (subjectName) => {
    if (!window.confirm(`እርግጠኛ ኖት የ "${subjectName}" ትምህርት ጥያቄዎችን በሙሉ መሰረዝ ይፈልጋሉ?`)) return;

    axios.delete(`${API_URL}/api/admin/question-bank/subject/${encodeURIComponent(subjectName)}`, getAuthHeader())
      .then(() => {
        alert(`የ "${subjectName}" ትምህርት ጥያቄዎች በሙሉ ተሰርዘዋል!`);
        fetchQuestionBank();
      })
      .catch(err => alert(err.response?.data?.error || 'ጥያቄዎችን በመሰረዝ ላይ ስህተት ተፈጥሯል'));
  };

  const groupedQuestions = questionBankList.reduce((acc, q) => {
    const subject = q.subject ? q.subject.trim() : 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(q);
    return acc;
  }, {});

  const subjectKeys = Object.keys(groupedQuestions);

  const displayedSubjects = selectedSubjectFilter === 'ALL' 
    ? subjectKeys 
    : subjectKeys.filter(s => s.toLowerCase() === selectedSubjectFilter.toLowerCase());

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
              <span>📚 አዲስ ጥያቄ ጨምር (Add to Question Bank)</span>
            </button>

            <button 
              onClick={() => { setOpenExamModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>📝 የፈተና መርሐ-ግብር ማቀናበሪያ (Schedule Exam)</span>
            </button>

            <button 
              onClick={() => { setOpenUserModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>👤 ተጠቃሚ መዝግብ</span>
            </button>

            {/* 🆕 HR Employee Navigation Button */}
            <button 
              onClick={() => { setOpenEmployeeModal(true); setSidebarOpen(false); }} 
              className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/40 text-gray-200 font-medium transition text-sm"
            >
              <span>🏢 HR ሰራተኛ መዝግብ (Add Employee)</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            {/* 🆕 HR Employees Stat Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-600">
              <p className="text-sm font-medium text-gray-500">ጠቅላላ ሰራተኞች (HR)</p>
              <h4 className="text-3xl font-bold text-indigo-600 mt-1">{stats.totalEmployees || 0}</h4>
            </div>
          </div>

          <ScheduledExamsTable />
          
          {/* Admin Question Bank Preview Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div>
                <h4 className="text-lg font-bold text-[#123758]">📚 የፈተና ጥያቄዎች ባንክ (Question Bank Inventory)</h4>
                <p className="text-xs text-gray-500 mt-1">በዚህ ክፍል ውስጥ በዳታቤዝ ውስጥ ያሉትን ጥያቄዎች በዓይነት ተደራጅተው ማየትና መቆጣጠር ይችላሉ።</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setOpenQuestionBankModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                >
                  + አዲስ ጥያቄ ጨምር
                </button>
                <button 
                  onClick={() => setOpenExamModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                >
                  📝 ፈተና መርሐ-ግብር አውጣ (Schedule Exam)
                </button>
                {/* 🆕 HR Employee Button in Quick Actions */}
                <button 
                  onClick={() => setOpenEmployeeModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                >
                  🏢 HR ሰራተኛ ጨምር
                </button>
                {questionBankList.length > 0 && (
                  <button 
                    onClick={handleDeleteAllQuestions}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                  >
                    🗑️ ሁሉንም ጥያቄዎች አጥፋ
                  </button>
                )}
              </div>
            </div>

            {loadingQuestions ? (
              <p className="text-sm text-gray-500 py-4">ጥያቄዎችን በመጫን ላይ...</p>
            ) : questionBankList.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">በፈተና ባንክ ውስጥ እስካሁን ምንም ጥያቄ የለም።</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-600 mr-2">ትምህርት ማጣሪያ (Filter Subject):</span>
                  <button
                    onClick={() => setSelectedSubjectFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                      selectedSubjectFilter === 'ALL'
                        ? 'bg-[#123758] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border'
                    }`}
                  >
                    ሁሉም ({questionBankList.length})
                  </button>
                  {subjectKeys.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubjectFilter(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm uppercase ${
                        selectedSubjectFilter.toLowerCase() === subj.toLowerCase()
                          ? 'bg-blue-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-200 border'
                      }`}
                    >
                      {subj} ({groupedQuestions[subj].length})
                    </button>
                  ))}
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {displayedSubjects.map((subjectName) => (
                    <div key={subjectName} className="space-y-3 border-l-4 border-blue-600 pl-4">
                      <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                        <h5 className="font-extrabold text-[#123758] uppercase tracking-wide text-sm">
                          📖 {subjectName} ({groupedQuestions[subjectName].length} ጥያቄዎች)
                        </h5>
                        <button
                          onClick={() => handleDeleteBySubject(subjectName)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded shadow transition flex items-center space-x-1"
                        >
                          <span>🗑️ የዚህን ትምህርት ጥያቄዎች አጥፋ</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {groupedQuestions[subjectName].map((q, idx) => (
                          <div key={q._id || idx} className="p-4 border rounded-lg bg-gray-50/50 space-y-2 relative shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-gray-500">ጥያቄ #{idx + 1}</span>
                              <button 
                                onClick={() => handleDeleteQuestion(q._id)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition"
                              >
                                🗑️ ሰርዝ
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{q.questionText}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                              <div className={`p-1.5 rounded ${q.correctAnswer === 'A' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white border'}`}>A) {q.optionA}</div>
                              <div className={`p-1.5 rounded ${q.correctAnswer === 'B' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white border'}`}>B) {q.optionB}</div>
                              {q.optionC && <div className={`p-1.5 rounded ${q.correctAnswer === 'C' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white border'}`}>C) {q.optionC}</div>}
                              {q.optionD && <div className={`p-1.5 rounded ${q.correctAnswer === 'D' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white border'}`}>D) {q.optionD}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 1. Question Bank Modal */}
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

      {/* 2. Exam Schedule Modal */}
      {openExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-amber-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">📝 የፈተና መርሐ-ግብር ማቀናበሪያ</h3>
              <button onClick={() => setOpenExamModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተናው ርዕስ (Exam Title)</label>
                <input 
                  type="text" 
                  value={examForm.title} 
                  onChange={e => setExamForm({...examForm, title: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                  placeholder="ምሳሌ፦ የሁለተኛ ወር ፈተና" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትምህርት ዓይነት (Subject)</label>
                <input 
                  type="text" 
                  value={examForm.subject} 
                  onChange={e => setExamForm({...examForm, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                  placeholder="ምሳሌ፦ Nutrition" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">👥 የሚፈተኑ ተማሪዎች ግሩፕ (Student Group)</label>
                  <select 
                    value={examForm.studentGroup} 
                    onChange={e => setExamForm({...examForm, studentGroup: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                  >
                    <option value="ALL">ሁሉም ተማሪዎች (All Students)</option>
                    <option value="Batch-1">ግሩፕ 1 (Batch 1)</option>
                    <option value="Batch-2">ግሩፕ 2 (Batch 2)</option>
                    <option value="Department-A">ክፍል A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">📋 የፈተና ዓይነት (Exam Type)</label>
                  <select 
                    value={examForm.examType} 
                    onChange={e => setExamForm({...examForm, examType: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                  >
                    <option value="Multiple Choice">ብዙ ምርጫ (Multiple Choice)</option>
                    <option value="True/False">እውነት/ሐሰት (True/False)</option>
                    <option value="Mixed">ቅልቅል (Mixed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና ቀን እና ሰዓት</label>
                  <input 
                    type="datetime-local" 
                    value={examForm.examDate} 
                    onChange={e => setExamForm({...examForm, examDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ውጤት የሚለቀቅበት ቀን</label>
                  <input 
                    type="datetime-local" 
                    value={examForm.resultReleaseDate} 
                    onChange={e => setExamForm({...examForm, resultReleaseDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg text-xs" 
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
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="30" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ከባንክ የሚወጡ ጥያቄዎች ብዛት</label>
                  <input 
                    type="number" 
                    value={examForm.numberOfQuestions} 
                    onChange={e => setExamForm({...examForm, numberOfQuestions: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="10" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">መግለጫ (Description)</label>
                <textarea 
                  rows="2" 
                  value={examForm.description} 
                  onChange={e => setExamForm({...examForm, description: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                  placeholder="ለተማሪዎች የሚሰጥ ማሳሰቢያ..." 
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenExamModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleExamSubmit} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow">መርሐ-ግብር አውጣ</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. User Registration Modal */}
      {openUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#123758] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">👤 ተጠቃሚ መዝግብ</h3>
              <button onClick={() => setOpenUserModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ሙሉ ስም</label>
                <input type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ኢሜይል</label>
                <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ሚና (Role)</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የይለፍ ቃል (Password)</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="border-t pt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">ወይም ከኤክሴል ፋይል ሎድ አድርግ (Excel)</label>
                <input type="file" accept=".xlsx, .xls" onChange={e => setExcelFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenUserModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleUserSubmit} className="px-5 py-2 bg-[#123758] hover:bg-blue-900 text-white rounded-lg text-sm font-medium shadow">ተጠቃሚ መዝግብ</button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 4. HR Employee Modal */}
      {openEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">🏢 HR ሰራተኛ መዝግብ (Employee Registration)</h3>
              <button onClick={() => setOpenEmployeeModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የሰራተኛው ሙሉ ስም</label>
                <input 
                  type="text" 
                  value={employeeForm.fullName} 
                  onChange={e => setEmployeeForm({...employeeForm, fullName: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg" 
                  placeholder="ምሳሌ፦ አበበ ከበደ" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ኢሜይል (Email)</label>
                  <input 
                    type="email" 
                    value={employeeForm.email} 
                    onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="example@maxtech.com" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ስልክ ቁጥር (Phone)</label>
                  <input 
                    type="text" 
                    value={employeeForm.phone} 
                    onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="0911..." 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የሥራ ክፍል (Department)</label>
                  <input 
                    type="text" 
                    value={employeeForm.department} 
                    onChange={e => setEmployeeForm({...employeeForm, department: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="IT / Finance / HR" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የሥራ መደብ (Position)</label>
                  <input 
                    type="text" 
                    value={employeeForm.position} 
                    onChange={e => setEmployeeForm({...employeeForm, position: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="Software Engineer" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">የተቀጠረበት ቀን (Hire Date)</label>
                  <input 
                    type="date" 
                    value={employeeForm.hireDate} 
                    onChange={e => setEmployeeForm({...employeeForm, hireDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ደመወዝ (Salary)</label>
                  <input 
                    type="number" 
                    value={employeeForm.salary} 
                    onChange={e => setEmployeeForm({...employeeForm, salary: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg" 
                    placeholder="15000" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenEmployeeModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleEmployeeSubmit} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow">ሰራተኛ መዝግብ</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Password Change Modal */}
      {openPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#123758] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">🔑 ፓስወርድ ቀይር</h3>
              <button onClick={() => setOpenPasswordModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የተጠቃሚ ኢሜይል</label>
                <input type="email" value={passwordForm.email} onChange={e => setPasswordForm({...passwordForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">አዲስ የይለፍ ቃል</label>
                <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenPasswordModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handlePasswordSubmit} className="px-5 py-2 bg-[#123758] hover:bg-blue-900 text-white rounded-lg text-sm font-medium shadow">ቀይር</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Approval Modal */}
      {openApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">✅ ጥያቄ አጽድቅ</h3>
              <button onClick={() => setOpenApprovalModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የተጠቃሚ ኢሜይል</label>
                <input type="email" value={approvalForm.email} onChange={e => setApprovalForm({...approvalForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የሚቆይበት ሰዓት (Hours Valid)</label>
                <input type="number" value={approvalForm.hoursValid} onChange={e => setApprovalForm({...approvalForm, hoursValid: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenApprovalModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">ይቅር</button>
              <button onClick={handleApprovalSubmit} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow">አጽድቅ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
