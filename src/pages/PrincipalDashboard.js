import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    LayoutDashboard, Users, PieChart, Send, Calendar, TrendingUp, DollarSign, Briefcase
} from 'lucide-react';
import {
    collegeStats, principalStats, broadcastMessages, principalSchedule
} from '../utils/mockData';
import styles from './PrincipalDashboard.module.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const PrincipalDashboard = () => {
    const menuItems = [
        { label: 'Overview', path: '/dashboard/principal', icon: <LayoutDashboard size={20} /> },
        { label: 'Analytics', path: '/dashboard/principal', icon: <PieChart size={20} /> },
        { label: 'Communication', path: '/dashboard/principal', icon: <Send size={20} /> },
    ];

    const pieData = {
        labels: ['Passed', 'Failed'],
        datasets: [
            {
                data: collegeStats.passFailData,
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: collegeStats.branches,
        datasets: [
            {
                label: 'Avg IA Performance (%)',
                data: collegeStats.branchPerformance,
                backgroundColor: '#3b82f6',
                borderRadius: 4,
            },
        ],
    };

    return (
        <DashboardLayout menuItems={menuItems}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.welcomeText}>Institute Overview</h1>
                    <p className={styles.subtitle}>Welcome, Principal Dr. S. Kulkarni</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.primaryBtn}>
                        <Send size={18} /> New Broadcast
                    </button>
                </div>
            </header>

            {/* Key Metrics Grid */}
            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconWrapper} ${styles.blueBg}`}>
                        <Users size={24} color="#2563eb" />
                    </div>
                    <div>
                        <p className={styles.metricLabel}>Total Students</p>
                        <p className={styles.metricValue}>{principalStats.totalStudents}</p>
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconWrapper} ${styles.greenBg}`}>
                        <Briefcase size={24} color="#059669" />
                    </div>
                    <div>
                        <p className={styles.metricLabel}>Placement Rate</p>
                        <p className={styles.metricValue}>{principalStats.placementRate}%</p>
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconWrapper} ${styles.yellowBg}`}>
                        <DollarSign size={24} color="#ca8a04" />
                    </div>
                    <div>
                        <p className={styles.metricLabel}>Fee Collection</p>
                        <p className={styles.metricValue}>{principalStats.feeCollection}</p>
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconWrapper} ${styles.purpleBg}`}>
                        <TrendingUp size={24} color="#7c3aed" />
                    </div>
                    <div>
                        <p className={styles.metricLabel}>Avg Attendance</p>
                        <p className={styles.metricValue}>{principalStats.avgAttendance}%</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainGrid}>
                {/* Left Column: Charts */}
                <div className={styles.leftColumn}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.cardTitle}>Institute Performance Index</h3>
                        <div className={styles.chartWrapper}>
                            <Bar
                                data={barData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: { y: { beginAtZero: true, max: 100 } },
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.cardTitle}>Overall Pass/Fail Ratio</h3>
                        <div className={styles.pieChartWrapper}>
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Communication & Schedule */}
                <div className={styles.rightColumn}>
                    {/* Broadcast Panel */}
                    <div className={styles.panelCard}>
                        <h3 className={styles.cardTitle}>Recent Broadcasts</h3>
                        <div className={styles.listContainer}>
                            {broadcastMessages.map(msg => (
                                <div key={msg.id} className={styles.listItem}>
                                    <div className={styles.listIcon}>
                                        <Send size={14} color="white" />
                                    </div>
                                    <div className={styles.listContent}>
                                        <p className={styles.listText}>{msg.message}</p>
                                        <span className={styles.listMeta}>To: {msg.target} • {msg.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className={styles.viewMoreBtn}>View All History</button>
                    </div>

                    {/* Schedule Panel */}
                    <div className={styles.panelCard}>
                        <h3 className={styles.cardTitle}>Today's Schedule</h3>
                        <div className={styles.listContainer}>
                            {principalSchedule.map(task => (
                                <div key={task.id} className={styles.scheduleItem}>
                                    <div className={styles.timeBox}>
                                        {task.time}
                                    </div>
                                    <div className={styles.scheduleContent}>
                                        <p className={styles.scheduleTitle}>{task.title}</p>
                                        <span className={`${styles.badge} ${task.type === 'Urgent' ? styles.urgent : styles.routine}`}>
                                            {task.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className={styles.viewMoreBtn}>
                            <Calendar size={14} style={{ marginRight: 4 }} /> Full Calendar
                        </button>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default PrincipalDashboard;
