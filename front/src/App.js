import React from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
    useLocation
} from 'react-router-dom';

// ==========================================
// PAGES
// ==========================================

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HREmployeeDashboard from './pages/HREmployeeDashboard';
import StudentPrintCartPage from './pages/StudentPrintCartPage';
import TakeExam from './pages/TakeExam';

// ==========================================
// API
// ==========================================

export const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

// ==========================================
// AUTH HELPERS
// ==========================================

export const getCurrentUser = () => {
    try {
        return JSON.parse(
            localStorage.getItem('currentUser') || 'null'
        );
    } catch {
        return null;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');

    window.location.href = '/login';
};

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({
    children,
    allowedRole
}) {
    const location = useLocation();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );
    }

    if (
        allowedRole &&
        role !== allowedRole
    ) {
        return (
            <Navigate
                to={getDashboardPath(role)}
                replace
            />
        );
    }

    return children;
}

// ==========================================
// ROLE DASHBOARD
// ==========================================

function getDashboardPath(role) {
    switch (role) {
        case 'admin':
            return '/admin';

        case 'teacher':
            return '/teacher';

        case 'hr':
            return '/hr';

        case 'student':
            return '/student';

        default:
            return '/login';
    }
}

// ==========================================
// HOME
// ==========================================

function Home() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role) {
        return (
            <Navigate
                to={getDashboardPath(role)}
                replace
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#061421] via-[#0d2438] to-[#123758] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-4xl">

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    <div className="grid md:grid-cols-2">

                        {/* BRAND */}
                        <div className="bg-[#123758] text-white p-8 sm:p-12 flex flex-col justify-center">

                            <div className="w-16 h-16 rounded-2xl bg-[#d4af37] flex items-center justify-center text-[#123758] font-black text-2xl mb-6">
                                MT
                            </div>

                            <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">
                                Max Technology
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-black mt-3 leading-tight">
                                Olin Exam Center
                            </h1>

                            <p className="text-blue-100/80 mt-5 leading-relaxed">
                                የተማሪዎችን ፈተና፣ የመምህራንን
                                ስራ እና የተማሪ መረጃን
                                በአንድ የዲጂታል ሲስተም
                                ያስተዳድሩ።
                            </p>

                        </div>

                        {/* LOGIN */}
                        <div className="p-8 sm:p-12 flex flex-col justify-center">

                            <h2 className="text-2xl font-black text-[#123758]">
                                እንኳን ደህና መጡ
                            </h2>

                            <p className="text-gray-500 mt-2">
                                ወደ መለያዎ በመግባት
                                ሲስተሙን ይጠቀሙ።
                            </p>

                            <Link
                                to="/login"
                                className="mt-8 w-full text-center bg-[#123758] hover:bg-[#0c2942] text-white font-bold py-3.5 rounded-xl transition shadow-lg"
                            >
                                ወደ መግቢያ ገጽ
                            </Link>

                        </div>

                    </div>

                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    © {new Date().getFullYear()} Max Technology
                </p>

            </div>

        </div>
    );
}

// ==========================================
// STUDENT LANDING
// ==========================================

function StudentHome() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-lg w-full text-center">

                <div className="mx-auto w-16 h-16 bg-[#123758] text-[#d4af37] rounded-2xl flex items-center justify-center font-black text-xl">
                    MT
                </div>

                <h1 className="text-2xl font-black text-[#123758] mt-5">
                    የተማሪ ፖርታል
                </h1>

                <p className="text-gray-500 mt-2">
                    ፈተናዎችዎን እና የተማሪ አገልግሎቶችን
                    ከዚህ ይጠቀሙ።
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

                    <Link
                        to="/student/print"
                        className="bg-[#123758] text-white rounded-xl py-3 font-semibold hover:bg-blue-900 transition"
                    >
                        ID Card
                    </Link>

                    <button
                        onClick={logoutUser}
                        className="bg-red-50 text-red-600 rounded-xl py-3 font-semibold hover:bg-red-100 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

// ==========================================
// APP
// ==========================================

function App() {
    return (
        <Router>

            <Routes>

                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* TEACHER */}
                <Route
                    path="/teacher"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* HR */}
                <Route
                    path="/hr"
                    element={
                        <ProtectedRoute allowedRole="hr">
                            <HREmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* STUDENT HOME */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentHome />
                        </ProtectedRoute>
                    }
                />

                {/* EXAM */}
                <Route
                    path="/student/exam/:examId"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <TakeExam />
                        </ProtectedRoute>
                    }
                />

                {/* PRINT */}
                <Route
                    path="/student/print"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentPrintCartPage />
                        </ProtectedRoute>
                    }
                />

                {/* FALLBACK */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </Router>
    );
}

export default App;
