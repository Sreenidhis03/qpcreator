// client-vite/src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';
import { assets } from '../assets/assets';

export default function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start visible

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Ensure currentUser is loaded before rendering dynamic content in the sidebar
    if (!currentUser) {
        return <div>Loading dashboard layout...</div>;
    }

    const userRole = currentUser.role || '';
    const isHOD = userRole.toLowerCase() === 'hod';
    const isTeacher = userRole.toLowerCase() === 'teacher';

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar / Navigation */}
            <aside 
                className={`bg-slate-800 text-white p-6 shadow-lg transition-all duration-300 ease-in-out 
                           ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'}`}
            >
                {/* Logo Section - Now acts as the toggle button */}
                <div 
                    className="mb-6 flex justify-center items-center cursor-pointer" 
                    onClick={toggleSidebar} 
                >
                    <img
                        src={assets.logo}
                        alt="QPCreator Logo"
                        className="w-40 object-contain"
                    />
                </div>

                <h2 className={`text-2xl font-bold mb-6 text-indigo-300 ${!isSidebarOpen && 'hidden'}`}>
                    {isHOD ? "HOD Panel" : isTeacher ? "Teacher Panel" : "Dashboard"} 
                </h2>

                <nav className={`${!isSidebarOpen && 'hidden'}`}> 
                    <ul>
                        <li className="mb-4">
                            <button
                                onClick={() => navigate(isHOD ? '/hod-dashboard' : '/teacher-dashboard')}
                                className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                            >
                                Dashboard Home
                            </button>
                        </li>

                        {isHOD && (
                            <>
                                <li className="mb-4">
                                    <button
                                        onClick={() => navigate('/create-question-paper')}
                                        className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                                    >
                                        Create Question Paper
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => navigate('/preview-questions')} 
                                        className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                                    >
                                        Question Bank Preview
                                    </button>
                                </li>
                            </>
                        )}

                        {isTeacher && (
                            <>
                                <li className="mb-4">
                                    <button
                                        onClick={() => navigate('/add-questions')}
                                        className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                                    >
                                        Add Questions
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => navigate('/preview-questions')} 
                                        className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                                    >
                                        Question Bank Preview
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => navigate('/teacher-preview')} 
                                        className="w-full text-left py-2 px-4 rounded-md hover:bg-slate-700 transition duration-200"
                                    >
                                        My Added Questions
                                    </button>
                                </li>
                            </>
                        )}

                        <li className="mt-8">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main 
                className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-0'}`} 
            >
                {/* Burger/Toggle Button for mobile (Optional - can be removed if logo is sufficient) */}
                {!isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-md shadow-lg" 
                    >
                        ☰
                    </button>
                )}

                {children} 
            </main>
        </div>
    );
}