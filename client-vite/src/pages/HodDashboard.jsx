// client-vite/src/pages/HodDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';


import DashboardLayout from '../components/DashboardLayout.jsx'; 

const HodDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Loading HOD Dashboard...</div>;
    }

    console.log("DEBUG: currentUser in HodDashboard:", currentUser);

    // The role checks are now primarily handled within DashboardLayout for sidebar items,
    // but keeping them here is harmless if you use them for conditional rendering of main content.
    // const isHOD = currentUser.role === 'hod' || currentUser.role === 'HOD';
    // const isTeacher = currentUser.role === 'Teacher'; 

    return (
        
        <DashboardLayout>
           

            <header className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">
                    Welcome, {currentUser.name || 'Admin'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Your role: <span className="font-medium capitalize">{currentUser.role || 'HOD'}</span>
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Cards for HOD functionalities */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                    <p className="text-gray-600">View and manage teacher and student accounts.</p>
                    <button 
                        onClick={() => navigate('/manage-users')} // Assuming you'll have this route
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        Go to Users
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">View Question Papers</h3>
                    <p className="text-gray-600">Review created question papers.</p>
                    <button 
                        onClick={() => navigate('/view-question-papers')} // Assuming you'll have this route
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        View QPs
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
                    <p className="text-gray-600">Access performance reports.</p>
                    <button 
                        onClick={() => navigate('/reports')} // Assuming you'll have this route
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        View Reports
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default HodDashboard;