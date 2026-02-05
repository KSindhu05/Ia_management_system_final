import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import styles from './PrincipalDashboard.module.css';
import {
    LayoutDashboard, Users, GraduationCap, FileText, TrendingUp,
    ShieldCheck, Calendar, BarChart2, Search, Award,
    Bell, Activity, Zap, Clock, AlertTriangle, Briefcase
} from 'lucide-react';
import {
    principalStats, hodSubmissionStatus,
    academicTrends, deptRankings, attendanceCorrelation, collegeStats,
    heatmapData, studentsList, departments, getStudentsByDept,
    aiInsights, liveTickerData, facultyClassAnalytics, principalSchedule,
    principalFacultyList, principalTimetables, principalCirculars, principalReports, principalGrievances
} from '../utils/mockData';
import {
    Line, Scatter, Doughnut
} from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { X, Download, Save, Plus, CheckCircle, Info } from 'lucide-react';

/* --- HELPER COMPONENTS (Toast & Modal) --- */
const ToastNotification = ({ show, msg, type }) => {
    if (!show) return null;
    const color = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';
    const bg = type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#dbeafe';
    return (
        <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem', background: 'white',
            padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}`, zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ padding: '0.25rem', borderRadius: '50%', background: bg, color: color }}>
                {type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <p style={{ margin: 0, fontWeight: 500, color: '#334155' }}>{msg}</p>
        </div>
    );
};

const SimpleModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '90%', maxWidth: '500px',
                padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'fadeIn 0.2s'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, ArcElement
);

/* Sub-Components extracted for performance */

const StudentSentinel = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 1) {
            const matches = studentsList.filter(s =>
                s.name.toLowerCase().includes(val.toLowerCase()) ||
                s.regNo.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5);
            setResults(matches);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    return (
        <div className={styles.sentinelContainer}>
            <div style={{ position: 'relative' }}>
                <Search className={styles.searchIcon} size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                    type="text"
                    className={styles.searchBarInput}
                    placeholder="Search Student..."
                    value={query}
                    onChange={handleSearch}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
            </div>
            {showResults && results.length > 0 && (
                <div className={styles.searchResultDropdown}>
                    {results.map(student => (
                        <div key={student.id} className={styles.resultItem} onClick={() => alert(`Opening Profile: ${student.name}`)}>
                            <div className={styles.resultAvatar}>{student.name.charAt(0)}</div>
                            <div className={styles.resultInfo}>
                                <h4>{student.name}</h4>
                                <p>{student.regNo} | {student.department}</p>
                            </div>
                            <span className={styles.riskBadge}>View</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DirectorySection = ({ selectedDept, deptStudents, handleDeptClick, setSelectedDept, setSelectedStudentProfile }) => {
    const [semester, setSemester] = useState('2nd');
    const [section, setSection] = useState('A');

    // Helper to generate random students for other semesters
    const generateRandomStudents = (count, sem, sec) => {
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Neerav', 'Rohan', 'Aryan', 'Dhruv', 'Kabir', 'Riyan', 'Ananya', 'Diya', 'Sana', 'Aaradhya', 'Kiara', 'Pari', 'Anika', 'Myra', 'Riya', 'Anya', 'Ahana', 'Kyra'];
        const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bhat', 'Saxena', 'Mehta', 'Joshi', 'Singh', 'Kumar', 'Reddy', 'Patel', 'Das', 'Roy', 'Nair', 'Rao', 'Iyer', 'Menon', 'Gowda', 'Shetty'];

        return Array.from({ length: count }, (_, i) => ({
            id: `RND${sem}${sec}${i}`,
            rollNo: `459CS${25 - (parseInt(sem) || 1)}0${String(i + 1).padStart(2, '0')}`,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            sem: sem,
            section: sec,
            attendance: Math.floor(Math.random() * 30) + 70,
            marks: {
                ia1: Math.floor(Math.random() * 20),
                ia2: Math.floor(Math.random() * 20)
            }
        }));
    };

    // Derived State: Filtered Students
    let filteredStudents = [];
    if (semester === '2nd') {
        // Use Real/Mock Data for 2nd Sem, filtered by Section if applicable
        // Note: Our mock data currently defaults to mostly 'A', so 'B' might be empty unless we relax it.
        // For the purpose of "don't change anything", we assume the user wants THAT list.
        // But if they select 'B' and that list defines them as 'A', it should show empty or we should just show the list ignoring section?
        // The user said "already 2nd sem students data there dont change anything", implies keeping that list intact.
        // However, "in section A and B section display" implies filtering.
        // Let's filter strict. If 2nd Sem dataset has 'Section A' and user picks 'B', it shows 0, which is correct behavior.
        filteredStudents = deptStudents.filter(s => s.section === section);
    } else {
        // Generate Random Data
        filteredStudents = generateRandomStudents(60, semester, section);
    }

    if (!selectedDept) {
        return (
            <div className={styles.sectionVisible}>
                <h3 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Select Department</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {departments.map(dept => (
                        <div
                            key={dept.id}
                            className={styles.glassCard}
                            onClick={() => handleDeptClick(dept)}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                borderLeft: `4px solid ${dept.id === 'CS' ? '#3b82f6' : dept.id === 'ME' ? '#f59e0b' : '#10b981'}`
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>{dept.name}</h4>
                                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{dept.id}</span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                <p>HOD: {dept.hod}</p>
                                <p>Total Students: {120}</p>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.9rem' }}>View Students →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sectionVisible}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setSelectedDept(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                >← Back</button>

                <div style={{ marginRight: 'auto' }}>
                    <h3 className={styles.chartTitle} style={{ marginBottom: 0 }}>{selectedDept.name} Students</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Total Records: {filteredStudents.length}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    >
                        {['1st', '2nd', '3rd', '4th', '5th'].map(sem => (
                            <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                    </select>

                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Sem</th>
                            <th>Section</th>
                            <th>Attendance</th>
                            <th>IA Performance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id} onClick={() => setSelectedStudentProfile(student)} style={{ cursor: 'pointer' }}>
                                    <td>{student.rollNo}</td>
                                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                                    <td>{student.sem}</td>
                                    <td>{student.section}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem',
                                            background: student.attendance >= 75 ? '#dcfce7' : '#fee2e2',
                                            color: student.attendance >= 75 ? '#166534' : '#991b1b'
                                        }}>
                                            {student.attendance}%
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${(student.marks.ia1 + student.marks.ia2) / 40 * 100}%`,
                                                height: '100%',
                                                background: '#3b82f6'
                                            }}></div>
                                        </div>
                                    </td>
                                    <td>
                                        <button className={styles.secondaryBtn} onClick={(e) => { e.stopPropagation(); setSelectedStudentProfile(student); }}>
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                    No students found for {semester} Sem - Section {section}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StudentProfileModal = ({ selectedStudentProfile, setSelectedStudentProfile, selectedDept }) => {
    if (!selectedStudentProfile) return null;
    const s = selectedStudentProfile;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }} onClick={() => setSelectedStudentProfile(null)}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '90%', maxWidth: '600px',
                padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => setSelectedStudentProfile(null)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <X size={24} color="#64748b" />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px', height: '80px', background: '#e0f2fe', color: '#0369a1',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem'
                    }}>
                        {s.name.charAt(0)}
                    </div>
                    <h2 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>{s.name}</h2>
                    <p style={{ margin: 0, color: '#64748b' }}>{s.rollNo} | {selectedDept?.name} | {s.sem} Sem</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className={styles.glassCard} style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.9rem' }}>Academic Performance</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>IA-1</span>
                            <span>{s.marks.ia1}/20</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>IA-2</span>
                            <span>{s.marks.ia2}/20</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                            <span>Total</span>
                            <span>{s.marks.ia1 + s.marks.ia2}/40</span>
                        </div>
                    </div>
                    <div className={styles.glassCard} style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.9rem' }}>Attendance & Behavior</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span>Attendance</span>
                                <span style={{ fontWeight: 'bold', color: s.attendance < 75 ? '#dc2626' : '#16a34a' }}>{s.attendance}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                <div style={{ width: `${s.attendance}%`, height: '100%', background: s.attendance < 75 ? '#dc2626' : '#16a34a', borderRadius: '3px' }}></div>
                            </div>
                        </div>
                        <div>
                            <span style={{ padding: '4px 8px', background: '#f0f9ff', color: '#0284c7', borderRadius: '4px', fontSize: '0.8rem' }}>Good Conduct</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.primaryBtn} onClick={() => alert('Report Generated')}>Download Report Card</button>
                    <button className={styles.secondaryBtn} onClick={() => alert('Contacting Parents...')}>Contact Parent</button>
                </div>
            </div>
        </div>
    );
};

