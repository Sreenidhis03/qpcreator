// client-vite/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPswrd from './pages/ResetPswrd';
import CreateQuestionPaper from './pages/CreateQP';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddQuestions from './pages/AddQuestions';
import PreviewQuestions from './pages/PreviewQuestions';
import { QuestionProvider } from './context/QuestionContext';
import TeacherPreview from './pages/TeacherPreview';

import { UserProvider, useAuth } from './context/UserContext.jsx'; // Correct import
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import HodDashboard from './pages/HodDashBoard.jsx';
import TeacherDashboard from './pages/TeacherDashBoard.jsx';
import RoleBasedDashboard from './components/RoleBasedDashboard.jsx';

import HodPreviewQuestionPapers from './pages/HodPreviewQuestionPapers.jsx';
import HodConvertPrintPaper from './pages/HodConvertPrintPaper.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import ViewQuestionPaper from './pages/ViewQuestionPaper.jsx';


const AppContent = () => {
    const { loading, isLoggedIn, currentUser } = useAuth();

    if (loading) {
        return <div>Loading application...</div>;
    }

    return (
        <>
            <ToastContainer />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={isLoggedIn ? <RoleBasedDashboard /> : <Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-pswrd" element={<ResetPswrd />} />

                {/* Protected Routes for HODs only */}
                <Route element={<ProtectedRoutes allowedRoles={['hod', 'HOD']} />}>
                    <Route path="/hod-dashboard" element={<HodDashboard />} />
                    <Route path="/create-question-paper" element={<CreateQuestionPaper />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/hod-preview-question-papers/:qpId" element={<HodPreviewQuestionPapers />} />
                    <Route path="/hod-convert-print-paper/:qpId" element={<HodConvertPrintPaper />} />
                    <Route path="/view-question-papers" element={<ViewQuestionPaper />} />
                    {/* <Route path="/preview-questions" element={<PreviewQuestions />} /> */}
                </Route>

                {/* Protected Routes for Teachers only */}
                <Route element={<ProtectedRoutes allowedRoles={['teacher', 'Teacher']} />}>
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    <Route path="/add-questions" element={<AddQuestions />} />

                    <Route path="/teacher-preview" element={<TeacherPreview />} />
                </Route>
                <Route path="/preview-questions" element={<PreviewQuestions />} />
                {/* Fallback for any routes that don't match */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <UserProvider> {/* Correct Provider component name */}
            <QuestionProvider>
                <AppContent />
            </QuestionProvider>
        </UserProvider>
    );
};

export default App;