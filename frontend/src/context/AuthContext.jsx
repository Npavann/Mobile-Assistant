import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
                const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
                if (username === adminUser && password === adminPass) {
                    setIsAdmin(true);
                    resolve({ success: true });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    };

    const logout = () => {
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, isLoading: false }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);