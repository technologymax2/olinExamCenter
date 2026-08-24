import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exams() {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 ደቂቃ በሰከንድ
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // የፈተና ጥያቄዎች ናሙና
  const questions = [
    {
      id: 1,
      questionText: 'MERN stack የሚከተሉትን ቴክኖሎጂዎች የትኛውን ያካትታል?',
      options: [
        'A) MySQL, Express, React, Node',
        'B) MongoDB, Express, React, Node',
        'C) MongoDB, Ember, React, Next',
        'D) Oracle, Express, Angular, Node'
      ],
      correctAnswer: 1 // B)
    },
    {
      id: 2,
      questionText: 'በ React ውስጥ የውሂብ (State) አያያዝ ለመጠቀም რომელი Hook ይጠቀማል?',
      options: [
        'A) useEffect',
        'B) useContext',
        'C) useState',
        'D) useReducer'
      ],
      correctAnswer: 2 // C)
    }
  ];

  // የሰዓት ቆጣሪ ሎጂክ
  useEffect(() => {
    if (!examStarted || submitted) return;

    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitExam = () => {
    setSubmitted(true);
    
    // ራስ-ሰር ውጤት ማሰላት (Auto-grading)
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        calculatedScore += 50; // እያንዳንዱ ጥያቄ 50 ነጥብ ቢኖረው
      }
    });
    setScore(calculatedScore);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. የጎን ሜኑ (Sidebar) */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-blue-800">
          ኮሌጅ ሲስተም
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate('/student-dashboard')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዳሽቦርድ (Dashboard)
          </button>
          <button 
            onClick={() => navigate('/digital-id')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ዲጂታል መታወቂያ (Digital ID)
          </button>
          <button 
            onClick={() => navigate('/exams')} 
            className="w-full text-left px-4 py-2.5 rounded bg-blue-800 font-semibold"
          >
            የኦንላይን ፈተና (Exams)
          </button>
          <button 
            onClick={() => navigate('/notices')} 
            className="w-full text-left px-4 py-2.5 rounded hover:bg-blue-800 transition"
          >
            ማስታወቂያዎች (Notices)
          </button>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-2 bg-red-600 rounded text-center font-semibold hover:bg-red-700 transition"
          >
            ውጣ (Logout)
          </button>
        </div>
      </aside>

      {/* 2. ዋናው የማሳያ ክፍል */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">የኦንላይን ፈተና ማዕከል (Online Exam Room)</h1>
          {examStarted && !submitted && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-inner">
              ⏳ ቀሪ ሰዓት: {formatTime(timeLeft)}
            </div>
          )}
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full">
          {!examStarted ? (
            /* የፈተና መግቢያ መግለጫ */
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">የሶፍትዌር ኢንጂነሪንግ ማጠቃለያ ፈተና</h2>
              <p className="text-gray-600 mb-6">
                ይህ ፈተና 2 ጥያቄዎችን የያዘ ሲሆን የተፈቀደልዎ ጊዜ <strong>10 ደቂቃ</strong> ነው። አንዴ ከጀመሩ ሰዓቱን ማቆም አይችሉም።
              </p>
              <button 
                onClick={() => setExamStarted(true)}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg text-lg"
              >
                ፈተናውን ጀምር (Start Exam)
              </button>
            </div>
          ) : submitted ? (
            /* የፈተና ውጤት ማሳያ */
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 ፈተናውን በተሳካ ሁኔታ ጨርሰዋል!</h2>
              <p className="text-gray-600 mb-6">መልሶችዎ በሲስተሙ ተመዝግበዋል ውጤትዎም ታይቷል።</p>
              
              <div className="bg-blue-50 p-6 rounded-xl max-w-sm mx-auto border border-blue-200 mb-6">
                <p className="text-sm text-gray-500">ያገኙት ውጤት (Score)</p>
                <h3 className="text-4xl font-extrabold text-blue-800 mt-2">{score} / 100</h3>
              </div>

              <button 
                onClick={() => navigate('/student-dashboard')}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                ወደ ዳሽቦርድ ተመለስ
              </button>
            </div>
          ) : (
            /* የፈተና ጥያቄዎች ዝርዝር */
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white p-6 rounded-xl shadow">
                  <p className="font-bold text-gray-800 text-lg mb-4">
                    {index + 1}. {q.questionText}
                  </p>
                  <div className="space-y-3 pl-4">
                    {q.options.map((option, optIdx) => (
                      <label 
                        key={optIdx} 
                        className={`block p-3 rounded-lg border cursor-pointer transition ${
                          answers[q.id] === optIdx 
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`question-${q.id}`} 
                          checked={answers[q.id] === optIdx}
                          onChange={() => handleOptionChange(q.id, optIdx)}
                          className="mr-3"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                onClick={handleSubmitExam}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg text-lg"
              >
                ፈተና አስረክብ (Submit Exam)
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
