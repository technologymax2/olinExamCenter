import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  const [excelFile, setExcelFile] = useState(null);
  const [examForm, setExamForm] = useState({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '' });
  const [passwordForm, setPasswordForm] = useState({ email: '', newPassword: '' });
  const [approvalForm, setApprovalForm] = useState({ email: '', hoursValid: 1 });

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/stats`)
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const handleUserSubmit = () => {
    if (excelFile) {
      const formData = new FormData();
      formData.append('file', excelFile);

      axios.post(`${API_URL}/api/users/upload-excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => { 
          alert('ተጠቃሚዎች ከኤክሴል ፋይል ተጭነው ተመዝግበዋል!'); 
          setOpenUserModal(false); 
          setExcelFile(null); 
        })
        .catch(err => console.error(err));
    } else {
      axios.post(`${API_URL}/api/admin/users`, userForm)
        .then(() => { 
          alert('ተጠቃሚው/አድሚኑ በተሳካ ሁኔታ ተመዝግቧል!'); 
          setOpenUserModal(false); 
          setUserForm({ name: '', email: '', role: 'student', password: '' });
        })
        .catch(err => console.error(err));
    }
  };

  const handleExamSubmit = () => {
    axios.post(`${API_URL}/api/admin/exams`, examForm)
      .then(() => { 
        alert('ፈተናው እና ቀናቱ ተይዘዋል!'); 
        setOpenExamModal(false); 
        setExamForm({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '' });
      })
      .catch(err => console.error(err));
  };

  const handlePasswordSubmit = () => {
    axios.put(`${API_URL}/api/admin/change-password`, passwordForm)
      .then(() => {
        alert('የአድሚኑ የይለፍ ቃል ተቀይሯል!');
        setOpenPasswordModal(false);
        setPasswordForm({ email: '', newPassword: '' });
      })
      .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
  };

  const handleApprovalSubmit = () => {
    axios.post(`${API_URL}/api/admin/approve-password-reset`, approvalForm)
      .then(res => {
        alert(res.data.message);
        setOpenApprovalModal(false);
        setApprovalForm({ email: '', hoursValid: 1 });
      })
      .catch(err => alert(err.response?.data?.error || 'ስህተት ተፈጥሯል'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Max Admin</span>
        </div>
        <span className="text-xs font-semibold text-amber-400">EMPOWERING YOUR REACH</span>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#123758] text-white transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div>
          <div className="p-6 hidden md:block">
            <h1 className="text-xl font-extrabold text-[#d4af37]">Max Admin</h1>
            <p className="text-xs text-gray-300 mt-1">Exam Center Control Panel</p>
          </div>
          <nav className="mt-6 md:mt-2 px-4 space-y-2">
            <a href="#dashboard" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/50 text-[#d4af37] font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>ዳሽቦርድ</span>
            </a>
          </nav>
        </div>
        <div className="p-4 text-xs text-center text-gray-400 border-t border-blue-900">
          Max Technology &copy; 2026
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Exam Center Admin</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EMPOWERING YOUR REACH</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            የአስተዳደር ዳሽቦርድ
          </h3>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#123758] flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ጠቅላላ ተማሪዎች</p>
                <h4 className="text-3xl font-bold text-[#123758] mt-1">{stats.totalStudents}</h4>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-600 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ጠቅላላ መምህራን</p>
                <h4 className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalTeachers}</h4>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500 flex items-center justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <p className="text-sm font-medium text-gray-500">የተዘጋጁ ፈተናዎች</p>
                <h4 className="text-3xl font-bold text-amber-600 mt-1">{stats.totalExams}</h4>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-lg font-bold text-[#123758]">ዋና ዋና አስተዳደራዊ ስራዎች</h4>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setOpenUserModal(true)}
                className="bg-[#123758] hover:bg-blue-900 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm sm:text-base"
              >
                ተማሪ/መምህር/አድሚን መዝግብ
              </button>
              
              <button 
                onClick={() => setOpenExamModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm sm:text-base"
              >
                ፈተና መርሐ-ግብር አውጣ
              </button>

              <button 
                onClick={() => setOpenPasswordModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm sm:text-base"
              >
                የአድሚን ፓስወርድ ቀይር
              </button>

              <button 
                onClick={() => setOpenApprovalModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition text-sm sm:text-base"
              >
                የፓስወርድ ጥያቄ አጽድቅ (Approve Reset)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* User & Admin Registration Modal */}
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
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={e => setUserForm({...userForm, name: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#123758] focus:outline-none"
                  placeholder="ሙሉ ስም"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ኢሜል</label>
                <input 
                  type="email" 
                  value={userForm.email} 
                  onChange={e => setUserForm({...userForm, email: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#123758] focus:outline-none"
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የሚስጥር ቁጥር (Password)</label>
                <input 
                  type="password" 
                  value={userForm.password} 
                  onChange={e => setUserForm({...userForm, password: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#123758] focus:outline-none"
                  placeholder="******"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የተጠቃሚው ሚና (Role)</label>
                <select 
                  value={userForm.role} 
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#123758] focus:outline-none bg-white"
                >
                  <option value="student">ተማሪ (Student)</option>
                  <option value="teacher">መምህር (Teacher)</option>
                  <option value="admin">አስተዳዳሪ (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ወይም ከኤክሴል ፋይል ጫን</label>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={e => setExcelFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#123758] hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenUserModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">ይቅር</button>
              <button onClick={handleUserSubmit} className="px-5 py-2 bg-[#123758] hover:bg-blue-900 text-white rounded-lg text-sm font-medium transition shadow">መዝግብ</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Change Modal */}
      {openPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የአድሚን ፓስወርድ መቀየሪያ</h3>
              <button onClick={() => setOpenPasswordModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የአድሚኑ ኢሜል</label>
                <input 
                  type="email" 
                  value={passwordForm.email} 
                  onChange={e => setPasswordForm({...passwordForm, email: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="admin@max.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">አዲስ የሚስጥር ቁጥር (New Password)</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword} 
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="አዲስ ፓስወርድ ያስገቡ"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenPasswordModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">ይቅር</button>
              <button onClick={handlePasswordSubmit} className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition shadow">ቀይር</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Password Reset Modal with Time Limit */}
      {openApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የፓስወርድ ጥያቄ ማጽደቂያ</h3>
              <button onClick={() => setOpenApprovalModal(false)} className="text-gray-100 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የተጠቃሚው ኢሜል</label>
                <input 
                  type="email" 
                  value={approvalForm.email} 
                  onChange={e => setApprovalForm({...approvalForm, email: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  placeholder="user@mail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የሚቆይበት የሰዓት ገደብ (Time Limit በሰዓት)</label>
                <input 
                  type="number" 
                  value={approvalForm.hoursValid} 
                  onChange={e => setApprovalForm({...approvalForm, hoursValid: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  placeholder="1"
                />
                <p className="text-xs text-gray-500 mt-1">ተጠቃሚው በዚህ ሰዓት ውስጥ አዲሱን ፓስወርድ መቀየር ይኖርበታል</p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenApprovalModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">ይቅር</button>
              <button onClick={handleApprovalSubmit} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow">አጽድቅ (Approve)</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Scheduling Modal */}
      {openExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-amber-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የፈተና መርሐ-ግብር ማቀናበሪያ</h3>
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
                  placeholder="የፈተና ርዕስ"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትምህርት ዓይነት</label>
                <input 
                  type="text" 
                  value={examForm.subject} 
                  onChange={e => setExamForm({...examForm, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="Mathematics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና ቀን እና ሰዓት</label>
                <input 
                  type="datetime-local" 
                  value={examForm.examDate} 
                  onChange={e => setExamForm({...examForm, examDate: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ውጤት የሚገለጽበት ቀን</label>
                <input 
                  type="datetime-local" 
                  value={examForm.resultReleaseDate} 
                  onChange={e => setExamForm({...examForm, resultReleaseDate: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
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
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button onClick={() => setOpenExamModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">ይቅር</button>
              <button onClick={handleExamSubmit} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition shadow">መዝግብ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
