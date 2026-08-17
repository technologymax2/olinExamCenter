import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

const ScheduledExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // AUTH HEADER
  // ==========================================
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Authentication token not found in localStorage');
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH EXAMS
  // ==========================================
  const fetchExams = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        console.error('❌ No login token found');
        setExams([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/exams`,
        getAuthHeader()
      );

      console.log('✅ Exams fetched:', response.data);

      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ Error fetching exams:', err);

      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Server response:', err.response.data);
      }

      if (err.response?.status === 401) {
        alert('የLogin ፍቃድዎ ጊዜ አልፎበታል። እባክዎ Login ያድርጉ።');

        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE EXAM
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm('ይህንን ፈተና መደምሰስ ይፈልጋሉ?')) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem('token');

      if (!token) {
        alert('እባክዎ Login ያድርጉ።');
        window.location.href = '/login';
        return;
      }

      await axios.delete(
        `${API_URL}/api/admin/exams/${id}`,
        getAuthHeader()
      );

      setExams((prevExams) =>
        prevExams.filter((exam) => exam._id !== id)
      );

      alert('ፈተናው ተሰርዟል!');
    } catch (err) {
      console.error('❌ Error deleting exam:', err);

      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Server response:', err.response.data);
      }

      if (err.response?.status === 401) {
        alert('የLogin ፍቃድዎ ጊዜ አልፎበታል።');

        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      alert(
        err.response?.data?.error ||
          'ፈተናውን በመሰረዝ ላይ ስህተት ተፈጥሯል'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOAD EXAMS
  // ==========================================
  useEffect(() => {
    fetchExams();
  }, []);

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md mt-6 border border-gray-100">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold text-[#123758]">
          የተዘጋጁ ፈተናዎች ዝርዝር
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Scheduled Exams)
          </span>
        </h3>

        <button
          onClick={fetchExams}
          disabled={loading}
          className="bg-[#123758] hover:bg-blue-900 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {loading ? 'በመጫን ላይ...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-blue-700 rounded-full mx-auto mb-3"></div>
          ፈተናዎችን በመጫን ላይ...
        </div>
      ) : exams.length === 0 ? (
        <div className="py-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          <p className="text-lg">📋</p>
          <p className="font-semibold mt-2">
            እስካሁን ምንም ፈተና አልተዘጋጀም።
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-sm font-bold text-gray-700">
                  የፈተና ርዕስ
                </th>

                <th className="p-3 text-left text-sm font-bold text-gray-700">
                  ትምህርት
                </th>

                <th className="p-3 text-left text-sm font-bold text-gray-700">
                  ቀን እና ሰዓት
                </th>

                <th className="p-3 text-center text-sm font-bold text-gray-700">
                  ድርጊቶች
                </th>
              </tr>
            </thead>

            <tbody>
              {exams.map((exam) => (
                <tr
                  key={exam._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold text-gray-800">
                    {exam.title || '-'}
                  </td>

                  <td className="p-3 text-gray-700">
                    {exam.subject || '-'}
                  </td>

                  <td className="p-3 text-gray-700">
                    {exam.examDate
                      ? new Date(exam.examDate).toLocaleString()
                      : '-'}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          alert(
                            'Edit modal ክፍት ማድረግ ይቻላል'
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                      >
                        አስተካክል
                      </button>

                      <button
                        onClick={() => handleDelete(exam._id)}
                        disabled={deletingId === exam._id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm"
                      >
                        {deletingId === exam._id
                          ? 'በመሰረዝ...'
                          : 'ሰርዝ'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduledExamsList;
