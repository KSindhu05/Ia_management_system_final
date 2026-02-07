const API_BASE_URL = 'http://127.0.0.1:8083/api';

export const login = async (userId, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: userId, password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network Error' };
    }
};

export const fetchStudentDashboard = async (regNo) => {
    try {
        const response = await fetch(`${API_BASE_URL}/student/dashboard?regNo=${regNo}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Fetch dashboard error:', error);
        return null;
    }
};

export const fetchHODDashboard = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/hod/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Fetch dashboard error:', error);
        return null;
    }
};
