import React, { useState, memo } from 'react';
import {
    Search, Award, Bell, Calendar, Briefcase, FileText, AlertTriangle, ShieldCheck, Users
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import styles from '../../../pages/PrincipalDashboard.module.css';
import {
    studentsList, facultyClassAnalytics, principalSchedule, collegeStats,
    hodSubmissionStatus, academicTrends
} from '../../../utils/mockData';

export const StudentSentinel = memo(() => {
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
});

export const FacultyPerformanceWidget = memo(() => (
    <div className={styles.glassCard} style={{ borderRadius: '24px', border: 'none', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 className={styles.chartTitle} style={{ margin: 0, fontSize: '1.1rem' }}>Faculty Pulse</h3>
            <div style={{ padding: '6px', background: '#e0e7ff', borderRadius: '8px', color: '#6366f1' }}>
                <Briefcase size={18} />
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6' }}>{facultyClassAnalytics.avgScore}%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Avg Score</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{facultyClassAnalytics.passRate}%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pass Rate</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>{facultyClassAnalytics.evaluated}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Evaluated</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>{facultyClassAnalytics.pending}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pending</div>
            </div>
        </div>
    </div>
));

export const ScheduleWidget = memo(() => (
    <div className={styles.glassCard} style={{ borderRadius: '24px', border: 'none', background: 'linear-gradient(145deg, #ffffff, #fefce8)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '6px', background: '#fef9c3', borderRadius: '8px', color: '#ca8a04' }}>
                <Calendar size={18} />
            </div>
            <h3 className={styles.chartTitle} style={{ margin: 0, fontSize: '1.1rem' }}>Today's Schedule</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {principalSchedule.map((item) => (
                <div key={item.id} style={{
                    display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '0.75rem 1rem', borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderLeft: item.type === 'Urgent' ? '4px solid #ef4444' : '4px solid #3b82f6'
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
));

export const ConfidenceScoreWidget = memo(({ headings }) => (
    <div className={styles.glassCard} style={{ padding: '1.5rem', borderRadius: '24px' }}>
        <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <Award size={20} color="#f59e0b" /> Department Confidence
        </h3>
        <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: color }}>{confidence}</span>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
));

export const FocusListWidget = memo(() => {
    const criticalDepts = collegeStats.branches
        .map((dept, i) => ({
            name: dept,
            score: collegeStats.branchPerformance[i],
            status: hodSubmissionStatus.find(h => h.id === dept)?.punctuality
        }))
        .filter(d => d.score < 70 || d.status === 'Delayed');

    return (
        <div className={styles.glassCard} style={{ background: '#fff', borderRadius: '24px', border: '1px solid #fee2e2' }}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '1.1rem' }}>
                <AlertTriangle size={20} /> Focus Required
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {criticalDepts.length > 0 ? criticalDepts.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fef2f2', borderRadius: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#7f1d1d', fontSize: '0.9rem' }}>{d.name}</span>
                        <div style={{ textAlign: 'right' }}>
                            {d.score < 70 && <span style={{ display: 'block', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>Low Perf. ({d.score}%)</span>}
                            {d.status === 'Delayed' && <span style={{ display: 'block', color: '#ca8a04', fontSize: '0.75rem', fontWeight: 600 }}>Delayed</span>}
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#16a34a', fontStyle: 'italic' }}>
                        No critical issues found.
                    </div>
                )}
            </div>
        </div>
    );
});

export const YearComparisonWidget = memo(() => {
    const data = {
        labels: academicTrends.labels,
        datasets: [
            academicTrends.datasets[0], // Current Trend
            {
                label: 'Previous Cycle',
                data: [65, 70, 72, 69, 75],
                borderColor: '#cbd5e1',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 10, usePointStyle: true } }, tooltip: { mode: 'index', intersect: false } },
        scales: { y: { beginAtZero: false, min: 50, grid: { borderDash: [4, 4], color: '#f1f5f9' } }, x: { grid: { display: false } } },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
    };

    return (
        <div className={styles.glassCard} style={{ borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className={styles.chartTitle} style={{ margin: 0, fontSize: '1.1rem' }}>Trend Analysis</h3>
                <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px', color: '#64748b' }}>Last 5 Years</span>
            </div>
            <div style={{ height: '220px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
});

export const NotesWidget = memo(() => {
    const [note, setNote] = useState('');
    return (
        <div className={styles.glassCard} style={{ display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
            <h3 className={styles.chartTitle} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <FileText size={20} color="#64748b" /> Quick Notes
            </h3>
            <textarea
                className={styles.notesArea}
                style={{
                    flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem',
                    fontSize: '0.9rem', resize: 'none', background: '#f8fafc', outline: 'none', minHeight: '100px',
                    boxShadow: 'inner 0 2px 4px rgba(0,0,0,0.05)'
                }}
                placeholder="Type here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    );
});

export const ActionCenter = memo(() => (
    <div className={styles.glassCard} style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white' }}>
        <h3 className={styles.chartTitle} style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.2rem' }}>Quick Actions</h3>
        <div className={styles.quickActionsGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button className={styles.actionBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} onClick={() => alert('Approval Request Sent')}>
                <ShieldCheck size={20} color="white" />
                <span>Approvals</span>
            </button>
            <button className={styles.actionBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} onClick={() => alert('Report Generated')}>
                <FileText size={20} color="white" />
                <span>Reports</span>
            </button>
            <button className={styles.actionBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} onClick={() => alert('Circular Broadcasted')}>
                <Users size={20} color="white" />
                <span>Broadcast</span>
            </button>
            <button className={styles.actionBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} onClick={() => alert('Meeting Scheduled')}>
                <Calendar size={20} color="white" />
                <span>Meetings</span>
            </button>
        </div>
    </div>
));
