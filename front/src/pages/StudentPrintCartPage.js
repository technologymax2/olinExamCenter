import React, { useState } from "react";

const API_BASE_URL = "https://max-tech-backend.onrender.com";
const FRONTEND_URL = "https://max-technology-website.vercel.app";

// ======================================================
// STUDENT PRINT CART PAGE
// ======================================================

function StudentPrintCartPage({ handleLogout }) {
  // ======================================================
  // SEARCH STATE
  // ======================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("studentId");

  const [searchResults, setSearchResults] = useState([]);
  const [printCart, setPrintCart] = useState([]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // ======================================================
  // CARD STYLE
  // ======================================================

  const [cardStyle, setCardStyle] = useState("standard");

  // ======================================================
  // COMPANY / COLLEGE INFORMATION
  // ======================================================

  const [companyLogoUrl] = useState(() => {
    return localStorage.getItem("company_logo_url") || "";
  });

  const [companyPhone] = useState(() => {
    return localStorage.getItem("company_phone") || "";
  });

  const [companyEmail] = useState(() => {
    return localStorage.getItem("company_email") || "";
  });

  const [organizationName] = useState(() => {
    return (
      localStorage.getItem("organization_name") ||
      "MAX TECHNOLOGY"
    );
  });

  // ======================================================
  // SEARCH STUDENTS
  // ======================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setStatusMessage("⚠️ እባክዎ የፍለጋ መረጃ ያስገቡ!");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setSearchResults([]);

    try {
      const query = encodeURIComponent(searchTerm.trim());

      /*
       * IMPORTANT:
       * Your backend should have:
       *
       * GET /api/students/search?query=...
       *
       * Example:
       * /api/students/search?query=ST001
       */

      const res = await fetch(
        `${API_BASE_URL}/api/students/search?query=${query}`
      );

      const data = await res.json();

      if (data.success) {
        const students =
          data.students ||
          data.results ||
          data.data ||
          [];

        setSearchResults(students);

        if (students.length === 0) {
          setStatusMessage(
            "⚠️ ምንም ተማሪ አልተገኘም!"
          );
        }
      } else {
        setSearchResults([]);

        setStatusMessage(
          data.message ||
            "⚠️ ምንም ተማሪ አልተገኘም!"
        );
      }
    } catch (err) {
      console.error("Student search error:", err);

      setSearchResults([]);

      setStatusMessage(
        "❌ የተማሪ ፍለጋ ላይ ስህተት ተፈጥሯል!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD STUDENT TO PRINT CART
  // ======================================================

  const addToCart = (student) => {
    if (!student || !student._id) {
      setStatusMessage(
        "❌ የተማሪው ID አልተገኘም!"
      );
      return;
    }

    const alreadyExists = printCart.some(
      (item) => item._id === student._id
    );

    if (alreadyExists) {
      setStatusMessage(
        "⚠️ ይህ ተማሪ አስቀድሞ ወደ Print Cart ገብቷል!"
      );
      return;
    }

    const newStudent = {
      ...student,
      selectedStyle: cardStyle,
    };

    setPrintCart((prev) => [
      ...prev,
      newStudent,
    ]);

    setStatusMessage(
      `✅ ${
        student.nameAmh ||
        student.nameEng ||
        "ተማሪ"
      } ወደ Print Cart ተጨምሯል!`
    );
  };

  // ======================================================
  // REMOVE STUDENT FROM CART
  // ======================================================

  const removeFromCart = (id) => {
    setPrintCart((prev) =>
      prev.filter(
        (student) => student._id !== id
      )
    );

    setStatusMessage(
      "✅ ተማሪው ከPrint Cart ተወግዷል!"
    );
  };

  // ======================================================
  // CLEAR CART
  // ======================================================

  const clearCart = () => {
    setPrintCart([]);

    setStatusMessage(
      "✅ Print Cart ተጠርጓል!"
    );
  };

  // ======================================================
  // PRINT ALL
  // ======================================================

  const handlePrint = () => {
    if (printCart.length === 0) {
      setStatusMessage(
        "⚠️ ለማተም ተማሪ የለም!"
      );
      return;
    }

    window.print();
  };

  // ======================================================
  // IMAGE URL HELPER
  // ======================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://via.placeholder.com/300x300?text=Student";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    const cleanPath = imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`;

    return `${API_BASE_URL}${cleanPath}`;
  };

  // ======================================================
  // QR CODE URL
  // ======================================================

  const getQrCodeUrl = (student) => {
    const verifyUrl = `${FRONTEND_URL}/student/verify/${student._id}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      verifyUrl
    )}`;
  };

  // ======================================================
  // STUDENT DISPLAY NAME
  // ======================================================

  const getStudentNameAmh = (student) => {
    return (
      student.nameAmh ||
      "የተማሪ ስም"
    );
  };

  const getStudentNameEng = (student) => {
    return (
      student.nameEng ||
      "Student Name"
    );
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-between p-3 sm:p-6 lg:p-8 relative print:bg-white print:p-0 overflow-x-hidden">

      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style
        dangerouslySetInnerHTML={{
          __html: `

          @page {
            size: auto;
            margin: 5mm;
          }

          @media print {

            html,
            body {
              background: white !important;
              width: 100% !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body * {
              visibility: hidden;
            }

            #student-printable-container,
            #student-printable-container * {
              visibility: visible;
            }

            #student-printable-container {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 8mm !important;
            }

            .student-print-wrapper {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: always !important;
              break-after: page !important;

              width: 100% !important;

              display: flex !important;
              flex-direction: row !important;
              justify-content: center !important;
              align-items: center !important;

              gap: 8mm !important;

              margin: 0 !important;
              padding: 0 !important;
            }

            .student-print-wrapper:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }

            .student-card-box {
              width: 85.6mm !important;
              height: 54mm !important;

              min-width: 85.6mm !important;
              max-width: 85.6mm !important;

              min-height: 54mm !important;
              max-height: 54mm !important;

              background-color: #132943 !important;

              color: white !important;

              border: 2px solid #d4af37 !important;

              border-radius: 4mm !important;

              overflow: hidden !important;

              box-shadow: none !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;

              flex-shrink: 0 !important;
            }

            .print-hide {
              display: none !important;
            }
          }

          @media print and (max-width: 900px) {

            .student-print-wrapper {
              flex-direction: column !important;
              gap: 5mm !important;
            }
          }

        `,
        }}
      />

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-wrap justify-between items-center bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-md gap-4 mb-6 print:hidden">

        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-blue-400">
          🎓
          የተማሪ መታወቂያ ማተሚያ
          (Student ID Print Cart)
        </h2>

        {handleLogout && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow text-sm"
          >
            ውጣ (Logout)
          </button>
        )}
      </div>

      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="flex-1 w-full max-w-7xl mx-auto space-y-6 print:max-w-none print:m-0">

        {/* ==================================================
            CARD DESIGN
        ================================================== */}

        <div className="bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-700 print:hidden">

          <label className="block text-sm font-bold text-[#d4af37] mb-3">
            🎴 የStudent ID Card ዲዛይን ይምረጡ
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() =>
                setCardStyle("standard")
              }
              className={`py-3 px-4 rounded-xl font-bold text-sm transition border ${
                cardStyle === "standard"
                  ? "bg-[#132943] border-[#d4af37] text-white shadow-lg"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700"
              }`}
            >
              🎓 Standard Student ID
            </button>

            <button
              type="button"
              onClick={() =>
                setCardStyle("compact")
              }
              className={`py-3 px-4 rounded-xl font-bold text-sm transition border ${
                cardStyle === "compact"
                  ? "bg-[#132943] border-[#d4af37] text-white shadow-lg"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700"
              }`}
            >
              🪪 Compact Student ID
            </button>

          </div>
        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 print:hidden">

          <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#d4af37]">
            🔍 ተማሪ ፈልግ
          </h3>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >

            {/* SEARCH TYPE */}

            <select
              value={searchFilter}
              onChange={(e) =>
                setSearchFilter(e.target.value)
              }
              className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm font-semibold"
            >
              <option value="studentId">
                በStudent ID
              </option>

              <option value="phone">
                በስልክ ቁጥር
              </option>

              <option value="name">
                በስም
              </option>

              <option value="department">
                በDepartment
              </option>
            </select>

            {/* SEARCH INPUT */}

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder={
                searchFilter === "studentId"
                  ? "Student ID ያስገቡ"
                  : searchFilter === "phone"
                  ? "ስልክ ቁጥር ያስገቡ"
                  : searchFilter === "department"
                  ? "Department ያስገቡ"
                  : "የተማሪ ስም ያስገቡ"
              }
              className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
              required
            />

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50 text-sm"
            >
              {loading
                ? "እየፈለገ..."
                : "🔍 ፈልግ"}
            </button>

          </form>

          {statusMessage && (
            <p className="mt-3 text-sm font-medium text-green-400">
              {statusMessage}
            </p>
          )}

        </div>

        {/* ==================================================
            SEARCH RESULTS
        ================================================== */}

        {searchResults.length > 0 && (

          <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 print:hidden">

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-lg font-bold text-blue-300">
                📋 የፍለጋ ውጤቶች
                ({searchResults.length})
              </h3>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {searchResults.map((student) => (

                <div
                  key={student._id}
                  className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col justify-between gap-3"
                >

                  {/* STUDENT INFO */}

                  <div className="flex items-center gap-3">

                    <img
                      src={getImageUrl(
                        student.imageUrl
                      )}
                      alt={getStudentNameEng(
                        student
                      )}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                    />

                    <div className="min-w-0">

                      <h4 className="font-bold text-white text-sm truncate">
                        {getStudentNameAmh(
                          student
                        )}
                      </h4>

                      <p className="text-xs text-gray-400 truncate">
                        {getStudentNameEng(
                          student
                        )}
                      </p>

                      <p className="text-xs text-blue-400 font-mono mt-1">
                        {student.studentIdNumber ||
                          "N/A"}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {student.department ||
                          "Department N/A"}
                      </p>

                    </div>

                  </div>

                  {/* ADD */}

                  <button
                    onClick={() =>
                      addToCart(student)
                    }
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    ➕ ወደ Print Cart ጨምር
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ==================================================
            PRINT CART
        ================================================== */}

        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 print:bg-white print:border-none print:p-0 print:shadow-none">

          {/* CART HEADER */}

          <div className="flex flex-wrap justify-between items-center gap-3 mb-4 print:hidden">

            <h3 className="text-lg sm:text-xl font-bold text-[#d4af37]">
              🛒 ለማተም የተመረጡ Students
              ({printCart.length})
            </h3>

            {printCart.length > 0 && (

              <div className="flex gap-2">

                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition text-xs sm:text-sm"
                >
                  🗑️ Clear All
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition text-xs sm:text-sm flex items-center gap-2"
                >
                  🖨️ ሁሉንም አትም
                  ({printCart.length})
                </button>

              </div>

            )}

          </div>

          {/* EMPTY CART */}

          {printCart.length === 0 ? (

            <div className="text-center py-10 text-gray-500 print:hidden text-sm">

              <div className="text-4xl mb-3">
                🛒
              </div>

              <p>
                Print Cart ባዶ ነው።
              </p>

              <p className="mt-1">
                ከላይ ተማሪዎችን ፈልገው
                ወደ Print Cart ይጨምሩ።
              </p>

            </div>

          ) : (

            /* ==================================================
               PRINTABLE STUDENTS
            ================================================== */

            <div
              id="student-printable-container"
              className="space-y-8"
            >

              {printCart.map((student) => (

                <div
                  key={student._id}
                  className="relative bg-gray-900 p-3 sm:p-4 rounded-2xl border border-gray-700 student-print-wrapper print:bg-white print:border-none print:p-0"
                >

                  {/* REMOVE BUTTON */}

                  <button
                    onClick={() =>
                      removeFromCart(
                        student._id
                      )
                    }
                    className="absolute top-2 right-2 text-white hover:text-gray-200 font-bold text-xs bg-red-600 w-7 h-7 rounded-full flex items-center justify-center z-20 print:hidden shadow-lg"
                    title="ከPrint Cart አስወግድ"
                  >
                    ✕
                  </button>

                  {/* ==================================================
                      STANDARD CARD
                  ================================================== */}

                  {student.selectedStyle ===
                    "standard" && (

                    <div className="flex flex-col gap-4">

                      <div className="text-xs font-bold text-[#d4af37] print:hidden">
                        🎓 Student ID — Front & Back
                      </div>

                      <div className="flex flex-row flex-wrap justify-center items-center gap-4">

                        {/* ==================================================
                            FRONT
                        ================================================== */}

                        <div className="student-card-box relative w-[340px] h-[215px] bg-[#132943] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col justify-between p-3 shrink-0">

                          {/* DECORATION */}

                          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#d4af37]/20 to-transparent pointer-events-none rounded-tl-[80px]" />

                          {/* HEADER */}

                          <div className="text-center relative z-10">

                            <div className="flex items-center justify-center gap-2">

                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#d4af37] overflow-hidden">

                                {companyLogoUrl ? (

                                  <img
                                    src={companyLogoUrl}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                  />

                                ) : (

                                  <span className="text-[8px] font-black text-[#132943]">
                                    LOGO
                                  </span>

                                )}

                              </div>

                              <div className="text-left">

                                <h2 className="text-[13px] font-black tracking-widest text-white">
                                  {organizationName}
                                </h2>

                                <p className="text-[8px] text-[#d4af37] font-bold tracking-wider">
                                  STUDENT IDENTIFICATION CARD
                                </p>

                              </div>

                            </div>

                          </div>

                          {/* STUDENT CONTENT */}

                          <div className="flex items-center gap-3 relative z-10">

                            {/* PHOTO */}

                            <div className="w-[78px] h-[90px] rounded-lg p-0.5 bg-gradient-to-tr from-[#d4af37] to-blue-400 shadow-md shrink-0">

                              <img
                                src={getImageUrl(
                                  student.imageUrl
                                )}
                                alt={getStudentNameEng(
                                  student
                                )}
                                className="w-full h-full object-cover rounded-md bg-white"
                              />

                            </div>

                            {/* DETAILS */}

                            <div className="min-w-0 flex-1">

                              <h3 className="text-[13px] font-black text-white leading-tight">
                                {getStudentNameAmh(
                                  student
                                )}
                              </h3>

                              <h3 className="text-[10px] font-bold text-gray-200 leading-tight mt-0.5">
                                {getStudentNameEng(
                                  student
                                )}
                              </h3>

                              <p className="text-[9px] text-[#d4af37] font-bold mt-1">
                                ID:{" "}
                                {student.studentIdNumber ||
                                  "-"}
                              </p>

                              <p className="text-[8.5px] text-gray-200 mt-0.5 truncate">
                                {student.department ||
                                  "Department"}
                              </p>

                              <p className="text-[8.5px] text-gray-300 mt-0.5">
                                {student.programLevel ||
                                  "Degree"}
                              </p>

                            </div>

                          </div>

                          {/* BOTTOM DETAILS */}

                          <div className="grid grid-cols-3 gap-1 text-[7.5px] font-semibold text-white relative z-10 bg-black/30 rounded-lg border border-[#d4af37]/30 p-1.5">

                            <div>
                              <span className="text-gray-400 block">
                                Level
                              </span>

                              <span className="font-bold">
                                {student.programLevel ||
                                  "-"}
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-400 block">
                                Year
                              </span>

                              <span className="font-bold">
                                {student.academicYear ||
                                  "-"}
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-400 block">
                                Semester
                              </span>

                              <span className="font-bold">
                                {student.semester ||
                                  "-"}
                              </span>
                            </div>

                          </div>

                          {/* FOOTER */}

                          <div className="text-center py-1 text-[7px] font-bold text-[#d4af37] bg-[#0c1b2d] -mx-3 -mb-3 border-t border-[#d4af37]/30 z-10">

                            Official Student Identification Card

                          </div>

                        </div>

                        {/* ==================================================
                            BACK
                        ================================================== */}

                        <div className="student-card-box relative w-[340px] h-[215px] bg-[#132943] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col justify-between p-3 shrink-0">

                          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#d4af37]/10 to-transparent pointer-events-none" />

                          {/* TITLE */}

                          <div className="relative z-10">

                            <h3 className="text-[10px] font-black text-[#d4af37] border-b border-white/20 pb-1 mb-2 tracking-wider text-center">

                              የተማሪ መታወቂያ መረጃ
                              / STUDENT DETAILS

                            </h3>

                            {/* INFO */}

                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[7.5px] font-semibold text-white bg-black/30 p-2 rounded-lg border border-[#d4af37]/30">

                              <div>
                                <span className="text-gray-400 block">
                                  Student ID
                                </span>

                                <span className="font-black">
                                  {student.studentIdNumber ||
                                    "-"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block">
                                  Gender
                                </span>

                                <span>
                                  {student.gender ||
                                    "-"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block">
                                  Birth Date
                                </span>

                                <span>
                                  {student.birthDate ||
                                    "-"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block">
                                  Age
                                </span>

                                <span>
                                  {student.age ||
                                    "-"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block">
                                  Department
                                </span>

                                <span className="truncate">
                                  {student.department ||
                                    "-"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block">
                                  Nationality
                                </span>

                                <span>
                                  {student.nationality ||
                                    "ኢትዮጵያዊ"}
                                </span>
                              </div>

                            </div>

                          </div>

                          {/* GUARDIAN + PHONE */}

                          <div className="relative z-10 grid grid-cols-2 gap-2 text-[7.5px] bg-black/30 p-2 rounded-lg border border-[#d4af37]/30">

                            <div>

                              <span className="text-gray-400 block">
                                Student Phone
                              </span>

                              <span className="font-bold">
                                {student.phoneNumber ||
                                  "-"}
                              </span>

                            </div>

                            <div>

                              <span className="text-gray-400 block">
                                Guardian
                              </span>

                              <span className="font-bold truncate">
                                {student.guardianName ||
                                  "-"}
                              </span>

                            </div>

                            <div>

                              <span className="text-gray-400 block">
                                Guardian Phone
                              </span>

                              <span className="font-bold">
                                {student.guardianPhone ||
                                  "-"}
                              </span>

                            </div>

                            <div>

                              <span className="text-gray-400 block">
                                Woreda / City
                              </span>

                              <span className="font-bold truncate">
                                {student.woreda ||
                                  "-"}{" "}
                                /{" "}
                                {student.city ||
                                  "-"}
                              </span>

                            </div>

                          </div>

                          {/* ISSUE / EXPIRE */}

                          <div className="grid grid-cols-2 gap-2 relative z-10 text-[7.5px]">

                            <div className="bg-black/30 rounded-lg p-1.5 border border-[#d4af37]/30">

                              <span className="text-gray-400 block">
                                Date of Issue
                              </span>

                              <span className="font-bold text-white">
                                {student.dateOfIssue ||
                                  "-"}
                              </span>

                            </div>

                            <div className="bg-black/30 rounded-lg p-1.5 border border-[#d4af37]/30">

                              <span className="text-gray-400 block">
                                Expire Date
                              </span>

                              <span className="font-bold text-yellow-300">
                                {student.expireDate ||
                                  "-"}
                              </span>

                            </div>

                          </div>

                          {/* QR */}

                          <div className="absolute right-3 top-[45px] flex flex-col items-center">

                            <div className="bg-white p-1 rounded">

                              <img
                                src={getQrCodeUrl(
                                  student
                                )}
                                alt="Student Verification QR"
                                style={{
                                  width: "58px",
                                  height: "58px",
                                  display: "block",
                                }}
                              />

                            </div>

                            <span className="text-[5.5px] text-[#d4af37] font-black mt-0.5">
                              SCAN TO VERIFY
                            </span>

                          </div>

                          {/* FOOTER */}

                          <div className="relative z-10 bg-[#0c1b2d] -mx-3 -mb-3 py-1 px-2 text-center border-t border-[#d4af37]/30">

                            <p className="text-[6.5px] font-bold text-gray-300">

                              Authorized Student ID —
                              {organizationName}

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* ==================================================
                      COMPACT DESIGN
                  ================================================== */}

                  {student.selectedStyle ===
                    "compact" && (

                    <div className="space-y-4">

                      <div className="text-xs font-bold text-[#d4af37] print:hidden">
                        🪪 Compact Student ID
                      </div>

                      <div className="flex flex-row flex-wrap justify-center gap-4">

                        {/* COMPACT FRONT */}

                        <div className="student-card-box relative w-[340px] h-[215px] bg-[#132943] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden p-3 shrink-0">

                          <div className="flex items-center justify-between border-b border-white/20 pb-2">

                            <div className="flex items-center gap-2">

                              <div className="w-9 h-9 bg-white rounded-full overflow-hidden border border-[#d4af37]">

                                {companyLogoUrl ? (

                                  <img
                                    src={companyLogoUrl}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                  />

                                ) : (

                                  <span className="text-[7px] font-black text-[#132943] flex items-center justify-center h-full">
                                    LOGO
                                  </span>

                                )}

                              </div>

                              <div>

                                <h2 className="text-[11px] font-black">
                                  {organizationName}
                                </h2>

                                <p className="text-[7px] text-[#d4af37] font-bold">
                                  STUDENT ID
                                </p>

                              </div>

                            </div>

                            <span className="text-[7px] text-gray-300">
                              {student.programLevel ||
                                "Degree"}
                            </span>

                          </div>

                          <div className="flex items-center gap-3 mt-3">

                            <div className="w-[70px] h-[82px] rounded-lg overflow-hidden border-2 border-[#d4af37] shrink-0">

                              <img
                                src={getImageUrl(
                                  student.imageUrl
                                )}
                                alt="Student"
                                className="w-full h-full object-cover"
                              />

                            </div>

                            <div className="space-y-1 min-w-0">

                              <h3 className="text-[12px] font-black truncate">
                                {getStudentNameAmh(
                                  student
                                )}
                              </h3>

                              <p className="text-[9px] text-gray-300 truncate">
                                {getStudentNameEng(
                                  student
                                )}
                              </p>

                              <p className="text-[8px] text-[#d4af37] font-bold">
                                {student.studentIdNumber ||
                                  "-"}
                              </p>

                              <p className="text-[8px] text-gray-300 truncate">
                                {student.department ||
                                  "-"}
                              </p>

                              <p className="text-[8px] text-gray-300">
                                Year:{" "}
                                {student.academicYear ||
                                  "-"}
                              </p>

                              <p className="text-[8px] text-gray-300">
                                Semester:{" "}
                                {student.semester ||
                                  "-"}
                              </p>

                            </div>

                            <div className="ml-auto flex flex-col items-center">

                              <div className="bg-white p-1 rounded">

                                <img
                                  src={getQrCodeUrl(
                                    student
                                  )}
                                  alt="QR"
                                  style={{
                                    width: "58px",
                                    height: "58px",
                                    display: "block",
                                  }}
                                />

                              </div>

                              <span className="text-[5px] text-[#d4af37] mt-1 font-black">
                                VERIFY
                              </span>

                            </div>

                          </div>

                          <div className="absolute bottom-0 left-0 right-0 bg-[#0c1b2d] border-t border-[#d4af37]/30 text-center py-1">

                            <span className="text-[6.5px] font-bold text-gray-300">
                              Official Student Identification Card
                            </span>

                          </div>

                        </div>

                        {/* COMPACT BACK */}

                        <div className="student-card-box relative w-[340px] h-[215px] bg-[#132943] text-white rounded-xl shadow-2xl border-2 border-[#d4af37] overflow-hidden p-3 shrink-0">

                          <h3 className="text-[10px] font-black text-[#d4af37] text-center border-b border-white/20 pb-2">

                            STUDENT INFORMATION

                          </h3>

                          <div className="grid grid-cols-2 gap-2 mt-3 text-[8px]">

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                Father
                              </span>
                              <span className="font-bold">
                                {student.fatherNameAmh ||
                                  "-"}
                              </span>
                            </div>

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                Grandfather
                              </span>
                              <span className="font-bold">
                                {student.grandfatherNameAmh ||
                                  "-"}
                              </span>
                            </div>

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                Mother
                              </span>
                              <span className="font-bold">
                                {student.motherNameAmh ||
                                  "-"}
                              </span>
                            </div>

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                Phone
                              </span>
                              <span className="font-bold">
                                {student.phoneNumber ||
                                  "-"}
                              </span>
                            </div>

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                City
                              </span>
                              <span className="font-bold">
                                {student.city ||
                                  "-"}
                              </span>
                            </div>

                            <div className="bg-black/30 rounded-lg p-2">
                              <span className="text-gray-400 block">
                                Woreda
                              </span>
                              <span className="font-bold">
                                {student.woreda ||
                                  "-"}
                              </span>
                            </div>

                          </div>

                          <div className="mt-3 bg-black/30 rounded-lg p-2 text-[8px]">

                            <div className="flex justify-between border-b border-white/10 pb-1 mb-1">
                              <span className="text-gray-400">
                                Issue Date
                              </span>

                              <span className="font-bold">
                                {student.dateOfIssue ||
                                  "-"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Expire Date
                              </span>

                              <span className="font-bold text-yellow-300">
                                {student.expireDate ||
                                  "-"}
                              </span>
                            </div>

                          </div>

                          <div className="absolute bottom-0 left-0 right-0 bg-[#0c1b2d] border-t border-[#d4af37]/30 text-center py-1">

                            <span className="text-[6.5px] font-bold text-gray-300">
                              {organizationName} — Student Affairs
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

 
      <div className="print:hidden mt-8">
      
      </div>

    </div>
  );
}

export default StudentPrintCartPage;
