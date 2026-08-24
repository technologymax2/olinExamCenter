import React from 'react';

export default function Navbar({ title, userName, roleBadge }) {
  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center border-b border-gray-100">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{roleBadge}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow">
          {userName ? userName.charAt(0) : 'U'}
        </div>
      </div>
    </header>
  );
}
