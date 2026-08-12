import React, { useState, useEffect } from 'react';

function HREmployeeDashboard() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [studentStatus, setStudentStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [studentList, setStudentList] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedIdCard, setSelectedIdCard] = useState(null);

  // 🔹 Bulk Selection እና AcademicYear Update ስቴቶች
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [targetAcademicYear, setTargetAcademicYear] = useState('2ኛ ዓመት');

  const IMGBB_API_KEY = "ebd592608f4dba1e8271bec8e920c408";
  const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

  // የተማሪ መረጃዎችን የያዘው ስቴት
  const initialFormState = {
    nameAmh: '',
    nameEng: '',
    fatherNameAmh: '',
    grandfatherNameAmh: '',
    motherNameAmh: '',
    gender: 'ወንድ',
    birthDate: '',
    age: '',
    studentIdNumber: '',
    programLevel: 'Degree',
    department: '',
    academicYear: '1ኛ ዓመት',
    semester: '1ኛ ሴሚስተር',
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
  };

  const [studentForm, setStudentForm] = useState(initialFormState);

  const FRONTEND_URL = window.location.origin;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  // ☁️ ምስልን በቀጥታ ወደ ImgBB ሰርቨር የሚጭን ፋንክሽን
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setStudentForm(prev => ({ ...prev, imageUrl: data.data.url }));
        setStudentStatus('ፎቶው በተሳካ ሁኔታ ተጭኗል!');
        setErrorMessage('');
      } else {
        setStudentStatus('');
        setErrorMessage('ፎቶውን መጫን አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setStudentStatus('');
      setErrorMessage('የኔትወርክ ስህተት ተፈጥሯል!');
    } finally {
      setUploadingImage(false);
    }
  };

  // 🔹 የ Checkbox ፋንክሽኖች
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(studentList.map(s => s._id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 🔹 የተመረጡትን ተማሪዎች ዓመተ ትምህርት በጅምላ ማሻሻያ
  const handleBulkUpdateAcademicYear = () => {
    if (selectedStudentIds.length === 0) {
      setErrorMessage("እባክዎ መጀመሪያ ከዝርዝሩ ውስጥ ተማሪዎችን ይምረጡ!");
      return;
    }

    setStudentList(prev => prev.map(student => {
      if (selectedStudentIds.includes(student._id)) {
        return { ...student, academicYear: targetAcademicYear };
      }
      return student;
    }));

    setStudentStatus(`${selectedStudentIds.length} ተማሪዎች በተሳካ ሁኔታ ወደ ${targetAcademicYear} ተሻሽለዋል!`);
    setErrorMessage('');
    setSelectedStudentIds([]);
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setStudentForm({ ...student });
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStudent = (id) => {
    setStudentList(prev => prev.filter(s => s._id !== id));
    setSelectedStudentIds(prev => prev.filter(item => item !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStudentStatus('');

    // --- VALIDATIONS ---
    const phoneRegex = /^(09|07)\d{8}$/;
    if (studentForm.phoneNumber && !phoneRegex.test(studentForm.phoneNumber)) {
      setErrorMessage('ስልክ ቁጥር በትክክል 10 ዲጂት መሆን አለበት (ምሳሌ: 0911223344)');
      return;
    }

    if (studentForm.guardianPhone && !phoneRegex.test(studentForm.guardianPhone)) {
      setErrorMessage('የወላጅ ስልክ ቁጥር በትክክል 10 ዲጂት መሆን አለበት (ምሳሌ: 0911223344)');
      return;
    }

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
      setStudentForm(initialFormState);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400 mb-6">👔 የኮሌጅ ሬጅስትራር / HR - የተማሪዎች ምዝገባ እና መታወቂያ ማዕከል</h1>

        {/* Error / Success Messages Banner */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-600/25 border border-red-500 text-red-400 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
        {studentStatus && (
          <div className="mb-4 p-4 bg-green-600/25 border border-green-500 text-green-400 rounded-xl text-sm font-medium">
            ✅ {studentStatus}
          </div>
        )}

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
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">የትምህርት ደረጃ</label>
                  <select name="programLevel" value={studentForm.programLevel} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm">
                    <option value="Level">Level (ቴክኒክና ሙያ)</option>
                    <option value="Degree">Degree (ዲግሪ)</option>
                    <option value="Master">Master's (ማስተርስ)</option>
                    <option value="PhD">PhD (ዶክትሬት)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">ዲፓርትመንት / መስክ</label>
                  <input type="text" name="department" placeholder="ምሳሌ፦ Software Eng." value={studentForm.department} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">ዓመተ ትምህርት</label>
                  <select name="academicYear" value={studentForm.academicYear} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm">
                    <option value="1ኛ ዓመት">1ኛ ዓመት</option>
                    <option value="2ኛ ዓመት">2ኛ ዓመት</option>
                    <option value="3ኛ ዓመት">3ኛ ዓመት</option>
                    <option value="4ኛ ዓመት">4ኛ ዓመት</option>
                    <option value="5ኛ ዓመት">5ኛ ዓመት</option>
                    <option value="ምርምር/Thesis">ምርምር / Thesis</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">ሴሚስተር</label>
                  <select name="semester" value={studentForm.semester} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm">
                    <option value="1ኛ ሴሚስተር">1ኛ ሴሚስተር</option>
                    <option value="2ኛ ሴሚስተር">2ኛ ሴሚስተር</option>
                    <option value="የክረምት ፕሮግራም">የክረምት ፕሮግራም</option>
                  </select>
                </div>
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
                <input type="text" name="studentIdNumber" placeholder="መታወቂያ ቁጥር (ID No)" value={studentForm.studentIdNumber} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="phoneNumber" placeholder="ስልክ ቁጥር (10 ዲጂት)" maxLength="10" value={studentForm.phoneNumber} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="guardianName" placeholder="የወላጅ/አሳዳጊ ስም" value={studentForm.guardianName} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
                <input type="text" name="guardianPhone" placeholder="ወላጅ ስልክ (10 ዲጂት)" maxLength="10" value={studentForm.guardianPhone} onChange={handleChange} required className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" />
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

              {/* 📷 የተማሪ ፎቶ መጫኛ ወደ ImgBB */}
              <div>
                <label className="text-xs text-blue-400 mb-1 block font-bold">የተማሪ ፎቶ ጫን (Upload Photo)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                />
                {uploadingImage && <p className="text-xs text-yellow-400 mt-1">ፎቶው ወደ ሰርቨር እየተጫነ ነው...</p>}
                {studentForm.imageUrl && !uploadingImage && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={studentForm.imageUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-blue-400" />
                    <span className="text-xs text-green-400">ፎቶው በተሳካ ሁኔታ ተጭኗል!</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading || uploadingImage} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition">
                  {loading ? "እየተቀመጠ ነው..." : (editingStudentId ? "ለውጦችን አስቀምጥ" : "ተማሪውን መዝግብ")}
                </button>
                {editingStudentId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingStudentId(null);
                      setErrorMessage('');
                      setStudentForm(initialFormState);
                    }} 
                    className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition"
                  >
                    ሰርዝ
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Student List Section */}
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 overflow-x-auto flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-blue-400">📋 የተመዘገቡ ተማሪዎች ዝርዝር</h3>

              {/* 🔹 Bulk Update Controls */}
              {studentList.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
                  <span className="text-xs text-gray-300">የተመረጡትን ወደ፦</span>
                  <select 
                    value={targetAcademicYear} 
                    onChange={(e) => setTargetAcademicYear(e.target.value)} 
                    className="p-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-xs"
                  >
                    <option value="1ኛ ዓመት">1ኛ ዓመት</option>
                    <option value="2ኛ ዓመት">2ኛ ዓመት</option>
                    <option value="3ኛ ዓመት">3ኛ ዓመት</option>
                    <option value="4ኛ ዓመት">4ኛ ዓመት</option>
                    <option value="5ኛ ዓመት">5ኛ ዓመት</option>
                    <option value="ምርምር/Thesis">ምርምር / Thesis</option>
                  </select>
                  <button 
                    onClick={handleBulkUpdateAcademicYear}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    አዘምን ({selectedStudentIds.length})
                  </button>
                </div>
              )}
            </div>

            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-3 w-10">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={studentList.length > 0 && selectedStudentIds.length === studentList.length}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">ተማሪ / Student</th>
                  <th className="p-3">ደረጃ እና ዲፓርትመንት</th>
                  <th className="p-3">መታወቂያ ቁጥር</th>
                  <th className="p-3">ስልክ ቁጥር</th>
                  <th className="p-3">እርምጃዎች</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {studentList.map((st) => (
                  <tr key={st._id} className="hover:bg-gray-800/50">
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedStudentIds.includes(st._id)}
                        onChange={() => handleCheckboxChange(st._id)}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold flex items-center gap-3">
                      <img src={st.imageUrl || 'https://via.placeholder.com/40'} alt={st.nameAmh} className="w-10 h-10 rounded-full object-cover border border-blue-500" />
                      <div>
                        <div>{st.nameAmh} {st.fatherNameAmh}</div>
                        <div className="text-xs text-gray-400">{st.nameEng}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">
                      <div className="font-bold text-blue-400">{st.programLevel}</div>
                      <div className="text-xs text-gray-400">{st.department} ({st.academicYear})</div>
                    </td>
                    <td className="p-3 font-mono text-xs text-blue-300">{st.studentIdNumber}</td>
                    <td className="p-3 text-gray-300">{st.phoneNumber || st.guardianPhone}</td>
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
                  <tr><td colSpan="6" className="p-6 text-center text-gray-500">ምንም የተመዘገበ ተማሪ የለም።</td></tr>
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
                  <h2 className="text-[11px] font-extrabold tracking-wider text-white">COLLEGE / UNIVERSITY</h2>
                  <p className="text-[8px] text-[#d4af37] font-medium">STUDENT ID CARD</p>
                </div>
                <div className="flex flex-col items-center my-auto">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-blue-400 shadow-md">
                    <img src={selectedIdCard.imageUrl || 'https://via.placeholder.com/100'} alt={selectedIdCard.nameEng} className="w-full h-full object-cover rounded-full bg-white" />
                  </div>
                  <h3 className="text-[11px] font-bold mt-1 text-center">{selectedIdCard.nameAmh} {selectedIdCard.fatherNameAmh}</h3>
                  <h3 className="text-[10px] font-semibold text-gray-300">{selectedIdCard.nameEng}</h3>
                  <p className="text-[9px] text-[#d4af37] font-semibold mt-0.5">{selectedIdCard.programLevel} - {selectedIdCard.department}</p>
                </div>
                <div className="text-[9px] space-y-1 text-gray-200 bg-black/25 p-2 rounded-lg border border-[#d4af37]/20">
                  <div className="flex justify-between"><span>መታወቂያ:</span> <span className="font-mono">{selectedIdCard.studentIdNumber}</span></div>
                  <div className="flex justify-between"><span>ዓመት:</span> <span>{selectedIdCard.academicYear}</span></div>
                </div>
              </div>

              {/* Back Side */}
              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col justify-between p-3">
                <div className="text-center">
                  <h3 className="text-[10px] font-bold text-[#d4af37] border-b border-white/10 pb-1">አደጋ ጊዜ እና አድራሻ</h3>
                </div>
                <div className="text-[9px] space-y-1.5 text-gray-200 bg-black/30 p-2 rounded-xl">
                  <div>ሴሚስተር: <span className="font-bold">{selectedIdCard.semester}</span></div>
                  <div>ወላጅ: <span className="font-bold">{selectedIdCard.guardianName}</span></div>
                  <div>ስልክ: <span className="font-bold">{selectedIdCard.guardianPhone}</span></div>
                  <div>አድራሻ: {selectedIdCard.city}, ወረዳ {selectedIdCard.woreda}</div>
                  <div>የሚያበቃበት: {selectedIdCard.expireDate}</div>
                </div>
                <div className="flex flex-col items-center bg-black/30 p-2 rounded-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${API_URL}/verify/${selectedIdCard._id}`)}`} alt="QR Code" style={{ width: '70px', height: '70px' }} />
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
