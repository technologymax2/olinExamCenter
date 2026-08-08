import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Upload, 
  Menu, 
  X, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award 
} from 'lucide-react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // የተጠቃሚ መመዝገቢያ ፎርም ስቴት
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  const [excelFile, setExcelFile] = useState(null);
  
  // የፈተና መርሐ-ግብር ስቴት
  const [examForm, setExamForm] = useState({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const handleUserSubmit = () => {
    if (excelFile) {
      const formData = new FormData();
      formData.append('file', excelFile);

      axios.post('http://localhost:5000/api/users/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => { 
          alert('ተጠቃሚዎች ከኤክሴል ፋይል ተጭነው ተመዝግበዋል!'); 
          setOpenUserModal(false); 
          setExcelFile(null); 
        })
        .catch(err => console.error(err));
    } else {
      axios.post('http://localhost:5000/api/admin/users', userForm)
        .then(() => { 
          alert('ተጠቃሚው ተመዝግቧል!'); 
          setOpenUserModal(false); 
          setUserForm({ name: '', email: '', role: 'student', password: '' });
        })
        .catch(err => console.error(err));
    }
  };

  const handleExamSubmit = () => {
    axios.post('http://localhost:5000/api/admin/exams', examForm)
      .then(() => { 
        alert('ፈተናው እና ቀናቱ ተይዘዋል!'); 
        setOpenExamModal(false); 
        setExamForm({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-[#123758] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-lg text-[#d4af37]">Max Admin</span>
        </div>
        <span className="text-xs font-semibold text-secondary">EMPOWERING YOUR REACH</span>
      </header>

      {/* Sidebar for Desktop & Mobile Drawer */}
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
              <LayoutDashboard size={20} />
              <span>ዳሽቦርድ</span>
            </a>
            <a href="#users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <Users size={20} />
              <span>ተማሪዎች እና መምህራን</span>
            </a>
            <a href="#exams" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900/30 text-gray-300 hover:text-white transition">
              <Award size={20} />
              <span>የፈተና ባንክና ቀናቶች</span>
            </a>
          </nav>
        </div>
        <div className="p-4 text-xs text-center text-gray-400 border-t border-blue-900">
          Max Technology &copy; 2026
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar (Desktop) */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#123758]">Max Technology - Exam Center Admin</h2>
          <span className="text-sm font-semibold tracking-wide text-amber-600">EMPOWERING YOUR REACH</span>
        </header>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            የአስተዳደር ዳሽቦርድ
          </h3>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Students Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#123758] flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ጠቅላላ ተማሪዎች</p>
                <h4 className="text-3xl font-bold text-[#123758] mt-1">{stats.totalStudents}</h4>
              </div>
              <div className="p-3 bg-blue-50 text-[#123758] rounded-full">
                <Users size={24} />
              </div>
            </div>

            {/* Teachers Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-600 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ጠቅላላ መምህራን</p>
                <h4 className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalTeachers}</h4>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <BookOpen size={24} />
              </div>
            </div>

            {/* Exams Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500 flex items-center justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <p className="text-sm font-medium text-gray-500">የተዘጋጁ ፈተናዎች</p>
                <h4 className="text-3xl font-bold text-amber-600 mt-1">{stats.totalExams}</h4>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                <Calendar size={24} />
              </div>
            </div>

          </div>

          {/* Quick Actions Container */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-lg font-bold text-[#123758]">ዋና ዋና አስተዳደራዊ ስራዎች</h4>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setOpenUserModal(true)}
                className="bg-[#123758] hover:bg-blue-900 text-white font-medium px-5 py-2.5 rounded-lg shadow transition flex items-center space-x-2 text-sm sm:text-base"
              >
                <Users size={18} />
                <span>ተማሪ/መምህር መዝግብ (ፎርም/ኤክሴል)</span>
              </button>
              
              <button 
                onClick={() => setOpenExamModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition flex items-center space-x-2 text-sm sm:text-base"
              >
                <Calendar size={18} />
                <span>ፈተና መርሐ-ግብር አውጣ (Exam Scheduling)</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* User Registration Modal */}
      {openUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#123758] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">አዲስ ተማሪ ወይም መምህር መዝግብ</h3>
              <button onClick={() => setOpenUserModal(false)} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ሙሉ ስም</label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={e => setUserForm({...userForm, name: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#123758] focus:outline-none"
                  placeholder="እባክዎ ሙሉ ስም ያስገቡ"
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

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">ወይም ከኤክሴል ፋይል ሎድ ያድርጉ</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#123758] transition bg-gray-50">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Upload size={18} className="text-[#123758]" />
                    <span className="truncate max-w-[220px]">
                      {excelFile ? excelFile.name : 'የኤክሴል ፋይል ይምረጡ (.xlsx, .xls)'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx, .xls" 
                    onChange={e => setExcelFile(e.target.files[0])} 
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
              <button 
                onClick={() => setOpenUserModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                ይቅር
              </button>
              <button 
                onClick={handleUserSubmit}
                className="px-5 py-2 bg-[#123758] hover:bg-blue-900 text-white rounded-lg text-sm font-medium transition shadow"
              >
                መዝግብ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Scheduling Modal */}
      {openExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-amber-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">የፈተና መርሐ-ግብር ማቀናበሪያ</h3>
              <button onClick={() => setOpenExamModal(false)} className="text-gray-100 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና ርዕስ (Title)</label>
                <input 
                  type="text" 
                  value={examForm.title} 
                  onChange={e => setExamForm({...examForm, title: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="ለምሳሌ፡ የሂሳብ 1ኛ ሴሚስተር ፈተና"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ትምህርት ዓይነት (Subject)</label>
                <input 
                  type="text" 
                  value={examForm.subject} 
                  onChange={e => setExamForm({...examForm, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="Mathematics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">የፈተና የሚሰጥበት ቀን እና ሰዓት</label>
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
              <button 
                onClick={() => setOpenExamModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                ይቅር
              </button>
              <button 
                onClick={handleExamSubmit}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition shadow"
              >
                ቀን ቆርጥ መዝግብ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