const ActionCenter = () => (
    <div className={styles.glassCard} style={{ marginTop: '2rem' }}>
        <h3 className={styles.chartTitle} style={{ marginBottom: '1rem' }}>Principal Action Center</h3>
        <div className={styles.quickActionsGrid}>
            <button className={styles.actionBtn} onClick={() => alert('Approval Request Sent to HODs')}>
                <ShieldCheck size={20} color="#2563eb" />
                <span>Approve Pending IAs</span>
            </button>
            <button className={styles.actionBtn} onClick={() => alert('Report Generated & Downloaded as PDF')}>
                <FileText size={20} color="#059669" />
                <span>Download Monthly Report</span>
            </button>
            <button className={styles.actionBtn} onClick={() => alert('Circular Broadcasted to All Faculty')}>
                <Users size={20} color="#7c3aed" />
                <span>Broadcast Circular</span>
            </button>
            <button className={styles.actionBtn} onClick={() => alert('Meeting Scheduled with HODs')}>
                <Calendar size={20} color="#ca8a04" />
                <span>Schedule HOD Meeting</span>
            </button>
        </div>
    </div>
);

const ComplianceSection = () => {
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedDeptDetails, setSelectedDeptDetails] = useState(null);

    const filteredData = hodSubmissionStatus.filter(item => {
        if (filter === 'All') return true;
        if (filter === 'Delayed') return item.punctuality === 'Delayed';
        return item.status === filter;
    });

    const summary = {
        total: hodSubmissionStatus.length,
        approved: hodSubmissionStatus.filter(i => i.status === 'Approved').length,
        pending: hodSubmissionStatus.filter(i => i.status === 'Pending').length,
        delayed: hodSubmissionStatus.filter(i => i.punctuality === 'Delayed').length
    };

    const handleViewDetails = (item) => {
        setSelectedDeptDetails(item);
        setShowModal(true);
    };

    return (
        <div className={styles.tableCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 className={styles.chartTitle} style={{ margin: 0 }}>HOD IA Submission Monitor</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['All', 'Approved', 'Pending', 'Delayed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                background: filter === f ? '#3b82f6' : '#f1f5f9', color: filter === f ? 'white' : '#64748b', transition: 'all 0.2s'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className={styles.table} style={{ minWidth: '1000px' }}>
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>HOD Name</th>
                            <th>Status</th>
                            <th>Punctuality</th>
                            <th>Date</th>
                            <th>Delay</th>
                            <th>Comp %</th>
                            <th>Priority</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontWeight: 600 }}>{item.dept}</td>
                                <td>{item.hod}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${item.status === 'Approved' ? styles.statusApproved : item.status === 'Submitted' ? styles.statusSubmitted : styles.statusPending}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: item.punctuality === 'Delayed' ? '#ef4444' : '#16a34a', fontWeight: 600 }}>
                                            {item.punctuality}
                                        </span>
                                        {item.punctuality === 'Delayed' && (
                                            <div title="Auto-Reminder Sent">
                                                <Bell size={14} color="#f59e0b" fill="#f59e0b" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>{item.submissionDate}</td>
                                <td>
                                    {item.delayDays > 0 ? (
                                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{item.delayDays} days</span>
                                    ) : (
                                        <span style={{ color: '#94a3b8' }}>-</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                            <div style={{ width: `${item.completion}%`, height: '100%', background: determineColor(item.completion), borderRadius: '3px' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem' }}>{item.completion}%</span>
                                    </div>
                                </td>
                                <td>
                                    {item.priority === 'High Priority' ? (
                                        <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #fecaca' }}>
                                            High
                                        </span>
                                    ) : (
                                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Normal</span>
                                    )}
                                </td>
                                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.remarks}</td>
                                <td>
                                    <button
                                        style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600, color: '#334155' }}>Total: {summary.total}</div>
                <div style={{ fontWeight: 600, color: '#16a34a' }}>Approved: {summary.approved}</div>
                <div style={{ fontWeight: 600, color: '#f59e0b' }}>Pending: {summary.pending}</div>
                <div style={{ fontWeight: 600, color: '#ef4444' }}>Delayed: {summary.delayed}</div>
            </div>

            {/* Simple Detail Modal */}
            {showModal && selectedDeptDetails && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
                }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', minWidth: '400px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0 }}>{selectedDeptDetails.dept} Details</h3>
                        <p><strong>HOD:</strong> {selectedDeptDetails.hod}</p>
                        <p><strong>Status:</strong> {selectedDeptDetails.status}</p>
                        <p><strong>Remarks:</strong> {selectedDeptDetails.remarks}</p>
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} className={styles.primaryBtn}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for color
const determineColor = (val) => {
    if (val >= 90) return '#16a34a';
    if (val >= 50) return '#f59e0b';
    return '#ef4444';
};



