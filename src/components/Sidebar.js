import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';
import { LogOut, BookOpen } from 'lucide-react';

const Sidebar = ({ menuItems }) => {
    const { user, logout } = useAuth();
    // const { isDarkMode, toggleTheme } = useTheme(); // Removed for now

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <BookOpen size={32} color="#fff" />
                <div className={styles.logoText}>
                    <span className={styles.collegeName}>Sanjay Gandhi</span>
                    <span className={styles.subtext}>Polytechnic</span>
                </div>
            </div>

            <div className={styles.userInfo}>
                <div className={styles.avatar}>
                    {user?.name?.charAt(0)}
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.userName}>{user?.name}</p>
                    <p className={styles.userRole}>{user?.role?.toUpperCase()}</p>
                </div>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            (item.isActive ?? isActive) ? `${styles.navItem} ${styles.active}` : styles.navItem
                        }
                        onClick={(e) => {
                            if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                            }
                        }}
                        end
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button onClick={logout} className={styles.logoutButton}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
