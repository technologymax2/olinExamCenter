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

function TakeExam() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);
    const [error, setError] = useState('');

    const [timeLeft, setTimeLeft] =
        useState(null);

    const getAuthHeader = useCallback(() => {
        const token =
            localStorage.getItem('token');

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };
    }, []);

    // ==========================================
    // FETCH EXAM
    // ==========================================

    useEffect(() => {
        let mounted = true;

        const fetchExam = async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await axios.get(
                        `${API_URL}/api/exams/${examId}`,
                        getAuthHeader()
                    );

                if (!mounted) return;

                setExam(response.data.exam);
                setQuestions(
                    response.data.questions || []
                );

                const duration =
                    Number(
                        response.data.exam.duration
                    );

                if (
                    Number.isFinite(duration) &&
                    duration > 0
                ) {
                    setTimeLeft(
                        duration * 60
                    );
                }
            } catch (err) {
                console.error(
                    'Fetch exam error:',
                    err
                );

                if (
                    err.response?.status === 401
                ) {
                    localStorage.clear();
                    navigate('/login', {
                        replace: true
                    });
                    return;
                }

                setError(
                    err.response?.data?.error ||
                    'ፈተናውን መጫን አልተቻለም።'
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchExam();

        return () => {
            mounted = false;
        };
    }, [
        examId,
        getAuthHeader,
        navigate
    ]);

    // ==========================================
    // TIMER
    // ==========================================

    const submitExam = useCallback(
        async (autoSubmit = false) => {
            if (submitting) return;

            if (!autoSubmit) {
                const confirmed =
                    window.confirm(
                        'ፈተናውን ማስገባት እርግጠኛ ኖት?'
                    );

                if (!confirmed) return;
            }

            try {
                setSubmitting(true);

                const response =
                    await axios.post(
                        `${API_URL}/api/exams/${examId}/submit`,
                        {
                            answers
                        },
                        getAuthHeader()
                    );

                const result =
                    response.data;

                alert(
                    autoSubmit
                        ? `ጊዜው አልቋል።\nውጤትዎ: ${result.score}%`
                        : `ፈተናው በተሳካ ሁኔታ ገብቷል!\nውጤትዎ: ${result.score}%`
                );

                navigate('/student', {
                    replace: true
                });
            } catch (err) {
                console.error(
                    'Submit exam error:',
                    err
                );

                if (
                    err.response?.status === 401
                ) {
                    localStorage.clear();

                    navigate('/login', {
                        replace: true
                    });

                    return;
                }

                alert(
                    err.response?.data?.error ||
                    'ፈተናውን ማስገባት አልተቻለም።'
                );

                setSubmitting(false);
            }
        },
        [
            submitting,
            answers,
            examId,
            getAuthHeader,
            navigate
        ]
    );

    useEffect(() => {
        if (
            timeLeft === null ||
            submitting
        ) {
            return;
        }

        if (timeLeft <= 0) {
            submitExam(true);
            return;
        }

        const timer =
            setInterval(() => {
                setTimeLeft(
                    (previous) =>
                        previous - 1
                );
            }, 1000);

        return () =>
            clearInterval(timer);
    }, [
        timeLeft,
        submitting,
        submitExam
    ]);

    // ==========================================
    // ANSWER
    // ==========================================

    const handleOptionSelect = (
        questionId,
        optionKey
    ) => {
        setAnswers(
            (previous) => ({
                ...previous,
                [questionId]:
                    optionKey
            })
        );
    };

    // ==========================================
    // HELPERS
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

    const current =
        questions[currentQuestion];

    const formattedTime = useMemo(() => {
        if (timeLeft === null) {
            return '--:--';
        }

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;

        return `${String(minutes).padStart(
            2,
            '0'
        )}:${String(seconds).padStart(
            2,
            '0'
        )}`;
    }, [timeLeft]);

    const timerDanger =
        timeLeft !== null &&
        timeLeft <= 60;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center max-w-sm w-full">
                    <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-slate-200 border-t-[#123758] animate-spin" />

                    <h2 className="text-lg font-bold text-[#123758]">
                        ፈተናውን በመጫን ላይ...
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        እባክዎ ትንሽ ይጠብቁ።
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center max-w-lg w-full">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl">
                        !
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mt-5">
                        ስህተት ተፈጥሯል
                    </h2>

                    <p className="text-slate-600 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                '/student'
                            )
                        }
                        className="mt-6 px-5 py-3 rounded-xl bg-[#123758] text-white font-semibold hover:bg-[#0d2942] transition"
                    >
                        ወደ Student Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // NO QUESTIONS
    // ==========================================

    if (!questions.length) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center max-w-lg w-full">
                    <h2 className="text-xl font-bold text-[#123758]">
                        ጥያቄ አልተገኘም
                    </h2>

                    <p className="text-slate-500 mt-2">
                        ለዚህ ፈተና ጥያቄዎች
                        አልተዘጋጁም።
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                '/student'
                            )
                        }
                        className="mt-6 px-5 py-3 rounded-xl bg-[#123758] text-white font-semibold"
                    >
                        ተመለስ
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* HEADER */}
            <header className="sticky top-0 z-40 bg-[#123758] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-[#123758] flex items-center justify-center font-black">
                                    M
                                </div>

                                <div>
                                    <h1 className="font-extrabold text-lg">
                                        {exam?.title}
                                    </h1>

                                    <p className="text-xs text-slate-300">
                                        {exam?.subject}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className={`px-4 py-2 rounded-xl font-mono font-bold border ${
                                    timerDanger
                                        ? 'bg-red-500/20 border-red-300 text-red-200'
                                        : 'bg-white/10 border-white/20 text-white'
                                }`}
                            >
                                ⏱ {formattedTime}
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        '/student'
                                    )
                                }
                                disabled={
                                    submitting
                                }
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold transition"
                            >
                                Exit
                            </button>
                        </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-300 mb-2">
                            <span>
                                የተመለሱ:
                                {' '}
                                {answeredCount}
                                /
                                {questions.length}
                            </span>

                            <span>
                                {progress}%
                            </span>
                        </div>

                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#d4af37] transition-all duration-300"
                                style={{
                                    width:
                                        `${progress}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    {/* QUESTION */}
                    <section>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 sm:p-7">
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <span className="text-sm font-bold text-[#123758]">
                                        ጥያቄ{' '}
                                        {currentQuestion +
                                            1}{' '}
                                        /{' '}
                                        {questions.length}
                                    </span>

                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {current &&
                                        answers[
                                            current._id
                                        ]
                                            ? 'Answered'
                                            : 'Not answered'}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-900">
                                    {current?.questionText}
                                </h2>

                                <div className="mt-7 space-y-3">
                                    {[
                                        'A',
                                        'B',
                                        'C',
                                        'D'
                                    ].map(
                                        (
                                            option
                                        ) => {
                                            const text =
                                                current?.[
                                                    `option${option}`
                                                ];

                                            if (
                                                !text
                                            ) {
                                                return null;
                                            }

                                            const selected =
                                                answers[
                                                    current._id
                                                ] ===
                                                option;

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        option
                                                    }
                                                    onClick={() =>
                                                        handleOptionSelect(
                                                            current._id,
                                                            option
                                                        )
                                                    }
                                                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                                                        selected
                                                            ? 'border-[#123758] bg-blue-50 shadow-sm'
                                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold ${
                                                            selected
                                                                ? 'bg-[#123758] text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {
                                                            option
                                                        }
                                                    </span>

                                                    <span
                                                        className={`text-sm sm:text-base ${
                                                            selected
                                                                ? 'font-semibold text-[#123758]'
                                                                : 'text-slate-700'
                                                        }`}
                                                    >
                                                        {
                                                            text
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* NAVIGATION */}
                            <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3">
                                <button
                                    disabled={
                                        currentQuestion ===
                                        0
                                    }
                                    onClick={() =>
                                        setCurrentQuestion(
                                            (
                                                previous
                                            ) =>
                                                Math.max(
                                                    0,
                                                    previous -
                                                        1
                                                )
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-sm disabled:opacity-40 hover:bg-slate-100 transition"
                                >
                                    ← Previous
                                </button>

                                {currentQuestion <
                                questions.length -
                                    1 ? (
                                    <button
                                        onClick={() =>
                                            setCurrentQuestion(
                                                (
                                                    previous
                                                ) =>
                                                    Math.min(
                                                        questions.length -
                                                            1,
                                                        previous +
                                                            1
                                                    )
                                            )
                                        }
                                        className="px-5 py-2.5 rounded-xl bg-[#123758] text-white font-semibold text-sm hover:bg-[#0d2942] transition"
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            submitExam(
                                                false
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 transition"
                                    >
                                        {submitting
                                            ? 'Submitting...'
                                            : 'Submit Exam ✓'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* QUESTION NAVIGATOR */}
                    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-fit lg:sticky lg:top-28">
                        <h3 className="font-bold text-[#123758]">
                            የጥያቄ ዝርዝር
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            ጥያቄ ለመቀየር ይጫኑ።
                        </p>

                        <div className="grid grid-cols-5 gap-2 mt-5">
                            {questions.map(
                                (
                                    question,
                                    index
                                ) => {
                                    const answered =
                                        Boolean(
                                            answers[
                                                question._id
                                            ]
                                        );

                                    const active =
                                        index ===
                                        currentQuestion;

                                    return (
                                        <button
                                            key={
                                                question._id
                                            }
                                            onClick={() =>
                                                setCurrentQuestion(
                                                    index
                                                )
                                            }
                                            className={`h-10 rounded-lg text-xs font-bold transition ${
                                                active
                                                    ? 'bg-[#123758] text-white ring-2 ring-[#d4af37]'
                                                    : answered
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {index +
                                                1}
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <div className="mt-6 space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-[#123758]" />
                                Current
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-emerald-100" />
                                Answered
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-slate-100" />
                                Not answered
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                submitExam(
                                    false
                                )
                            }
                            disabled={
                                submitting
                            }
                            className="w-full mt-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50"
                        >
                            {submitting
                                ? 'በማስገባት ላይ...'
                                : 'ፈተና አስገባ'}
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default TakeExam;
