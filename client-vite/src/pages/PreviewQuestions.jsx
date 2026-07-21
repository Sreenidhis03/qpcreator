import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const PreviewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/questions/all'); // Adjust endpoint if needed
        setQuestions(response.data.questions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Preview Questions</h2>

        {loading && <p>Loading questions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ul className="space-y-4">
            {questions.length === 0 ? (
              <li>No questions available.</li>
            ) : (
              questions.map((q) => (
                <li key={q._id} className="border p-4 rounded shadow">
                  <p><strong>Question:</strong> {q.questionText}</p>
                  <p><strong>Subject:</strong> {q.subject}</p>
                  <p><strong>Module:</strong> {q.moduleNumber.join(', ')} - {q.moduleName}</p>
                  <p><strong>Weightage:</strong> {q.weightage}</p>
                  <p><strong>Bloom's Level:</strong> {q.bloomsLevel}</p>
                  <p><strong>Type:</strong> {q.type}</p>
                  <p><strong>COs:</strong> {q.cos.join(', ')}</p>
                  {q.answer && <p><strong>Answer:</strong> {q.answer}</p>}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PreviewQuestions;
