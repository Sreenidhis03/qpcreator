// client-vite/src/pages/CreateQP.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';

import {
    subjectsByProgramAndSemester,
    semesterOptions,
    moduleOptions, // Assuming this is an array of strings like ['Module 1', 'Module 2']
    cosOptions, // Assuming this is an array of strings like ['CO1', 'CO2']
    programs
} from '../data/academicData';

export default function CreateQP() {
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth();

    // --- State for General Paper Details ---
    const [collegeName, setCollegeName] = useState('Bharata Mata College(Autonomous)');
    const [examTitle, setExamTitle] = useState('First Semester B.Tech. Degree Examination');
    const [examMonthYear, setExamMonthYear] = useState('January 2025');
    const [courseDetails, setCourseDetails] = useState('Integrated Msc Computer Science');
    const [paperCode, setPaperCode] = useState('');
    const [time, setTime] = useState('3 Hours');
    const [maxWeight, setMaxWeight] = useState(''); // Total Marks for the paper

    // --- State for Program/Subject Selection ---
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(''); // This will be the "paperName" on the QP
    const [semesterSubjects, setSemesterSubjects] = useState([]);

    // --- State for Dynamic Parts of the Question Paper ---
    const [parts, setParts] = useState([
        {
            partName: 'Part A',
            moduleNumber: [], // Array for multiple module selection via checkboxes
            instructions: 'Answer all questions',
            partCO: [], // Array for multiple CO selection via checkboxes
            expectedPartWeightage: '', // Expected total weightage from questions in this part
            questionsToPick: '' // NEW: How many questions to pick for this part
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Effect to update available subjects when program or semester changes
    useEffect(() => {
        if (selectedProgram && selectedSemester) {
            const subjects = subjectsByProgramAndSemester[selectedProgram]?.[selectedSemester] || [];
            setSemesterSubjects(subjects);
            if (!subjects.includes(selectedSubject)) {
                setSelectedSubject('');
            }
        } else {
            setSemesterSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedProgram, selectedSemester, selectedSubject]);

    // Role-based redirection
    useEffect(() => {
        if (!authLoading && (!currentUser || currentUser.role.toLowerCase() !== 'hod')) {
            toast.error("Access Denied. Only HODs are authorized to create question papers.");
            navigate('/login');
        }
    }, [currentUser, authLoading, navigate]);


    // Handle adding a new part
    const handleAddPart = () => {
        const newPartName = `Part ${String.fromCharCode(65 + parts.length)}`;
        setParts([...parts, {
            partName: newPartName,
            moduleNumber: [],
            instructions: '',
            partCO: [],
            expectedPartWeightage: '',
            questionsToPick: '' // Initialize new field
        }]);
    };

    // Handle removing a part
    const handleRemovePart = (index) => {
        setParts(parts.filter((_, i) => i !== index));
    };

    // Handler for checkbox changes (for modules and COs)
    const handleCheckboxChange = (partIndex, field, value, isChecked) => {
        const newParts = [...parts];
        if (isChecked) {
            if (!newParts[partIndex][field].includes(value)) {
                newParts[partIndex][field] = [...newParts[partIndex][field], value];
            }
        } else {
            newParts[partIndex][field] = newParts[partIndex][field].filter(item => item !== value);
        }
        setParts(newParts);
    };

    // Generic handler for text/number input changes in parts
    const handlePartInputChange = (partIndex, field, value) => {
        const newParts = [...parts];
        newParts[partIndex][field] = value;
        setParts(newParts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // --- Client-Side Validation ---
        if (!collegeName || !examTitle || !examMonthYear || !courseDetails || !paperCode || !selectedProgram || !selectedSemester || !selectedSubject || !time || !maxWeight) {
            toast.error("Please fill in all general paper details.");
            return;
        }

        if (parts.length === 0) {
            toast.error("Please define at least one part for the question paper.");
            return;
        }

        for (const part of parts) {
            if (!part.partName || part.moduleNumber.length === 0 || !part.instructions || part.partCO.length === 0 || !part.expectedPartWeightage || !part.questionsToPick) {
                toast.error(`Please fill in all details for "${part.partName}". Ensure modules, COs, and number of questions to pick are selected.`);
                return;
            }
        }

        setLoading(true);

        try {
            const currentUserId = currentUser?._id || currentUser?.id;

            const questionPaperData = {
                collegeName,
                examTitle,
                examMonthYear,
                courseDetails,
                paperCode,
                paperName: selectedSubject, // Using selectedSubject as paperName
                time,
                maxWeight: Number(maxWeight),
                program: selectedProgram,
                semester: selectedSemester,
                subject: selectedSubject, // Also send subject separately for question fetching
                parts: parts.map(part => ({
                    partName: part.partName,
                    moduleNumber: part.moduleNumber.map(String), // Ensure they are strings
                    instructions: part.instructions,
                    partCO: part.partCO.map(String), // Ensure they are strings
                    expectedPartWeightage: Number(part.expectedPartWeightage),
                    questionsToPick: Number(part.questionsToPick) // Ensure number
                })),
                createdBy: currentUserId,
            };
            console.log(questionPaperData)
            // --- API call to your backend to GENERATE the paper ---
            // This endpoint will now use the detailed 'parts' array to pick questions
            const response = await axios.post(
                'http://localhost:4000/api/question-papers/generate-question-paper', // <-- Changed to the new generate endpoint
                questionPaperData,
                { withCredentials: true }
            );

            const generatedQpId = response.data.questionPaperId; 
            if (generatedQpId) {
                toast.success("Question paper generated successfully!");
                navigate(`/hod-preview-question-papers/${generatedQpId}`);
            } else {
                throw new Error("Failed to retrieve question paper ID from backend response.");
            }

        } catch (err) {
            console.error("Error generating question paper:", err);
            setError(err.response?.data?.message || "Failed to generate question paper. Please try again.");
            toast.error(err.response?.data?.message || "Failed to generate question paper.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <DashboardLayout><div className="text-center p-4">Loading authentication status...</div></DashboardLayout>;
    }

    if (!currentUser || currentUser.role.toLowerCase() !== 'hod') {
        // Redirection handled by useEffect
        return null;
    }

    return (
        <DashboardLayout>
            <div className="p-4 bg-gray-100 min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Generate Question Paper</h2>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* --- Section: General Paper Header Details --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Paper Header Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="collegeName" className="block text-gray-700 text-sm font-bold mb-2">College Name:</label>
                                <input type="text" id="collegeName" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="examTitle" className="block text-gray-700 text-sm font-bold mb-2">Exam Title:</label>
                                <input type="text" id="examTitle" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="examMonthYear" className="block text-gray-700 text-sm font-bold mb-2">Exam Month/Year:</label>
                                <input type="text" id="examMonthYear" value={examMonthYear} onChange={(e) => setExamMonthYear(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="courseDetails" className="block text-gray-700 text-sm font-bold mb-2">Course Details:</label>
                                <input type="text" id="courseDetails" value={courseDetails} onChange={(e) => setCourseDetails(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Time Allotted:</label>
                                <input type="text" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="maxWeight" className="block text-gray-700 text-sm font-bold mb-2">Max. Weight (Total for paper):</label>
                                <input type="number" id="maxWeight" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g., 50" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Program */}
                            <div>
                                <label htmlFor="selectedProgram" className="block text-gray-700 text-sm font-bold mb-2">Program:</label>
                                <select id="selectedProgram" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                                    <option value="">Select Program</option>
                                    {programs && programs.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            {/* Semester */}
                            <div>
                                <label htmlFor="selectedSemester" className="block text-gray-700 text-sm font-bold mb-2">Semester:</label>
                                <select id="selectedSemester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!selectedProgram} required>
                                    <option value="">Select Semester</option>
                                    {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            {/* Subject (also serves as Paper Name) */}
                            <div>
                                <label htmlFor="selectedSubject" className="block text-gray-700 text-sm font-bold mb-2">Subject (will be Paper Name):</label>
                                <select id="selectedSubject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!selectedSemester} required>
                                    <option value="">Select Subject</option>
                                    {semesterSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Paper Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="paperCode" className="block text-gray-700 text-sm font-bold mb-2">Paper Code:</label>
                                <input type="text" id="paperCode" value={paperCode} onChange={(e) => setPaperCode(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g., CS201" required />
                            </div>
                        </div>
                    </div>

                    {/* --- Section: Question Paper Parts Configuration --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Question Paper Parts Configuration</h3>
                        {parts.map((part, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50 relative">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">{part.partName}</h4>
                                {parts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePart(index)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-1 rounded-full text-xs w-6 h-6 flex items-center justify-center"
                                        title="Remove Part"
                                    >
                                        X
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Part Name Input */}
                                    <div>
                                        <label htmlFor={`partName-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Part Name:</label>
                                        <input type="text" id={`partName-${index}`} value={part.partName} onChange={(e) => handlePartInputChange(index, 'partName', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                    </div>
                                    {/* Questions to Pick for this Part */}
                                    <div>
                                        <label htmlFor={`questionsToPick-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Number of Questions to Pick for this Part:</label>
                                        <input
                                            type="number"
                                            id={`questionsToPick-${index}`}
                                            value={part.questionsToPick}
                                            onChange={(e) => handlePartInputChange(index, 'questionsToPick', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="e.g., 5"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Modules for this Part (Checkboxes) */}
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Modules for this Part (select one or more):</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border p-2 rounded">
                                        {moduleOptions.map(mod => (
                                            <div key={mod} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`module-${index}-${mod}`}
                                                    value={mod}
                                                    checked={part.moduleNumber.includes(mod)}
                                                    onChange={(e) => handleCheckboxChange(index, 'moduleNumber', mod, e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`module-${index}-${mod}`} className="text-gray-700 text-sm">{mod}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Instructions for this Part */}
                                <div className="mb-4 mt-4">
                                    <label htmlFor={`instructions-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Instructions for this Part:</label>
                                    <textarea id={`instructions-${index}`} value={part.instructions} onChange={(e) => handlePartInputChange(index, 'instructions', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20" placeholder="e.g., Answer any five questions from this part." required />
                                </div>
                                {/* COs for this Part (Checkboxes) & Expected Weightage */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">COs for this Part (select one or more):</label>
                                        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border p-2 rounded">
                                            {cosOptions.map(co => (
                                                <div key={co} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`co-${index}-${co}`}
                                                        value={co}
                                                        checked={part.partCO.includes(co)}
                                                        onChange={(e) => handleCheckboxChange(index, 'partCO', co, e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={`co-${index}-${co}`} className="text-gray-700 text-sm">{co}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor={`expectedPartWeightage-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Expected Total Weightage for this Part:</label>
                                        <input type="number" id={`expectedPartWeightage-${index}`} value={part.expectedPartWeightage} onChange={(e) => handlePartInputChange(index, 'expectedPartWeightage', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g., 20" required />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddPart}
                            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add New Part
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline text-lg"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Question Paper'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}