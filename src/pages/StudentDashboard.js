
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { LayoutDashboard, FileText, Calendar, Book, User, Download, Upload, Bell, TrendingUp, Award, Clock, CheckCircle, Mail, MapPin, Filter, ChevronDown } from 'lucide-react';
import styles from './StudentDashboard.module.css';

// --- DATA DEFINITIONS ---

const studentInfo = {
    name: 'Aruna',
    rollNo: '21CS045',
    branch: 'Computer Science',
    semester: '5th',
    attendance: 78,
    cgpa: 8.2,
};

// --- SOPHISTICATED MOCK DATA FOR IA MARKS (SEM 1-6) ---
// Rules:
// Theory: 3 IAs. Total IA Marks = 50 (Derived from IAs + Assignments)
// Labs: Continuous Eval + 1-2 Skill Tests. Total IA Marks = 60.

const semesterData = {
    1: {
        theory: [
            { code: '15CS11T', subject: 'Engg Mathematics-I', ia1: 18, ia2: 19, ia3: 17, assignment: 9, total: 44 },
            { code: '15CS12T', subject: 'Applied Science', ia1: 15, ia2: 16, ia3: 18, assignment: 8, total: 41 },
            { code: '15CS13T', subject: 'Concepts of Electrical', ia1: 20, ia2: 19, ia3: 20, assignment: 10, total: 49 },
            { code: '15CS14T', subject: 'Applied Electronics', ia1: 12, ia2: 14, ia3: 15, assignment: 7, total: 38 },
        ],
        labs: [
            { code: '15CS16P', subject: 'Basic Electronics Lab', skill1: 22, skill2: 24, record: 10, total: 56 }, // Example out of 60
            { code: '15CS17P', subject: 'Computer Fundamentals', skill1: 25, skill2: 23, record: 10, total: 58 },
            { code: '15CS18P', subject: 'Science Lab', skill1: 20, skill2: 21, record: 9, total: 50 },
        ]
    },
    2: {
        theory: [
            { code: '15CS21T', subject: 'Engg Mathematics-II', ia1: 16, ia2: 18, ia3: 19, assignment: 9, total: 43 },
            { code: '15CS22T', subject: 'English Comm', ia1: 19, ia2: 20, ia3: 20, assignment: 10, total: 49 },
            { code: '15CS23T', subject: 'Digital Electronics', ia1: 14, ia2: 15, ia3: 13, assignment: 8, total: 39 },
            { code: '15CS24T', subject: 'C Programming', ia1: 20, ia2: 20, ia3: 20, assignment: 10, total: 50 },
        ],
        labs: [
            { code: '15CS26P', subject: 'Multimedia Lab', skill1: 23, skill2: 24, record: 9, total: 56 },
            { code: '15CS27P', subject: 'C Programming Lab', skill1: 25, skill2: 25, record: 10, total: 60 },
        ]
    },
    3: {
        theory: [
            { code: '15CS31T', subject: 'Data Structures', ia1: 15, ia2: 16, ia3: 18, assignment: 8, total: 42 },
            { code: '15CS32T', subject: 'Computer Networks', ia1: 18, ia2: 19, ia3: 17, assignment: 9, total: 45 },
            { code: '15CS33T', subject: 'Operating Systems', ia1: 14, ia2: 15, ia3: 16, assignment: 7, total: 40 },
            { code: '15CS34T', subject: 'Java Programming', ia1: 19, ia2: 18, ia3: 20, assignment: 10, total: 48 },
        ],
        labs: [
            { code: '15CS36P', subject: 'Data Structure Lab', skill1: 24, skill2: 22, record: 9, total: 55 },
            { code: '15CS37P', subject: 'Java Lab', skill1: 25, skill2: 24, record: 10, total: 59 },
        ]
    },
    4: {
        theory: [
            { code: '15CS41T', subject: 'Software Engineering', ia1: 17, ia2: 18, ia3: 19, assignment: 9, total: 45 },
            { code: '15CS42T', subject: 'DBMS', ia1: 16, ia2: 15, ia3: 17, assignment: 8, total: 42 },
            { code: '15CS43T', subject: 'OOPs with C++', ia1: 20, ia2: 19, ia3: 20, assignment: 10, total: 49 },
            { code: '15CS44T', subject: 'Prof. Ethics', ia1: 18, ia2: 18, ia3: 18, assignment: 9, total: 45 },
        ],
        labs: [
            { code: '15CS46P', subject: 'DBMS Lab', skill1: 23, skill2: 24, record: 10, total: 57 },
            { code: '15CS47P', subject: 'C++ Lab', skill1: 22, skill2: 21, record: 9, total: 52 },
        ]
    },
    5: {
        theory: [
            // Current Semester (Matches original mock data roughly but structured)
            { code: '15CS51T', subject: 'Design & Analysis of Algo', ia1: 22, ia2: 20, ia3: 23, assignment: 10, total: 48 }, // Using ~25 scale for IAs then converting? Or raw marks? Let's assume raw IAs are out of 25.
            { code: '15CS52T', subject: 'Web Development', ia1: 18, ia2: 19, ia3: 20, assignment: 9, total: 46 },
            { code: '15CS53T', subject: 'Cloud Computing', ia1: 15, ia2: 17, ia3: 18, assignment: 8, total: 42 },
        ],
        labs: [
            { code: '15CS56P', subject: 'Web Dev Lab', skill1: 24, skill2: 25, record: 10, total: 59 },
            { code: '15CS57P', subject: 'Python Lab', skill1: 22, skill2: 23, record: 9, total: 54 },
            { code: '15CS58P', subject: 'Mini Project', skill1: 25, skill2: 25, record: 10, total: 60 }
        ]
    },
    6: {
        theory: [
            { code: '15CS61T', subject: 'Cyber Security', ia1: 0, ia2: 0, ia3: 0, assignment: 0, total: 0 }, // Future
        ],
        labs: [
            { code: '15CS66P', subject: 'Major Project', skill1: 0, skill2: 0, record: 0, total: 0 },
            { code: '15CS67P', subject: 'Internship', skill1: 0, skill2: 0, record: 0, total: 0 },
        ]
    }
};

