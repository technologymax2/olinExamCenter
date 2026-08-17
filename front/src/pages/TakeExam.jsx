import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

import {
    useNavigate,
    useParams
} from 'react-router-dom';

import axios from 'axios';

const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

const getAuthConfig = () => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

function TakeExam() {

    const { examId } = useParams();
    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    // ==========================================
    // FETCH EXAM
    // ==========================================

    const fetchExam = useCallback(async () => {

        try {

            setLoading(true);
            setError('');

            const response = await axios.get(
                `${API_URL}/api/exams/${examId}`,
                getAuthConfig()
            );

            setExam(response.data.exam || null);

            setQuestions(
                Array.isArray(response.data.questions)
                    ? response.data.questions
                    : []
            );

            const duration =
                Number(response.data.exam?.duration) || 60;

            setTimeLeft(duration * 60);

        } catch (error) {

            console.error(
                'Exam loading error:',
                error
            );

            if (
                error.response?.status === 401
            ) {
                localStorage.clear();
                navigate('/login', {
                    replace: true
                });
                return;
            }

            setError(
                error.response?.data?.error ||
                'ፈተናውን መጫን አልተቻለም።'
            );

        } finally {
            setLoading(false);
        }

    }, [examId, navigate]);

    useEffect(() => {
        fetchExam();
    }, [fetchExam]);

    // ==========================================
    // TIMER
    // ==========================================

    useEffect(() => {

        if (
            loading ||
            submitting ||
            timeLeft <= 0
        ) {
            return;
        }

        const timer = setInterval(() => {

            setTimeLeft((previous) => {

                if (previous <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });

        }, 1000);

        return () => clearInterval(timer);

    }, [
        loading,
        submitting,
        timeLeft
    ]);

    // ==========================================
    // AUTO SUBMIT
    // ==========================================

    useEffect(() => {

        if (
            !loading &&
            timeLeft === 0 &&
            questions.length > 0 &&
            !submitting
        ) {
            handleSubmitExam(true);
        }

    }, [
        timeLeft,
        loading,
        questions.length,
        submitting
    ]);

    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formattedTime = useMemo(() => {

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;

        return `${String(minutes).padStart(2, '0')}:${String(
            seconds
        ).padStart(2, '0')}`;

    }, [timeLeft]);

    // ==========================================
    // ANSWER
    // ==========================================

    const handleOptionSelect = (
        questionId,
        option
    ) => {

        if (submitting) {
            return;
        }

        setAnswers((previous) => ({
            ...previous,
            [questionId]: option
        }));
    };

    // ==========================================
    // PROGRESS
    // ==========================================

    const answeredCount =
        Object.keys(answers).length;

    const progress =
        questions.length > 0
            ? Math.round(
                  (answeredCount /
                      questions.length) *
                      100
              )
            : 0;

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmitExam = async (
        automatic = false
    ) => {

        if (submitting) {
            return;
        }

        if (
            !automatic &&
            !window.confirm(
                'ፈተናውን አሁን ማስገባት እርግጠኛ ኖት?'
            )
        ) {
            return;
        }

        try {

            setSubmitting(true);

            const response = await axios.post(
                `${API_URL}/api/exams/${examId}/submit`,
                {
                    answers
                },
                getAuthConfig()
            );

            const result =
                response.data;

            alert(
                automatic
                    ? `የፈተናው ጊዜ አልቋል።\nውጤት: ${result.score}%`
                    : `ፈተናው በተሳካ ሁኔታ ገብቷል።\nውጤት: ${result.score}%`
            );

            navigate('/student', {
                replace: true
            });

        } catch (error) {

            console.error(
                'Submit exam error:',
                error
            );

            if (
                error.response?.status === 401
            ) {
                localStorage.clear();
                navigate('/login', {
                    replace: true
                });
                return;
            }

            alert(
                error.response?.data?.error ||
                'ፈተናውን ማስገባት አልተቻለም።'
            );

        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#123758] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-600 font-medium">
                        ፈተናውን በመጫን ላይ...
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

                <div className="bg-white max-w-md w-full rounded-2xl shadow-lg border p-8 text-center">

                    <div className="text-red-500 text-4xl">
                        !
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mt-4">
                        ስህተት
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate('/student')}
                        className="mt-6 bg-[#123758] text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        ወደ ተማሪ ገጽ ተመለስ
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50 pb-32">

            {/* HEADER */}

            <header className="sticky top-0 z-40 bg-[#123758] text-white shadow-lg">

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                                Max Technology
                            </p>

                            <h1 className="text-lg sm:text-xl font-black mt-1">
                                {exam?.title}
                            </h1>

                            <p className="text-blue-100 text-xs mt-1">
                                {exam?.subject}
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <div
                                className={`px-4 py-2 rounded-xl font-black ${
                                    timeLeft <= 60
                                        ? 'bg-red-600 animate-pulse'
                                        : 'bg-white/10'
                                }`}
                            >
                                ⏱ {formattedTime}
                            </div>

                            <button
                                onClick={() =>
                                    navigate('/student')
                                }
                                disabled={submitting}
                                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm"
                            >
                                Exit
                            </button>

                        </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-4">

                        <div className="flex justify-between text-xs text-blue-100 mb-1">

                            <span>
                                የተመለሱ
                                {' '}
                                {answeredCount}
                                {' / '}
                                {questions.length}
                            </span>

                            <span>
                                {progress}%
                            </span>

                        </div>

                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-[#d4af37] transition-all"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </header>

            {/* QUESTIONS */}

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                {questions.length === 0 ? (

                    <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">

                        <h2 className="font-bold text-gray-800">
                            ምንም ጥያቄ አልተገኘም
                        </h2>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {questions.map(
                            (question, index) => {

                                const selected =
                                    answers[
                                        question._id
                                    ];

                                const options = [
                                    {
                                        key: 'A',
                                        text: question.optionA
                                    },
                                    {
                                        key: 'B',
                                        text: question.optionB
                                    },
                                    {
                                        key: 'C',
                                        text: question.optionC
                                    },
                                    {
                                        key: 'D',
                                        text: question.optionD
                                    }
                                ].filter(
                                    (option) =>
                                        option.text
                                );

                                return (
                                    <section
                                        key={
                                            question._id ||
                                            index
                                        }
                                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7"
                                    >

                                        <div className="flex gap-3">

                                            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#123758] text-white flex items-center justify-center font-black text-sm">
                                                {index + 1}
                                            </div>

                                            <h2 className="font-bold text-gray-800 leading-relaxed pt-1">
                                                {
                                                    question.questionText
                                                }
                                            </h2>

                                        </div>

                                        <div className="mt-5 grid gap-3">

                                            {options.map(
                                                (
                                                    option
                                                ) => {

                                                    const isSelected =
                                                        selected ===
                                                        option.key;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={
                                                                option.key
                                                            }
                                                            disabled={
                                                                submitting
                                                            }
                                                            onClick={() =>
                                                                handleOptionSelect(
                                                                    question._id,
                                                                    option.key
                                                                )
                                                            }
                                                            className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition ${
                                                                isSelected
                                                                    ? 'border-[#123758] bg-blue-50'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        >

                                                            <span
                                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                                                                    isSelected
                                                                        ? 'bg-[#123758] text-white'
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {
                                                                    option.key
                                                                }
                                                            </span>

                                                            <span className="text-sm sm:text-base text-gray-700 pt-1">
                                                                {
                                                                    option.text
                                                                }
                                                            </span>

                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </section>
                                );
                            }
                        )}

                    </div>
                )}

            </main>

            {/* SUBMIT BAR */}

            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t shadow-lg">

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

                    <div className="hidden sm:block">

                        <p className="text-sm font-bold text-gray-800">
                            ፈተናውን ለማስገባት ዝግጁ ነዎት?
                        </p>

                        <p className="text-xs text-gray-500">
                            {answeredCount} / {questions.length}
                            {' '}ጥያቄዎች ተመልሰዋል።
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            handleSubmitExam(false)
                        }
                        disabled={
                            submitting ||
                            questions.length === 0
                        }
                        className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 sm:px-8 py-3 rounded-xl font-black shadow-lg transition"
                    >
                        {submitting
                            ? 'በማስገባት ላይ...'
                            : 'ፈተና አስገባ'}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default TakeExam;