const FacultyPerformanceWidget = () => (
    <div className={styles.glassCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 className={styles.chartTitle} style={{ margin: 0 }}>Faculty Performance Overview</h3>
            <Briefcase size={20} color="#6366f1" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>{facultyClassAnalytics.avgScore}%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Avg Class Score</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>{facultyClassAnalytics.passRate}%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pass Rate</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>{facultyClassAnalytics.evaluated}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Evaluated Copies</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>{facultyClassAnalytics.pending}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending Reviews</div>
            </div>
        </div>
    </div>
);

const ScheduleWidget = () => (
    <div className={styles.glassCard} style={{ background: 'linear-gradient(to bottom right, #fff, #fefce8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Calendar size={20} color="#ca8a04" />
            <h3 className={styles.chartTitle} style={{ margin: 0 }}>Today's Schedule</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {principalSchedule.map((item) => (
                <div key={item.id} style={{
                    display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '0.75rem 1rem', borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: item.type === 'Urgent' ? '3px solid #ef4444' : '3px solid #3b82f6'
                }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>{item.time}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.type}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ConfidenceScoreWidget = ({ headings }) => (
    <div className={styles.glassCard} style={{ padding: '1.5rem' }}>
        <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#f59e0b" /> Department Confidence Score
        </h3>
        <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#64748b' }}>Department</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem', color: '#64748b' }}>Score</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem', color: '#64748b' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {collegeStats.branches.map((dept, index) => {
                    const performance = collegeStats.branchPerformance[index];
                    const compliance = hodSubmissionStatus.find(h => h.id === dept)?.status === 'Approved' ? 100 : 50;
                    const confidence = Math.round((performance * 0.6) + (compliance * 0.4));
                    const color = confidence > 80 ? '#10b981' : confidence > 60 ? '#f59e0b' : '#ef4444';
                    const bg = confidence > 80 ? '#dcfce7' : confidence > 60 ? '#fef3c7' : '#fee2e2';

                    return (
                        <tr key={dept} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#334155' }}>{dept}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 'bold', color: color }}>
                                {confidence}/100
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                <span style={{ background: bg, color: color, padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {confidence > 80 ? 'Excellent' : confidence > 60 ? 'Good' : 'Low'}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const FocusListWidget = () => {
    const criticalDepts = collegeStats.branches
        .map((dept, i) => ({
            name: dept,
            score: collegeStats.branchPerformance[i],
            status: hodSubmissionStatus.find(h => h.id === dept)?.punctuality
        }))
        .filter(d => d.score < 70 || d.status === 'Delayed');

    return (
        <div className={styles.glassCard} style={{ background: '#fff' }}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <AlertTriangle size={20} /> Principal's Focus List
            </h3>
            <table className={styles.table} style={{ width: '100%' }}>
                <thead>
                    <tr style={{ background: '#fef2f2' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: '#b91c1c' }}>Department</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right', color: '#b91c1c' }}>Issue</th>
                    </tr>
                </thead>
                <tbody>
                    {criticalDepts.length > 0 ? criticalDepts.map((d, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #fecaca' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#7f1d1d' }}>{d.name}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>
                                {d.score < 70 && <span style={{ display: 'block', color: '#ef4444' }}>Low Performance ({d.score}%)</span>}
                                {d.status === 'Delayed' && <span style={{ display: 'block', color: '#ca8a04', fontWeight: 600 }}>Submission Delayed</span>}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: '#16a34a', fontStyle: 'italic' }}>
                                No critical issues found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const YearComparisonWidget = () => {
    // Using academicTrends from mockData
    const data = {
        labels: academicTrends.labels,
        datasets: [
            academicTrends.datasets[0], // Current Trend
            {
                label: 'Previous Cycle',
                data: [65, 70, 72, 69, 75], // Mock previous data
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: { legend: { display: true, position: 'top' } },
        scales: { y: { beginAtZero: false, min: 50 } }
    };

    return (
        <div className={styles.glassCard}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1rem' }}>Academic Year Comparison</h3>
            <div style={{ height: '200px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

const NotesWidget = () => {
    const [note, setNote] = useState('');
    return (
        <div className={styles.glassCard} style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#64748b" /> Private Notes
            </h3>
            <textarea
                className={styles.notesArea} // Assume styled or inline
                style={{
                    flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem',
                    fontSize: '0.9rem', resize: 'none', background: '#f8fafc', outline: 'none', minHeight: '120px'
                }}
                placeholder="Add observations, points for next meeting, or reminders..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    );
};

const FacultyDirectorySection = ({ onAdd }) => (
    <div className={styles.sectionVisible}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className={styles.chartTitle}>Staff Directory</h2>
            <button className={styles.primaryBtn} onClick={onAdd}>+ Add Faculty</button>
        </div>
        <div className={styles.glassCard}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Workload</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {principalFacultyList.map(f => (
                        <tr key={f.id}>
                            <td>{f.id}</td>
                            <td style={{ fontWeight: 600 }}>{f.name}</td>
                            <td>{f.dept}</td>
                            <td>{f.designation}</td>
                            <td>{f.workload}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                    background: f.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                    color: f.status === 'Active' ? '#16a34a' : '#991b1b'
                                }}>{f.status}</span>
                            </td>
                            <td>
                                <button className={styles.actionBtn}>View Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const TimetablesSection = ({ onDownload }) => (
    <div className={styles.sectionVisible}>
        <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Master Timetables</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {principalTimetables.map(t => (
                <div key={t.id} className={styles.glassCard} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7' }}>
                        <Calendar size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{t.dept}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{t.semester}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Updated {t.updated}</p>
                    </div>
                    <button className={styles.iconBtn} onClick={() => onDownload(t)}><Download size={18} /></button>
                </div>
            ))}
        </div>
    </div>
);

const CircularsSection = ({ onNewBroadcast }) => (
    <div className={styles.sectionVisible}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className={styles.chartTitle}>Circulars & Broadcasts</h2>
            <button className={styles.primaryBtn} style={{ background: '#7c3aed' }} onClick={onNewBroadcast}>+ New Broadcast</button>
        </div>
        <div className={styles.glassCard}>
            {principalCirculars.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '8px', color: '#7c3aed' }}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{c.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Target: {c.target} | Date: {c.date}</p>
                        </div>
                    </div>
                    <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontSize: '0.8rem' }}>{c.status}</span>
                </div>
            ))}
        </div>
    </div>
);

const ReportsSection = ({ onDownload }) => (
    <div className={styles.sectionVisible}>
        <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Reports Center</h2>
        <div className={styles.glassCard}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Generated Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {principalReports.map(r => (
                        <tr key={r.id}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <FileText size={16} color="#64748b" /> {r.name}
                            </td>
                            <td>{r.type}</td>
                            <td>{r.size}</td>
                            <td>{r.date}</td>
                            <td>
                                <button className={styles.actionBtn} onClick={() => onDownload(r)}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const GrievancesSection = ({ onView }) => (
    <div className={styles.sectionVisible}>
        <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Student Grievances</h2>
        <div className={styles.glassCard}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Issue</th>
                        <th>Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {principalGrievances.map(g => (
                        <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>{g.student}</td>
                            <td>{g.issue}</td>
                            <td>{g.date}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                                    background: g.priority === 'High' ? '#fee2e2' : g.priority === 'Medium' ? '#fef3c7' : '#f1f5f9',
                                    color: g.priority === 'High' ? '#991b1b' : g.priority === 'Medium' ? '#b45309' : '#64748b'
                                }}>{g.priority}</span>
                            </td>
                            <td>{g.status}</td>
                            <td>
                                <button className={styles.secondaryBtn} onClick={() => onView(g)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const OverviewSection = ({ barData }) => (
    <>
        <div className={styles.metricsGrid}>
            <div className={styles.glassCard}>
                <div className={styles.cardIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <Users size={24} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Total Students</p>
                    <p className={styles.cardValue}>{principalStats.totalStudents}</p>
                </div>
            </div>
            <div className={styles.glassCard}>
                <div className={styles.cardIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <GraduationCap size={24} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Placement Rate</p>
                    <p className={styles.cardValue}>{principalStats.placementRate}%</p>
                </div>
            </div>
            <div className={styles.glassCard}>
                <div className={styles.cardIcon} style={{ background: '#fef9c3', color: '#ca8a04' }}>
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Avg Attendance</p>
                    <p className={styles.cardValue}>{principalStats.avgAttendance}%</p>
                </div>
            </div>
            <div className={styles.glassCard}>
                <div className={styles.cardIcon} style={{ background: '#f3e8ff', color: '#7c3aed' }}>
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Pending Approvals</p>
                    <p className={styles.cardValue} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        3 <span className={`${styles.indicator} ${styles.redLight}`}></span>
                    </p>
                </div>
            </div>
        </div>

        <div className={styles.glassCard} style={{ marginTop: '2rem', padding: '1.5rem' }}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                Department-wise Academic Performance
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', padding: '1rem 0' }}>
                {collegeStats.branches.map((dept, index) => {
                    const score = collegeStats.branchPerformance[index];
                    const color = barData.datasets[0].backgroundColor[index];
                    const chartData = {
                        labels: ['Score', 'Remaining'],
                        datasets: [{
                            data: [score, 100 - score],
                            backgroundColor: [color, '#f1f5f9'],
                            borderWidth: 0,
                            cutout: '78%',
                            borderRadius: 30,
                        }]
                    };
                    return (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                            <div style={{ height: '120px', width: '120px', position: 'relative' }}>
                                <Doughnut
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                        animation: { duration: 1500, easing: 'easeOutQuart' }
                                    }}
                                />
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1e293b', lineHeight: 1 }}>{score}%</span>
                                </div>
                            </div>
                            <span style={{ marginTop: '1rem', fontWeight: 600, fontSize: '0.95rem', color: '#64748b', textAlign: 'center' }}>{dept}</span>
                        </div>
                    );
                })}
            </div>
        </div>



        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <ConfidenceScoreWidget />
            <FocusListWidget />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <YearComparisonWidget />
            <NotesWidget />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <FacultyPerformanceWidget />
            <ScheduleWidget />
        </div>

        <ActionCenter />
    </>
);

const PrincipalDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Directory State
    const [selectedDept, setSelectedDept] = useState(null);
    const [deptStudents, setDeptStudents] = useState([]);
    const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);

    // Interaction State
    const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
    const [activeModal, setActiveModal] = useState(null); // 'faculty', 'broadcast', 'grievance'
    const [selectedItem, setSelectedItem] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
    };

    const handleDownload = (item) => {
        showToast(`Downloading ${item.name || item.dept + ' Timetable'}...`, 'info');
    };

    const handleSaveFaculty = (e) => {
        e.preventDefault();
        setActiveModal(null);
        showToast('New Faculty Added Successfully!', 'success');
    };

    const handleSendBroadcast = (e) => {
        e.preventDefault();
        setActiveModal(null);
        showToast('Circular Broadcasted Successfully!', 'success');
    };

    const menuItems = [
        {
            label: 'Dashboard Overview',
            path: '/dashboard/principal',
            icon: <LayoutDashboard size={20} />,
            isActive: activeTab === 'overview',
            onClick: () => setActiveTab('overview')
        },

        {
            label: 'IA Compliance Monitor',
            path: '/dashboard/principal/compliance',
            icon: <ShieldCheck size={20} />,
            isActive: activeTab === 'compliance',
            onClick: () => setActiveTab('compliance')
        },

        {
            label: 'Student Directory',
            path: '/dashboard/principal/directory',
            icon: <Users size={20} />,
            isActive: activeTab === 'directory',
            onClick: () => { setActiveTab('directory'); setSelectedDept(null); }
        },
        {
            label: 'Faculty Info',
            path: '/dashboard/principal/faculty',
            icon: <Briefcase size={20} />,
            isActive: activeTab === 'faculty',
            onClick: () => setActiveTab('faculty')
        },
        {
            label: 'Timetables',
            path: '/dashboard/principal/timetables',
            icon: <Calendar size={20} />,
            isActive: activeTab === 'timetables',
            onClick: () => setActiveTab('timetables')
        },
        {
            label: 'Circulars/Broadcasts',
            path: '/dashboard/principal/circulars',
            icon: <Bell size={20} />,
            isActive: activeTab === 'circulars',
            onClick: () => setActiveTab('circulars')
        },
        {
            label: 'Reports & Analytics',
            path: '/dashboard/principal/reports',
            icon: <BarChart2 size={20} />,
            isActive: activeTab === 'reports',
            onClick: () => setActiveTab('reports')
        },
        {
            label: 'Grievances',
            path: '/dashboard/principal/grievances',
            icon: <AlertTriangle size={20} />,
            isActive: activeTab === 'grievances',
            onClick: () => setActiveTab('grievances')
        },
    ];

    /* Chart Configs and Helper Logic */
    // ... (Use existing chart configs)
    const barData = {
        labels: collegeStats.branches,
        datasets: [{
            label: 'Avg IA Performance (%)',
            data: collegeStats.branchPerformance,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderRadius: 6
        }]
    };

    const scatterData = {
        datasets: [{
            label: 'Attendance vs IA Marks',
            data: attendanceCorrelation,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
        }]
    };

    const handleDeptClick = (dept) => {
        setSelectedDept(dept);
        const students = getStudentsByDept(dept.id);
        setDeptStudents(students);
    };

    return (
        <DashboardLayout menuItems={menuItems}>
            <div style={{ padding: '0' }}>
                <header className={styles.header}>
                    <div className={styles.welcomeText}>
                        <h1>Hello, Dr. Gowri Shankar</h1>
                        <p>Principal | Sanjay Gandhi Polytechnic</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => alert("Downloading Full Institute Report...")}
                            style={{ padding: '0.5rem', marginRight: '0.5rem', border: 'none', background: '#ecfdf5', color: '#059669', borderRadius: '8px', cursor: 'pointer' }}
                            title="Download Full Report"
                        >
                            <FileText size={20} />
                        </button>
                        <StudentSentinel />
                        <select className={styles.yearSelector}>
                            <option>Academic Year 2025-26</option>
                            <option>Academic Year 2024-25</option>
                        </select>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className={styles.sectionVisible}>
                    {activeTab === 'overview' && <OverviewSection barData={barData} />}

                    {activeTab === 'compliance' && <ComplianceSection />}

                    {activeTab === 'directory' && <DirectorySection
                        selectedDept={selectedDept}
                        deptStudents={deptStudents}
                        handleDeptClick={handleDeptClick}
                        setSelectedDept={setSelectedDept}
                        setSelectedStudentProfile={setSelectedStudentProfile}
                    />}

                    {activeTab === 'faculty' && <FacultyDirectorySection onAdd={() => setActiveModal('faculty')} />}
                    {activeTab === 'timetables' && <TimetablesSection onDownload={handleDownload} />}
                    {activeTab === 'circulars' && <CircularsSection onNewBroadcast={() => setActiveModal('broadcast')} />}
                    {activeTab === 'reports' && <ReportsSection onDownload={handleDownload} />}
                    {activeTab === 'grievances' && <GrievancesSection onView={(g) => { setSelectedItem(g); setActiveModal('grievance'); }} />}
                </div>
            </div>

            <StudentProfileModal
                selectedStudentProfile={selectedStudentProfile}
                setSelectedStudentProfile={setSelectedStudentProfile}
                selectedDept={selectedDept}
            />

            {/* Interaction Modals */}
            <ToastNotification show={toast.show} msg={toast.msg} type={toast.type} />

            <SimpleModal isOpen={activeModal === 'faculty'} onClose={() => setActiveModal(null)} title="Add New Faculty">
                <form onSubmit={handleSaveFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className={styles.searchBarInput} placeholder="Full Name" required style={{ border: '1px solid #e2e8f0' }} />
                    <select className={styles.searchBarInput} style={{ border: '1px solid #e2e8f0' }}>
                        <option>Computer Science</option>
                        <option>Mechanical</option>
                        <option>Civil</option>
                    </select>
                    <input className={styles.searchBarInput} placeholder="Designation" required style={{ border: '1px solid #e2e8f0' }} />
                    <button type="submit" className={styles.primaryBtn} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Save Faculty</button>
                </form>
            </SimpleModal>

            <SimpleModal isOpen={activeModal === 'broadcast'} onClose={() => setActiveModal(null)} title="New Broadcast">
                <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className={styles.searchBarInput} placeholder="Circular Title" required style={{ border: '1px solid #e2e8f0' }} />
                    <textarea className={styles.notesArea} placeholder="Message content..." required style={{ border: '1px solid #e2e8f0', minHeight: '100px' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', gap: '0.5rem' }}><input type="checkbox" /> Students</label>
                        <label style={{ display: 'flex', gap: '0.5rem' }}><input type="checkbox" defaultChecked /> Faculty</label>
                    </div>
                    <button type="submit" className={styles.primaryBtn} style={{ marginTop: '0.5rem', justifyContent: 'center', background: '#7c3aed' }}>Send Broadcast</button>
                </form>
            </SimpleModal>

            <SimpleModal isOpen={activeModal === 'grievance'} onClose={() => setActiveModal(null)} title="Grievance Details">
                {selectedItem && (
                    <div style={{ padding: '0.5rem 0' }}>
                        <p><strong>Student:</strong> {selectedItem.student}</p>
                        <p><strong>Issue:</strong> {selectedItem.issue}</p>
                        <p><strong>Date:</strong> {selectedItem.date}</p>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button className={styles.primaryBtn} onClick={() => { setActiveModal(null); showToast('Marked as Resolved', 'success'); }}>Resolve</button>
                            <button className={styles.secondaryBtn} onClick={() => setActiveModal(null)}>Close</button>
                        </div>
                    </div>
                )}
            </SimpleModal>
        </DashboardLayout >
    );
};

export default PrincipalDashboard;
