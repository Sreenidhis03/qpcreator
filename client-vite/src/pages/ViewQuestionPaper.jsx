import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionPaperTable from '../components/QuestionPaperTable ';
import DashboardLayout from '../components/DashboardLayout';


const QuestionPaperView = () => {
    const [questionPapers, setQuestionPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestionPapers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/question-papers/get-all-QuestinPapers'); // Adjust your API endpoint
                setQuestionPapers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchQuestionPapers();
    }, []);

    if (loading) return <div>Loading question papers...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
         <DashboardLayout>
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Question Papers</h1>
            <QuestionPaperTable questionPapers={questionPapers} />
        </div>
        </DashboardLayout>
    );
};

export default QuestionPaperView;