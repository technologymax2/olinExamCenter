import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function StudentPrintCartPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

  // Students passed from HREmployeeDashboard
  const passedStudents = location.state?.students || [];

  const [studentList, setStudentList] = useState(passedStudents);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // ==========================================
  // FETCH STUDENTS
  // ==========================================
  const fetchStudents = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          'የመግቢያ ፍቃድዎ የለም። እባክዎ Login ያድርጉ።'
        );
      }

      setLoading(true);
      setErrorMessage('');

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

      if (response.status === 401) {
        localStorage.removeItem('token');

        throw new Error(
          'የመግቢያ ፍቃድዎ ጊዜው አልፏል። እባክዎ Login እንደገና ያድርጉ።'
        );
      }

      if (response.status === 403) {
        throw new Error(
          'ይህን የHR መረጃ ለማየት ፍቃድ የለዎትም።'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'የተማሪዎችን መረጃ ማምጣት አልተቻለም።'
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
      console.error('Student Print Cart fetch error:', error);

      // If data was already passed from dashboard,
      // keep it instead of clearing it.
      if (passedStudents.length === 0) {
        setStudentList([]);
      }

      setErrorMessage(
        error.message ||
          'የተማሪዎችን መረጃ ማምጣት አልተቻለም።'
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, passedStudents.length]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ==========================================
  // SELECT ALL
  // ==========================================
  const allSelected =
    studentList.length > 0 &&
    selectedStudentIds.length === studentList.length;

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
  const handleStudentSelect = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  // ==========================================
  // ADD SELECTED TO CART
  // ==========================================
  const handleAddSelectedToCart = () => {
    if (selectedStudentIds.length === 0) {
      setErrorMessage(
        'እባክዎ ቢያንስ አንድ ተማሪ ይምረጡ።'
      );
      return;
    }

    setErrorMessage('');

    const selectedStudents = studentList.filter((student) =>
      selectedStudentIds.includes(student._id)
    );

    setCart((previousCart) => {
      const updatedCart = [...previousCart];

      selectedStudents.forEach((student) => {
        const alreadyExists = updatedCart.some(
          (item) => item._id === student._id
        );

        if (!alreadyExists) {
          updatedCart.push({
            ...student,
            copies: 1
          });
        }
      });

      return updatedCart;
    });

    setSelectedStudentIds([]);
  };

  // ==========================================
  // ADD ONE STUDENT
  // ==========================================
  const handleAddOneToCart = (student) => {
    setErrorMessage('');

    setCart((previousCart) => {
      const alreadyExists = previousCart.some(
        (item) => item._id === student._id
      );

      if (alreadyExists) {
        return previousCart;
      }

      return [
        ...previousCart,
        {
          ...student,
          copies: 1
        }
      ];
    });
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================
  const handleRemoveFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (student) => student._id !== id
      )
    );
  };

  // ==========================================
  // UPDATE COPIES
  // ==========================================
  const handleUpdateCopies = (id, amount) => {
    setCart((previousCart) =>
      previousCart.map((student) => {
        if (student._id !== id) {
          return student;
        }

        const newCopies = Math.max(
          1,
          Number(student.copies || 1) + amount
        );

        return {
          ...student,
          copies: newCopies
        };
      })
    );
  };

  // ==========================================
  // TOTAL COPIES
  // ==========================================
  const totalCopies = useMemo(() => {
    return cart.reduce(
      (total, student) =>
        total + Number(student.copies || 1),
      0
    );
  }, [cart]);

  // ==========================================
  // PRINT
  // ==========================================
  const handlePrintCart = () => {
    if (cart.length === 0) {
      setErrorMessage(
        'Print ለማድረግ ቢያንስ አንድ ተማሪ በCart ውስጥ ያስገቡ።'
      );
      return;
    }

    setErrorMessage('');

    const printWindow = window.open(
      '',
      '_blank',
      'width=1400,height=1000'
    );

    if (!printWindow) {
      alert(
        'Print page መክፈት አልተቻለም። Browser popup ይፍቀዱ።'
      );
      return;
    }

    const cards = [];

    cart.forEach((student) => {
      const copies = Number(student.copies || 1);

      for (let i = 0; i < copies; i++) {
        cards.push(`
          <div class="student-set">

            <!-- FRONT -->
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

            <!-- BACK -->
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
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `${API_URL}/verify/${student._id}`
                  )}"
                  alt="QR Code"
                />

                <div class="qr-text">
                  SCAN TO VERIFY
                </div>

              </div>

            </div>

          </div>
        `);
      }
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">

      <head>

        <meta charset="UTF-8" />

        <title>
          Student ID Cards
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
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          body {
            padding: 20px;
          }

          .print-title {
            text-align: center;
            margin-bottom: 25px;
          }

          .print-title h1 {
            margin: 0;
            font-size: 20px;
          }

          .print-title p {
            margin-top: 5px;
            color: #555;
            font-size: 12px;
          }

          .student-set {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 25px;
            margin-bottom: 35px;
            page-break-inside: avoid;
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

          @media print {

            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            body {
              padding: 0;
            }

            .print-title {
              display: none;
            }

            .student-set {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 10mm;
            }

            .card {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

          }

        </style>

      </head>

      <body>

        <div class="print-title">
          <h1>
            STUDENT IDENTIFICATION CARDS
          </h1>

          <p>
            Total Students: ${cart.length}
            |
            Total Cards: ${totalCopies}
          </p>
        </div>

        ${cards.join('')}

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
  // CLEAR CART
  // ==========================================
  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-purple-400">
              🛒 Student Print Cart
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              የተመዘገቡ ተማሪዎችን ምረጥ እና መታወቂያ አትም
            </p>

          </div>

          <div className="flex gap-2 flex-wrap">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-semibold"
            >
              ← ወደ HR Dashboard
            </button>

            <button
              type="button"
              onClick={fetchStudents}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              🔄 Refresh
            </button>

          </div>

        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-5 p-4 bg-red-600/20 border border-red-500 rounded-xl text-red-400">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* STUDENTS */}
          <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">

              <div>
                <h2 className="text-xl font-bold text-blue-400">
                  📋 የተመዘገቡ ተማሪዎች
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Total: {studentList.length}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={handleAddSelectedToCart}
                  disabled={
                    selectedStudentIds.length === 0
                  }
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-bold disabled:opacity-40"
                >
                  🛒 Add Selected (
                  {selectedStudentIds.length}
                  )
                </button>

              </div>

            </div>

            {/* SELECT ALL */}
            <div className="mb-3 p-3 bg-gray-800 rounded-xl flex items-center gap-3">

              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer"
              />

              <span className="text-sm font-semibold">
                ሁሉንም ምረጥ
              </span>

              <span className="text-xs text-gray-500">
                {selectedStudentIds.length} selected
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>

                  <tr className="border-b border-gray-800 text-gray-400 text-sm">

                    <th className="p-3 text-left">
                      Select
                    </th>

                    <th className="p-3 text-left">
                      Student
                    </th>

                    <th className="p-3 text-left">
                      Department
                    </th>

                    <th className="p-3 text-left">
                      ID
                    </th>

                    <th className="p-3 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-800">

                  {studentList.map((student) => {

                    const inCart = cart.some(
                      (item) =>
                        item._id === student._id
                    );

                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-gray-800/50"
                      >

                        <td className="p-3">

                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(
                              student._id
                            )}
                            onChange={() =>
                              handleStudentSelect(
                                student._id
                              )
                            }
                            className="w-4 h-4 cursor-pointer"
                          />

                        </td>

                        <td className="p-3">

                          <div className="flex items-center gap-3">

                            <img
                              src={
                                student.imageUrl ||
                                'https://via.placeholder.com/50'
                              }
                              alt="Student"
                              className="w-11 h-11 rounded-full object-cover border border-blue-500"
                            />

                            <div>

                              <div className="font-semibold">
                                {student.nameAmh}{' '}
                                {student.fatherNameAmh}
                              </div>

                              <div className="text-xs text-gray-400">
                                {student.nameEng}
                              </div>

                            </div>

                          </div>

                        </td>

                        <td className="p-3">

                          <div className="text-blue-400 font-semibold">
                            {student.programLevel}
                          </div>

                          <div className="text-xs text-gray-400">
                            {student.department}
                          </div>

                          <div className="text-xs text-gray-500">
                            {student.academicYear}
                          </div>

                        </td>

                        <td className="p-3 font-mono text-xs text-blue-300">
                          {student.studentIdNumber}
                        </td>

                        <td className="p-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleAddOneToCart(
                                student
                              )
                            }
                            disabled={inCart}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              inCart
                                ? 'bg-green-700 text-green-200 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                          >
                            {inCart
                              ? '✓ In Cart'
                              : '🛒 Add'}
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                  {studentList.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
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

          {/* CART */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-fit sticky top-5">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-bold text-[#d4af37]">
                  🛒 Print Cart
                </h2>

                <p className="text-xs text-gray-500">
                  {cart.length} students • {totalCopies} cards
                </p>

              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              )}

            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">

              {cart.map((student) => (

                <div
                  key={student._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-3"
                >

                  <div className="flex gap-3">

                    <img
                      src={
                        student.imageUrl ||
                        'https://via.placeholder.com/50'
                      }
                      alt="Student"
                      className="w-12 h-12 rounded-full object-cover border border-[#d4af37]"
                    />

                    <div className="min-w-0 flex-1">

                      <div className="font-semibold text-sm truncate">
                        {student.nameAmh}{' '}
                        {student.fatherNameAmh}
                      </div>

                      <div className="text-xs text-gray-400 truncate">
                        {student.studentIdNumber}
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFromCart(
                          student._id
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>

                  </div>

                  {/* COPIES */}
                  <div className="flex items-center justify-between mt-3">

                    <span className="text-xs text-gray-400">
                      Copies
                    </span>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCopies(
                            student._id,
                            -1
                          )
                        }
                        className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                      >
                        −
                      </button>

                      <span className="w-6 text-center font-bold">
                        {student.copies}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCopies(
                            student._id,
                            1
                          )
                        }
                        className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              ))}

              {cart.length === 0 && (
                <div className="py-12 text-center">

                  <div className="text-5xl mb-3">
                    🛒
                  </div>

                  <p className="text-gray-400 text-sm">
                    Cart ባዶ ነው
                  </p>

                  <p className="text-gray-600 text-xs mt-1">
                    ከላይ ካሉት ተማሪዎች ይምረጡ
                  </p>

                </div>
              )}

            </div>

            {/* PRINT BUTTON */}
            {cart.length > 0 && (
              <div className="border-t border-gray-800 mt-5 pt-5">

                <div className="flex justify-between text-sm mb-4">

                  <span className="text-gray-400">
                    Total Students
                  </span>

                  <strong>
                    {cart.length}
                  </strong>

                </div>

                <div className="flex justify-between text-sm mb-5">

                  <span className="text-gray-400">
                    Total Cards
                  </span>

                  <strong className="text-[#d4af37]">
                    {totalCopies}
                  </strong>

                </div>

                <button
                  type="button"
                  onClick={handlePrintCart}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition"
                >
                  🖨 Print All ID Cards
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentPrintCartPage;
