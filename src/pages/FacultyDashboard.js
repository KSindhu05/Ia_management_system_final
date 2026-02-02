
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { LayoutDashboard, Users, FilePlus, Save, AlertCircle, Upload, Calendar, Phone, FileText, CheckCircle, Search, Filter, MoreVertical, Mail, Download, Printer } from 'lucide-react';
import { facultyData, facultySubjects, studentsList, facultyClassAnalytics, labSchedule } from '../utils/mockData';
import styles from './FacultyDashboard.module.css';

const FacultyDashboard = () => {
    const [activeSection, setActiveSection] = useState('Overview');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [marks, setMarks] = useState(studentsList);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [searchTerm, setSearchTerm] = useState('');

    const menuItems = [
        {
            label: 'Overview',
            path: '/dashboard/faculty',
            icon: <LayoutDashboard size={20} />,
            isActive: activeSection === 'Overview',
            onClick: () => { setActiveSection('Overview'); setSelectedSubject(null); }
        },
        {
            label: 'My Students',
            path: '/dashboard/faculty',
            icon: <Users size={20} />,
            isActive: activeSection === 'My Students',
            onClick: () => { setActiveSection('My Students'); setSelectedSubject(null); }
        },
        {
            label: 'IA Entry',
            path: '/dashboard/faculty',
            icon: <FilePlus size={20} />,
            isActive: activeSection === 'IA Entry',
            onClick: () => { setActiveSection('IA Entry'); setSelectedSubject(null); }
        },
    ];

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setActiveSection('IA Entry'); // Auto-switch to IA Entry when a subject is clicked
    };

    const handleMarkChange = (studentId, field, value, maxMarks = 30) => {
        // Allow clearing the field
        if (value === '') {
            setMarks(prevMarks =>
                prevMarks.map(student =>
                    student.id === studentId ? { ...student, [field]: '' } : student
                )
            );
            return;
        }

        // Validate marks based on passed limit
        const numValue = Math.min(maxMarks, Math.max(0, Number(value)));

        setMarks(prevMarks =>
            prevMarks.map(student =>
                student.id === studentId ? { ...student, [field]: numValue } : student
            )
        );
    };

    const calculateAverage = (s) => {
        const i1 = Number(s.ia1 || 0);
        const i2 = Number(s.ia2 || 0);
        const i3 = Number(s.ia3 || 0);

        // If it's a specific subject view, check its type
        if (selectedSubject?.type === 'Lab') {
            return Math.round((i1 + i2) / 2);
        }

        return Math.round((i1 + i2 + i3) / 3);
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            showToast('IA Marks Saved Successfully!', 'success');
        }, 1000);
    };

    // --- VIEW RENDERERS ---

    const renderOverview = () => (
        <>
            <div className={styles.analyticsGrid}>
                {/* Same Analytics cards as before */}
                <div className={styles.analyticsCard}>
                    <h3 className={styles.analyticsTitle}>IA STATUS</h3>
                    <div className={styles.analyticsContent}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultySubjects.reduce((acc, curr) => acc + curr.studentCount, 0)}</span>
                            <span className={styles.statLabel}>Total Students</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultyClassAnalytics.evaluated}</span>
                            <span className={styles.statLabel}>Evaluated</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultyClassAnalytics.pending}</span>
                            <span className={styles.statLabel}>Pending</span>
                        </div>
                    </div>
                </div>
                <div className={styles.analyticsCard}>
                    <h3 className={styles.analyticsTitle}>CLASS ANALYTICS</h3>
                    <div className={styles.analyticsContent}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultyClassAnalytics.avgScore}%</span>
                            <span className={styles.statLabel}>Avg Score</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultyClassAnalytics.lowPerformers}</span>
                            <span className={styles.statLabel}>Low Performers</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{facultyClassAnalytics.topPerformers}</span>
                            <span className={styles.statLabel}>Top Performers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.mainContentGrid}>
                <div className={styles.leftColumn}>
                    <section>
                        <h2 className={styles.sectionTitle}>My Subjects</h2>
                        <div className={styles.cardsGrid}>
                            {facultySubjects.map(sub => (
                                <div key={sub.id} className={styles.subjectCard} onClick={() => handleSubjectClick(sub)}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.subjectName}>{sub.name}</h3>
                                        <span className={styles.termBadge}>{sub.semester} Sem</span>
                                    </div>
                                    <div className={styles.subjectFooter}>
                                        <div className={styles.cardStats}>
                                            <Users size={16} color="#6b7280" />
                                            <span>{sub.studentCount} Students</span>
                                        </div>
                                        <span className={styles.progressBadge}>85% Comp</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className={styles.sectionTitle}>Quick Actions</h2>
                        <div className={styles.quickActionsGrid}>
                            <button className={styles.actionBtn} onClick={() => showToast('Report Generated!')}>
                                <FileText size={18} /> Generate Report
                            </button>
                            <button className={styles.actionBtn} onClick={() => showToast('Bulk Upload Modal Opened')}>
                                <Upload size={18} /> Bulk Marks Upload
                            </button>
                            <button className={styles.actionBtn} onClick={() => showToast('Calling Parent...')}>
                                <Phone size={18} /> Parent Call
                            </button>
                            <button className={styles.actionBtn} onClick={() => showToast('Downloading Attendance Sheet...')}>
                                <Users size={18} /> Attendance Sheet
                            </button>
                        </div>
                    </section>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.labCard}>
                        <h2 className={styles.cardTitle}>Lab Scheduler 📅</h2>
                        <div className={styles.scheduleList}>
                            {labSchedule.map(slot => (
                                <div key={slot.id} className={styles.scheduleItem}>
                                    <div className={styles.scheduleTime}>
                                        <span className={styles.day}>{slot.day}</span>
                                        <span className={styles.time}>{slot.time}</span>
                                    </div>
                                    <div className={styles.scheduleInfo}>
                                        <span className={styles.labName}>{slot.lab}</span>
                                        <span className={styles.batch}>{slot.batch}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderMyStudents = () => {
        // Mock larger list for demo if needed, or filter existing
        const filteredStudents = marks.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>My Students Directory</h2>
                    <div className={styles.headerActions}>
                        <div className={styles.searchWrapper}>
                            <Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search student..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className={styles.filterBtn}><Filter size={16} /> Filter</button>
                        <button className={styles.secondaryBtn}><Printer size={16} /> Print List</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Semester</th>
                                    <th>Attendance</th>
                                    <th>Avg IA Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((std) => (
                                    <tr key={std.id}>
                                        <td className={styles.codeText}>{std.rollNo}</td>
                                        <td className={styles.subjectText}>{std.name}</td>
                                        <td>5th</td>
                                        <td>
                                            <span className={`${styles.badge} ${std.ia1 > 20 ? styles.excellent : styles.good}`}>
                                                {90 - (std.id * 2)}% {/* Randomish attendance */}
                                            </span>
                                        </td>
                                        <td className={styles.totalCell}>{calculateAverage(std)}</td>
                                        <td>
                                            <div className={styles.actionIcons}>
                                                <button title="View Profile" className={styles.iconBtn}><Users size={16} /></button>
                                                <button title="Email" className={styles.iconBtn}><Mail size={16} /></button>
                                                <button title="Report" className={styles.iconBtn}><AlertCircle size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderIAEntry = () => {
        if (!selectedSubject) {
            return (
                <div className={styles.emptyState}>
                    <h2 className={styles.sectionTitle}>Select a Subject to Enter Marks</h2>
                    <div className={styles.cardsGrid}>
                        {facultySubjects.map(sub => (
                            <div key={sub.id} className={styles.subjectCard} onClick={() => setSelectedSubject(sub)}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.subjectName}>{sub.name}</h3>
                                    <span className={styles.termBadge}>{sub.semester} Sem</span>
                                </div>
                                <div className={styles.subjectFooter}>
                                    <button className={styles.enterBtn} style={{ marginTop: '0.5rem', width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                        Enter Marks
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const maxMarks = selectedSubject.type === 'Lab' ? 20 : 30;

        return (
            <section className={styles.marksSection}>
                <div className={styles.marksHeader}>
                    <button className={styles.backBtn} onClick={() => setSelectedSubject(null)}>
                        ← Back to Subjects
                    </button>
                    <div>
                        <h2 className={styles.sectionTitle}>{selectedSubject.name} - IA Marks Entry</h2>
                        <span className={styles.subtitle} style={{ fontSize: '0.9rem' }}>
                            Max Marks: {maxMarks} ({selectedSubject.type || 'Theory'})
                        </span>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={styles.secondaryBtn} onClick={() => showToast('Importing Excel...')}>
                            <Upload size={16} /> Import Excel
                        </button>
                        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>{selectedSubject.type === 'Lab' ? 'Lab-1' : 'IA-1'} ({maxMarks})</th>
                                <th>{selectedSubject.type === 'Lab' ? 'Lab-2' : 'IA-2'} ({maxMarks})</th>
                                {selectedSubject.type !== 'Lab' && <th>IA-3 ({maxMarks})</th>}
                                <th>Average</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marks.map((student) => {
                                const avg = calculateAverage(student);
                                return (
                                    <tr key={student.id} className={avg < (maxMarks * 0.4) ? styles.lowPerformance : ''}>
                                        <td>{student.rollNo}</td>
                                        <td>
                                            {student.name}
                                            {avg < (maxMarks * 0.4) && <AlertCircle size={14} color="#ef4444" style={{ marginLeft: 6 }} />}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={student.ia1}
                                                className={styles.markInput}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleMarkChange(student.id, 'ia1', e.target.value, maxMarks)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={student.ia2}
                                                className={styles.markInput}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleMarkChange(student.id, 'ia2', e.target.value, maxMarks)}
                                            />
                                        </td>
                                        {selectedSubject.type !== 'Lab' && (
                                            <td>
                                                <input
                                                    type="number"
                                                    value={student.ia3}
                                                    className={styles.markInput}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleMarkChange(student.id, 'ia3', e.target.value, maxMarks)}
                                                />
                                            </td>
                                        )}
                                        <td className={styles.avgCell}>{avg}</td>
                                        <td>
                                            <span className={`${styles.badge} ${avg >= (maxMarks * 0.8) ? styles.excellent : avg >= (maxMarks * 0.4) ? styles.good : styles.poor}`}>
                                                {avg >= (maxMarks * 0.4) ? 'Pass' : 'Low'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    };

    return (
        <DashboardLayout menuItems={menuItems}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.welcomeText}>Hello, {facultyData.name}</h1>
                    <p className={styles.subtitle}>{facultyData.designation} | {facultyData.department}</p>
                </div>
            </header>

            {activeSection === 'Overview' && renderOverview()}
            {activeSection === 'My Students' && renderMyStudents()}
            {activeSection === 'IA Entry' && renderIAEntry()}

            {toast.show && (
                <div className={`${styles.toast} ${toast.type === 'error' ? styles.error : ''}`}>
                    <CheckCircle size={18} />
                    {toast.message}
                </div>
            )}
        </DashboardLayout>
    );
};

export default FacultyDashboard;
