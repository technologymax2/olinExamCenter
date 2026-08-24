import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalIDCard({ student }) {
  const verificationUrl = `https://college.edu/verify/${student.studentId}`;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-blue-700">
      {/* ሪቫይ (Header) */}
      <div className="bg-blue-950 px-6 py-4 flex justify-between items-center border-b border-blue-800">
        <div>
          <h2 className="font-bold text-lg tracking-wider">የኢትዮጵያ ኮሌጅ</h2>
          <p className="text-xs text-blue-300">Official Digital Student ID</p>
        </div>
        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-inner">
          {student.status || 'Active'}
        </span>
      </div>

      {/* አካል (Body) */}
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-200">
          <img src={student.photo || 'https://via.placeholder.com/150'} alt="Student" className="w-full h-full object-cover" />
        </div>

        <h3 className="text-2xl font-bold tracking-wide">{student.name}</h3>
        <p className="text-blue-200 text-sm font-mono mt-1">{student.studentId}</p>

        <div className="w-full grid grid-cols-2 gap-4 mt-6 text-left bg-blue-950/50 p-4 rounded-xl border border-blue-800/50 text-sm">
          <div>
            <p className="text-xs text-blue-300">ዲፓርትመንት</p>
            <p className="font-semibold mt-0.5">{student.department}</p>
          </div>
          <div>
            <p className="text-xs text-blue-300">የአሁን ሁኔታ (Status)</p>
            <p className="font-semibold text-green-400 mt-0.5">{student.academicYear}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6 bg-white p-3 rounded-xl shadow-inner flex items-center justify-center">
          <QRCodeSVG value={verificationUrl} size={110} />
        </div>
        <p className="text-[11px] text-blue-300 mt-2">ለማረጋገጥ (Verify) የQR ኮዱን ይቃኙ</p>
      </div>

      {/* ግርጌ (Footer) */}
      <div className="bg-blue-950 px-6 py-3 text-center text-xs text-blue-400 border-t border-blue-800">
        ይህ መታወቂያ በሲስተሙ በራስ-ሰር የተፈጠረ ነው።
      </div>
    </div>
  );
}
