// client/src/pages/AddQuestions.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx'; // Corrected path if it's UserContext, but based on your file, it should be AuthContext.jsx
// Make sure this is correct: import { useAuth } from '../context/AuthContext.jsx'; // <<< IMPORTANT: Confirm file name
import DashboardLayout from '../components/DashboardLayout.jsx';
import { bloomsLevelMapping } from '../data/academicData';
import {
  subjectsByProgramAndSemester,
  electives,
  semesterOptions,
  moduleOptions,
  bloomsTaxonomy,
  questionTypes,
  cosOptions
} from '../data/academicData';

export default function AddQuestions() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth(); // Get currentUser and authLoading from context

  // ... (rest of your state variables: program, semester, subject, module, questions, etc.) ...
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [module, setModule] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [weightage, setWeightage] = useState('');
  const [bloomsLevel, setBloomsLevel] = useState('');
  const [type, setType] = useState('');
  const [cos, setCos] = useState('');
  const [allQuestionsForCurrentModule, setAllQuestionsForCurrentModule] = useState([]);
  const [loading, setLoading] = useState(false); // Local loading for component
  const [error, setError] = useState('');
  const [allQuestions, setAllQuestions] = useState([]); // State to hold all questions fetched from DB
  const [selectedElective, setSelectedElective] = useState('');

  const semesterSubjects = program && semester ? subjectsByProgramAndSemester[program]?.[semester] || [] : [];
  const isElective = (subjectName) => typeof subjectName === 'string' && subjectName.includes("Elective"); // Added type check here
  const electiveOptions = program && subject && isElective(subject)
    ? electives[program]?.[subject] || []
    : [];

  // Fetching questions (corrected logic for cookie-based auth)
  useEffect(() => {
    async function fetchQuestions() {
      // Don't fetch if auth is still loading
      if (authLoading) {
        return;
      }

      const currentTeacherId = currentUser?._id || currentUser?.id; // Use _id or id based on backend response structure

      if (!currentTeacherId) {
        setError("User not authenticated. Please log in."); // Changed message slightly
        setLoading(false);
        setAllQuestions([]);
        return;
      }

      setLoading(true); // Start local loading for fetch operation
      setError(''); // Clear previous errors

      try {
        const res = await axios.get(`http://localhost:4000/api/questions?teacherId=${currentTeacherId}`, {
          withCredentials: true // IMPORTANT: Send cookies
        });
        setAllQuestions(res.data);
        setError(""); // Clear error if successful
      } catch (err) {
        console.error("Error fetching all questions:", err);
        setAllQuestions([]);
        setError(err.response?.data?.message || "Failed to load existing questions.");
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if currentUser is available and authLoading is false
    if (!authLoading && currentUser) {
      fetchQuestions();
    } else if (!authLoading && !currentUser) {
      // If auth is done loading and no user, set error
      setError("Please log in to view and add questions.");
      setAllQuestions([]);
    }
  }, [currentUser, authLoading]); // Dependency on currentUser and authLoading

  // Add question to temporary state
  const handleAddQuestion = () => {
    // ... (logic remains the same) ...
    if (!questionText || !weightage || !bloomsLevel || !type || !cos) {
      toast.error("Please fill in all question fields.");
      return;
    }

    const newQuestion = {
      questionText,
      weightage: Number(weightage),
      bloomsLevel,
      type,
      cos,
      moduleName,
      moduleNumber: module,
      program,
      semester,
      subject: isElective(subject) ? selectedElective : subject,
      teacherId: currentUser?._id || currentUser?.id // Ensure correct ID property
    };

    setAllQuestionsForCurrentModule(prevQuestions => [...prevQuestions, newQuestion]);
    toast.success("Question added to current module preview!");

    // Clear question input fields
    setQuestionText('');
    setWeightage('');
    setBloomsLevel('');
    setType('');
    setCos('');
  };


  // Final submission of all questions for the module
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (allQuestionsForCurrentModule.length === 0) {
      toast.error("No questions to submit for the current module.");
      return;
    }

    setLoading(true);
    setError('');

    const currentTeacherId = currentUser?._id || currentUser?.id;
    if (!currentTeacherId) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Loop through each question and submit
      for (const question of allQuestionsForCurrentModule) {
        // Create a copy of the question to modify its bloomsLevel
        const questionToSubmit = { ...question, teacherId: currentTeacherId };

        questionToSubmit.bloomsLevel = bloomsLevelMapping[question.bloomsLevel] || question.bloomsLevel;
        

        await axios.post('http://localhost:4000/api/questions', questionToSubmit, {
          withCredentials: true // IMPORTANT: Send cookies
        });
      }

      toast.success("All questions for the module submitted successfully!");
      setAllQuestionsForCurrentModule([]); // Clear preview questions

      // Re-fetch questions to update the list
      const res = await axios.get(`http://localhost:4000/api/questions?teacherId=${currentTeacherId}`, {
        withCredentials: true // IMPORTANT: Send cookies
      });
      setAllQuestions(res.data);

    } catch (err) {
      console.error("Error submitting questions:", err);
      console.log("Full error response:", err.response);
      setError(err.response?.data?.message || "Failed to submit questions.");
      toast.error(err.response?.data?.message || "Failed to submit questions.");
    } finally {
      setLoading(false);
    }
  };

  // Display loading while auth is being checked
  if (authLoading) {
    return <DashboardLayout><div className="text-center p-4">Loading authentication status...</div></DashboardLayout>;
  }

  // ... (rest of your component's JSX, using the imported constants) ...
  return (
    <DashboardLayout>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Questions</h2>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {/* Module Meta-data */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Module Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Program */}
            <div>
              <label htmlFor="program" className="block text-gray-700 text-sm font-bold mb-2">
                Program:
              </label>
              <select
                id="program"
                name="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Program</option>
                {Object.keys(subjectsByProgramAndSemester).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label htmlFor="semester" className="block text-gray-700 text-sm font-bold mb-2">
                Semester:
              </label>
              <select
                id="semester"
                name="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!program}
                required
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                Subject:
              </label>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!program || !semester}
                required
              >
                <option value="">Select Subject</option>
                {semesterSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Elective Selector (Conditional) */}
            {isElective(subject) && electiveOptions.length > 0 && (
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
                  required
                >
                  <option value="">Select Elective Subject</option>
                  {electiveOptions.map((elec) => (
                    <option key={elec} value={elec}>{elec}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Module Number */}
            <div>
              <label htmlFor="module" className="block text-gray-700 text-sm font-bold mb-2">
                Module Number:
              </label>
              <select
                id="module"
                name="module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Module</option>
                {moduleOptions.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            {/* Module Name */}
            <div>
              <label htmlFor="moduleName" className="block text-gray-700 text-sm font-bold mb-2">
                Module Name:
              </label>
              <input
                type="text"
                id="moduleName"
                name="moduleName"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Introduction to AI"
                required
              />
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Question</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label htmlFor="questionText" className="block text-gray-700 text-sm font-bold mb-2">
                Question:
              </label>
              <textarea
                id="questionText"
                name="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                placeholder="Enter question text"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weightage */}
              <div>
                <label htmlFor="weightage" className="block text-gray-700 text-sm font-bold mb-2">
                  Weightage:
                </label>
                <input
                  type="number"
                  id="weightage"
                  name="weightage"
                  value={weightage}
                  onChange={(e) => setWeightage(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 5"
                  required
                />
              </div>

              {/* Bloom's Level */}
              <div>
                <label htmlFor="bloomsLevel" className="block text-gray-700 text-sm font-bold mb-2">
                  Bloom's Level:
                </label>
                <select
                  id="bloomsLevel"
                  name="bloomsLevel"
                  value={bloomsLevel}
                  onChange={(e) => setBloomsLevel(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Bloom's Level</option>
                  {bloomsTaxonomy.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Type of Question */}
              <div>
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                  Type:
                </label>
                <select
                  id="type"
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Type</option>
                  {questionTypes.map((qType) => (
                    <option key={qType} value={qType}>{qType}</option>
                  ))}
                </select>
              </div>

              {/* Course Outcome (COs) */}
              <div>
                <label htmlFor="cos" className="block text-gray-700 text-sm font-bold mb-2">
                  COs:
                </label>
                <select
                  id="cos"
                  name="cos"
                  value={cos}
                  onChange={(e) => setCos(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select CO</option>
                  {cosOptions.map((co) => (
                    <option key={co} value={co}>{co}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Question to Current Module
            </button>
          </form>
        </div>

        {/* Preview Questions for Current Module */}
        {allQuestionsForCurrentModule.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Questions for Current Module ({allQuestionsForCurrentModule.length})</h3>
            <ul className="list-disc pl-5">
              {allQuestionsForCurrentModule.map((q, index) => (
                <li key={index} className="mb-2 text-gray-800">
                  <p className="font-semibold">{q.questionText}</p>
                  <p className="text-sm">
                    Weightage: {q.weightage}, Bloom's: {q.bloomsLevel}, Type: {q.type}, CO: {q.cos}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubmit}
              className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Module Questions to Database'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}

        {/* Display Existing Questions (if any) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Questions in Database</h3>
          {loading && <p>Loading existing questions...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {allQuestions.length === 0 && !loading && !error && (
            <p>No questions found for this teacher.</p>
          )}
          <ul className="list-disc pl-5">
            {allQuestions.map((q) => (
              <li key={q._id} className="mb-2 text-gray-800">
                <p className="font-semibold">{q.questionText}</p>
                <p className="text-sm">
                  Program: {q.program}, Semester: {q.semester}, Subject: {q.subject}, Module: {q.moduleNumber},
                  Weightage: {q.weightage}, Bloom's: {q.bloomsLevel}, Type: {q.type}, CO: {q.cos}
                </p>
                <p className="text-xs text-gray-500">Teacher ID: {q.teacherId}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}