const upcomingExams = [
    { id: 1, exam: 'IA-5', subject: 'Software Engineering', date: '15-Dec', time: '10:00 AM' },
    { id: 2, exam: 'IA-6', subject: 'Java Programming', date: '22-Dec', time: '02:00 PM' },
    { id: 3, exam: 'IA-5', subject: 'Industrial Mgmt', date: '24-Dec', time: '10:00 AM' },
];

const notifications = [
    { id: 1, message: 'New IA-5 Marks Uploaded for CAD', time: '2 hrs ago', type: 'info' },
    { id: 2, message: 'Parent Meeting Scheduled for 20th Dec', time: '1 day ago', type: 'warning' },
    { id: 3, message: 'IA-6 Submission Deadline Tomorrow', time: '2 days ago', type: 'alert' },
];



// Reusing same mock data for other tabs for simplicity or generating on fly
const attendanceData = [
    { id: 1, subject: 'Data Structures', total: 45, attended: 40, percentage: 88, status: 'Great' },
    { id: 2, subject: 'DBMS', total: 42, attended: 32, percentage: 76, status: 'Good' },
    { id: 3, subject: 'Operating Systems', total: 40, attended: 28, percentage: 70, status: 'Average' },
    { id: 4, subject: 'Computer Networks', total: 44, attended: 42, percentage: 95, status: 'Excellent' },
    { id: 5, subject: 'Web Technologies', total: 38, attended: 25, percentage: 65, status: 'Warning' },
];

const subjectsList = [
    { code: 'CS301', name: 'Data Structures', credits: 4, type: 'Core', faculty: 'Dr. Sarah Wilson' },
    { code: 'CS302', name: 'Database Management', credits: 4, type: 'Core', faculty: 'Prof. James Kumar' },
    { code: 'CS303', name: 'Operating Systems', credits: 3, type: 'Core', faculty: 'Prof. Anita Roy' },
    { code: 'CS304', name: 'Computer Networks', credits: 3, type: 'Core', faculty: 'Dr. Alan Smith' },
    { code: 'CS305', name: 'Web Technologies', credits: 3, type: 'Elective', faculty: 'Prof. Meera T' },
    { code: 'CS306', name: 'Software Engineering', credits: 3, type: 'Core', faculty: 'Dr. R. Gupta' },
];

