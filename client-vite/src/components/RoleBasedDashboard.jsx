// src/components/RoleBasedDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';
import HodDashboard from '../pages/HodDashBoard.jsx'; // Make sure paths are correct
import TeacherDashboard from '../pages/TeacherDashBoard.jsx'; // Make sure paths are correct

const RoleBasedDashboard = () => {
    const { currentUser, isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();

    // This component acts as a router based on role.
    // It should only be rendered if isLoggedIn is true and loading is false.

    React.useEffect(() => {
        if (!loading && !isLoggedIn) {
            // If not logged in after initial check, redirect to login
            navigate('/login');
        } else if (!loading && isLoggedIn && currentUser) {
            // If logged in, navigate to the specific dashboard based on role
            if (currentUser.role === 'hod') {
                navigate('/hod-dashboard', { replace: true }); // Use replace to prevent back button issues
            } else if (currentUser.role === 'teacher') {
                navigate('/teacher-dashboard', { replace: true });
            } else {
                // Fallback for unexpected roles or if role is not yet fully loaded
                console.warn("User logged in with unrecognized role, redirecting to home:", currentUser?.role);
                navigate('/', { replace: true });
            }
        }
    }, [loading, isLoggedIn, currentUser, navigate]); // Depend on these auth states

    if (loading) {
        return <div>Loading user data...</div>;
    }

    // We return null because the actual dashboard content is handled by the redirect above
    // to the appropriate route (e.g., /hod-dashboard or /teacher-dashboard).
    // The App.jsx's <Route element={<ProtectedRoutes ...> will then render the actual dashboard.
    return null;
};

export default RoleBasedDashboard;