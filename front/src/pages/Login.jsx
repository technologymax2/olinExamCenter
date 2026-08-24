// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // student, teacher, admin
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // በሰጠነው ሮል መሰረት ወደየራሳቸው ዳሽቦርድ እንመራቸዋለን
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">የኮሌጅ ማስተዳደሪያ ሲስተም</h1>
          <p className="text-sm text-gray-500 mt-1">እባክዎ መለያዎን ያስገቡ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">የተጠቃሚ  አይነት (Role)</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="student">ተማሪ (Student)</option>
              <option value="teacher">መምህር (Teacher)</option>
              <option value="admin">አስተዳዳሪ (Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ኢሜይል</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="name@college.edu"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">የሚስጥር ቃል (Password)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="********"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 text-white bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            ግባ (Login)
          </button>
        </form>
      </div>
    </div>
  );
}
