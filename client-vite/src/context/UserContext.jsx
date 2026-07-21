// client-vite/src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to check authentication status on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // *** CRITICAL CORRECTION HERE: ENSURE THIS URL IS /isAuthenticated ***
                const response = await axios.get('http://localhost:4000/api/auth/isAuthenticated', {
                    withCredentials: true // Essential for sending the cookie
                });

                if (response.data.success && response.data.user) {
                    setCurrentUser(response.data.user);
                    setIsLoggedIn(true);
                } else {
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Authentication check failed:", error.response?.data?.message || error.message);
                setCurrentUser(null);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:4000/api/auth/login', { email, password }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setCurrentUser({
                    id: res.data.userId,
                    email: email,
                    role: res.data.role,
                    name: res.data.name
                });
                setIsLoggedIn(true);
                return { success: true, role: res.data.role };
            } else {
                toast.error(res.data.message);
                setCurrentUser(null);
                setIsLoggedIn(false);
                return { success: false, message: res.data.message };
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Login failed!");
            setCurrentUser(null);
            setIsLoggedIn(false);
            return { success: false, message: error.response?.data?.message || "Login failed!" };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
            setCurrentUser(null);
            setIsLoggedIn(false);
            toast.success("Logged out successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Logout failed!");
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, isLoggedIn, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};