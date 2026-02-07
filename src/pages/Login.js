import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';
import { User, Lock, ArrowRight } from 'lucide-react';

// Import background images
import bg1 from '../assets/login_background_final.png';
import bg2 from '../assets/slideshow_1.png';
import bg3 from '../assets/slideshow_2.png';
import bg4 from '../assets/slideshow_3.png';

const backgroundImages = [bg1, bg2, bg3, bg4];

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Slideshow effect
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Alert 1: Beginning submit
        // alert("Submitting login for: " + userId); 

        try {
            const result = await login(userId, password);
            // alert("Login result received: " + JSON.stringify(result));

<<<<<<< HEAD
        if (result.success) {
            // Redirect based on role
            const id = userId.toUpperCase();
            if (id.startsWith('S') || id.startsWith('DIP')) navigate('/dashboard/student');
            else if (id.startsWith('F') || id.startsWith('FAC')) navigate('/dashboard/faculty');
            else if (id.startsWith('H') || id.startsWith('HOD')) navigate('/dashboard/hod');
            else if (id.startsWith('P') || id === 'ADMIN' || id.startsWith('PRIN')) navigate('/dashboard/principal');
        } else {
            setError(result.message);
=======
            if (result.success) {
                // Alert 2: Success
                // alert("Login successful! Redirecting...");

                const role = result.role;
                if (role === 'student') navigate('/dashboard/student');
                else if (role === 'faculty') navigate('/dashboard/faculty');
                else if (role === 'hod') navigate('/dashboard/hod');
                else if (role === 'principal') navigate('/dashboard/principal');
                else navigate('/');
            } else {
                // Alert 3: Failure
                console.error("Login failed:", result.message);
                setError(result.message);
            }
        } catch (err) {
            console.error("Unexpected error in handleSubmit:", err);
            setError("Unexpected error: " + err.message);
            alert("Unexpected error: " + err.message);
>>>>>>> ksindhu-sync
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Side - Image Slideshow */}
            <div className={styles.leftPanel}>
                <div
                    className={styles.slideshow}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {backgroundImages.map((bg, index) => (
                        <div
                            key={index}
                            className={styles.slide}
                            style={{ backgroundImage: `url(${bg})` }}
                        />
                    ))}
                </div>

                {/* Content Overlay */}
                <div className={styles.leftOverlayContent}>
                    <div className={styles.logoWrapper}>
                        <img src={require('../assets/college_logo.png')} alt="College Logo" className={styles.leftLogo} />
                    </div>
                    <h1>IA MANAGEMENT SYSTEM</h1>
                    <p>Efficiently manage Internal Assessments and track academic progress</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={styles.rightPanel}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <div className={styles.logoContainer}>
                            <img src={require('../assets/college_logo.png')} alt="College Logo" className={styles.collegeLogo} />
                        </div>
                        <h1 className={styles.collegeName}>IA Management System</h1>
                        <p className={styles.subtitle}>Role Based Login Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="userId">User ID</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.icon} size={20} />
                                <input
                                    type="text"
                                    id="userId"
                                    placeholder="Enter your user ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.icon} size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" className={styles.loginButton}>
                            Login <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>Login with your credentials provided by the institute</p>
                        <div className={styles.securityNote}>
                            🔒 Secure Login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
