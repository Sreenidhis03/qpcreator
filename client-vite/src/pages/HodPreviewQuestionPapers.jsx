// client-vite/src/pages/HodPreviewQuestionPapers.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import axios from 'axios'; // <-- This import is now active!

const HodPreviewQuestionPapers = () => {
    const { qpId } = useParams(); // Get the question paper ID from the URL
    const navigate = useNavigate();
    const [questionPaper, setQuestionPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (qpId) {
            axios.get(`http://localhost:4000/api/question-papers/${qpId}`, { withCredentials: true })
                .then(response => {
                    setQuestionPaper(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching question paper:', err);
                    if (err.response?.data?.message) {
                        setError(`Failed to load question paper: ${err.response.data.message}`);
                    } else {
                        setError('Failed to load question paper for preview. Please check network and backend.');
                    }
                    setLoading(false);
                });
        } else {
            setError('No question paper ID provided for preview.');
            setLoading(false);
        }
    }, [qpId]);
    // Function to handle the "Approve & Convert" button click
    const handleApproveAndConvert = () => {
        if (qpId) {
            // Navigate to the convert/print page, passing the same qpId
            navigate(`/hod-convert-print-paper/${qpId}`);
        } else {
            alert('Cannot proceed: No question paper ID available.');
        }
    };

    // --- Loading, Error, and No Paper Found States ---
    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-gray-600">Loading question paper preview...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!questionPaper) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-gray-600">No question paper found for preview.</p>
                </div>
            </DashboardLayout>
        );
    }

    // --- Render the Question Paper Details ---
    return (
        <DashboardLayout>
            <div className="p-8 bg-gray-50 min-h-full">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Preview Question Paper (HOD)</h1>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-2">{questionPaper.examTitle}</h2>
                    <p className="text-gray-700 mb-1"><strong>College:</strong> {questionPaper.collegeName}</p>
                    <p className="text-gray-700 mb-1"><strong>Course:</strong> {questionPaper.courseDetails}</p>
                    <p className="text-gray-700 mb-1"><strong>Paper Code:</strong> {questionPaper.paperCode}</p>
                    <p className="text-gray-700 mb-1"><strong>Paper Name:</strong> {questionPaper.paperName}</p>
                    <p className="text-gray-700 mb-1"><strong>Exam Date:</strong> {questionPaper.examMonthYear}</p>
                    <p className="text-gray-700 mb-1"><strong>Duration:</strong> {questionPaper.time}</p>
                    <p className="text-gray-700 mb-4"><strong>Status:</strong> {questionPaper.status}</p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">Parts:</h3>
                    {questionPaper.parts && questionPaper.parts.length > 0 ? (
                        questionPaper.parts.map((part, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                                <h4 className="text-lg font-bold mb-2">{part.partName} - {part.moduleName}</h4>
                                <p className="text-gray-700 mb-1"><strong>COs:</strong> {part.partCO}</p>
                                <p className="text-gray-700 mb-2"><strong>Instructions:</strong> {part.instructions}</p>

                                <h5 className="font-semibold">Questions:</h5>
                                {part.questions && part.questions.length > 0 ? (
                                    part.questions.map((q, qIdx) => (
                                        <div key={q._id || qIdx} className="mb-4 pl-4">
                                            <p className="text-gray-800 mb-1">Q{qIdx + 1}. {q.questionText} ({q.weightage} Marks)</p>
                                            {q.type === 'Multiple Choice' && q.options?.length > 0 && (
                                                <ul className="list-disc list-inside ml-4">
                                                    {q.options.map((opt, i) => (
                                                        <li key={i}>{String.fromCharCode(65 + i)}. {opt}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">Bloom's Level: {q.bloomsLevel} | COs: {q.cos?.join(', ') || 'N/A'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No questions added yet.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No parts defined in this question paper.</p>
                    )}

                    <button
                        onClick={handleApproveAndConvert}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Approve & Convert to PDF
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HodPreviewQuestionPapers;