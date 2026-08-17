import React, { useState, useEffect, useCallback } from 'react';

function HREmployeeDashboard() {
  // ==========================================
  // BASIC STATES
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [studentStatus, setStudentStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [studentList, setStudentList] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedIdCard, setSelectedIdCard] = useState(null);

  // ==========================================
  // BULK SELECTION
  // ==========================================
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [targetAcademicYear, setTargetAcademicYear] =
    useState('2ኛ ዓመት');

  // ==========================================
  // API CONFIGURATION
  // ==========================================
  const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

  // ==========================================
  // IMGBB CONFIGURATION
  // ==========================================
  const IMGBB_API_KEY =
    process.env.REACT_APP_IMGBB_API_KEY ||
    'ebd592608f4dba1e8271bec8e920c408';

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  /*
    IMPORTANT:
    Your login stores the JWT as:

    localStorage.setItem('token', ...)

    Every protected HR API request must send:

    Authorization: Bearer <token>
  */

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {})
    };
  };

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================
  const checkAuthentication = () => {
    const token = getToken();

    if (!token) {
      setErrorMessage(
        'የመግቢያ ፍቃድዎ የለም። እባክዎ እንደገና Login ያድርጉ።'
      );

      return false;
    }

    return true;
  };

  // ==========================================
  // INITIAL FORM
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
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrorMessage('');
    setStudentStatus('');
  };

  // ==========================================
  // FETCH STUDENTS
  // ==========================================
  const fetchStudents = useCallback(async () => {
    try {
      setErrorMessage('');

      const token = getToken();

      if (!token) {
        throw new Error(
          'Authentication required. እባክዎ Login ያድርጉ።'
        );
      }

      const response = await fetch(
        `${API_URL}/api/hr/students`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      // ------------------------------------------
      // AUTH ERROR
      // ------------------------------------------
      if (response.status === 401) {
        localStorage.removeItem('token');

        throw new Error(
          'የመግቢያ ፍቃድዎ ጊዜው አልፏል። እባክዎ Login እንደገና ያድርጉ።'
        );
      }

      // ------------------------------------------
      // FORBIDDEN
      // ------------------------------------------
      if (response.status === 403) {
        throw new Error(
          'ይህን የHR መረጃ ለማየት ፍቃድ የለዎትም።'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
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
  // LOAD STUDENTS
  // ==========================================
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        'እባክዎ የምስል ፋይል ብቻ ይምረጡ!'
      );
      return;
    }

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

      setStudentForm((prev) => ({
        ...prev,
        imageUrl: data.data.url
      }));

      setStudentStatus(
        'ፎቶው በተሳካ ሁኔታ ተጭኗል!'
      );
    } catch (error) {
      console.error(
        'Image upload error:',
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
  // SELECT ALL
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
  // SELECT ONE
  // ==========================================
  const handleCheckboxChange = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ==========================================
  // BULK UPDATE ACADEMIC YEAR
  // ==========================================
  const handleBulkUpdateAcademicYear =
    async () => {
      if (selectedStudentIds.length === 0) {
        setErrorMessage(
          'እባክዎ መጀመሪያ ተማሪዎችን ይምረጡ!'
        );
        return;
      }

      if (!checkAuthentication()) {
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
                headers: getAuthHeaders(),
                body: JSON.stringify({
                  academicYear:
                    targetAcademicYear
                })
              }
            );

            const data = await response.json();

            if (response.status === 401) {
              localStorage.removeItem('token');

              throw new Error(
                'የመግቢያ ፍቃድዎ ጊዜው አልፏል።'
              );
            }

            if (response.status === 403) {
              throw new Error(
                'ይህን ተግባር ለመፈጸም ፍቃድ የለዎትም።'
              );
            }

            if (!response.ok) {
              throw new Error(
                data.error ||
                  data.message ||
                  'የተማሪውን መረጃ ማዘመን አልተቻለም!'
              );
            }

            return data;
          })
        );

        setStudentStatus(
          `${selectedStudentIds.length} ተማሪዎች ወደ ${targetAcademicYear} ተሻሽለዋል!`
        );

        setSelectedStudentIds([]);

        await fetchStudents();
      } catch (error) {
        console.error(
          'Bulk update error:',
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
  // EDIT STUDENT
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
  // CANCEL EDIT
  // ==========================================
  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setStudentForm(initialFormState);
    setErrorMessage('');
    setStudentStatus('');
  };

  // ==========================================
  // DELETE STUDENT
  // ==========================================
  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      'ይህን ተማሪ በእርግጥ መሰረዝ ይፈልጋሉ?'
    );

    if (!confirmed) return;

    if (!checkAuthentication()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setStudentStatus('');

      const response = await fetch(
        `${API_URL}/api/hr/students/${id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');

        throw new Error(
          'የመግቢያ ፍቃድዎ ጊዜው አልፏል። እባክዎ Login እንደገና ያድርጉ።'
        );
      }

      if (response.status === 403) {
        throw new Error(
          'ተማሪን ለመሰረዝ ፍቃድ የለዎትም።'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'ተማሪውን መሰረዝ አልተቻለም!'
        );
      }

      setStudentList((prev) =>
        prev.filter(
          (student) => student._id !== id
        )
      );

      setSelectedStudentIds((prev) =>
        prev.filter((item) => item !== id)
      );

      if (editingStudentId === id) {
        setEditingStudentId(null);
        setStudentForm(initialFormState);
      }

      if (
        selectedIdCard &&
        selectedIdCard._id === id
      ) {
        setSelectedIdCard(null);
      }

      setStudentStatus(
        data.message ||
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
  // CREATE / UPDATE STUDENT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setStudentStatus('');

    if (!checkAuthentication()) {
      return;
    }

    const phoneRegex = /^(09|07)\d{8}$/;

    if (
      studentForm.phoneNumber &&
      !phoneRegex.test(
        studentForm.phoneNumber.trim()
      )
    ) {
      setErrorMessage(
        'ስልክ ቁጥር 10 ዲጂት መሆን አለበት።'
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
        'የወላጅ ስልክ ቁጥር 10 ዲጂት መሆን አለበት።'
      );
      return;
    }

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

      // ------------------------------------------
      // UPDATE
      // ------------------------------------------
      if (editingStudentId) {
        response = await fetch(
          `${API_URL}/api/hr/students/${editingStudentId}`,
          {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(studentData)
          }
        );
      }

      // ------------------------------------------
      // CREATE
      // ------------------------------------------
      else {
        response = await fetch(
          `${API_URL}/api/hr/students`,
          {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(studentData)
          }
        );
      }

      const data = await response.json();

      // ------------------------------------------
      // AUTH ERROR
      // ------------------------------------------
      if (response.status === 401) {
        localStorage.removeItem('token');

        throw new Error(
          'የመግቢያ ፍቃድዎ ጊዜው አልፏል። እባክዎ Login እንደገና ያድርጉ።'
        );
      }

      // ------------------------------------------
      // FORBIDDEN
      // ------------------------------------------
      if (response.status === 403) {
        throw new Error(
          'ይህን ተግባር ለመፈጸም የHR ፍቃድ ያስፈልጋል።'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'የተማሪውን መረጃ ማስቀመጥ አልተቻለም!'
        );
      }

      setStudentStatus(
        data.message ||
          (editingStudentId
            ? 'የተማሪው መረጃ ተሻሽሏል!'
            : 'ተማሪው ተመዝግቧል!')
      );

      await fetchStudents();

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
  // REFRESH
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
  // PRINT ID CARD
  // ==========================================
  const handlePrintIdCard = () => {
    if (!selectedIdCard) {
      setErrorMessage(
        'እባክዎ መጀመሪያ የተማሪ መታወቂያ ይምረጡ!'
      );
      return;
    }

    const student = selectedIdCard;

    const qrData =
      `${API_URL}/verify/${student._id}`;

    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        qrData
      )}`;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1200,height=900'
    );

    if (!printWindow) {
      alert(
        'Print page መክፈት አልተቻለም። እባክዎ browser popup ይፍቀዱ።'
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>

        <meta charset="UTF-8" />

        <title>
          Student ID - ${student.studentIdNumber || ''}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, Helvetica, sans-serif;
          }

          body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .print-header {
            width: 100%;
            padding: 20px;
            text-align: center;
          }

          .print-header h1 {
            margin: 0;
            font-size: 20px;
          }

          .print-header p {
            margin: 5px 0 0;
            color: #555;
            font-size: 13px;
          }

          .cards {
            display: flex;
            gap: 30px;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .card {
            width: 260px;
            height: 410px;
            background: #0b192c;
            color: white;
            border: 2px solid #d4af37;
            border-radius: 12px;
            overflow: hidden;
            padding: 12px;
            position: relative;
            display: flex;
            flex-direction: column;
            box-shadow: none;
          }

          .card-header {
            text-align: center;
          }

          .college {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .subtitle {
            font-size: 8px;
            color: #d4af37;
            margin-top: 4px;
            font-weight: bold;
          }

          .student-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .photo-container {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            padding: 2px;
            border: 2px solid #d4af37;
            overflow: hidden;
          }

          .photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            background: white;
          }

          .amh-name {
            margin-top: 8px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
          }

          .eng-name {
            font-size: 10px;
            color: #ddd;
            margin-top: 3px;
            text-align: center;
          }

          .program {
            font-size: 9px;
            color: #d4af37;
            font-weight: bold;
            margin-top: 5px;
            text-align: center;
          }

          .info-box {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 8px;
            padding: 9px;
            font-size: 9px;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            gap: 5px;
            margin-bottom: 5px;
          }

          .info-row:last-child {
            margin-bottom: 0;
          }

          .back-title {
            color: #d4af37;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding-bottom: 5px;
          }

          .back-info {
            margin-top: 30px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 10px;
            font-size: 9px;
            line-height: 1.6;
          }

          .qr-box {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 10px;
          }

          .qr-box img {
            width: 80px;
            height: 80px;
          }

          .qr-text {
            color: #d4af37;
            font-size: 7px;
            font-weight: bold;
            margin-top: 4px;
          }

          .print-note {
            margin-top: 20px;
            font-size: 12px;
            color: #555;
          }

          @media print {

            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            body {
              background: white;
            }

            .print-header {
              padding: 5px;
            }

            .print-header h1 {
              font-size: 16px;
            }

            .print-note {
              display: none;
            }

            .cards {
              gap: 15mm;
              padding: 5mm;
            }

            .card {
              box-shadow: none;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

          }

        </style>

      </head>

      <body>

        <div class="print-header">

          <h1>
            STUDENT IDENTIFICATION CARD
          </h1>

          <p>
            ${student.nameEng || ''}
            -
            ${student.studentIdNumber || ''}
          </p>

        </div>

        <div class="cards">

          <div class="card">

            <div class="card-header">

              <div class="college">
                COLLEGE / UNIVERSITY
              </div>

              <div class="subtitle">
                STUDENT ID CARD
              </div>

            </div>

            <div class="student-main">

              <div class="photo-container">

                <img
                  src="${
                    student.imageUrl ||
                    'https://via.placeholder.com/100'
                  }"
                  alt="Student"
                />

              </div>

              <div class="amh-name">
                ${student.nameAmh || ''}
                ${student.fatherNameAmh || ''}
              </div>

              <div class="eng-name">
                ${student.nameEng || ''}
              </div>

              <div class="program">
                ${student.programLevel || ''}
                -
                ${student.department || ''}
              </div>

            </div>

            <div class="info-box">

              <div class="info-row">
                <span>መታወቂያ:</span>
                <strong>
                  ${student.studentIdNumber || '-'}
                </strong>
              </div>

              <div class="info-row">
                <span>ዓመት:</span>
                <strong>
                  ${student.academicYear || '-'}
                </strong>
              </div>

              <div class="info-row">
                <span>ሴሚስተር:</span>
                <strong>
                  ${student.semester || '-'}
                </strong>
              </div>

            </div>

          </div>

          <div class="card">

            <div class="back-title">
              አደጋ ጊዜ እና አድራሻ
            </div>

            <div class="back-info">

              <div>
                ሴሚስተር:
                <strong>
                  ${student.semester || '-'}
                </strong>
              </div>

              <div>
                ወላጅ:
                <strong>
                  ${student.guardianName || '-'}
                </strong>
              </div>

              <div>
                ስልክ:
                <strong>
                  ${student.guardianPhone || '-'}
                </strong>
              </div>

              <div>
                አድራሻ:
                ${
                  student.addressAmh ||
                  student.addressEng ||
                  `${student.city || ''}, ወረዳ ${
                    student.woreda || ''
                  }`
                }
              </div>

              <div>
                የሚያበቃበት:
                <strong>
                  ${student.expireDate || '-'}
                </strong>
              </div>

            </div>

            <div class="qr-box">

              <img
                src="${qrUrl}"
                alt="QR Code"
              />

              <div class="qr-text">
                SCAN TO VERIFY
              </div>

            </div>

          </div>

        </div>

        <div class="print-note">
          Use your browser print dialog to print the student ID card.
        </div>

        <script>

          window.onload = function () {

            setTimeout(function () {

              window.print();

            }, 1000);

          };

          window.onafterprint = function () {

            setTimeout(function () {

              window.close();

            }, 500);

          };

        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400">
              👔 የኮሌጅ ሬጅስትራር / HR
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              የተማሪዎች ምዝገባ እና መታወቂያ ማዕከል
            </p>
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleRefreshStudents}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              🔄 አድስ
            </button>

            {selectedIdCard && (
              <button
                type="button"
                onClick={handlePrintIdCard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition"
              >
                🖨 Print ID
              </button>
            )}

          </div>

        </div>

        {/* MESSAGES */}
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

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* STUDENT FORM */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">
              {editingStudentId
                ? '✏️ የተማሪ መረጃ ማስተካከያ'
                : '➕ አዲስ ተማሪ መዝግብ'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              <input
                type="text"
                name="nameAmh"
                placeholder="የተማሪ ስም (አማርኛ)"
                value={studentForm.nameAmh}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
              />

              <input
                type="text"
                name="nameEng"
                placeholder="Student Full Name (English)"
                value={studentForm.nameEng}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
              />

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

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="programLevel"
                  value={studentForm.programLevel}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
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

                <input
                  type="text"
                  name="department"
                  placeholder="ዲፓርትመንት / መስክ"
                  value={studentForm.department}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="academicYear"
                  value={studentForm.academicYear}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                >
                  <option value="1ኛ ዓመት">1ኛ ዓመት</option>
                  <option value="2ኛ ዓመት">2ኛ ዓመት</option>
                  <option value="3ኛ ዓመት">3ኛ ዓመት</option>
                  <option value="4ኛ ዓመት">4ኛ ዓመት</option>
                  <option value="5ኛ ዓመት">5ኛ ዓመት</option>
                  <option value="ምርምር/Thesis">
                    ምርምር / Thesis
                  </option>
                </select>

                <select
                  name="semester"
                  value={studentForm.semester}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
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

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="gender"
                  value={studentForm.gender}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                >
                  <option value="ወንድ">ወንድ</option>
                  <option value="ሴት">ሴት</option>
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

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="date"
                  name="birthDate"
                  value={studentForm.birthDate}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="number"
                  name="age"
                  placeholder="እድሜ"
                  value={studentForm.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  name="studentIdNumber"
                  placeholder="መታወቂያ ቁጥር"
                  value={studentForm.studentIdNumber}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="ስልክ ቁጥር"
                  maxLength="10"
                  value={studentForm.phoneNumber}
                  onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

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
                  placeholder="ወላጅ ስልክ"
                  maxLength="10"
                  value={studentForm.guardianPhone}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

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

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="date"
                  name="dateOfIssue"
                  value={studentForm.dateOfIssue}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

                <input
                  type="date"
                  name="expireDate"
                  value={studentForm.expireDate}
                  onChange={handleChange}
                  required
                  className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="text-xs text-blue-400 mb-1 block font-bold">
                  የተማሪ ፎቶ ጫን
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs"
                />

                {uploadingImage && (
                  <p className="text-xs text-yellow-400 mt-1">
                    ፎቶው እየተጫነ ነው...
                  </p>
                )}

                {studentForm.imageUrl &&
                  !uploadingImage && (
                    <div className="mt-2 flex items-center gap-3">

                      <img
                        src={studentForm.imageUrl}
                        alt="Student"
                        className="w-12 h-12 rounded-full object-cover border border-blue-400"
                      />

                      <span className="text-xs text-green-400">
                        ፎቶው ተጭኗል!
                      </span>

                    </div>
                  )}

              </div>

              {/* FORM BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={
                    loading ||
                    uploadingImage
                  }
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
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
                    className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl"
                  >
                    ሰርዝ
                  </button>
                )}

              </div>

            </form>
          </div>

          {/* STUDENT LIST */}

          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 overflow-x-auto">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">

              <h3 className="text-xl font-bold text-blue-400">
                📋 የተመዘገቡ ተማሪዎች
              </h3>

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
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                  >
                    አዘምን (
                    {selectedStudentIds.length}
                    )
                  </button>

                </div>
              )}

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">

                    <th className="p-3">

                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          studentList.length > 0 &&
                          selectedStudentIds.length ===
                            studentList.length
                        }
                        className="w-4 h-4 cursor-pointer"
                      />

                    </th>

                    <th className="p-3">
                      ተማሪ / Student
                    </th>

                    <th className="p-3">
                      ደረጃ / ዲፓርትመንት
                    </th>

                    <th className="p-3">
                      ID
                    </th>

                    <th className="p-3">
                      ስልክ
                    </th>

                    <th className="p-3">
                      እርምጃ
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-sm">

                  {studentList.map((st) => (
                    <tr
                      key={st._id}
                      className="hover:bg-gray-800/50"
                    >

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
                          className="w-4 h-4 cursor-pointer"
                        />

                      </td>

                      <td className="p-3">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              st.imageUrl ||
                              'https://via.placeholder.com/40'
                            }
                            alt="Student"
                            className="w-10 h-10 rounded-full object-cover border border-blue-500"
                          />

                          <div>

                            <div className="font-semibold">
                              {st.nameAmh}{' '}
                              {st.fatherNameAmh}
                            </div>

                            <div className="text-xs text-gray-400">
                              {st.nameEng}
                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="p-3">

                        <div className="font-bold text-blue-400">
                          {st.programLevel}
                        </div>

                        <div className="text-xs text-gray-400">
                          {st.department}
                        </div>

                        <div className="text-xs text-gray-500">
                          {st.academicYear}
                        </div>

                      </td>

                      <td className="p-3 font-mono text-xs text-blue-300">
                        {st.studentIdNumber}
                      </td>

                      <td className="p-3 text-gray-300">
                        {st.phoneNumber ||
                          st.guardianPhone ||
                          '-'}
                      </td>

                      <td className="p-3">

                        <div className="flex gap-2 flex-wrap">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedIdCard(st)
                            }
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg"
                          >
                            🪪 መታወቂያ
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(st)
                            }
                            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-lg"
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
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                          >
                            🗑 አጥፋ
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

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

      {/* ID CARD PREVIEW */}

      {selectedIdCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">

          <div className="flex flex-col items-center gap-6 relative">

            <button
              type="button"
              onClick={() =>
                setSelectedIdCard(null)
              }
              className="absolute -top-10 right-0 text-white font-bold bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">

              {/* FRONT */}

              <div className="w-[260px] h-[410px] bg-[#0b192c] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col p-3">

                <div className="text-center mb-2">

                  <h2 className="text-[11px] font-extrabold tracking-wider">
                    COLLEGE / UNIVERSITY
                  </h2>

                  <p className="text-[8px] text-[#d4af37] font-medium">
                    STUDENT ID CARD
                  </p>

                </div>

                <div className="flex flex-col items-center my-auto">

                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-blue-400">

                    <img
                      src={
                        selectedIdCard.imageUrl ||
                        'https://via.placeholder.com/100'
                      }
                      alt="Student"
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

                  <p className="text-[9px] text-[#d4af37] font-semibold mt-0.5 text-center">
                    {selectedIdCard.programLevel}
                    {' - '}
                    {selectedIdCard.department}
                  </p>

                </div>

                <div className="text-[9px] text-gray-200 bg-black/25 p-2 rounded-lg border border-[#d4af37]/20">

                  <div className="flex justify-between">
                    <span>መታወቂያ:</span>

                    <span className="font-mono">
                      {selectedIdCard.studentIdNumber}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>ዓመት:</span>

                    <span>
                      {selectedIdCard.academicYear}
                    </span>
                  </div>

                </div>

              </div>

              {/* BACK */}

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
                      `${selectedIdCard.city || ''}, ወረዳ ${selectedIdCard.woreda || ''}`}
                  </div>

                  <div>
                    የሚያበቃበት:{' '}
                    {selectedIdCard.expireDate}
                  </div>

                </div>

                <div className="flex flex-col items-center bg-black/30 p-2 rounded-xl">

                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                      `${API_URL}/verify/${selectedIdCard._id}`
                    )}`}
                    alt="QR Code"
                    className="w-[70px] h-[70px]"
                  />

                  <span className="text-[7px] text-[#d4af37] font-bold mt-1">
                    SCAN TO VERIFY
                  </span>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={handlePrintIdCard}
              className="w-full max-w-[560px] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-sm transition"
            >
              🖨 መታወቂያውን አትም
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedIdCard(null)
              }
              className="w-full max-w-[560px] py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl"
            >
              ዝጋ
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default HREmployeeDashboard;
