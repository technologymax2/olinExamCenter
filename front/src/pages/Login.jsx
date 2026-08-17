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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (!email || !password) {
        setError('እባክዎ ኢሜይል እና የይለፍ ቃል ይሙሉ።');
        return;
      }

      console.log('Login request:', {
        url: `${API_BASE_URL}/login`,
        email
      });

      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login response:', response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('የሰርቨሩ የLogin ምላሽ ትክክል አይደለም።');
      }

      const {
        id,
        name,
        email: userEmail,
        role
      } = user;

      if (!role) {
        throw new Error('የተጠቃሚው Role ከሰርቨሩ አልተገኘም።');
      }

      // Clear old authentication data first
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');

      // Store new JWT/user information
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name || '');
      localStorage.setItem('userEmail', userEmail || '');

      localStorage.setItem(
        'user',
        JSON.stringify({
          id,
          name,
          email: userEmail,
          role
        })
      );

      window.dispatchEvent(new Event('storage'));

      console.log('Authentication saved:', {
        role,
        name,
        email: userEmail,
        hasToken: Boolean(token)
      });

      alert(`እንኳን ደህና መጡ, ${name || 'ተጠቃሚ'}!`);

      // Redirect according to role
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
          navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('LOGIN ERROR:', err);
      console.error('Status:', err.response?.status);
      console.error('Response:', err.response?.data);

      if (err.response?.status === 401) {
        setError(
          err.response?.data?.error ||
          'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው።'
        );
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.error ||
          'ይህን ክፍል ለመጠቀም ፈቃድ የለዎትም።'
        );
      } else {
        setError(
          err.response?.data?.error ||
          err.message ||
          'የኔትወርክ ስህተት አጋጥሟል።'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#123758]">
              ወደ መለያዎ ይግቡ
            </h1>

            <p className="mt-2 text-gray-500">
              ማክ ቴክኖሎጂ የፈተና እና ትምህርት ማዕከል
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                ኢሜይል
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="admin@max.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#123758] focus:ring-2 focus:ring-[#123758]/20"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                የይለፍ ቃል
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#123758] focus:ring-2 focus:ring-[#123758]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#123758] px-4 py-3 font-semibold text-white transition hover:bg-[#0d2942] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'በመግባት ላይ...' : 'ግባ'}
            </button>

          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-[#123758]"
            >
              ← ወደ መነሻ ገጽ ተመለስ
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
