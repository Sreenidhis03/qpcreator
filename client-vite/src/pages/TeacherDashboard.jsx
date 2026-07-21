// client-vite/src/pages/TeacherDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';
// REMOVE: import { assets } from '../assets/assets'; // This is no longer needed here

import DashboardLayout from '../components/DashboardLayout.jsx'; // Correct import for DashboardLayout

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Removed logout as it's handled in DashboardLayout

    if (!currentUser) {
        return <div>Loading Teacher Dashboard...</div>;
    }

    console.log("DEBUG: currentUser in TeacherDashboard:", currentUser);

    // isTeacher and isHOD checks are primarily for sidebar rendering in DashboardLayout
    // No longer strictly necessary here, but harmless if kept.
    // const isTeacher = currentUser.role === 'Teacher' || currentUser.role === 'teacher';
    // const isHOD = currentUser.role === 'Hod' || currentUser.role === 'HOD'; 

    return (
        // TeacherDashboard content is now the 'children' of DashboardLayout
        <DashboardLayout> 
            {/* The entire <div className="min-h-screen bg-gray-100 flex"> and <aside>
                ARE PROVIDED BY DashboardLayout.jsx.
                DO NOT INCLUDE THEM HERE. */}

            {/* This is the main content area for the Teacher Dashboard */}
            <header className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">
                    Welcome, {currentUser.name || 'Teacher'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Your role: <span className="font-medium capitalize">{currentUser.role || 'Teacher'}</span>
                </p>
            </header>

            {/* Updated Cards for Teacher functionalities */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card for Adding Questions */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Add New Questions</h3>
                    <p className="text-gray-600">Submit new questions to the question bank for various subjects and modules.</p>
                    <button
                        onClick={() => navigate('/add-questions')}
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        Start Adding Questions
                    </button>
                </div>

                {/* Card for Question Bank Preview */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Question Bank Preview</h3>
                    <p className="text-gray-600">Review all questions currently available in the question bank.</p>
                    <button
                        onClick={() => navigate('/preview-questions')}
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        View All Questions
                    </button>
                </div>
                
                {/* Card for Teacher Specific Preview (e.g., questions added by this teacher) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">My Added Questions</h3>
                    <p className="text-gray-600">See the questions you have contributed to the question bank.</p>
                    <button
                        onClick={() => navigate('/teacher-preview')}
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        My Questions
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default TeacherDashboard;