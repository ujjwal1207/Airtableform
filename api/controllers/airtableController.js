// controllers/airtableController.js
const axios = require('axios');

const getAirtableHeaders = (req) => ({
    'Authorization': `Bearer ${req.user.accessToken}`,
});

exports.getBases = async (req, res) => {
    try {
        const response = await axios.get('https://api.airtable.com/v0/meta/bases', {
            headers: getAirtableHeaders(req),
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Get Airtable bases error:", error);
        res.status(500).json({ message: 'Error fetching Airtable bases', error: error.message });
    }
};

exports.getTables = async (req, res) => {
    try {
        const { baseId } = req.params;
        const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
        const response = await axios.get(url, {
            headers: getAirtableHeaders(req),
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Get Airtable tables error:", error);
        res.status(500).json({ message: 'Error fetching Airtable tables', error: error.message });
    }
};

exports.getFields = async (req, res) => {
     try {
        const { baseId, tableId } = req.params;
        const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
        const response = await axios.get(url, {
            headers: getAirtableHeaders(req),
        });
        const table = response.data.tables.find(t => t.id === tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        const supportedTypes = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
        const supportedFields = table.fields.filter(field => supportedTypes.includes(field.type));
        res.status(200).json({ fields: supportedFields });
    } catch (error) {
        console.error("Get Airtable fields error:", error);
        res.status(500).json({ message: 'Error fetching Airtable fields', error: error.message });
    }
};

// Add this new function
exports.getBaseAndTableNames = async (req, res) => {
    try {
        const { baseId, tableId } = req.params;
        const headers = getAirtableHeaders(req);

        // Fetch all bases to find the base name
        const basesResponse = await axios.get('https://api.airtable.com/v0/meta/bases', { headers });
        const base = basesResponse.data.bases.find(b => b.id === baseId);

        if (!base) {
            return res.status(404).json({ message: 'Base not found' });
        }

        // Fetch tables for that base to find the table name
        const tablesUrl = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
        const tablesResponse = await axios.get(tablesUrl, { headers });
        const table = tablesResponse.data.tables.find(t => t.id === tableId);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json({ baseName: base.name, tableName: table.name });
    } catch (error) {
        console.error("Get base and table names error:", error);
        res.status(500).json({ message: 'Error fetching names', error: error.message });
    }
};
