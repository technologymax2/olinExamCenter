import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://olinexamcenter.onrender.com';

function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Stores selected answers { questionId: 'A' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        // Fetch exam details and its associated questions
        const res = await axios.get(`${API_URL}/api/exams/${examId}`, getAuthHeader());
        setExam(res.data.exam);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error('Error fetching exam:', err);
        alert('ፈተናውን መጫን አልተቻለም።');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers({
      ...answers,
      [questionId]: optionKey
    });
  };

  const handleSubmitExam = async () => {
    if (!window.confirm('ፈተናውን ማስገባት እርግጠኛ ኖት?')) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/exams/${examId}/submit`, { answers }, getAuthHeader());
      alert(`ፈተናው በትሳካ ሁኔታ ገብቷል! ውጤትዎ: ${res.data.score}%`);
      navigate('/student');
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert('ፈተናውን ማስገባት ላይ ችግር ተፈጥሯል።');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">ፈተናውን በመጫን ላይ...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 max-w-4xl mx-auto font-sans">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#123758]">{exam?.title}</h1>
          <p className="text-sm text-gray-500">ትምህርት: {exam?.subject}</p>
        </div>
        <button 
          onClick={() => navigate('/student')}
          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md font-semibold transition"
        >
          ውጣ (Exit)
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q._id || index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">
              {index + 1}. {q.questionText}
            </h3>
            
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((optKey) => {
                const optText = q[`option${optKey}`];
                if (!optText) return null; // Skip if option is empty

                const isSelected = answers[q._id] === optKey;

                return (
                  <label 
                    key={optKey}
                    onClick={() => handleOptionSelect(q._id, optKey)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                      isSelected ? 'border-[#123758] bg-blue-50/50 text-[#123758] font-medium' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                      {optKey}
                    </span>
                    <span className="text-sm">{optText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmitExam}
          disabled={submitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition"
        >
          {submitting ? 'በማስገባት ላይ...' : 'ፈተና አስገባ (Submit Exam)'}
        </button>
      </div>
    </div>
  );
}

export default TakeExam;
