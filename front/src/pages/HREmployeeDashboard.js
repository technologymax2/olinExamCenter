import React, { useState } from 'react';

function HREmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);
  const [studentStatus, setStudentStatus] = useState('');
  
  const [studentList, setStudentList] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedIdCard, setSelectedIdCard] = useState(null);

  // የተማሪ መረጃዎችን የያዘው ስቴት
  const [studentForm, setStudentForm] = useState({
    nameAmh: '',
    nameEng: '',
    fatherNameAmh: '',
    grandfatherNameAmh: '',
    motherNameAmh: '',
    gender: 'ወንድ',
    birthDate: '',
    age: '',
    studentIdNumber: '',
    gradeAmh: '',
    gradeEng: '',
    dateOfIssue: '',
    expireDate: '',
    addressAmh: '',
    addressEng: '',
    city: '',
    woreda: '',
    nationality: 'ኢትዮጵያዊ',
    phoneNumber: '',
    guardianName: '',
    guardianPhone: '',
    imageUrl: ''
  });

  const FRONTEND_URL = window.location.origin;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setStudentForm({
      nameAmh: student.nameAmh || '',
      nameEng: student.nameEng || '',
      fatherNameAmh: student.fatherNameAmh || '',
      grandfatherNameAmh: student.grandfatherNameAmh || '',
      motherNameAmh: student.motherNameAmh || '',
      gender: student.gender || 'ወንድ',
      birthDate: student.birthDate || '',
      age: student.age || '',
      studentIdNumber: student.studentIdNumber || '',
      gradeAmh: student.gradeAmh || '',
      gradeEng: student.gradeEng || '',
      dateOfIssue: student.dateOfIssue || '',
      expireDate: student.expireDate || '',
      addressAmh: student.addressAmh || '',
      addressEng: student.addressEng || '',
      city: student.city || '',
      woreda: student.woreda || '',
      nationality: student.nationality || 'ኢትዮጵያዊ',
      phoneNumber: student.phoneNumber || '',
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '',
      imageUrl: student.imageUrl || ''
    });
    setActiveTab('form');
  };

  const handleDeleteStudent = (id) => {
    setStudentList(prev => prev.filter(s => s._id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (editingStudentId) {
        setStudentList(prev => prev.map(s => s._id === editingStudentId ? { ...studentForm, _id: editingStudentId } : s));
        setStudentStatus('የተማሪው መረጃ በተሳካ ሁኔታ ተሻሽሏል!');
      } else {
        const newStudent = { ...studentForm, _id: Date.now().toString() };
        setStudentList(prev => [newStudent, ...prev]);
        setStudentStatus('ተማሪው በተሳካ ሁኔታ ተመዝግቧል!');
      }
      setLoading(false);
      setEditingStudentId(null);
      setStudentForm({
        nameAmh: '', nameEng: '', fatherNameAmh: '', grandfatherNameAmh: '', motherNameAmh: '', gender: 'ወንድ',
        birthDate: '', age: '', studentIdNumber: '', gradeAmh: '', gradeEng: '', dateOfIssue: '',
        expireDate: '', addressAmh: '', addressEng: '', city: '', woreda: '', nationality: 'ኢትዮጵያዊ',
        phoneNumber: '', guardianName: '', guardianPhone: '', imageUrl: ''
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400 mb-6">👔 የHR ሰራተኛ - የተማሪዎች ምዝገባ እና መታወቂያ ማዕከል</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">
              {editingStudentId ? "✏️ የተማሪ መረጃ ማስተካከያ" : "➕ አዲስ ተማሪ መዝግብ"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <input type="text" name="nameAmh" placeholder="የተማሪ ስም (አማርኛ)" value={studentForm.nameAmh} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="nameEng" placeholder="Student Full Name (English)" value={studentForm.nameEng} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input type="text" name="fatherNameAmh" placeholder="የአባት ስም" value={studentForm.fatherNameAmh} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="grandfatherNameAmh" placeholder="የአያት ስም" value={studentForm.grandfatherNameAmh} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="motherNameAmh" placeholder="የእናት ስም" value={studentForm.motherNameAmh} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select name="gender" value={studentForm.gender} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm">
                  <option value="ወንድ">ወንድ</option>
                  <option value="ሴት">ሴት</option>
                </select>
                <input type="text" name="nationality" placeholder="ዜግነት" value={studentForm.nationality} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">የትውልድ ቀን</label>
                  <input type="date" name="birthDate" value={studentForm.birthDate} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">እድሜ</label>
                  <input type="number" name="age" placeholder="እድሜ" value={studentForm.age} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="gradeAmh" placeholder="ክፍል (ဥድ. 10ኛ)" value={studentForm.gradeAmh} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="gradeEng" placeholder="Grade (e.g. Grade 10)" value={studentForm.gradeEng} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="studentIdNumber" placeholder="መታወቂያ ቁጥር (ID No)" value={studentForm.studentIdNumber} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="phoneNumber" placeholder="የተማሪ ስልክ ቁጥር" value={studentForm.phoneNumber} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="guardianName" placeholder="የወላጅ/አሳዳጊ ስም" value={studentForm.guardianName} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="guardianPhone" placeholder="ወላጅ ስልክ ቁጥር" value={studentForm.guardianPhone} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="city" placeholder="ከተማ" value={studentForm.city} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="woreda" placeholder="ወረዳ" value={studentForm.woreda} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-green-400 mb-1 block font-bold">የተሰጠበት ቀን</label>
                  <input type="date" name="dateOfIssue" value={studentForm.dateOfIssue} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-red-400 mb-1 block font-bold">የሚያበቃበት ቀን</label>
                  <input type="date" name="expireDate" value={studentForm.expireDate} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                </div>
              </div>

              <input type="text" name="imageUrl" placeholder="የፎቶ ሊንክ (Image URL)" value={studentForm.imageUrl} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition">
                  {loading ? "እየተቀመጠ ነው..." : (editingStudentId ? "ለውጦችን አስቀምጥ" : "ተማሪውን መዝግብ")}
                </button>
                {editingStudentId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingStudentId(null);
                      setStudentForm({
                        nameAmh: '', nameEng: '', fatherNameAmh: '', grandfatherNameAmh: '', motherNameAmh: '', gender: 'ወንድ',
                        birthDate: '', age: '', studentIdNumber: '', gradeAmh: '', gradeEng: '', dateOfIssue: '',
                        expireDate: '', addressAmh: '', addressEng: '', city: '', woreda: '', nationality: 'ኢትዮጵያዊ',
                        phoneNumber: '', guardianName: '', guardianPhone: '', imageUrl: ''
                      });
                    }} 
                    className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition"
                  >
                    ሰርዝ
                  </button>
                )}
              </div>
            </form>
            {studentStatus && <p className="mt-3 text-center font-medium text-green-400 text-sm">{studentStatus}</p>}
          </div>

          {/* Student List Section */}
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-blue-400">📋 የተመዘገቡ ተማሪዎች ዝርዝር</h3>
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-3">ተማሪ / Student</th>
                  <th className="p-3">ክፍል / Grade</th>
                  <th className="p-3">መታወቂያ ቁጥር</th>
                  <th className="p-3">ወላጅ/አሳዳጊ ስልክ</th>
                  <th className="p-3">እርምጃዎች</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {studentList.map((st) => (
                  <tr key={st._id} className="hover:bg-gray-800/50">
                    <td className="p-3 font-semibold flex items-center gap-3">
                      <img src={st.imageUrl || 'https://via.placeholder.com/40'} alt={st.nameAmh} className="w-10 h-10 rounded-full object-cover border border-blue-500" />
                      <div>
                        <div>{st.nameAmh} {st.fatherNameAmh}</div>
                        <div className="text-xs text-gray-400">እናት: {st.motherNameAmh}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">
                      <div>{st.gradeAmh}</div>
                    </td>
                    <td className="p-3 font-mono text-xs text-blue-300">{st.studentIdNumber}</td>
                    <td className="p-3 text-gray-300">{st.guardianPhone}</td>
                    <td className="p-3">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setSelectedIdCard(st)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition">
                          🪪 መታወቂያ
                        </button>
                        <button onClick={() => handleEditClick(st)} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-lg transition">
                          ✏️ አስተካክል
                        </button>
                        <button onClick={() => handleDeleteStudent(st._id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition">
                          🗑 አጥፋ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {studentList.length === 0 && (
                  <tr><td colSpan="5" className="p-6 text-center text-gray-500">ምንም የተመዘገበ ተማሪ የለም።</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ID Card Preview Modal */}
      {selectedIdCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="flex flex-col items-center gap-6 relative">
            <button onClick={() => setSelectedIdCard(null)} className="absolute -top-10 right-0 text-white font-bold bg-red-600 w-8 h-8 rounded-full flex items-center justify-center z-35">
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              {/* Front Side */}
              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col p-3 relative">
                <div className="text-center mb-2">
                  <h2 className="text-[11px] font-extrabold tracking-wider text-white">SCHOOL NAME</h2>
                  <p className="text-[8px] text-[#d4af37] font-medium">STUDENT ID CARD</p>
                </div>
                <div className="flex flex-col items-center my-auto">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-blue-400 shadow-md">
                    <img src={selectedIdCard.imageUrl || 'https://via.placeholder.com/100'} alt={selectedIdCard.nameEng} className="w-full h-full object-cover rounded-full bg-white" />
                  </div>
                  <h3 className="text-[11px] font-bold mt-1 text-center">{selectedIdCard.nameAmh} {selectedIdCard.fatherNameAmh}</h3>
                  <h3 className="text-[10px] font-semibold text-gray-300">{selectedIdCard.nameEng}</h3>
                  <p className="text-[9px] text-[#d4af37] font-semibold mt-0.5">{selectedIdCard.gradeAmh}</p>
                </div>
                <div className="text-[9px] space-y-1 text-gray-200 bg-black/25 p-2 rounded-lg border border-[#d4af37]/20">
                  <div className="flex justify-between"><span>መታወቂያ:</span> <span className="font-mono">{selectedIdCard.studentIdNumber}</span></div>
                  <div className="flex justify-between"><span>ስልክ:</span> <span>{selectedIdCard.phoneNumber || 'N/A'}</span></div>
                </div>
              </div>

              {/* Back Side */}
              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col justify-between p-3">
                <div className="text-center">
                  <h3 className="text-[10px] font-bold text-[#d4af37] border-b border-white/10 pb-1">የወላጅ/አሳዳጊ መረጃ</h3>
                </div>
                <div className="text-[9px] space-y-1.5 text-gray-200 bg-black/30 p-2 rounded-xl">
                  <div>እናት: <span className="font-bold">{selectedIdCard.motherNameAmh}</span></div>
                  <div>ወላጅ: <span className="font-bold">{selectedIdCard.guardianName}</span></div>
                  <div>ስልክ: <span className="font-bold">{selectedIdCard.guardianPhone}</span></div>
                  <div>አድራሻ: {selectedIdCard.city}, ወረዳ {selectedIdCard.woreda}</div>
                </div>
                <div className="flex flex-col items-center bg-black/30 p-2 rounded-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${FRONTEND_URL}/verify/${selectedIdCard._id}`)}`} alt="QR Code" style={{ width: '70px', height: '70px' }} />
                  <span className="text-[7px] text-[#d4af37] font-bold mt-1">SCAN TO VERIFY</span>
                </div>
              </div>
            </div>

            <button onClick={() => window.print()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-sm transition">
              🖨 መታወቂያውን አትም (Print ID)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HREmployeeDashboard;
