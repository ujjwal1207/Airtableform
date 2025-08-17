// controllers/airtableController.js
const axios = require('axios');

/**
 * Helper function to create the authorization headers for Airtable API calls.
 * It uses the accessToken stored with the logged-in user.
 */
const getAirtableHeaders = (req) => ({
    'Authorization': `Bearer ${req.user.accessToken}`,
});

/**
 * Proxies a request to fetch the user's Airtable bases.
 */
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

/**
 * Proxies a request to fetch the tables within a specific Airtable base.
 */
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

/**
 * Proxies a request to fetch the fields from a specific Airtable table.
 */
exports.getFields = async (req, res) => {
     try {
        const { baseId, tableId } = req.params;
        // The Airtable API to get a table's schema is the same as getting all tables.
        const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
        const response = await axios.get(url, {
            headers: getAirtableHeaders(req),
        });

        // We find the specific table the user requested from the list.
        const table = response.data.tables.find(t => t.id === tableId);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // We only return fields that our application supports for form questions.
        const supportedTypes = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
        const supportedFields = table.fields.filter(field => supportedTypes.includes(field.type));

        res.status(200).json({ fields: supportedFields });
    } catch (error) {
        console.error("Get Airtable fields error:", error);
        res.status(500).json({ message: 'Error fetching Airtable fields', error: error.message });
    }
};
