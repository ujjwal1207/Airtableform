import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, api } = useAuth();
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await api.get('/api/forms');
        setForms(response.data);
      } catch (err) {
        setError('Failed to fetch forms. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [api]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Here are your created forms.</p>
        </div>
        <Link
          to="/builder/new" // We will create this page next
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          + Create New Form
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading your forms...</p>
      ) : error ? (
        <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
      ) : forms.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">No forms yet!</h2>
          <p className="text-gray-500 mt-2">Click the "Create New Form" button to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{form.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Created on: {new Date(form.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-2">
                <Link to={`/form/${form._id}`} className="text-blue-600 font-semibold hover:underline">View</Link>
                <Link to={`/builder/edit/${form._id}`} className="text-green-600 font-semibold hover:underline">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;