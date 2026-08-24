import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Pages Import ---
import Login from './pages/Login/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import BulkRegistration from './pages/BulkRegistration/BulkRegistration';
import DigitalID from './pages/DigitalID/DigitalID';
import Assignments from './pages/Assignments/Assignments';
import Exams from './pages/Exams/Exams';
import Notices from './pages/Notices/Notices';

// --- Shared Components Import (ለሙከራ እንዲሆን) ---
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* ሲስተሙ ውስጥ ሲገቡ የሚታይ የጎን ሜኑ እና NavBar (Conditional ማድረግ ይቻላል) */}
        {/* ለጊዜው አጠቃላይ ራውቶቹን እንዘረጋለን */}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            {/* 1. የመግቢያ ገጽ */}
            <Route path="/" element={<Login />} />

            {/* 2. የአስተዳዳሪ ዳሽቦርድ */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* 3. የመምህር ዳሽቦርድ */}
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

            {/* 4. የተማሪ ዳሽቦርድ */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />

            {/* 5. በኤክሴል በጅምላ የመመዝገቢያ ገጽ */}
            <Route path="/bulk-registration" element={<BulkRegistration />} />

            {/* 6. ዲጂታል መታወቂያ እና QR ማረጋገጫ ገጽ */}
            <Route path="/digital-id" element={<DigitalID />} />

            {/* 7. አሳይመንት እና የቤት ስራ መቆጣጠሪያ */}
            <Route path="/assignments" element={<Assignments />} />

            {/* 8. የኦንላይን ፈተና ገጽ */}
            <Route path="/exams" element={<Exams />} />

            {/* 9. የማስታወቂያ ሰሌዳ */}
            <Route path="/notices" element={<Notices />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
