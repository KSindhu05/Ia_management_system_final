import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    LayoutDashboard, Users, FileText, CheckCircle, TrendingUp, BarChart2,
    AlertTriangle, Briefcase, Bell
} from 'lucide-react';
import {
    hodData, departmentStats, hodBranchComparison, departmentAlerts, resourceRequests
} from '../utils/mockData';
import styles from './HODDashboard.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HODDashboard = () => {
    const menuItems = [
        { label: 'Overview', path: '/dashboard/hod', icon: <LayoutDashboard size={20} /> },
        { label: 'Faculty Stats', path: '/dashboard/hod', icon: <Users size={20} /> },
        { label: 'Approvals', path: '/dashboard/hod', icon: <CheckCircle size={20} /> },
        { label: 'Reports', path: '/dashboard/hod', icon: <FileText size={20} /> },
    ];

    const chartData = {
        labels: hodBranchComparison.labels,
        datasets: [
            {
                label: 'Pass %',
                data: hodBranchComparison.passPercentage,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderRadius: 4,
            },
            {
                label: 'Avg Attendance %',
                data: hodBranchComparison.attendance,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: '#f3f4f6' }
            },
            x: {
                grid: { display: false }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <DashboardLayout menuItems={menuItems}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.welcomeText}>Department Overview</h1>
                    <p className={styles.subtitle}>{hodData.department} | HOD: {hodData.name}</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.reportBtn}>
                        <FileText size={18} /> Dept. Report
                    </button>
                    <div className={styles.notificationBell}>
                        <Bell size={20} color="#6b7280" />
                        <span className={styles.badgeDot}></span>
                    </div>
                </div>
            </header>

            {/* Top Stats Row */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.blueBg}`}>
                        <Users size={24} color="#2563eb" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Students</p>
                        <p className={styles.statValue}>{departmentStats.totalStudents}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.greenBg}`}>
                        <Briefcase size={24} color="#059669" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Faculty On-Duty</p>
                        <p className={styles.statValue}>{departmentStats.facultyCount}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.yellowBg}`}>
                        <TrendingUp size={24} color="#ca8a04" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Dept Pass %</p>
                        <p className={styles.statValue}>{departmentStats.passPercentage}%</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.purpleBg}`}>
                        <AlertTriangle size={24} color="#7c3aed" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Pending Issues</p>
                        <p className={styles.statValue}>3</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainContentGrid}>
                {/* Left: Charts & Approvals */}
                <div className={styles.leftColumn}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.cardTitle}>Branch Comparison (Pass % vs Attendance)</h3>
                        <div className={styles.chartWrapper}>
                            <Bar options={options} data={chartData} />
                        </div>
                    </div>

                    <div className={styles.approvalPanel}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.cardTitle}>Resource Requests</h3>
                            <button className={styles.viewAllBtn}>View All</button>
                        </div>
                        <div className={styles.approvalList}>
                            {resourceRequests.map(req => (
                                <div key={req.id} className={styles.approvalItem}>
                                    <div className={styles.reqInfo}>
                                        <p className={styles.reqName}>{req.request}</p>
                                        <span className={styles.reqBy}>By {req.requester}</span>
                                    </div>
                                    <span className={`${styles.statusBadge} ${req.status === 'Approved' ? styles.statusSuccess : styles.statusPending}`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))}
                            {/* Mock Pending IA Submissions inside same panel for demo */}
                            <div className={styles.approvalItem}>
                                <div className={styles.reqInfo}>
                                    <p className={styles.reqName}>IA-3 Marks Submission - Civil</p>
                                    <span className={styles.reqBy}>By Mrs. Nair</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.approveBtn}>Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Alerts & Faculty Roster */}
                <div className={styles.rightColumn}>
                    <div className={styles.alertCard}>
                        <h3 className={styles.cardTitle}>Department Alerts</h3>
                        <ul className={styles.alertList}>
                            {departmentAlerts.map(alert => (
                                <li key={alert.id} className={styles.alertItem}>
                                    <AlertTriangle size={16}
                                        color={alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6'}
                                    />
                                    <div className={styles.alertContent}>
                                        <p className={styles.alertMsg}>{alert.message}</p>
                                        <span className={styles.alertTime}>{alert.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.rosterCard}>
                        <h3 className={styles.cardTitle}>Faculty Roster</h3>
                        <div className={styles.rosterList}>
                            <div className={styles.rosterItem}>
                                <div className={styles.rosterUser}>
                                    <div className={styles.avatar}>AV</div>
                                    <div>
                                        <p className={styles.rosterName}>Dr. A. Verma</p>
                                        <span className={styles.rosterStatus}>In Class (Lab 2)</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rosterItem}>
                                <div className={styles.rosterUser}>
                                    <div className={styles.avatar}>SG</div>
                                    <div>
                                        <p className={styles.rosterName}>Mrs. S. Gupta</p>
                                        <span className={styles.rosterStatus}>Free</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default HODDashboard;
