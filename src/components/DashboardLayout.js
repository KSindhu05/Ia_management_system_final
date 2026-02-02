import React from 'react';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ menuItems, children }) => {
    return (
        <div className={styles.layout}>
            <Sidebar menuItems={menuItems} />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
