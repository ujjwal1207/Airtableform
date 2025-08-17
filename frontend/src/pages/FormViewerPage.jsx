import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const FormViewerPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/forms/${formId}`
        );
        setForm(response.data);
      } catch (err) {
        setError(
          "Failed to load the form. It may not exist or the link is incorrect."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  useEffect(() => {
    if (form) {
      const newVisibleQuestions = form.questions.filter((question) => {
        const rule = form.logic.find(
          (r) => r.targetFieldId === question.airtableFieldId
        );
        if (!rule) return true; // Always show if no rule

        const sourceValue = submission[rule.sourceFieldId];
        return sourceValue === rule.requiredValue;
      });
      setVisibleQuestions(newVisibleQuestions);
    }
  }, [form, submission]);

  const handleInputChange = (fieldId, value) => {
    setSubmission((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleMultiSelectChange = (fieldId, optionName, isChecked) => {
    setSubmission((prev) => {
      const existing = prev[fieldId] || [];
      if (isChecked) {
        return { ...prev, [fieldId]: [...existing, optionName] };
      } else {
        return {
          ...prev,
          [fieldId]: existing.filter((item) => item !== optionName),
        };
      }
    });
  };

  const renderField = (question) => {
    const { airtableFieldId, label, type, options } = question;
    const value = submission[airtableFieldId] || "";

    switch (type) {
      case "multilineText":
        return (
          <textarea
            id={airtableFieldId}
            value={value}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        );
      case "singleSelect":
        return (
          <select
            id={airtableFieldId}
            value={value}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        );
      case "multipleSelects":
        return (
          <div className="mt-2 space-y-2">
            {(options || []).map((opt) => (
              <label key={opt.id} className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMultiSelectChange(
                      airtableFieldId,
                      opt.name,
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{opt.name}</span>
              </label>
            ))}
          </div>
        );
      case "multipleAttachments":
        return (
          <input
            type="text"
            id={airtableFieldId}
            value={value}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            placeholder="Enter a public image URL"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            id={airtableFieldId}
            value={value}
            onChange={(e) => handleInputChange(airtableFieldId, e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionPromise = axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/forms/${formId}/submit`,
      submission
    );

    toast.promise(submissionPromise, {
      loading: "Submitting...",
      success: () => {
        setSubmission({});
        return "Form submitted successfully!";
      },
      error: "Failed to submit the form. Please try again.",
    });

    try {
      await submissionPromise;
    } catch (error) {
      console.error(error);
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
          {visibleQuestions.map((q) => (
            <div key={q.airtableFieldId}>
              <label
                htmlFor={q.airtableFieldId}
                className="block text-sm font-medium text-gray-700"
              >
                {q.label}
              </label>
              {renderField(q)}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormViewerPage;
