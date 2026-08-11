
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduledExamsList = () => {
  const [exams, setExams] = useState([]);

  // ፈተናዎችን ከመሰብሰብ (Fetch)
  const fetchExams = async () => {
    try {
      const response = await axios.get('https://olinexamcenter.onrender.com/api/admin/exams');
      setExams(response.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ፈተናን የመሰረዝ ተግባር
  const handleDelete = async (id) => {
    if (window.confirm('ይህንን ፈተና መደምሰስ ይፈልጋሉ?')) {
      try {
        await axios.delete(`https://olinexamcenter.onrender.com/api/admin/exams/${id}`);
        setExams(exams.filter(exam => exam._id !== id));
        alert('ፈተናው ተሰርዟል');
      } catch (err) {
        alert('ፈተናውን በመሰረዝ ላይ ስህተት ተፈጥሯል');
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">የተዘጋጁ ፈተናዎች ዝርዝር (Scheduled Exams)</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">የፈተና ርዕስ (Title)</th>
            <th className="p-2 text-left">ትምህርት (Subject)</th>
            <th className="p-2 text-left">ቀን እና ሰዓት</th>
            <th className="p-2 text-center">ድርጊቶች (Actions)</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{exam.title}</td>
              <td className="p-2">{exam.subject}</td>
              <td className="p-2">{new Date(exam.examDate).toLocaleString()}</td>
              <td className="p-2 text-center space-x-2">
                <button 
                  onClick={() => alert('Edit modal ክፍት ማድረግ ይቻላል')} 
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  አስተካክል
                </button>
                <button 
                  onClick={() => handleDelete(exam._id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  ሰርዝ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduledExamsList;