const facultyList = [
    { id: 1, name: 'Dr. Sarah Wilson', dept: 'Computer Science', email: 'sarah.w@college.edu', cabin: 'CS-101', subjects: ['Data Structures', 'Algorithms'] },
    { id: 2, name: 'Prof. James Kumar', dept: 'Computer Science', email: 'james.k@college.edu', cabin: 'CS-105', subjects: ['DBMS', 'SQL'] },
    { id: 3, name: 'Prof. Anita Roy', dept: 'Information Science', email: 'anita.r@college.edu', cabin: 'IS-202', subjects: ['OS', 'Linux'] },
    { id: 4, name: 'Dr. Alan Smith', dept: 'Computer Science', email: 'alan.s@college.edu', cabin: 'CS-103', subjects: ['Networks', 'Security'] },
    { id: 5, name: 'Prof. Meera T', dept: 'Computer Science', email: 'meera.t@college.edu', cabin: 'CS-108', subjects: ['Web Dev', 'React'] },
];

// --- COMPONENT ---

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('Overview');
    const [toast, setToast] = useState({ show: false, message: '' });

    // Filter States
    const [selectedSemester, setSelectedSemester] = useState('5'); // Default to current
    const [selectedIA, setSelectedIA] = useState('All'); // All, IA-1, IA-2, IA-3

    const menuItems = [
        {
            label: 'Overview',
            path: '/dashboard/student',
            icon: <LayoutDashboard size={20} />,
            isActive: activeSection === 'Overview',
            onClick: () => setActiveSection('Overview')
        },
        {
            label: 'IA Marks',
            path: '/dashboard/student',
            icon: <FileText size={20} />,
            isActive: activeSection === 'IA Marks',
            onClick: () => setActiveSection('IA Marks')
        },
        {
            label: 'Attendance',
            path: '/dashboard/student',
            icon: <Calendar size={20} />,
            isActive: activeSection === 'Attendance',
            onClick: () => setActiveSection('Attendance')
        },
        {
            label: 'Subjects',
            path: '/dashboard/student',
            icon: <Book size={20} />,
            isActive: activeSection === 'Subjects',
            onClick: () => setActiveSection('Subjects')
        },
        {
            label: 'Faculty',
            path: '/dashboard/student',
            icon: <User size={20} />,
            isActive: activeSection === 'Faculty',
            onClick: () => setActiveSection('Faculty')
        },
    ];

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    // --- RENDER HELPERS ---

    const renderOverview = () => {
        // Use Semester 5 data for Overview summary
        const currentSemData = semesterData[5].theory;
        const avgScore = Math.round(currentSemData.reduce((acc, curr) => acc + curr.total, 0) / currentSemData.length);

        return (
            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>📊 Current Semester Overview (Sem 5)</h2>
                            <button className={styles.downloadBtn} onClick={() => showToast('Downloading report...')}>
                                <Download size={16} /> Export
                            </button>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>IA-1</th>
                                        <th>IA-2</th>
                                        <th>IA-3</th>
                                        <th>Total (50)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSemData.map((mark, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className={styles.subjectCell}>
                                                    <span className={styles.subjectName}>{mark.subject}</span>
                                                    <span className={styles.subjectCode}>{mark.code}</span>
                                                </div>
                                            </td>
                                            <td>{mark.ia1}</td>
                                            <td>{mark.ia2}</td>
                                            <td>{mark.ia3}</td>
                                            <td className={styles.avgCell}>{mark.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>📅 Upcoming Exams</h2>
                        <div className={styles.examsList}>
                            {upcomingExams.map(exam => (
                                <div key={exam.id} className={styles.examItem}>
                                    <div className={styles.examBadge}>{exam.exam}</div>
                                    <div className={styles.examInfo}>
                                        <span className={styles.examSubject}>{exam.subject}</span>
                                        <span className={styles.examDate}>{exam.date} at {exam.time}</span>
                                    </div>
                                    <Clock size={16} className={styles.examIcon} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>🔔 Notifications</h2>
                        <div className={styles.notificationsList}>
                            {notifications.map(notif => (
                                <div key={notif.id} className={styles.notifItem}>
                                    <div className={`${styles.notifDot} ${styles[notif.type]}`}></div>
                                    <div className={styles.notifContent}>
                                        <p className={styles.notifMessage}>{notif.message}</p>
                                        <span className={styles.notifTime}>{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        )
    };

    const renderIAMarks = () => {
        const data = semesterData[selectedSemester];

        return (
            <div className={styles.detailsContainer}>
                {/* Filters */}
                <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
                    <div className={styles.selectionRow}>
                        <div className={styles.selectionGroup}>
                            <label className={styles.selectionLabel}>Select Semester:</label>
                            <div className={styles.selectWrapper}>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className={styles.selectInput}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(sem => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </div>

                        <div className={styles.selectionGroup}>
                            <label className={styles.selectionLabel}>Select IA / Exam:</label>
                            <div className={styles.selectWrapper}>
                                <select
                                    value={selectedIA}
                                    onChange={(e) => setSelectedIA(e.target.value)}
                                    className={styles.selectInput}
                                >
                                    <option value="All">All Internals</option>
                                    <option value="IA-1">IA - 1 / Skill Test 1</option>
                                    <option value="IA-2">IA - 2 / Skill Test 2</option>
                                    <option value="IA-3">IA - 3</option>
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theory Table */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>📘 Theory Subjects</h2>
                        <div className={styles.badge} style={{ background: '#e0f2fe', color: '#0369a1' }}>
                            Max IA Marks: 50
                        </div>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    {(selectedIA === 'All' || selectedIA === 'IA-1') && <th>IA-1</th>}
                                    {(selectedIA === 'All' || selectedIA === 'IA-2') && <th>IA-2</th>}
                                    {(selectedIA === 'All' || selectedIA === 'IA-3') && <th>IA-3</th>}
                                    <th>Activities</th>
                                    <th>Total IA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.theory.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className={styles.codeText}>{item.code}</td>
                                        <td className={styles.subjectText}>{item.subject}</td>
                                        {(selectedIA === 'All' || selectedIA === 'IA-1') && <td>{item.ia1}</td>}
                                        {(selectedIA === 'All' || selectedIA === 'IA-2') && <td>{item.ia2}</td>}
                                        {(selectedIA === 'All' || selectedIA === 'IA-3') && <td>{item.ia3}</td>}
                                        <td>{item.assignment}</td>
                                        <td className={styles.totalCell}>{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lab Table */}
                <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>🔬 Lab / Practical Subjects</h2>
                        <div className={styles.badge} style={{ background: '#dcfce7', color: '#15803d' }}>
                            Max IA Marks: 60
                        </div>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Lab Code</th>
                                    <th>Lab Name</th>
                                    {(selectedIA === 'All' || selectedIA === 'IA-1') && <th>Skill Test 1</th>}
                                    {(selectedIA === 'All' || selectedIA === 'IA-2') && <th>Skill Test 2</th>}
                                    <th>Record + Viva</th>
                                    <th>Total IA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.labs.length > 0 ? data.labs.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className={styles.codeText}>{item.code}</td>
                                        <td className={styles.subjectText}>{item.subject}</td>
                                        {(selectedIA === 'All' || selectedIA === 'IA-1') && <td>{item.skill1}</td>}
                                        {(selectedIA === 'All' || selectedIA === 'IA-2') && <td>{item.skill2}</td>}
                                        <td>{item.record}</td>
                                        <td className={styles.totalCell}>{item.total}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No Labs for this semester
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderAttendance = () => (
        <div className={styles.detailsContainer}>
            <div className={styles.attendanceGrid}>
                {attendanceData.map(item => (
                    <div key={item.id} className={styles.attendanceCard}>
                        <div className={styles.attendanceHeader}>
                            <h3 className={styles.attendanceSubject}>{item.subject}</h3>
                            <span className={`${styles.badge} ${item.percentage >= 85 ? styles.excellent : item.percentage >= 75 ? styles.good : styles.needsFocus}`}>
                                {item.status}
                            </span>
                        </div>
                        <div className={styles.attendanceCircle}>
                            <span className={styles.attendancePercentage}>{item.percentage}%</span>
                            <span className={styles.attendanceLabel}>Present</span>
                        </div>
                        <div className={styles.attendanceStats}>
                            <div className={styles.attStat}>
                                <span>Total Classes</span>
                                <strong>{item.total}</strong>
                            </div>
                            <div className={styles.attStat}>
                                <span>Attended</span>
                                <strong>{item.attended}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSubjects = () => (
        <div className={styles.detailsContainer}>
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>📚 Registered Subjects</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Subject Name</th>
                                <th>Type</th>
                                <th>Credits</th>
                                <th>Faculty In-Charge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectsList.map(sub => (
                                <tr key={sub.code}>
                                    <td><span className={styles.codeBadge}>{sub.code}</span></td>
                                    <td style={{ fontWeight: 500 }}>{sub.name}</td>
                                    <td>{sub.type}</td>
                                    <td>{sub.credits}</td>
                                    <td>{sub.faculty}</td>
                                    <td>
                                        <button className={styles.actionLink} onClick={() => showToast(`Opening syllabus for ${sub.code}`)}>View Syllabus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderFaculty = () => (
        <div className={styles.detailsContainer}>
            <div className={styles.facultyGrid}>
                {facultyList.map(f => (
                    <div key={f.id} className={styles.facultyCard}>
                        <div className={styles.facultyAvatar}>
                            <User size={32} color="#4b5563" />
                        </div>
                        <div className={styles.facultyInfo}>
                            <h3 className={styles.facultyName}>{f.name}</h3>
                            <p className={styles.facultyDept}>{f.dept}</p>
                            <div className={styles.facultyMeta}>
                                <div className={styles.metaItem}>
                                    <Mail size={14} /> {f.email}
                                </div>
                                <div className={styles.metaItem}>
                                    <MapPin size={14} /> Cabin: {f.cabin}
                                </div>
                            </div>
                            <div className={styles.facultyTags}>
                                {f.subjects.map(s => (
                                    <span key={s} className={styles.tag}>{s}</span>
                                ))}
                            </div>
                            <button className={styles.msgBtn} onClick={() => showToast(`Message sent to ${f.name}`)}>
                                Send Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <DashboardLayout menuItems={menuItems}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.welcomeText}>
                        {activeSection === 'Overview' ? `Welcome, ${studentInfo.name} 👋` : activeSection}
                    </h1>
                    <p className={styles.subtitle}>{studentInfo.branch} | Semester: {studentInfo.semester} | Roll: {studentInfo.rollNo}</p>
                </div>
                <div className={styles.headerStats}>
                    <div className={styles.headerStat}>
                        <TrendingUp size={18} className={styles.statIcon} />
                        <span>CGPA: <strong>{studentInfo.cgpa}</strong></span>
                    </div>
                </div>
            </header>

            {activeSection === 'Overview' && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statCardIcon} style={{ background: '#dbeafe' }}>
                            <Award size={24} color="#2563eb" />
                        </div>
                        <div className={styles.statCardContent}>
                            <span className={styles.statCardValue}>22/25</span>
                            <span className={styles.statCardLabel}>Avg IA Score</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statCardIcon} style={{ background: '#dcfce7' }}>
                            <CheckCircle size={24} color="#16a34a" />
                        </div>
                        <div className={styles.statCardContent}>
                            <span className={styles.statCardValue}>5/6</span>
                            <span className={styles.statCardLabel}>IAs Completed</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statCardIcon} style={{ background: '#fef3c7' }}>
                            <Calendar size={24} color="#d97706" />
                        </div>
                        <div className={styles.statCardContent}>
                            <span className={styles.statCardValue}>{studentInfo.attendance}%</span>
                            <span className={styles.statCardLabel}>Attendance</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statCardIcon} style={{ background: '#fce7f3' }}>
                            <Bell size={24} color="#db2777" />
                        </div>
                        <div className={styles.statCardContent}>
                            <span className={styles.statCardValue}>{notifications.length}</span>
                            <span className={styles.statCardLabel}>Notifications</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {activeSection === 'Overview' && renderOverview()}
            {activeSection === 'IA Marks' && renderIAMarks()}
            {activeSection === 'Attendance' && renderAttendance()}
            {activeSection === 'Subjects' && renderSubjects()}
            {activeSection === 'Faculty' && renderFaculty()}

            {/* Toast */}
            {toast.show && (
                <div className={styles.toast}>
                    <CheckCircle size={18} />
                    {toast.message}
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
