import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContent = React.createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/isAuthenticated', {
                withCredentials: true, // <--- Add this
            });

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            toast.error(error.message);
            setIsLoggedin(false);
            setUserData(null);
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + 'get-user-data', {
                withCredentials: true, // <--- Add this
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []); // <--- Add empty dependency array to avoid infinite calls

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
