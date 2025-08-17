import React from 'react';

// We now accept an onUpdateQuestion and onSetLogic function
const QuestionEditor = ({ questions, onUpdateQuestion, onSetLogic }) => {
  if (questions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Your Form Canvas</h2>
        <p className="text-gray-500 mt-2">Select a base and table, then click on fields from the left to add them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form Editor</h2>
      {questions.map((question, index) => (
        <div key={question.airtableFieldId} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <label 
              htmlFor={`question-label-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Question Label
            </label>
            {/* We only show the logic button for the second question onwards */}
            {index > 0 && (
              <button
                onClick={() => onSetLogic(index)}
                className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full hover:bg-blue-200"
              >
                Set Logic
              </button>
            )}
          </div>
          <input
            id={`question-label-${index}`}
            type="text"
            value={question.label}
            onChange={(e) => onUpdateQuestion(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Airtable Field: <span className="font-semibold">{question.label}</span> | Type: <span className="font-semibold">{question.type}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuestionEditor;
