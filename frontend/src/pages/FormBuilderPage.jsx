import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AirtableSelector from '../components/form-builder/AirtableSelector';
import FieldList from '../components/form-builder/FieldList';
import QuestionEditor from '../components/form-builder/QuestionEditor';
import LogicBuilder from '../components/form-builder/LogicBuilder'; // Import the new modal

const FormBuilderPage = () => {
  const { api } = useAuth();
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState(null);
  const [formQuestions, setFormQuestions] = useState([]);
  const [formName, setFormName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for logic
  const [logicRules, setLogicRules] = useState([]);
  const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
  const [logicTargetIndex, setLogicTargetIndex] = useState(null);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setFormQuestions([]);
    setLogicRules([]); // Reset logic when table changes
  };

  const addQuestion = (field) => {
    if (formQuestions.some(q => q.airtableFieldId === field.id)) return;
    const newQuestion = {
      airtableFieldId: field.id,
      label: field.name,
      type: field.type,
      options: field.options?.choices || null,
    };
    setFormQuestions([...formQuestions, newQuestion]);
  };

  const updateQuestionLabel = (questionIndex, newLabel) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[questionIndex].label = newLabel;
    setFormQuestions(updatedQuestions);
  };

  // --- Functions to handle the logic modal ---
  const openLogicModal = (questionIndex) => {
    setLogicTargetIndex(questionIndex);
    setIsLogicModalOpen(true);
  };

  const closeLogicModal = () => {
    setIsLogicModalOpen(false);
    setLogicTargetIndex(null);
  };

  const saveLogicRule = (newLogic) => {
    // Remove any existing rule for this target question first
    const otherRules = logicRules.filter(r => r.targetFieldId !== newLogic.targetFieldId);
    setLogicRules([...otherRules, newLogic]);
    closeLogicModal();
    alert("Logic rule saved!");
  };
  // -----------------------------------------

  const handleSaveForm = async () => {
    if (!formName.trim() || formQuestions.length === 0) {
      alert("Please provide a form name and add at least one question.");
      return;
    }
    setIsSaving(true);
    const formData = {
      name: formName,
      airtableBaseId: selectedTable.baseId,
      airtableTableId: selectedTable.id,
      questions: formQuestions,
      logic: logicRules, // Include the logic rules in the payload
    };

    try {
      await api.post('/api/forms', formData);
      alert("Form saved successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("An error occurred while saving the form.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logic Builder Modal */}
      {isLogicModalOpen && (
        <LogicBuilder
          targetQuestion={formQuestions[logicTargetIndex]}
          allQuestions={formQuestions.slice(0, logicTargetIndex)} // Can only depend on previous questions
          onSaveLogic={saveLogicRule}
          onCancel={closeLogicModal}
        />
      )}

      <div className="mb-8">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter Form Name"
          className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full py-2"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md self-start">
          <AirtableSelector onTableSelect={handleTableSelect} />
          {selectedTable && (
            <FieldList
              table={selectedTable}
              onAddField={addQuestion}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8">
          <QuestionEditor 
            questions={formQuestions} 
            onUpdateQuestion={updateQuestionLabel}
            onSetLogic={openLogicModal} // Pass the function to open the modal
          />
          {formQuestions.length > 0 && (
             <div className="mt-8 text-right">
                <button 
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400"
                >
                  {isSaving ? 'Saving...' : 'Save Form'}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
