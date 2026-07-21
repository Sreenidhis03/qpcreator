// client/src/pages/TeacherPreview.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from '../context/UserContext.jsx'; // Make sure this is correct: import { useAuth } from '../context/AuthContext.jsx'; // <<< IMPORTANT: Confirm file name

// Import constants from the new academicData.js file
import {
  subjectsByProgramAndSemester,
  electives,
  semesterOptions,
  moduleOptions,
  bloomsTaxonomy,
  questionTypes,
  cosOptions
} from '../data/academicData';

export default function TeacherPreview() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth(); // Get currentUser and authLoading from useAuth

  const [filters, setFilters] = useState({
    program: '',
    semester: '',
    subject: '',
    module: '',
    bloomsLevel: '',
    type: '',
    cos: ''
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Local loading state
  const [error, setError] = useState('');
  const [selectedElective, setSelectedElective] = useState("");

  const semesterSubjects = filters.program && filters.semester ? subjectsByProgramAndSemester[filters.program]?.[filters.semester] || [] : [];
  const isElective = (subjectName) => {
    return typeof subjectName === 'string' && subjectName.includes("Elective");
  };

  const electiveOptions = filters.program && filters.subject && isElective(filters.subject)
    ? electives[filters.program]?.[filters.subject] || []
    : [];

  const fetchFilteredQuestions = async () => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      return;
    }

    setLoading(true);
    setError('');

    const currentTeacherId = currentUser?._id || currentUser?.id; // Use _id or id

    if (!currentTeacherId) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      setQuestions([]);
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('teacherId', currentTeacherId); // Always include teacherId

      // Append other filters
      if (filters.program) queryParams.append('program', filters.program);
      if (filters.semester) queryParams.append('semester', filters.semester);
      // Determine subject based on whether it's an elective
      const effectiveSubject = isElective(filters.subject) ? selectedElective : filters.subject;
      if (effectiveSubject) queryParams.append('subject', effectiveSubject);
      if (filters.module) queryParams.append('moduleNumber', filters.module);
      if (filters.bloomsLevel) queryParams.append('bloomsLevel', filters.bloomsLevel);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.cos) queryParams.append('cos', filters.cos);

      const url = `http://localhost:4000/api/questions?${queryParams.toString()}`;
      const res = await axios.get(url, {
        withCredentials: true // IMPORTANT: Send cookies
      });

      setQuestions(res.data);
      toast.success("Questions loaded successfully!");
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.response?.data?.message || "Failed to fetch questions. Please try again.");
      toast.error(err.response?.data?.message || "Failed to fetch questions.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Only fetch if currentUser is available and authLoading is false
    if (!authLoading && currentUser) {
      fetchFilteredQuestions();
    } else if (!authLoading && !currentUser) {
      // If auth is done loading and no user, set error
      setError("Please log in to view your questions.");
      setQuestions([]);
    }
  }, [filters, currentUser, authLoading, selectedElective]); // Add selectedElective and authLoading to dependencies

  // Delete function (remains largely the same, but now uses withCredentials)
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    setLoading(true);
    try {
      // No need for token, browser handles cookie
      await axios.delete(`http://localhost:4000/api/questions/${id}`, {
        withCredentials: true // IMPORTANT: Send cookies
      });
      toast.success("Question deleted successfully!");
      fetchFilteredQuestions(); // Re-fetch questions after deletion
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.response?.data?.message || "Failed to delete question.");
      toast.error(err.response?.data?.message || "Failed to delete question.");
    } finally {
      setLoading(false);
    }
  };

  // Display loading while auth is being checked
  if (authLoading) {
    return <DashboardLayout><div className="text-center p-4">Loading authentication status...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Question Bank Preview</h2>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Filter Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ... (filter JSX remains the same, using imported constants) ... */}
            {/* Program Filter */}
            <div>
              <label htmlFor="program" className="block text-gray-700 text-sm font-bold mb-2">
                Program:
              </label>
              <select
                id="program"
                name="program"
                value={filters.program}
                onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value, semester: '', subject: '', selectedElective: '' }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Programs</option>
                {Object.keys(subjectsByProgramAndSemester).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label htmlFor="semester" className="block text-gray-700 text-sm font-bold mb-2">
                Semester:
              </label>
              <select
                id="semester"
                name="semester"
                value={filters.semester}
                onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value, subject: '', selectedElective: '' }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!filters.program}
              >
                <option value="">All Semesters</option>
                {semesterOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                Subject:
              </label>
              <select
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, subject: e.target.value }));
                  setSelectedElective(""); // Reset elective if subject changes
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!filters.program || !filters.semester}
              >
                <option value="">All Subjects</option>
                {semesterSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Elective Filter (Conditional) */}
            {isElective(filters.subject) && electiveOptions.length > 0 && (
              <div>
                <label htmlFor="electiveSubject" className="block text-gray-700 text-sm font-bold mb-2">
                  Select Elective:
                </label>
                <select
                  id="electiveSubject"
                  name="electiveSubject"
                  value={selectedElective}
                  onChange={(e) => setSelectedElective(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">All Electives</option>
                  {electiveOptions.map((elec) => (
                    <option key={elec} value={elec}>{elec}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Module Filter */}
            <div>
              <label htmlFor="module" className="block text-gray-700 text-sm font-bold mb-2">
                Module:
              </label>
              <select
                id="module"
                name="module"
                value={filters.module}
                onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Modules</option>
                {moduleOptions.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            {/* Bloom's Level Filter */}
            <div>
              <label htmlFor="bloomsLevel" className="block text-gray-700 text-sm font-bold mb-2">
                Bloom's Level:
              </label>
              <select
                id="bloomsLevel"
                name="bloomsLevel"
                value={filters.bloomsLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, bloomsLevel: e.target.value }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Levels</option>
                {bloomsTaxonomy.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                Type:
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Types</option>
                {questionTypes.map((qType) => (
                  <option key={qType} value={qType}>{qType}</option>
                ))}
              </select>
            </div>

            {/* COs Filter */}
            <div>
              <label htmlFor="cos" className="block text-gray-700 text-sm font-bold mb-2">
                COs:
              </label>
              <select
                id="cos"
                name="cos"
                value={filters.cos}
                onChange={(e) => setFilters(prev => ({ ...prev, cos: e.target.value }))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All COs</option>
                {cosOptions.map((co) => (
                  <option key={co} value={co}>{co}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                setFilters({
                  program: '', semester: '', subject: '', module: '',
                  bloomsLevel: '', type: '', cos: ''
                });
                setSelectedElective('');
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none focus:shadow-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Display Questions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Questions</h3>
          {loading && <p>Loading questions...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {questions.length === 0 && !loading && !error && (
            <p>No questions found matching the selected filters.</p>
          )}
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q._id} className="border p-4 rounded-md shadow-sm">
                <p className="font-semibold text-gray-900">{q.questionText}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Program:</span> {q.program} |
                  <span className="font-medium"> Semester:</span> {q.semester} |
                  <span className="font-medium"> Subject:</span> {q.subject} |
                  <span className="font-medium"> Module:</span> {q.moduleNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Weightage:</span> {q.weightage} |
                  <span className="font-medium"> Bloom's:</span> {q.bloomsLevel} |
                  <span className="font-medium"> Type:</span> {q.type} |
                  <span className="font-medium"> CO:</span> {q.cos}
                </p>
                <div className="mt-3 text-right">
                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}