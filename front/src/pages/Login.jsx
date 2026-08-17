import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) {
            setError('');
        }
    };

    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) return;

        setError('');
        setLoading(true);

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            setError('እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።');
            setLoading(false);
            return;
        }

        try {

            console.log('Login request:', {
                url: `${API_URL}/api/login`,
                email
            });

            const response = await axios.post(
                `${API_URL}/api/login`,
                {
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            console.log('Login response:', response.data);

            const {
                token,
                role,
                name,
                email: returnedEmail
            } = response.data;

            if (!token || !role) {
                throw new Error(
                    'የሰርቨሩ የLogin ምላሽ ትክክል አይደለም።'
                );
            }

            // ==========================================
            // SAVE AUTH DATA
            // ==========================================

            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', name || '');
            localStorage.setItem(
                'userEmail',
                returnedEmail || email
            );

            // ==========================================
            // REDIRECT
            // ==========================================

            window.dispatchEvent(new Event('storage'));

            switch (role) {

                case 'admin':
                    navigate('/admin', { replace: true });
                    break;

                case 'hr':
                    navigate('/hr', { replace: true });
                    break;

                case 'teacher':
                    navigate('/teacher', { replace: true });
                    break;

                case 'student':
                    navigate('/student', { replace: true });
                    break;

                default:
                    localStorage.clear();
                    setError(
                        'የተጠቃሚው ሚና (Role) ትክክል አይደለም።'
                    );
            }

        } catch (err) {

            console.error('LOGIN ERROR:', err);

            // ==========================================
            // SERVER RESPONSE ERROR
            // ==========================================

            if (err.response) {

                console.error(
                    'Status:',
                    err.response.status
                );

                console.error(
                    'Response:',
                    err.response.data
                );

                if (err.response.status === 401) {

                    setError(
                        'የመግቢያ ፈቃድ አልተሰጠም። ኢሜይል ወይም የይለፍ ቃል ያረጋግጡ።'
                    );

                } else if (err.response.status === 400) {

                    setError(
                        err.response.data?.error ||
                        'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው።'
                    );

                } else if (err.response.status === 403) {

                    setError(
                        'የመግቢያ ፈቃድ የለዎትም።'
                    );

                } else if (err.response.status >= 500) {

                    setError(
                        'የሰርቨሩ ላይ ስህተት ተፈጥሯል። እባክዎ ቆይተው ይሞክሩ።'
                    );

                } else {

                    setError(
                        err.response.data?.error ||
                        'Login ማድረግ አልተቻለም።'
                    );
                }

            }

            // ==========================================
            // NETWORK ERROR
            // ==========================================

            else if (err.request) {

                setError(
                    'ከሰርቨሩ ጋር መገናኘት አልተቻለም። ኢንተርኔትዎን እና ሰርቨሩን ያረጋግጡ።'
                );

            }

            // ==========================================
            // OTHER ERROR
            // ==========================================

            else {

                setError(
                    err.message ||
                    'ያልታወቀ ስህተት ተፈጥሯል።'
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#071827] via-[#123758] to-[#0b2236] flex items-center justify-center p-4">

            <div className="w-full max-w-md">

                {/* BRAND */}

                <div className="text-center mb-6">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d4af37] shadow-lg mb-4">

                        <span className="text-[#123758] text-2xl font-black">
                            MT
                        </span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                        Max Technology
                    </h1>

                    <p className="text-gray-300 text-sm mt-1">
                        Olin Exam Center
                    </p>

                </div>

                {/* CARD */}

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* HEADER */}

                    <div className="px-6 sm:px-8 pt-7 pb-5">

                        <h2 className="text-2xl font-extrabold text-[#123758]">
                            ወደ መለያዎ ይግቡ
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            የፈተና እና የትምህርት ማዕከል
                        </p>

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className="mx-6 sm:mx-8 mb-4">

                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">

                                <div className="flex items-start gap-2">

                                    <span className="font-bold">
                                        ⚠
                                    </span>

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleLogin}
                        className="px-6 sm:px-8 pb-8 space-y-5"
                    >

                        {/* EMAIL */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ኢሜይል አድራሻ
                            </label>

                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#123758] focus:border-[#123758] transition"
                            />

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                የይለፍ ቃል
                            </label>

                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#123758] focus:border-[#123758] transition"
                            />

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#123758] hover:bg-[#0c2a43] text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <span className="flex items-center justify-center gap-2">

                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                                    በመግባት ላይ...

                                </span>
                            ) : (
                                'ግባ'
                            )}

                        </button>

                    </form>

                    {/* FOOTER */}

                    <div className="bg-gray-50 border-t px-6 py-4 text-center">

                        <Link
                            to="/"
                            className="text-sm text-gray-600 hover:text-[#123758] font-medium transition"
                        >
                            ← ወደ መነሻ ገጽ ተመለስ
                        </Link>

                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-5">
                    © 2026 Max Technology. All rights reserved.
                </p>

            </div>

        </div>
    );
}

export default Login;
