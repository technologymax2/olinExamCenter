import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ከላይቭ ሰርቨር ጋር ማገናኘት (አስፈላጊ ከሆነ ሎካልሆስት መጠቀም ይቻላል)
      const response = await axios.post('https://olinexamcenter.onrender.com/api/login', formData);
      
      const { role, name } = response.data;
      alert(`እንኳን ደህና መጡ, ${name}!`);

      // እንደ ሮሉ (Role) መጠን ወደየራሱ ዳሽቦርድ መውሰድ
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'student') {
        navigate('/student');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'የኔትወርክ ስህተት አጋጥሟል፡፡ እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123758]">
            ወደ መለያዎ ይግቡ
          </h2>
          <p className="text-sm text-gray-600">
            ማክ ቴክኖሎጂ የፈተና እና ትምህርት ማዕከል
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ኢሜይል አድራሻ (Email)</label>
            <input 
              type="email"
              name="email"
              required
              placeholder="example@getMax.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">የይለፍ ቃል (Password)</label>
            <input 
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#123758]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#123758] hover:bg-blue-900 text-white font-medium p-3 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? ' በመግባት ላይ...' : 'ግባ'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-gray-500 hover:text-[#123758] transition">
            &larr; ወደ መነሻ ገጽ ተመለስ
          </Link>
        </div>

      </div>
    </div>
  );
}

### 3. በ `App.js` ውስጥ ራውቱን ማካተት
በመጨረሻም በ `App.js` ውስጥ የሊንክ አዝራር እና የ `/login` ራውት ጨምር፦

```javascript
<Route element="{<Login" path="/login"/>} />
