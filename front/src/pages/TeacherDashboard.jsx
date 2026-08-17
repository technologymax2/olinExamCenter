import React, {
    useCallback,
    useEffect,
    useState
} from 'react';
import axios from 'axios';

const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://olinexamcenter.onrender.com';

function TeacherDashboard() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [openModal, setOpenModal] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    const [contents, setContents] =
        useState([]);

    const [contentForm, setContentForm] =
        useState({
            title: '',
            description: '',
            type: 'homework'
        });

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
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        window.location.href = '/login';
    };

    // ==========================================
    // AUTH ERROR
    // ==========================================

    const handleAuthError = (
        status
    ) => {
        if (
            status === 401 ||
            status === 403
        ) {
            localStorage.clear();
            window.location.href =
                '/login';

            return true;
        }

        return false;
    };

    // ==========================================
    // FETCH CONTENT
    // ==========================================

    const fetchContents = useCallback(
        async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await axios.get(
                        `${API_URL}/api/contents`,
                        getAuthHeader()
                    );

                setContents(
                    response.data || []
                );
            } catch (err) {
                console.error(
                    'Content loading error:',
                    err
                );

                if (
                    handleAuthError(
                        err.response?.status
                    )
                ) {
                    return;
                }

                setError(
                    err.response?.data?.error ||
                    'መረጃዎችን መጫን አልተቻለም።'
                );
            } finally {
                setLoading(false);
            }
        },
        [
            getAuthHeader
        ]
    );

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    // ==========================================
    // FORM
    // ==========================================

    const updateForm = (
        field,
        value
    ) => {
        setContentForm(
            (previous) => ({
                ...previous,
                [field]: value
            })
        );
    };

    const resetForm = () => {
        setContentForm({
            title: '',
            description: '',
            type: 'homework'
        });
    };

    // ==========================================
    // SUBMIT CONTENT
    // ==========================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (
            !contentForm.title.trim() ||
            !contentForm.description.trim()
        ) {
            alert(
                'እባክዎ ርዕስ እና መግለጫ ይሙሉ።'
            );

            return;
        }

        try {
            setSubmitting(true);

            await axios.post(
                `${API_URL}/api/contents`,
                {
                    title:
                        contentForm.title.trim(),
                    description:
                        contentForm.description.trim(),
                    type:
                        contentForm.type
                },
                getAuthHeader()
            );

            alert(
                'መረጃው በተሳካ ሁኔታ ተለቋል!'
            );

            resetForm();
            setOpenModal(false);

            await fetchContents();
        } catch (err) {
            console.error(
                'Posting content:',
                err
            );

            if (
                handleAuthError(
                    err.response?.status
                )
            ) {
                return;
            }

            alert(
                err.response?.data?.error ||
                'መረጃውን መላክ አልተቻለም።'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    const getTypeLabel = (
        type
    ) => {
        switch (type) {
            case 'homework':
                return 'የቤት ስራ';

            case 'assignment':
                return 'አሳይንመንት';

            case 'message':
                return 'የወላጅ መልዕክት';

            default:
                return 'አጠቃላይ';
        }
    };

    // ==========================================
    // DATE
    // ==========================================

    const formatDate = (
        date
    ) => {
        if (!date) return '-';

        return new Date(
            date
        ).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* MOBILE HEADER */}
            <header className="md:hidden sticky top-0 z-40 bg-[#123758] text-white shadow-lg">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() =>
                            setSidebarOpen(
                                true
                            )
                        }
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    <div className="text-center">
                        <div className="font-extrabold text-[#d4af37]">
                            Max Technology
                        </div>

                        <div className="text-[10px] text-slate-300">
                            TEACHER PORTAL
                        </div>
                    </div>

                    <button
                        onClick={
                            handleLogout
                        }
                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-bold"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72 bg-[#123758] text-white
                    flex flex-col
                    transform transition-transform duration-300
                    md:translate-x-0
                    ${
                        sidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }
                    md:sticky md:top-0
                    md:h-screen
                `}
            >
                {/* BRAND */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xl font-black text-[#d4af37]">
                                Max Technology
                            </div>

                            <div className="text-xs text-slate-300 mt-1">
                                Teacher Management Portal
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                            className="md:hidden text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="p-4 space-y-2 flex-1">
                    <a
                        href="#dashboard"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-[#d4af37] font-bold"
                    >
                        <span>⌂</span>
                        <span>
                            ዳሽቦርድ
                        </span>
                    </a>

                    <a
                        href="#content"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <span>▤</span>
                        <span>
                            የቤት ስራ / አሳይንመንት
                        </span>
                    </a>

                    <a
                        href="#messages"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <span>✉</span>
                        <span>
                            መልዕክቶች
                        </span>
                    </a>
                </nav>

                {/* SIDEBAR FOOTER */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={
                            handleLogout
                        }
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
                    >
                        Logout
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        © 2026 Max Technology
                    </p>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    onClick={() =>
                        setSidebarOpen(
                            false
                        )
                    }
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                />
            )}

            {/* PAGE */}
            <div className="md:ml-0">
                <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {/* HEADER */}
                    <section
                        id="dashboard"
                        className="mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">
                                    Teacher Portal
                                </p>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123758] mt-1">
                                    እንኳን ደህና መጡ, መምህር!
                                </h1>

                                <p className="text-slate-500 mt-2 max-w-2xl">
                                    ለተማሪዎች እና
                                    ለወላጆች የቤት
                                    ስራዎችን፣
                                    አሳይንመንቶችን
                                    እና መልዕክቶችን
                                    ያስተዳድሩ።
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setOpenModal(
                                        true
                                    )
                                }
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#123758] hover:bg-[#0d2942] text-white font-bold shadow-lg transition"
                            >
                                <span className="text-[#d4af37] text-xl">
                                    +
                                </span>

                                አዲስ መረጃ
                            </button>
                        </div>
                    </section>

                    {/* STATS */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Total Posts
                            </p>

                            <p className="text-3xl font-black text-[#123758] mt-2">
                                {
                                    contents.length
                                }
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Homework
                            </p>

                            <p className="text-3xl font-black text-[#123758] mt-2">
                                {
                                    contents.filter(
                                        (item) =>
                                            item.type ===
                                            'homework'
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Assignments
                            </p>

                            <p className="text-3xl font-black text-[#123758] mt-2">
                                {
                                    contents.filter(
                                        (item) =>
                                            item.type ===
                                            'assignment'
                                    ).length
                                }
                            </p>
                        </div>
                    </section>

                    {/* QUICK ACTION */}
                    <section
                        id="content"
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black text-[#123758]">
                                    ፈጣን ማስተካከያ
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    ለተማሪዎች አዲስ
                                    መረጃ ይለቁ።
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setOpenModal(
                                        true
                                    )
                                }
                                className="px-5 py-3 rounded-xl bg-[#123758] text-white font-bold hover:bg-[#0d2942] transition"
                            >
                                + አዲስ ልጥፍ
                            </button>
                        </div>
                    </section>

                    {/* RECENT CONTENT */}
                    <section
                        id="messages"
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                        <div className="p-5 sm:p-6 border-b border-slate-200">
                            <h2 className="text-lg font-black text-[#123758]">
                                የቅርብ ጊዜ መረጃዎች
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                በቅርብ ጊዜ
                                የተለቀቁ
                                መረጃዎች።
                            </p>
                        </div>

                        <div className="p-5 sm:p-6">
                            {loading ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto h-10 w-10 rounded-full border-4 border-slate-200 border-t-[#123758] animate-spin" />

                                    <p className="mt-4 text-sm text-slate-500">
                                        መረጃዎችን
                                        በመጫን ላይ...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-5 rounded-xl bg-red-50 text-red-700 border border-red-100">
                                    {error}
                                </div>
                            ) : contents.length ===
                              0 ? (
                                <div className="py-12 text-center">
                                    <div className="text-4xl">
                                        📭
                                    </div>

                                    <h3 className="font-bold text-slate-800 mt-3">
                                        ምንም መረጃ የለም
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        የመጀመሪያውን
                                        ልጥፍ ይፍጠሩ።
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {contents.map(
                                        (
                                            content
                                        ) => (
                                            <article
                                                key={
                                                    content._id
                                                }
                                                className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div>
                                                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-[#123758] text-xs font-bold">
                                                            {getTypeLabel(
                                                                content.type
                                                            )}
                                                        </span>

                                                        <h3 className="text-lg font-black text-slate-900 mt-3">
                                                            {
                                                                content.title
                                                            }
                                                        </h3>
                                                    </div>

                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(
                                                            content.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-slate-600 mt-3 leading-6 whitespace-pre-wrap">
                                                    {
                                                        content.description
                                                    }
                                                </p>

                                                {content.author?.name && (
                                                    <p className="text-xs text-slate-400 mt-4">
                                                        Posted by{' '}
                                                        {
                                                            content.author.name
                                                        }
                                                    </p>
                                                )}
                                            </article>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="bg-[#123758] text-white p-5 sm:p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black">
                                    አዲስ መረጃ ይለቁ
                                </h2>

                                <p className="text-xs text-slate-300 mt-1">
                                    Homework,
                                    assignment
                                    ወይም message
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setOpenModal(
                                        false
                                    )
                                }
                                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="p-5 sm:p-6 space-y-5"
                        >
                            {/* TYPE */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    የይዘቱ ዓይነት
                                </label>

                                <select
                                    value={
                                        contentForm.type
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            'type',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#123758]"
                                >
                                    <option value="homework">
                                        የቤት ስራ
                                    </option>

                                    <option value="assignment">
                                        አሳይንመንት
                                    </option>

                                    <option value="message">
                                        የወላጅ መልዕክት
                                    </option>

                                    <option value="general">
                                        አጠቃላይ
                                    </option>
                                </select>
                            </div>

                            {/* TITLE */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    ርዕስ
                                </label>

                                <input
                                    type="text"
                                    value={
                                        contentForm.title
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            'title',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="የመረጃውን ርዕስ ያስገቡ"
                                    maxLength={150}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#123758]"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    መግለጫ
                                </label>

                                <textarea
                                    rows={6}
                                    value={
                                        contentForm.description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            'description',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="ዝርዝር መረጃ ይጻፉ..."
                                    maxLength={5000}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#123758]"
                                />

                                <p className="text-right text-xs text-slate-400 mt-1">
                                    {
                                        contentForm
                                            .description
                                            .length
                                    }{' '}
                                    / 5000
                                </p>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setOpenModal(
                                            false
                                        );
                                    }}
                                    disabled={
                                        submitting
                                    }
                                    className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition disabled:opacity-50"
                                >
                                    ይቅር
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="px-6 py-3 rounded-xl bg-[#123758] hover:bg-[#0d2942] text-white font-bold transition disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'በመላክ ላይ...'
                                        : 'ለቀቅ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;
