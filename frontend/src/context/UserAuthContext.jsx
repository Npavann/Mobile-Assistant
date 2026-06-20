import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('userToken');
        const storedUser = sessionStorage.getItem('userData');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const signup = async (name, email, password) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/signup`,
            { name, email, password }
        );
        const { token, user } = response.data;
        sessionStorage.setItem('userToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return user;
    };

    const login = async (email, password) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/login`,
            { email, password }
        );
        const { token, user } = response.data;
        sessionStorage.setItem('userToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return user;
    };

    const logout = () => {
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
        setToken(null);
        setUser(null);
    };

    return (
        <UserAuthContext.Provider value={{ user, token, signup, login, logout, isLoggedIn: !!token }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export const useUserAuth = () => useContext(UserAuthContext);