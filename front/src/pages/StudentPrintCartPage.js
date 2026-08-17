import React, { useState } from 'react';
import Footer from '../components/Footer';

// ==========================================
// API
// ==========================================

const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://olinexamcenter.onrender.com';

// ==========================================
// FRONTEND URL
// ==========================================

const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  window.location.origin;

// ==========================================
// HR PRINT CART PAGE
// ==========================================

function HRPrintCartPage({ handleLogout }) {

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('phone');

  const [searchResults, setSearchResults] = useState([]);

  // ==========================================
  // PRINT CART
  // ==========================================

  const [printCart, setPrintCart] = useState([]);

  // ==========================================
  // UI STATES
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // ==========================================
  // CARD STYLE
  // standard / chest
  // ==========================================

  const [cardStyle, setCardStyle] = useState('standard');

  // ==========================================
  // COMPANY INFORMATION
  // ==========================================

  const [companyLogoUrl] = useState(() =>
    localStorage.getItem('company_logo_url') || ''
  );

  const [companyPhone] = useState(() =>
    localStorage.getItem('company_phone') || ''
  );

  const [companyEmail] = useState(() =>
    localStorage.getItem('company_email') || ''
  );

  // ==========================================
  // SEARCH STUDENTS
  // ==========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setStatusMessage('⚠️ እባክዎ የፍለጋ ቁጥር ያስገቡ!');
      return;
    }

    setLoading(true);
    setStatusMessage('');
    setSearchResults([]);

    try {

      const res = await fetch(
        `${API_URL}/api/hr/search?query=${encodeURIComponent(
          searchTerm.trim()
        )}`
      );

      const data = await res.json();

      if (data.success) {

        const students =
          data.students ||
          data.employees ||
          data.results ||
          [];

        setSearchResults(students);

        if (students.length === 0) {
          setStatusMessage(
            '⚠️ ምንም ተማሪ አልተገኘም!'
          );
        }

      } else {

        setSearchResults([]);

        setStatusMessage(
          data.message ||
          '⚠️ ምንም ተማሪ አልተገኘም!'
        );
      }

    } catch (error) {

      console.error(
        'Student search error:',
        error
      );

      setStatusMessage(
        '❌ በፍለጋ ጊዜ ስህተት ተፈጥሯል!'
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // ADD STUDENT TO PRINT CART
  // ==========================================

  const addToCart = (student) => {

    const alreadyExists = printCart.some(
      item => item._id === student._id
    );

    if (alreadyExists) {

      setStatusMessage(
        '⚠️ ይህ ተማሪ አስቀድሞ በPrint Cart ውስጥ አለ!'
      );

      return;
    }

    setPrintCart(prev => [
      ...prev,
      {
        ...student,
        selectedStyle: cardStyle
      }
    ]);

    setStatusMessage(
      `✅ ${
        student.nameAmh ||
        student.nameEng ||
        'ተማሪ'
      } ወደ Print Cart ተጨምሯል!`
    );
  };

  // ==========================================
  // ADD ALL SEARCH RESULTS
  // ==========================================

  const addAllToCart = () => {

    if (!searchResults.length) {
      setStatusMessage(
        '⚠️ ለመጨመር የፍለጋ ውጤት የለም!'
      );
      return;
    }

    let addedCount = 0;

    const newStudents = [];

    searchResults.forEach(student => {

      const exists = printCart.some(
        item => item._id === student._id
      );

      if (!exists) {

        newStudents.push({
          ...student,
          selectedStyle: cardStyle
        });

        addedCount++;
      }
    });

    setPrintCart(prev => [
      ...prev,
      ...newStudents
    ]);

    setStatusMessage(
      `✅ ${addedCount} ተማሪ(ዎች) ወደ Print Cart ተጨምረዋል!`
    );
  };

  // ==========================================
  // REMOVE ONE
  // ==========================================

  const removeFromCart = (id) => {

    setPrintCart(prev =>
      prev.filter(
        item => item._id !== id
      )
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {

    if (!printCart.length) return;

    const confirmed =
      window.confirm(
        'ሁሉንም ከPrint Cart ማስወገድ ይፈልጋሉ?'
      );

    if (confirmed) {
      setPrintCart([]);
    }
  };

  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {

    if (!printCart.length) {

      setStatusMessage(
        '⚠️ ለማተም ምንም ID አልተመረጠም!'
      );

      return;
    }

    window.print();
  };

  // ==========================================
  // GET IMAGE
  // ==========================================

  const getStudentImage = (student) => {

    return (
      student.imageUrl ||
      student.photoUrl ||
      student.profileImage ||
      'https://via.placeholder.com/300'
    );
  };

  // ==========================================
  // GET LOGO
  // ==========================================

  const getLogo = (student) => {

    return (
      student.logoUrl ||
      companyLogoUrl ||
      ''
    );
  };

  // ==========================================
  // QR CODE
  // ==========================================

  const getQRCode = (student, size = 150) => {

    const verifyUrl =
      `${FRONTEND_URL}/verify/student/${student._id}`;

    return (
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
        verifyUrl
      )}`
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        min-h-screen
        bg-gray-900
        text-gray-100
        p-3
        sm:p-6
        lg:p-8
        print:bg-white
        print:text-black
        print:p-0
      "
    >

      {/* =====================================================
          PRINT CSS
      ===================================================== */}

      <style>
        {`

          /* ==========================================
             A4 LANDSCAPE
          ========================================== */

          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          /* ==========================================
             NORMAL SCREEN
          ========================================== */

          .student-print-card {
            box-sizing: border-box;
          }

          /* ==========================================
             PRINT
          ========================================== */

          @media print {

            html,
            body {
              width: 100%;
              height: auto;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body * {
              visibility: hidden;
            }

            #student-print-area,
            #student-print-area * {
              visibility: visible;
            }

            #student-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            /* ==========================================
               GROUP OF STUDENTS
            ========================================== */

            .student-print-grid {

              display: grid !important;

              grid-template-columns:
                repeat(3, 85.6mm);

              gap: 5mm;

              justify-content: center;

              align-items: start;

              width: 100% !important;

            }

            /* ==========================================
               EACH STUDENT
            ========================================== */

            .student-print-wrapper {

              width: 85.6mm !important;

              page-break-inside: avoid !important;

              break-inside: avoid !important;

              margin: 0 !important;

              padding: 0 !important;

              background: transparent !important;

              border: none !important;

              box-shadow: none !important;

            }

            /* ==========================================
               STANDARD ID
               WIDTH > HEIGHT
            ========================================== */

            .standard-card {

              width: 85.6mm !important;

              height: 54mm !important;

              min-width: 85.6mm !important;

              min-height: 54mm !important;

              max-width: 85.6mm !important;

              max-height: 54mm !important;

              border-radius: 3mm !important;

              overflow: hidden !important;

              box-sizing: border-box !important;

              page-break-inside: avoid !important;

              break-inside: avoid !important;

              box-shadow: none !important;

            }

            /* ==========================================
               CHEST BADGE
               WIDTH > HEIGHT
            ========================================== */

            .chest-card {

              width: 90mm !important;

              height: 55mm !important;

              min-width: 90mm !important;

              min-height: 55mm !important;

              max-width: 90mm !important;

              max-height: 55mm !important;

              border-radius: 3mm !important;

              overflow: hidden !important;

              box-sizing: border-box !important;

              page-break-inside: avoid !important;

              break-inside: avoid !important;

              box-shadow: none !important;

            }

            /* ==========================================
               FRONT/BACK
            ========================================== */

            .card-side-container {

              display: flex !important;

              flex-direction: column !important;

              gap: 3mm !important;

            }

            /* ==========================================
               HIDE SCREEN ELEMENTS
            ========================================== */

            .screen-only {
              display: none !important;
            }

            /* ==========================================
               REMOVE EXTRA SPACE
            ========================================== */

            .print-student-item {

              padding: 0 !important;

              margin: 0 !important;

              border: none !important;

              background: transparent !important;

            }

          }

        `}
      </style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          screen-only
          flex
          flex-wrap
          justify-between
          items-center
          bg-gray-800
          p-4
          sm:p-5
          rounded-2xl
          shadow-md
          gap-4
          mb-6
        "
      >

        <h2
          className="
            text-lg
            sm:text-2xl
            font-bold
            text-blue-400
          "
        >
          🖨️ የተማሪ መታወቂያ ማተሚያ
        </h2>

        {handleLogout && (

          <button
            onClick={handleLogout}
            className="
              px-4
              py-2
              bg-red-600
              hover:bg-red-700
              text-white
              font-semibold
              rounded-xl
              transition
              shadow
            "
          >
            ውጣ (Logout)
          </button>

        )}

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div
        className="
          screen-only
          w-full
          max-w-7xl
          mx-auto
          space-y-6
        "
      >

        {/* ===================================================
            CARD STYLE
        =================================================== */}

        <div
          className="
            bg-gray-800
            p-4
            sm:p-6
            rounded-2xl
            shadow-lg
            border
            border-gray-700
          "
        >

          <label
            className="
              block
              text-sm
              font-bold
              text-[#d4af37]
              mb-3
            "
          >
            🎴 የመታወቂያ አይነት ይምረጡ
          </label>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* STANDARD */}

            <button
              type="button"
              onClick={() =>
                setCardStyle('standard')
              }
              className={`
                py-4
                px-4
                rounded-xl
                font-bold
                border
                transition

                ${
                  cardStyle === 'standard'
                    ? 'bg-[#132943] border-[#d4af37] text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400'
                }
              `}
            >
              🪪 መደበኛ ID
              <span className="block text-xs mt-1 opacity-70">
                85.6mm × 54mm
              </span>
            </button>

            {/* CHEST */}

            <button
              type="button"
              onClick={() =>
                setCardStyle('chest')
              }
              className={`
                py-4
                px-4
                rounded-xl
                font-bold
                border
                transition

                ${
                  cardStyle === 'chest'
                    ? 'bg-[#132943] border-[#d4af37] text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400'
                }
              `}
            >
              🎫 የደረት ባጅ
              <span className="block text-xs mt-1 opacity-70">
                90mm × 55mm
              </span>
            </button>

          </div>

        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div
          className="
            bg-gray-800
            p-4
            sm:p-6
            rounded-2xl
            shadow-lg
            border
            border-gray-700
          "
        >

          <h3
            className="
              text-lg
              sm:text-xl
              font-bold
              mb-4
              text-[#d4af37]
            "
          >
            🔍 ተማሪ ፈልግ
          </h3>

          <form
            onSubmit={handleSearch}
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
          >

            <select
              value={searchFilter}
              onChange={(e) =>
                setSearchFilter(e.target.value)
              }
              className="
                p-3
                bg-gray-900
                border
                border-gray-700
                rounded-xl
                text-white
                font-semibold
              "
            >

              <option value="phone">
                በስልክ ቁጥር
              </option>

              <option value="fayda">
                በፋይዳ ቁጥር
              </option>

              <option value="studentId">
                በStudent ID
              </option>

            </select>

            <input
              type="text"
              placeholder={
                searchFilter === 'phone'
                  ? '09...'
                  : searchFilter === 'fayda'
                  ? '16 አሃዝ Fayda'
                  : 'Student ID'
              }
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="
                flex-1
                p-3
                bg-gray-900
                border
                border-gray-700
                rounded-xl
                text-white
              "
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="
                px-7
                py-3
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-bold
                rounded-xl
                disabled:opacity-50
              "
            >
              {loading
                ? 'እየፈለገ...'
                : 'ፈልግ'}
            </button>

          </form>

          {statusMessage && (

            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-green-400
              "
            >
              {statusMessage}
            </p>

          )}

        </div>

        {/* ===================================================
            SEARCH RESULTS
        =================================================== */}

        {searchResults.length > 0 && (

          <div
            className="
              bg-gray-800
              p-4
              sm:p-6
              rounded-2xl
              border
              border-gray-700
            "
          >

            <div
              className="
                flex
                flex-wrap
                justify-between
                items-center
                gap-3
                mb-4
              "
            >

              <h3
                className="
                  text-lg
                  font-bold
                  text-blue-300
                "
              >
                📋 የፍለጋ ውጤቶች
              </h3>

              <button
                onClick={addAllToCart}
                className="
                  px-4
                  py-2
                  bg-green-600
                  hover:bg-green-700
                  rounded-xl
                  text-white
                  font-bold
                "
              >
                ➕ ሁሉንም ጨምር
              </button>

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
              "
            >

              {searchResults.map(student => (

                <div
                  key={student._id}
                  className="
                    bg-gray-900
                    p-4
                    rounded-xl
                    border
                    border-gray-700
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <img
                      src={getStudentImage(student)}
                      alt={
                        student.nameEng ||
                        'Student'
                      }
                      className="
                        w-14
                        h-14
                        rounded-full
                        object-cover
                        border-2
                        border-blue-500
                      "
                    />

                    <div>

                      <h4
                        className="
                          font-bold
                          text-white
                        "
                      >
                        {student.nameAmh}
                      </h4>

                      <p
                        className="
                          text-xs
                          text-gray-400
                        "
                      >
                        {student.nameEng}
                      </p>

                      <p
                        className="
                          text-xs
                          text-blue-400
                          font-mono
                        "
                      >
                        {student.studentIdNumber ||
                          student.studentId ||
                          '-'}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      addToCart(student)
                    }
                    className="
                      w-full
                      mt-4
                      py-2
                      bg-green-600
                      hover:bg-green-700
                      rounded-lg
                      text-white
                      font-bold
                    "
                  >
                    ➕ ወደ Print Cart
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

      {/* =====================================================
          PRINT CART
      ===================================================== */}

      <div
        className="
          mt-6
          bg-gray-800
          p-4
          sm:p-6
          rounded-2xl
          border
          border-gray-700
          print:bg-white
          print:border-none
          print:p-0
          print:m-0
        "
      >

        {/* CART HEADER */}

        <div
          className="
            screen-only
            flex
            flex-wrap
            justify-between
            items-center
            gap-3
            mb-5
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-[#d4af37]
            "
          >
            🛒 ለማተም የተመረጡ
            ({printCart.length})
          </h3>

          <div
            className="
              flex
              gap-2
              flex-wrap
            "
          >

            <button
              onClick={clearCart}
              className="
                px-4
                py-2
                bg-red-600
                hover:bg-red-700
                text-white
                rounded-xl
                font-bold
              "
            >
              🗑️ Clear
            </button>

            <button
              onClick={handlePrint}
              disabled={!printCart.length}
              className="
                px-5
                py-2
                bg-blue-600
                hover:bg-blue-700
                disabled:opacity-40
                text-white
                rounded-xl
                font-bold
              "
            >
              🖨️ Print All
            </button>

          </div>

        </div>

        {/* EMPTY */}

        {printCart.length === 0 ? (

          <div
            className="
              screen-only
              text-center
              py-12
              text-gray-500
            "
          >
            ማተሚያ Cart ባዶ ነው።
            <br />
            ተማሪዎችን ከላይ ፈልገው
            ወደ Cart ይጨምሩ።
          </div>

        ) : (

          /* =================================================
             PRINT AREA
          ================================================= */

          <div
            id="student-print-area"
            className="
              student-print-grid
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {printCart.map(student => (

              <div
                key={student._id}
                className="
                  student-print-wrapper
                  print-student-item
                  bg-gray-900
                  p-3
                  rounded-xl
                  border
                  border-gray-700
                "
              >

                {/* REMOVE */}

                <button
                  onClick={() =>
                    removeFromCart(
                      student._id
                    )
                  }
                  className="
                    screen-only
                    float-right
                    bg-red-600
                    text-white
                    w-7
                    h-7
                    rounded-full
                    font-bold
                  "
                >
                  ×
                </button>

                <div
                  className="
                    card-side-container
                    clear-both
                  "
                >

                  {/* =================================================
                      STANDARD ID
                  ================================================= */}

                  {student.selectedStyle ===
                    'standard' && (

                    <>

                      {/* FRONT */}

                      <div
                        className="
                          standard-card
                          relative
                          bg-[#132943]
                          text-white
                          rounded-xl
                          border-2
                          border-[#d4af37]
                          overflow-hidden
                          p-3
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        {/* LOGO */}

                        <div
                          className="
                            text-center
                          "
                        >

                          <div
                            className="
                              w-9
                              h-9
                              mx-auto
                              bg-white
                              rounded-full
                              overflow-hidden
                              border-2
                              border-[#d4af37]
                            "
                          >

                            {getLogo(student) ? (

                              <img
                                src={getLogo(student)}
                                alt="Logo"
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                              />

                            ) : (

                              <div
                                className="
                                  w-full
                                  h-full
                                  flex
                                  items-center
                                  justify-center
                                  text-[#132943]
                                  font-black
                                  text-[8px]
                                "
                              >
                                MT
                              </div>

                            )}

                          </div>

                          <h2
                            className="
                              text-[11px]
                              font-black
                              tracking-wider
                              mt-1
                            "
                          >
                            OLIN EXAM CENTER
                          </h2>

                          <p
                            className="
                              text-[7px]
                              text-[#d4af37]
                              font-bold
                            "
                          >
                            STUDENT ID CARD
                          </p>

                        </div>

                        {/* PHOTO + NAME */}

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            my-1
                          "
                        >

                          <img
                            src={getStudentImage(student)}
                            alt={
                              student.nameEng
                            }
                            className="
                              w-16
                              h-16
                              rounded-lg
                              object-cover
                              border-2
                              border-[#d4af37]
                              bg-white
                            "
                          />

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <h3
                              className="
                                text-[11px]
                                font-black
                                truncate
                              "
                            >
                              {student.nameAmh}
                            </h3>

                            <p
                              className="
                                text-[9px]
                                font-bold
                                truncate
                              "
                            >
                              {student.nameEng}
                            </p>

                            <p
                              className="
                                text-[7.5px]
                                text-[#d4af37]
                                font-bold
                                mt-1
                              "
                            >
                              {student.department ||
                                '-'}
                            </p>

                          </div>

                        </div>

                        {/* INFORMATION */}

                        <div
                          className="
                            bg-black/30
                            rounded-lg
                            border
                            border-[#d4af37]/30
                            p-2
                            grid
                            grid-cols-2
                            gap-x-3
                            gap-y-1
                            text-[7px]
                          "
                        >

                          <div>
                            <span className="text-gray-400">
                              Student ID
                            </span>

                            <div className="font-black">
                              {student.studentIdNumber ||
                                student.studentId ||
                                '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Year
                            </span>

                            <div className="font-black">
                              {student.academicYear ||
                                '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Program
                            </span>

                            <div className="font-black">
                              {student.programLevel ||
                                'Degree'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Sex
                            </span>

                            <div className="font-black">
                              {student.gender ||
                                '-'}
                            </div>
                          </div>

                        </div>

                        <div
                          className="
                            text-center
                            text-[6px]
                            text-[#d4af37]
                            font-bold
                          "
                        >
                          Max Technology • Olin Exam Center
                        </div>

                      </div>

                      {/* BACK */}

                      <div
                        className="
                          standard-card
                          relative
                          bg-[#132943]
                          text-white
                          rounded-xl
                          border-2
                          border-[#d4af37]
                          overflow-hidden
                          p-3
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        <h3
                          className="
                            text-[9px]
                            font-black
                            text-[#d4af37]
                            text-center
                            border-b
                            border-white/20
                            pb-1
                          "
                        >
                          STUDENT INFORMATION
                        </h3>

                        <div
                          className="
                            bg-black/30
                            rounded-lg
                            border
                            border-[#d4af37]/30
                            p-2
                            space-y-1
                            text-[7px]
                          "
                        >

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Name:
                            </span>

                            <span className="font-bold">
                              {student.nameEng}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Department:
                            </span>

                            <span className="font-bold">
                              {student.department || '-'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Semester:
                            </span>

                            <span className="font-bold">
                              {student.semester || '-'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Phone:
                            </span>

                            <span className="font-bold">
                              {student.phoneNumber || '-'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Issue:
                            </span>

                            <span className="font-bold">
                              {student.dateOfIssue || '-'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Expire:
                            </span>

                            <span className="font-bold text-yellow-300">
                              {student.expireDate || '-'}
                            </span>
                          </div>

                        </div>

                        {/* QR */}

                        <div
                          className="
                            flex
                            flex-col
                            items-center
                            justify-center
                          "
                        >

                          <div
                            className="
                              bg-white
                              p-1.5
                              rounded-lg
                            "
                          >

                            <img
                              src={getQRCode(
                                student,
                                150
                              )}
                              alt="QR"
                              className="
                                w-[32mm]
                                h-[32mm]
                              "
                            />

                          </div>

                          <span
                            className="
                              text-[7px]
                              text-[#d4af37]
                              font-black
                              mt-1
                            "
                          >
                            SCAN TO VERIFY
                          </span>

                        </div>

                        <div
                          className="
                            text-center
                            text-[6px]
                            text-gray-300
                            border-t
                            border-[#d4af37]/30
                            pt-1
                          "
                        >
                          Authorized Student Identification
                        </div>

                      </div>

                    </>

                  )}

                  {/* =================================================
                      CHEST BADGE
                  ================================================= */}

                  {student.selectedStyle ===
                    'chest' && (

                    <>

                      {/* CHEST FRONT */}

                      <div
                        className="
                          chest-card
                          bg-[#132943]
                          text-white
                          rounded-xl
                          border-2
                          border-[#d4af37]
                          overflow-hidden
                          p-3
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-white/20
                            pb-2
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <div
                              className="
                                w-8
                                h-8
                                rounded-full
                                bg-white
                                overflow-hidden
                                border
                                border-[#d4af37]
                              "
                            >

                              {getLogo(student) ? (

                                <img
                                  src={getLogo(student)}
                                  alt="Logo"
                                  className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                                />

                              ) : (

                                <div
                                  className="
                                    w-full
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-[#132943]
                                    font-black
                                    text-[8px]
                                  "
                                >
                                  MT
                                </div>

                              )}

                            </div>

                            <div>

                              <h2
                                className="
                                  text-[9px]
                                  font-black
                                "
                              >
                                OLIN EXAM CENTER
                              </h2>

                              <p
                                className="
                                  text-[6px]
                                  text-[#d4af37]
                                  font-bold
                                "
                              >
                                STUDENT BADGE
                              </p>

                            </div>

                          </div>

                          <div
                            className="
                              text-[6px]
                              text-right
                            "
                          >
                            <div>
                              {companyPhone}
                            </div>

                            <div>
                              {companyEmail}
                            </div>
                          </div>

                        </div>

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            flex-1
                            py-2
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <img
                              src={getStudentImage(student)}
                              alt={
                                student.nameEng
                              }
                              className="
                                w-16
                                h-16
                                rounded-lg
                                object-cover
                                border-2
                                border-[#d4af37]
                              "
                            />

                            <div>

                              <h3
                                className="
                                  text-[10px]
                                  font-black
                                "
                              >
                                {student.nameAmh}
                              </h3>

                              <p
                                className="
                                  text-[8px]
                                  font-bold
                                "
                              >
                                {student.nameEng}
                              </p>

                              <p
                                className="
                                  text-[7px]
                                  text-[#d4af37]
                                  font-bold
                                  mt-1
                                "
                              >
                                {student.department ||
                                  '-'}
                              </p>

                              <p
                                className="
                                  text-[6.5px]
                                  text-gray-300
                                  mt-1
                                "
                              >
                                ID:
                                {' '}
                                {student.studentIdNumber ||
                                  student.studentId ||
                                  '-'}
                              </p>

                            </div>

                          </div>

                          {/* QR */}

                          <div
                            className="
                              bg-black/30
                              p-1.5
                              rounded-lg
                              border
                              border-[#d4af37]/30
                              flex
                              flex-col
                              items-center
                            "
                          >

                            <div
                              className="
                                bg-white
                                p-1
                                rounded
                              "
                            >

                              <img
                                src={getQRCode(
                                  student,
                                  120
                                )}
                                alt="QR"
                                className="
                                  w-[18mm]
                                  h-[18mm]
                                "
                              />

                            </div>

                            <span
                              className="
                                text-[5px]
                                text-[#d4af37]
                                font-black
                                mt-0.5
                              "
                            >
                              SCAN
                            </span>

                          </div>

                        </div>

                        <div
                          className="
                            bg-[#0c1b2d]
                            -mx-3
                            -mb-3
                            py-1
                            text-center
                            text-[6px]
                            font-bold
                            text-gray-300
                          "
                        >
                          Official Student Chest Badge
                        </div>

                      </div>

                      {/* CHEST BACK */}

                      <div
                        className="
                          chest-card
                          bg-[#132943]
                          text-white
                          rounded-xl
                          border-2
                          border-[#d4af37]
                          overflow-hidden
                          p-3
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        <h3
                          className="
                            text-[9px]
                            text-[#d4af37]
                            font-black
                            border-b
                            border-white/20
                            pb-1
                          "
                        >
                          STUDENT DETAILS
                        </h3>

                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-2
                            bg-black/30
                            p-2
                            rounded-lg
                            border
                            border-[#d4af37]/30
                            text-[7px]
                          "
                        >

                          <div>
                            <span className="text-gray-400">
                              Student ID
                            </span>

                            <div className="font-black">
                              {student.studentIdNumber ||
                                student.studentId ||
                                '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Academic Year
                            </span>

                            <div className="font-black">
                              {student.academicYear || '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Semester
                            </span>

                            <div className="font-black">
                              {student.semester || '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Department
                            </span>

                            <div className="font-black">
                              {student.department || '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Phone
                            </span>

                            <div className="font-black">
                              {student.phoneNumber || '-'}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              Expire
                            </span>

                            <div className="font-black text-yellow-300">
                              {student.expireDate || '-'}
                            </div>
                          </div>

                        </div>

                        <div
                          className="
                            text-center
                            text-[6px]
                            text-gray-300
                            border-t
                            border-[#d4af37]/30
                            pt-1
                          "
                        >
                          Max Technology • Olin Exam Center
                        </div>

                      </div>

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="screen-only mt-8">

        <Footer />

      </div>

    </div>
  );
}

export default HRPrintCartPage;
