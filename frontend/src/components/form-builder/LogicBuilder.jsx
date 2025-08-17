import React, { useState } from 'react';

const LogicBuilder = ({ targetQuestion, allQuestions, onSaveLogic, onCancel }) => {
  // State to hold the rule being created
  const [sourceFieldId, setSourceFieldId] = useState('');
  const [requiredValue, setRequiredValue] = useState('');

  // Filter out the target question itself from the list of possible sources
  const sourceQuestions = allQuestions.filter(
    q => q.airtableFieldId !== targetQuestion.airtableFieldId
  );

  const handleSave = () => {
    if (!sourceFieldId || !requiredValue.trim()) {
      alert("Please select a source question and enter a required value.");
      return;
    }
    const newLogic = {
      targetFieldId: targetQuestion.airtableFieldId,
      sourceFieldId: sourceFieldId,
      requiredValue: requiredValue.trim(),
    };
    onSaveLogic(newLogic);
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal content */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Conditional Logic</h2>
        <p className="mb-6 text-gray-600">
          Show the question <span className="font-semibold text-blue-600">"{targetQuestion.label}"</span> only when...
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="source-question" className="block text-sm font-medium text-gray-700">
              The answer to this question...
            </label>
            <select
              id="source-question"
              value={sourceFieldId}
              onChange={(e) => setSourceFieldId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a question</option>
              {sourceQuestions.map(q => (
                <option key={q.airtableFieldId} value={q.airtableFieldId}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="required-value" className="block text-sm font-medium text-gray-700">
              ...is equal to this value:
            </label>
            <input
              type="text"
              id="required-value"
              value={requiredValue}
              onChange={(e) => setRequiredValue(e.target.value)}
              placeholder="e.g., Engineer, Yes, etc."
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Save Logic
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicBuilder;
