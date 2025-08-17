import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AirtableSelector from '../components/form-builder/AirtableSelector';
import FieldList from '../components/form-builder/FieldList';
import QuestionEditor from '../components/form-builder/QuestionEditor';
import LogicBuilder from '../components/form-builder/LogicBuilder';
import toast from 'react-hot-toast';

const FormBuilderPage = ({ existingForm }) => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const { formId } = useParams();

    const [selectedTable, setSelectedTable] = useState(null);
    const [formQuestions, setFormQuestions] = useState([]);
    const [formName, setFormName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [logicRules, setLogicRules] = useState([]);
    const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
    const [logicTargetIndex, setLogicTargetIndex] = useState(null);
    const [initialBase, setInitialBase] = useState(null);

    useEffect(() => {
        if (existingForm) {
            setFormName(existingForm.name);
            setFormQuestions(existingForm.questions);
            setLogicRules(existingForm.logic || []);
            setInitialBase({
                baseId: existingForm.airtableBaseId,
                tableId: existingForm.airtableTableId,
            });
        }
    }, [existingForm]);

    const handleTableSelect = (table) => {
        setSelectedTable(table);
        if (!existingForm || (table && table.id !== existingForm.airtableTableId)) {
            setFormQuestions([]);
            setLogicRules([]);
        }
    };

    const addQuestion = (field) => {
        if (formQuestions.some(q => q.airtableFieldId === field.id)) {
            toast.error("This field has already been added.");
            return;
        }
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

    const openLogicModal = (questionIndex) => {
        setLogicTargetIndex(questionIndex);
        setIsLogicModalOpen(true);
    };

    const closeLogicModal = () => {
        setIsLogicModalOpen(false);
        setLogicTargetIndex(null);
    };

    const saveLogicRule = (newLogic) => {
        const otherRules = logicRules.filter(r => r.targetFieldId !== newLogic.targetFieldId);
        setLogicRules([...otherRules, newLogic]);
        closeLogicModal();
        toast.success("Logic rule saved!");
    };

    const handleSaveForm = async () => {
        if (!formName.trim()) {
            toast.error("Please provide a form name.");
            return;
        }
        if (formQuestions.length === 0) {
            toast.error("Please add at least one question.");
            return;
        }
        setIsSaving(true);
        const formData = {
            name: formName,
            airtableBaseId: selectedTable.baseId,
            airtableTableId: selectedTable.id,
            questions: formQuestions,
            logic: logicRules,
        };

        const savePromise = formId
            ? api.put(`/api/forms/${formId}`, formData)
            : api.post('/api/forms', formData);

        toast.promise(savePromise, {
            loading: 'Saving form...',
            success: () => {
                navigate('/dashboard');
                return 'Form saved successfully!';
            },
            error: 'Failed to save the form.',
        });

        try {
            await savePromise;
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            {isLogicModalOpen && (
                <LogicBuilder
                    targetQuestion={formQuestions[logicTargetIndex]}
                    allQuestions={formQuestions.slice(0, logicTargetIndex)}
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
                <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md self-start">
                    <AirtableSelector 
                        onTableSelect={handleTableSelect} 
                        initialSelection={initialBase}
                    />
                    {selectedTable && (
                        <FieldList
                            table={selectedTable}
                            onAddField={addQuestion}
                        />
                    )}
                </div>

                <div className="lg:col-span-8">
                    <QuestionEditor 
                        questions={formQuestions} 
                        onUpdateQuestion={updateQuestionLabel}
                        onSetLogic={openLogicModal}
                    />
                    {formQuestions.length > 0 && (
                        <div className="mt-8 text-right">
                            <button onClick={handleSaveForm} disabled={isSaving} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400">
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