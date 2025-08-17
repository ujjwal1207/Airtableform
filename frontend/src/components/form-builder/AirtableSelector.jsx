import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AirtableSelector = ({ onTableSelect, initialSelection }) => {
  const { api } = useAuth();
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const [selectedTableId, setSelectedTableId] = useState('');
  const [isLoadingBases, setIsLoadingBases] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Fetch all bases when the component mounts
  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await api.get('/api/airtable/bases');
        setBases(response.data.bases);
        if (initialSelection) {
          setSelectedBaseId(initialSelection.baseId);
        }
      } catch (error) {
        console.error("Failed to fetch bases:", error);
      } finally {
        setIsLoadingBases(false);
      }
    };
    fetchBases();
  }, [api, initialSelection]);

  // Fetch tables when a base is selected
  useEffect(() => {
    if (!selectedBaseId) {
      setTables([]);
      onTableSelect(null);
      return;
    }

    const fetchTables = async () => {
      setIsLoadingTables(true);
      try {
        const response = await api.get(`/api/airtable/tables/${selectedBaseId}`);
        setTables(response.data.tables);
        if (initialSelection && selectedBaseId === initialSelection.baseId) {
          setSelectedTableId(initialSelection.tableId);
          // Automatically trigger onTableSelect for the initial load
          const selectedTable = response.data.tables.find(t => t.id === initialSelection.tableId);
          if (selectedTable) {
            onTableSelect({ ...selectedTable, baseId: selectedBaseId });
          }
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      } finally {
        setIsLoadingTables(false);
      }
    };
    fetchTables();
  }, [selectedBaseId, api, initialSelection, onTableSelect]);

  const handleBaseChange = (e) => {
    setSelectedBaseId(e.target.value);
    setSelectedTableId(''); // Reset table selection
    onTableSelect(null);
  };

  const handleTableChange = (e) => {
    const tableId = e.target.value;
    setSelectedTableId(tableId);
    if (tableId) {
      const selectedTable = tables.find(t => t.id === tableId);
      onTableSelect({ ...selectedTable, baseId: selectedBaseId });
    } else {
      onTableSelect(null);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div>
        <label htmlFor="base-select" className="block text-sm font-medium text-gray-700 mb-1">1. Select a Base</label>
        <select
          id="base-select"
          value={selectedBaseId}
          onChange={handleBaseChange}
          disabled={isLoadingBases}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{isLoadingBases ? 'Loading bases...' : 'Choose a base'}</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>{base.name}</option>
          ))}
        </select>
      </div>
      {selectedBaseId && (
        <div>
          <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-1">2. Select a Table</label>
          <select
            id="table-select"
            value={selectedTableId}
            onChange={handleTableChange}
            disabled={isLoadingTables || tables.length === 0}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{isLoadingTables ? 'Loading tables...' : 'Choose a table'}</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>{table.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AirtableSelector;