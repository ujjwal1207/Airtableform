import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormBuilderPage from './FormBuilderPage';

const FormEditPage = () => {
  const { formId } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await api.get(`/api/forms/edit/${formId}`);
        setForm(response.data);
      } catch (error) {
        console.error("Failed to fetch form for editing:", error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [api, formId, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <FormBuilderPage existingForm={form} />;
};

export default FormEditPage;