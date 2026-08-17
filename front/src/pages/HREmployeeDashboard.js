import React, { useState, useEffect, useCallback } from 'react';

function HREmployeeDashboard() {
  // ==========================================
  // 🔧 BASIC STATES
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [studentStatus, setStudentStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [studentList, setStudentList] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedIdCard, setSelectedIdCard] = useState(null);

  // ==========================================
  // ☑️ BULK SELECTION STATES
  // ==========================================
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [targetAcademicYear, setTargetAcademicYear] =
    useState('2ኛ ዓመት');

  // ==========================================
  // 🌐 API CONFIGURATION
  // ==========================================
  const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

  // ==========================================
  // ☁️ IMGBB CONFIGURATION
  // ==========================================
  const IMGBB_API_KEY =
    process.env.REACT_APP_IMGBB_API_KEY ||
    'ebd592608f4dba1e8271bec8e920c408';

  // ==========================================
  // 📝 INITIAL STUDENT FORM
  // ==========================================
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

  const [studentForm, setStudentForm] =
    useState(initialFormState);

  // ==========================================
  // ✏️ FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear old messages when user starts editing
    if (errorMessage) {
      setErrorMessage('');
    }

    if (studentStatus) {
      setStudentStatus('');
    }
  };

  // ==========================================
  // 📚 FETCH STUDENTS FROM MONGODB
  // GET /api/hr/students
  // ==========================================
  const fetchStudents = useCallback(async () => {
    try {
      setErrorMessage('');

      const response = await fetch(
        `${API_URL}/api/hr/students`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'የተማሪዎችን መረጃ ማምጣት አልተቻለም!'
        );
      }

      if (Array.isArray(data)) {
        setStudentList(data);
      } else if (Array.isArray(data.students)) {
        setStudentList(data.students);
      } else {
        setStudentList([]);
      }
    } catch (error) {
      console.error(
        'Fetch students error:',
        error
      );

      setStudentList([]);

      setErrorMessage(
        error.message ||
          'የተማሪዎችን መረጃ ለማምጣት ስህተት ተፈጥሯል!'
      );
    }
  }, [API_URL]);

  // ==========================================
  // 🚀 LOAD STUDENTS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ==========================================
  // ☁️ UPLOAD IMAGE TO IMGBB
  // ==========================================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        'እባክዎ የምስል ፋይል ብቻ ይምረጡ!'
      );
      return;
    }

    // Check file size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        'የፎቶው መጠን ከ 5MB መብለጥ የለበትም!'
      );
      return;
    }

    setUploadingImage(true);
    setErrorMessage('');
    setStudentStatus('');

    const formData = new FormData();

    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            'ፎቶውን መጫን አልተቻለም!'
        );
      }

      const imageUrl = data.data.url;

      setStudentForm((prev) => ({
        ...prev,
        imageUrl
      }));

      setStudentStatus(
        'ፎቶው በተሳካ ሁኔታ ተጭኗል!'
      );

      setErrorMessage('');
    } catch (error) {
      console.error(
        'Error uploading image:',
        error
      );

      setStudentStatus('');

      setErrorMessage(
        error.message ||
          'ፎቶውን ለመጫን የኔትወርክ ስህተት ተፈጥሯል!'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // ☑️ SELECT ALL
  // ==========================================
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(
        studentList.map((student) => student._id)
      );
    } else {
      setSelectedStudentIds([]);
    }
  };

  // ==========================================
  // ☑️ SELECT / UNSELECT ONE STUDENT
  // ==========================================
  const handleCheckboxChange = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ==========================================
  // 🔄 BULK ACADEMIC YEAR UPDATE
  // PUT /api/hr/students/:id
  // ==========================================
  const handleBulkUpdateAcademicYear =
    async () => {
      if (selectedStudentIds.length === 0) {
        setErrorMessage(
          'እባክዎ መጀመሪያ ከዝርዝሩ ውስጥ ተማሪዎችን ይምረጡ!'
        );
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');
        setStudentStatus('');

        await Promise.all(
          selectedStudentIds.map(async (id) => {
            const response = await fetch(
              `${API_URL}/api/hr/students/${id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  academicYear:
                    targetAcademicYear
                })
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.error ||
                  'የተማሪውን መረጃ ማዘመን አልተቻለም!'
              );
            }

            return data;
          })
        );

        setStudentStatus(
          `${selectedStudentIds.length} ተማሪዎች በተሳካ ሁኔታ ወደ ${targetAcademicYear} ተሻሽለዋል!`
        );

        setSelectedStudentIds([]);

        // Reload directly from MongoDB
        await fetchStudents();
      } catch (error) {
        console.error(
          'Bulk academic year update error:',
          error
        );

        setErrorMessage(
          error.message ||
            'የተማሪዎችን ዓመተ ትምህርት ማዘመን አልተቻለም!'
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // ✏️ EDIT STUDENT
  // ==========================================
  const handleEditClick = (student) => {
    setEditingStudentId(student._id);

    setStudentForm({
      ...initialFormState,
      ...student,
      age:
        student.age !== undefined &&
        student.age !== null
          ? String(student.age)
          : ''
    });

    setErrorMessage('');
    setStudentStatus('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ==========================================
  // ❌ CANCEL EDIT
  // ==========================================
  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setStudentForm(initialFormState);
    setErrorMessage('');
    setStudentStatus('');
  };

  // ==========================================
  // 🗑️ DELETE STUDENT FROM MONGODB
  // DELETE /api/hr/students/:id
  // ==========================================
  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      'ይህን ተማሪ በእርግጥ መሰረዝ ይፈልጋሉ?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setStudentStatus('');

      const response = await fetch(
        `${API_URL}/api/hr/students/${id}`,
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'ተማሪውን መሰረዝ አልተቻለም!'
        );
      }

      // Remove from UI immediately
      setStudentList((prev) =>
        prev.filter(
          (student) => student._id !== id
        )
      );

      // Remove from selected list
      setSelectedStudentIds((prev) =>
        prev.filter((item) => item !== id)
      );

      // If deleted student was being edited
      if (editingStudentId === id) {
        setEditingStudentId(null);
        setStudentForm(initialFormState);
      }

      // If deleted student card was open
      if (
        selectedIdCard &&
        selectedIdCard._id === id
      ) {
        setSelectedIdCard(null);
      }

      setStudentStatus(
        'ተማሪው በተሳካ ሁኔታ ተሰርዟል!'
      );
    } catch (error) {
      console.error(
        'Delete student error:',
        error
      );

      setErrorMessage(
        error.message ||
          'ተማሪውን ለመሰረዝ ስህተት ተፈጥሯል!'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 💾 CREATE / UPDATE STUDENT
  // POST  /api/hr/students
  // PUT   /api/hr/students/:id
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setStudentStatus('');

    // ==========================================
    // 📱 PHONE VALIDATION
    // ==========================================
    const phoneRegex = /^(09|07)\d{8}$/;

    if (
      studentForm.phoneNumber &&
      !phoneRegex.test(
        studentForm.phoneNumber.trim()
      )
    ) {
      setErrorMessage(
        'ስልክ ቁጥር በትክክል 10 ዲጂት መሆን አለበት (ምሳሌ: 0911223344)'
      );
      return;
    }

    if (
      studentForm.guardianPhone &&
      !phoneRegex.test(
        studentForm.guardianPhone.trim()
      )
    ) {
      setErrorMessage(
        'የወላጅ ስልክ ቁጥር በትክክል 10 ዲጂት መሆን አለበት (ምሳሌ: 0911223344)'
      );
      return;
    }

    // ==========================================
    // 🔢 PREPARE DATA
    // ==========================================
    const studentData = {
      nameAmh: studentForm.nameAmh.trim(),
      nameEng: studentForm.nameEng.trim(),
      fatherNameAmh:
        studentForm.fatherNameAmh.trim(),
      grandfatherNameAmh:
        studentForm.grandfatherNameAmh.trim(),
      motherNameAmh:
        studentForm.motherNameAmh.trim(),

      gender: studentForm.gender,

      birthDate: studentForm.birthDate,

      age:
        studentForm.age === ''
          ? ''
          : Number(studentForm.age),

      studentIdNumber:
        studentForm.studentIdNumber.trim(),

      programLevel:
        studentForm.programLevel,

      department:
        studentForm.department.trim(),

      academicYear:
        studentForm.academicYear,

      semester:
        studentForm.semester,

      gradeAmh:
        studentForm.gradeAmh || '',

      gradeEng:
        studentForm.gradeEng || '',

      dateOfIssue:
        studentForm.dateOfIssue,

      expireDate:
        studentForm.expireDate,

      addressAmh:
        studentForm.addressAmh || '',

      addressEng:
        studentForm.addressEng || '',

      city:
        studentForm.city.trim(),

      woreda:
        studentForm.woreda.trim(),

      nationality:
        studentForm.nationality.trim(),

      phoneNumber:
        studentForm.phoneNumber.trim(),

      guardianName:
        studentForm.guardianName.trim(),

      guardianPhone:
        studentForm.guardianPhone.trim(),

      imageUrl:
        studentForm.imageUrl || ''
    };

    try {
      setLoading(true);

      let response;

      // ==========================================
      // ✏️ UPDATE EXISTING STUDENT
      // ==========================================
      if (editingStudentId) {
        response = await fetch(
          `${API_URL}/api/hr/students/${editingStudentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
          }
        );
      }

      // ==========================================
      // ➕ CREATE NEW STUDENT
      // ==========================================
      else {
        response = await fetch(
          `${API_URL}/api/hr/students`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
          }
        );
      }

      // ==========================================
      // 📦 READ SERVER RESPONSE
      // ==========================================
      const data = await response.json();

      // ==========================================
      // ❌ SERVER ERROR
      // ==========================================
      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'የተማሪውን መረጃ ማስቀመጥ አልተቻለም!'
        );
      }

      // ==========================================
      // ✅ SUCCESS MESSAGE
      // ==========================================
      if (editingStudentId) {
        setStudentStatus(
          data.message ||
            'የተማሪው መረጃ በተሳካ ሁኔታ ተሻሽሏል!'
        );
      } else {
        setStudentStatus(
          data.message ||
            'ተማሪው በተሳካ ሁኔታ ተመዝግቧል!'
        );
      }

      // ==========================================
      // 🔄 RELOAD FROM MONGODB
      // ==========================================
      await fetchStudents();

      // ==========================================
      // 🧹 RESET FORM
      // ==========================================
      setEditingStudentId(null);
      setStudentForm(initialFormState);

    } catch (error) {
      console.error(
        'Student save error:',
        error
      );

      setErrorMessage(
        error.message ||
          'የተማሪውን መረጃ ማስቀመጥ አልተቻለም!'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔄 MANUAL REFRESH
  // ==========================================
  const handleRefreshStudents = async () => {
    setStudentStatus('');
    setErrorMessage('');

    try {
      setLoading(true);
      await fetchStudents();

      setStudentStatus(
        'የተማሪዎች ዝርዝር በድጋሚ ተጭኗል!'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🎨 RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400">
            👔 የኮሌጅ ሬጅስትራር / HR -
            የተማሪዎች ምዝገባ እና መታወቂያ ማዕከል
          </h1>

          <button
            type="button"
            onClick={handleRefreshStudents}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            🔄 አድስ
          </button>

        </div>

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-600/25 border border-red-500 text-red-400 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}
        {studentStatus && (
          <div className="mb-4 p-4 bg-green-600/25 border border-green-500 text-green-400 rounded-xl text-sm font-medium">
            ✅ {studentStatus}
          </div>
        )}

        {/* ==========================================
            MAIN GRID
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ==========================================
              STUDENT FORM
          ========================================== */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 lg:col-span-1">

            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">
              {editingStudentId
                ? '✏️ የተማሪ መረጃ ማስተካከያ'
                : '➕ አዲስ ተማሪ መዝግብ'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              {/* Names */}
              <div className="grid grid-cols-1 gap-3">

                <input
                  type="text"
                  name="nameAmh"
                  placeholder="የተማሪ ስም (አማርኛ)"
                  value={studentForm.nameAmh}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="nameEng"
                  placeholder="Student Full Name (English)"
                  value={studentForm.nameEng}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Family Names */}
              <div className="grid grid-cols-3 gap-2">

                <input
                  type="text"
                  name="fatherNameAmh"
                  placeholder="የአባት ስም"
                  value={studentForm.fatherNameAmh}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="grandfatherNameAmh"
                  placeholder="የአያት ስም"
                  value={studentForm.grandfatherNameAmh}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="motherNameAmh"
                  placeholder="የእናት ስም"
                  value={studentForm.motherNameAmh}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Program */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    የትምህርት ደረጃ
                  </label>

                  <select
                    name="programLevel"
                    value={studentForm.programLevel}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  >
                    <option value="Level">
                      Level (ቴክኒክና ሙያ)
                    </option>

                    <option value="Degree">
                      Degree (ዲግሪ)
                    </option>

                    <option value="Master">
                      Master's (ማስተርስ)
                    </option>

                    <option value="PhD">
                      PhD (ዶክትሬት)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    ዲፓርትመንት / መስክ
                  </label>

                  <input
                    type="text"
                    name="department"
                    placeholder="ምሳሌ፦ Software Eng."
                    value={studentForm.department}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  />
                </div>

              </div>

              {/* Academic Year + Semester */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    ዓመተ ትምህርት
                  </label>

                  <select
                    name="academicYear"
                    value={studentForm.academicYear}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  >
                    <option value="1ኛ ዓመት">
                      1ኛ ዓመት
                    </option>

                    <option value="2ኛ ዓመት">
                      2ኛ ዓመት
                    </option>

                    <option value="3ኛ ዓመት">
                      3ኛ ዓመት
                    </option>

                    <option value="4ኛ ዓመት">
                      4ኛ ዓመት
                    </option>

                    <option value="5ኛ ዓመት">
                      5ኛ ዓመት
                    </option>

                    <option value="ምርምር/Thesis">
                      ምርምር / Thesis
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    ሴሚስተር
                  </label>

                  <select
                    name="semester"
                    value={studentForm.semester}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  >
                    <option value="1ኛ ሴሚስተር">
                      1ኛ ሴሚስተር
                    </option>

                    <option value="2ኛ ሴሚስተር">
                      2ኛ ሴሚስተር
                    </option>

                    <option value="የክረምት ፕሮግራም">
                      የክረምት ፕሮግራም
                    </option>
                  </select>
                </div>

              </div>

              {/* Gender + Nationality */}
              <div className="grid grid-cols-2 gap-3">

                <select
                  name="gender"
                  value={studentForm.gender}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                >
                  <option value="ወንድ">
                    ወንድ
                  </option>

                  <option value="ሴት">
                    ሴት
                  </option>
                </select>

                <input
                  type="text"
                  name="nationality"
                  placeholder="ዜግነት"
                  value={studentForm.nationality}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Birth Date + Age */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    የትውልድ ቀን
                  </label>

                  <input
                    type="date"
                    name="birthDate"
                    value={studentForm.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    እድሜ
                  </label>

                  <input
                    type="number"
                    name="age"
                    placeholder="እድሜ"
                    value={studentForm.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  />
                </div>

              </div>

              {/* ID + Phone */}
              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  name="studentIdNumber"
                  placeholder="መታወቂያ ቁጥር (ID No)"
                  value={studentForm.studentIdNumber}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="ስልክ ቁጥር (10 ዲጂት)"
                  maxLength="10"
                  value={studentForm.phoneNumber}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Guardian */}
              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  name="guardianName"
                  placeholder="የወላጅ/አሳዳጊ ስም"
                  value={studentForm.guardianName}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="guardianPhone"
                  placeholder="ወላጅ ስልክ (10 ዲጂት)"
                  maxLength="10"
                  value={studentForm.guardianPhone}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  name="city"
                  placeholder="ከተማ"
                  value={studentForm.city}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="woreda"
                  placeholder="ወረዳ"
                  value={studentForm.woreda}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Optional Address */}
              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  name="addressAmh"
                  placeholder="አድራሻ በአማርኛ"
                  value={studentForm.addressAmh}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="addressEng"
                  placeholder="Address in English"
                  value={studentForm.addressEng}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* Issue + Expire */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs text-green-400 mb-1 block font-bold">
                    የተሰጠበት ቀን
                  </label>

                  <input
                    type="date"
                    name="dateOfIssue"
                    value={studentForm.dateOfIssue}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-red-400 mb-1 block font-bold">
                    የሚያበቃበት ቀን
                  </label>

                  <input
                    type="date"
                    name="expireDate"
                    value={studentForm.expireDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  />
                </div>

              </div>

              {/* ==========================================
                  PHOTO UPLOAD
              ========================================== */}
              <div>

                <label className="text-xs text-blue-400 mb-1 block font-bold">
                  የተማሪ ፎቶ ጫን (Upload Photo)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
                />

                {uploadingImage && (
                  <p className="text-xs text-yellow-400 mt-1">
                    ፎቶው ወደ ImgBB እየተጫነ ነው...
                  </p>
                )}

                {studentForm.imageUrl &&
                  !uploadingImage && (
                    <div className="mt-2 flex items-center gap-3">

                      <img
                        src={studentForm.imageUrl}
                        alt="Student Preview"
                        className="w-12 h-12 rounded-full object-cover border border-blue-400"
                      />

                      <span className="text-xs text-green-400">
                        ፎቶው በተሳካ ሁኔታ ተጭኗል!
                      </span>

                    </div>
                  )}

              </div>

              {/* ==========================================
                  FORM BUTTONS
              ========================================== */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={
                    loading ||
                    uploadingImage
                  }
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition"
                >
                  {loading
                    ? 'እየተቀመጠ ነው...'
                    : editingStudentId
                    ? 'ለውጦችን አስቀምጥ'
                    : 'ተማሪውን መዝግብ'}
                </button>

                {editingStudentId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition"
                  >
                    ሰርዝ
                  </button>
                )}

              </div>

            </form>
          </div>

          {/* ==========================================
              STUDENT LIST
          ========================================== */}
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 overflow-x-auto flex flex-col gap-4">

            {/* List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

              <h3 className="text-xl font-bold text-blue-400">
                📋 የተመዘገቡ ተማሪዎች ዝርዝር
              </h3>

              {/* ==========================================
                  BULK UPDATE
              ========================================== */}
              {studentList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">

                  <span className="text-xs text-gray-300">
                    የተመረጡትን ወደ፦
                  </span>

                  <select
                    value={targetAcademicYear}
                    onChange={(e) =>
                      setTargetAcademicYear(
                        e.target.value
                      )
                    }
                    className="p-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-xs"
                  >
                    <option value="1ኛ ዓመት">
                      1ኛ ዓመት
                    </option>

                    <option value="2ኛ ዓመት">
                      2ኛ ዓመት
                    </option>

                    <option value="3ኛ ዓመት">
                      3ኛ ዓመት
                    </option>

                    <option value="4ኛ ዓመት">
                      4ኛ ዓመት
                    </option>

                    <option value="5ኛ ዓመት">
                      5ኛ ዓመት
                    </option>

                    <option value="ምርምር/Thesis">
                      ምርምር / Thesis
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={
                      handleBulkUpdateAcademicYear
                    }
                    disabled={
                      loading ||
                      selectedStudentIds.length ===
                        0
                    }
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    አዘምን (
                    {selectedStudentIds.length}
                    )
                  </button>

                </div>
              )}

            </div>

            {/* ==========================================
                TABLE
            ========================================== */}
            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">

                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          studentList.length > 0 &&
                          selectedStudentIds.length ===
                            studentList.length
                        }
                        className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>

                    <th className="p-3">
                      ተማሪ / Student
                    </th>

                    <th className="p-3">
                      ደረጃ እና ዲፓርትመንት
                    </th>

                    <th className="p-3">
                      መታወቂያ ቁጥር
                    </th>

                    <th className="p-3">
                      ስልክ ቁጥር
                    </th>

                    <th className="p-3">
                      እርምጃዎች
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-sm">

                  {studentList.map((st) => (
                    <tr
                      key={st._id}
                      className="hover:bg-gray-800/50"
                    >

                      {/* Checkbox */}
                      <td className="p-3">

                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(
                            st._id
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              st._id
                            )
                          }
                          className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />

                      </td>

                      {/* Student */}
                      <td className="p-3 font-semibold">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              st.imageUrl ||
                              'https://via.placeholder.com/40'
                            }
                            alt={
                              st.nameAmh ||
                              st.nameEng ||
                              'Student'
                            }
                            className="w-10 h-10 rounded-full object-cover border border-blue-500"
                          />

                          <div>

                            <div>
                              {st.nameAmh}{' '}
                              {st.fatherNameAmh}
                            </div>

                            <div className="text-xs text-gray-400">
                              {st.nameEng}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* Program */}
                      <td className="p-3 text-gray-300">

                        <div className="font-bold text-blue-400">
                          {st.programLevel}
                        </div>

                        <div className="text-xs text-gray-400">
                          {st.department}{' '}
                          ({st.academicYear})
                        </div>

                      </td>

                      {/* ID */}
                      <td className="p-3 font-mono text-xs text-blue-300">
                        {st.studentIdNumber}
                      </td>

                      {/* Phone */}
                      <td className="p-3 text-gray-300">
                        {st.phoneNumber ||
                          st.guardianPhone ||
                          '-'}
                      </td>

                      {/* Actions */}
                      <td className="p-3">

                        <div className="flex gap-2 items-center flex-wrap">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedIdCard(st)
                            }
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            🪪 መታወቂያ
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(st)
                            }
                            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            ✏️ አስተካክል
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteStudent(
                                st._id
                              )
                            }
                            disabled={loading}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                          >
                            🗑 አጥፋ
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                  {/* Empty */}
                  {studentList.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-10 text-center text-gray-500"
                      >
                        {loading
                          ? '⏳ ተማሪዎች እየተጫኑ ነው...'
                          : 'ምንም የተመዘገበ ተማሪ የለም።'}
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          ID CARD PREVIEW MODAL
      ========================================== */}
      {selectedIdCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">

          <div className="flex flex-col items-center gap-6 relative">

            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setSelectedIdCard(null)
              }
              className="absolute -top-10 right-0 text-white font-bold bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center z-50"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">

              {/* ==========================================
                  FRONT SIDE
              ========================================== */}
              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col p-3 relative">

                <div className="text-center mb-2">

                  <h2 className="text-[11px] font-extrabold tracking-wider text-white">
                    COLLEGE / UNIVERSITY
                  </h2>

                  <p className="text-[8px] text-[#d4af37] font-medium">
                    STUDENT ID CARD
                  </p>

                </div>

                <div className="flex flex-col items-center my-auto">

                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-blue-400 shadow-md">

                    <img
                      src={
                        selectedIdCard.imageUrl ||
                        'https://via.placeholder.com/100'
                      }
                      alt={
                        selectedIdCard.nameEng
                      }
                      className="w-full h-full object-cover rounded-full bg-white"
                    />

                  </div>

                  <h3 className="text-[11px] font-bold mt-1 text-center">
                    {selectedIdCard.nameAmh}{' '}
                    {selectedIdCard.fatherNameAmh}
                  </h3>

                  <h3 className="text-[10px] font-semibold text-gray-300">
                    {selectedIdCard.nameEng}
                  </h3>

                  <p className="text-[9px] text-[#d4af37] font-semibold mt-0.5">
                    {selectedIdCard.programLevel} -{' '}
                    {selectedIdCard.department}
                  </p>

                </div>

                <div className="text-[9px] space-y-1 text-gray-200 bg-black/25 p-2 rounded-lg border border-[#d4af37]/20">

                  <div className="flex justify-between">
                    <span>
                      መታወቂያ:
                    </span>

                    <span className="font-mono">
                      {selectedIdCard.studentIdNumber}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      ዓመት:
                    </span>

                    <span>
                      {selectedIdCard.academicYear}
                    </span>
                  </div>

                </div>

              </div>

              {/* ==========================================
                  BACK SIDE
              ========================================== */}
              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col justify-between p-3">

                <div className="text-center">

                  <h3 className="text-[10px] font-bold text-[#d4af37] border-b border-white/10 pb-1">
                    አደጋ ጊዜ እና አድራሻ
                  </h3>

                </div>

                <div className="text-[9px] space-y-1.5 text-gray-200 bg-black/30 p-2 rounded-xl">

                  <div>
                    ሴሚስተር:{' '}
                    <span className="font-bold">
                      {selectedIdCard.semester}
                    </span>
                  </div>

                  <div>
                    ወላጅ:{' '}
                    <span className="font-bold">
                      {selectedIdCard.guardianName}
                    </span>
                  </div>

                  <div>
                    ስልክ:{' '}
                    <span className="font-bold">
                      {selectedIdCard.guardianPhone}
                    </span>
                  </div>

                  <div>
                    አድራሻ:{' '}
                    {selectedIdCard.addressAmh ||
                      selectedIdCard.addressEng ||
                      `${selectedIdCard.city}, ወረዳ ${selectedIdCard.woreda}`}
                  </div>

                  <div>
                    የሚያበቃበት:{' '}
                    {selectedIdCard.expireDate}
                  </div>

                </div>

                {/* QR */}
                <div className="flex flex-col items-center bg-black/30 p-2 rounded-xl">

                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                      `${API_URL}/verify/${selectedIdCard._id}`
                    )}`}
                    alt="QR Code"
                    style={{
                      width: '70px',
                      height: '70px'
                    }}
                  />

                  <span className="text-[7px] text-[#d4af37] font-bold mt-1">
                    SCAN TO VERIFY
                  </span>

                </div>

              </div>

            </div>

            {/* Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-sm transition"
            >
              🖨 መታወቂያውን አትም (Print ID)
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default HREmployeeDashboard;
