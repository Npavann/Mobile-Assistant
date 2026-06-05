import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth === 'true') {
            setIsAdmin(true);
        }
        setIsLoading(false);
    }, []);

    const login = (username, password, rememberMe) => {
        return new Promise((resolve, reject) => {
            // Simulated API delay
            setTimeout(() => {
                const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
                const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
                if (username === adminUser && password === adminPass) {
                    setIsAdmin(true);
                    localStorage.setItem('adminAuth', 'true');
                    // Store additional pref if needed
                    if (rememberMe) {
                        localStorage.setItem('adminRemember', 'true');
                    }
                    resolve({ success: true });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('adminAuth');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
