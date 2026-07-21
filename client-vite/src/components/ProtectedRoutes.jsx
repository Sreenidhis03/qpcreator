// client-vite/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx'; // Adjust path if your UserContext.jsx is elsewhere

const ProtectedRoute = ({ allowedRoles }) => {
    const { isLoggedIn, currentUser, loading } = useAuth();

    // If still loading authentication status, show a loading indicator
    if (loading) {
        return <div>Loading authentication...</div>; // Or a proper loading spinner/component
    }

    // If user is not logged in, redirect them to the login page
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified AND user is logged in
    if (allowedRoles && currentUser) {
        
        const userRoleLower = currentUser.role ? currentUser.role.toLowerCase() : '';

       
        const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

        // Check if the user's lowercase role is NOT among the lowercase allowed roles
        if (!allowedRolesLower.includes(userRoleLower)) {
            console.warn(`Access Denied: User role '${currentUser.role}' not in allowed roles: ${allowedRoles.join(', ')}`);
            
            // Redirect to a specific dashboard based on their actual role, or a generic home/unauthorized page
            if (userRoleLower === 'hod') { // Use userRoleLower for consistency
                return <Navigate to="/hod-dashboard" replace />;
            } else if (userRoleLower === 'teacher') { // Use userRoleLower for consistency
                return <Navigate to="/teacher-dashboard" replace />;
            }
            // Fallback for roles that don't have a specific dashboard or just deny access
            return <Navigate to="/" replace />; // Or a custom "/access-denied" page
        }
    }

    // If authenticated AND authorized (role matches or no role restrictions), render the nested routes
    return <Outlet />;
};

export default ProtectedRoute;