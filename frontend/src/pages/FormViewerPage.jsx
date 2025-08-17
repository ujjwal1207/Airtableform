import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FormViewerPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/forms/${formId}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to load the form. It may not exist.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldId, value) => {
    setSubmission(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (question) => {
    const { airtableFieldId, label, type, options } = question;

    switch (type) {
      case 'multilineText':
        return (
          <textarea
            id={airtableFieldId}
            value={submission[airtableFieldId] || ''}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        );
      case 'singleSelect':
        return (
          <select
            id={airtableFieldId}
            value={submission[airtableFieldId] || ''}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an option</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        );
      case 'multipleAttachments':
         return (
          <input
            type="text"
            id={airtableFieldId}
            value={submission[airtableFieldId] || ''}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            placeholder="Enter a public image URL"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        );
      default: // singleLineText and others
        return (
          <input
            type="text"
            id={airtableFieldId}
            value={submission[airtableFieldId] || ''}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5001/api/forms/${formId}/submit`, submission);
      alert('Form submitted successfully!');
      setSubmission({}); // Clear the form
    } catch (err) {
      alert('Failed to submit the form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading form...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!form) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.name}</h1>
        <p className="text-gray-600 mb-6">Fill out the form below.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map(q => (
            <div key={q.airtableFieldId}>
              <label htmlFor={q.airtableFieldId} className="block text-sm font-medium text-gray-700">{q.label}</label>
              {renderField(q)}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormViewerPage;