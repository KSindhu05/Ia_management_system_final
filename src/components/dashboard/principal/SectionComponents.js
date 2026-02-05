import React, { memo } from 'react';
import { Calendar, Download, Bell, FileText } from 'lucide-react';
import styles from '../../../pages/PrincipalDashboard.module.css';
import {
    principalFacultyList, principalTimetables, principalCirculars,
    principalReports, principalGrievances
} from '../../../utils/mockData';

export const FacultyDirectorySection = memo(({ onAdd }) => (
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
));

export const TimetablesSection = memo(({ onDownload }) => (
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
));

export const CircularsSection = memo(({ onNewBroadcast }) => (
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
));

export const ReportsSection = memo(({ onDownload }) => (
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
));

export const GrievancesSection = memo(({ onView }) => (
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
));
