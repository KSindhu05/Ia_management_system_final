import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userId, password) => {
        // Mock Authentication Logic
        // In a real app, this would be an API call

        // Simple logic based on ID prefix
        const id = userId.toUpperCase();
        let role = '';
        let name = '';

        // Expanded logic for new Blueprint ID formats
        // Student: DIP/2024/CS/001 or S...
        // Faculty: FAC/CS/001 or F...
        // HOD: HOD/CS/001
        // Principal: PRIN/001 or P...

        if (id.startsWith('S') || id.startsWith('DIP')) {
            role = 'student';
            name = 'Student User';
        } else if (id.startsWith('F') || id.startsWith('FAC')) {
            role = 'faculty';
            name = 'Faculty Member';
        } else if (id.startsWith('H') || id.startsWith('HOD')) {
            role = 'hod';
            name = 'Head of Department';
        } else if (id.startsWith('P') || id === 'ADMIN' || id.startsWith('PRIN')) {
            role = 'principal';
            name = 'Principal';
        } else {
            return { success: false, message: 'Invalid User ID' };
        }

        // Basic password check (accept any password for now or specific one)
        if (password.length < 3) {
            return { success: false, message: 'Password must be at least 3 characters' };
        }

        const userData = { id, role, name };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
