import React from 'react';

const QuestionPaperTable = ({ questionPapers }) => {
  if (!questionPapers || questionPapers.length === 0) {
    return <p>No question papers available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      {questionPapers.map((paper, paperIndex) => (
        <div key={paper._id} className="mb-12">
          <h2 className="text-xl font-bold mb-4">
            {paper.paperName} ({paper.paperCode}) - {paper.examTitle}
          </h2>
          <p className="mb-2">
            <strong>College:</strong> {paper.collegeName} | 
            <strong>Course:</strong> {paper.courseDetails} | 
            <strong>Max Weight:</strong> {paper.maxWeight} | 
            <strong>Time:</strong> {paper.time}
          </p>
          
          {paper.parts.map((part, partIndex) => (
            <div key={part._id || partIndex} className="mb-8">
              <h3 className="text-lg font-semibold mb-2">
                {part.partName} - {part.moduleName} (CO: {part.partCO})
              </h3>
              <p className="mb-3"><em>{part.instructions}</em></p>
              
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Q.No</th>
                    <th className="border border-gray-300 p-2">Question</th>
                    <th className="border border-gray-300 p-2">Weight</th>
                    <th className="border border-gray-300 p-2">Level</th>
                    <th className="border border-gray-300 p-2">COs</th>
                  </tr>
                </thead>
                <tbody>
                  {part.questions.map((question, qIndex) => (
                    <tr key={question._id || qIndex}>
                      <td className="border border-gray-300 p-2">{qIndex + 1}</td>
                      <td className="border border-gray-300 p-2">{question.questionText}</td>
                      <td className="border border-gray-300 p-2 text-center">{question.marksAllocated}</td>
                      <td className="border border-gray-300 p-2 text-center">{question.bloomsLevel}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {Array.isArray(question.co) ? question.co.join(', ') : question.co}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionPaperTable;