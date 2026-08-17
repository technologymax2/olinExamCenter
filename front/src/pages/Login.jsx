import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://olinexamcenter.onrender.com/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    console.log('Login request:', {
      url: `${API_BASE_URL}/login`,
      email
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
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

      // ==========================================
      // VALIDATE SERVER RESPONSE
      // ==========================================
      if (!response.data) {
        throw new Error('የሰርቨሩ ምላሽ ባዶ ነው።');
      }

      const { token, user } = response.data;

      if (!token) {
        console.error('Missing token:', response.data);

        throw new Error(
          'የሰርቨሩ የLogin ምላሽ ትክክለኛ Token የለውም።'
        );
      }

      if (!user) {
        console.error('Missing user object:', response.data);

        throw new Error(
          'የሰርቨሩ የLogin ምላሽ የተጠቃሚ መረጃ የለውም።'
        );
      }

      const userName = user.name || '';
      const userEmail = user.email || email;
      const userRole = user.role || '';

      if (!userRole) {
        console.error('Missing role:', response.data);

        throw new Error(
          'የተጠቃሚው Role ከሰርቨሩ አልተላከም።'
        );
      }

      // ==========================================
      // SAVE LOGIN DATA
      // ==========================================
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userEmail', userEmail);

      // Save complete user object as well
      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      console.log('Login successful:', {
        name: userName,
        email: userEmail,
        role: userRole
      });

      // Notify other components
      window.dispatchEvent(new Event('storage'));

      // ==========================================
      // ROLE-BASED REDIRECT
      // ==========================================
      switch (userRole) {
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
          console.error('Unknown role:', userRole);

          setError(
            `የተጠቃሚው Role "${userRole}" አይታወቅም።`
          );

          // Clear invalid login
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('user');

          break;
      }

    } catch (err) {

      console.error('LOGIN ERROR:', err);

      console.error(
        'Status:',
        err.response?.status
      );

      console.error(
        'Response:',
        err.response?.data
      );

      // ==========================================
      // BACKEND ERROR
      // ==========================================
      if (err.response) {

        const status = err.response.status;
        const serverMessage =
          err.response.data?.error ||
          err.response.data?.message;

        if (status === 401) {
          setError(
            serverMessage ||
            'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው።'
          );

        } else if (status === 400) {
          setError(
            serverMessage ||
            'የገቡት መረጃ ትክክል አይደለም።'
          );

        } else if (status === 403) {
          setError(
            serverMessage ||
            'ወደዚህ ሲስተም ለመግባት ፈቃድ የለዎትም።'
          );

        } else if (status === 404) {
          setError(
            'የLogin API አድራሻ አልተገኘም።'
          );

        } else if (status >= 500) {
          setError(
            'የሰርቨሩ ውስጣዊ ስህተት ተፈጥሯል። እባክዎ ቆይተው ይሞክሩ።'
          );

        } else {
          setError(
            serverMessage ||
            'Login ላይ ስህተት ተፈጥሯል።'
          );
        }

      // ==========================================
      // NETWORK ERROR
      // ==========================================
      } else if (err.request) {

        setError(
          'ከሰርቨሩ ጋር መገናኘት አልተቻለም። እባክዎ Internet እና Backend Server ያረጋግጡ።'
        );

      // ==========================================
      // FRONTEND ERROR
      // ==========================================
      } else {

        setError(
          err.message ||
          'ያልታወቀ የLogin ስህተት ተፈጥሯል።'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-[#123758] px-6 sm:px-8 py-8 text-center text-white">

            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">

              <span className="text-3xl">
                🎓
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold">
              እንኳን ደህና መጡ
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              ማክ ቴክኖሎጂ የፈተና እና ትምህርት ማዕከል
            </p>

          </div>

          {/* FORM AREA */}
          <div className="p-6 sm:p-8">

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    ⚠️
                  </span>

                  <div>
                    <p className="font-semibold text-red-800 text-sm">
                      Login ስህተት
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {error}
                    </p>
                  </div>

                </div>

              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  ኢሜይል አድራሻ
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="example@max.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 outline-none transition focus:border-[#123758] focus:ring-2 focus:ring-[#123758]/20"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  የይለፍ ቃል
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 outline-none transition focus:border-[#123758] focus:ring-2 focus:ring-[#123758]/20"
                />

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#123758] hover:bg-[#0d2b46] active:scale-[0.99] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    በመግባት ላይ...

                  </span>
                ) : (
                  'ግባ'
                )}

              </button>

            </form>

            {/* BACK */}
            <div className="mt-6 text-center">

              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-[#123758] transition"
              >
                ← ወደ መነሻ ገጽ ተመለስ
              </Link>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} Max Technology
        </p>

      </div>

    </div>
  );
}

export default Login;
