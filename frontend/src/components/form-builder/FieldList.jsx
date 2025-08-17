import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const FieldList = ({ table, onAddField }) => {
  const { api } = useAuth();
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!table) return;

    const fetchFields = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/airtable/fields/${table.baseId}/${table.id}`);
        setFields(response.data.fields);
      } catch (error) {
        console.error("Failed to fetch fields:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, [table, api]);

  if (isLoading) {
    return <p className="text-gray-500">Loading fields...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 border-t pt-4">Available Fields</h3>
      <p className="text-sm text-gray-500 mb-4">Click a field to add it to your form.</p>
      <ul className="space-y-2">
        {fields.map(field => (
          <li
            key={field.id}
            onClick={() => onAddField(field)}
            className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 cursor-pointer transition-colors duration-200"
          >
            <span className="font-medium text-gray-700">{field.name}</span>
            <span className="text-xs text-gray-500 ml-2">({field.type})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldList;