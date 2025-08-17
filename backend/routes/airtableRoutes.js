// routes/airtableRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const airtableController = require('../controllers/airtableController');

// Middleware to protect routes, ensuring the user is logged in via JWT.
const protect = passport.authenticate('jwt', { session: false });

/**
 * @route   GET /api/airtable/bases
 * @desc    Get a list of the logged-in user's Airtable bases
 * @access  Private
 */
router.get('/bases', protect, airtableController.getBases);

/**
 * @route   GET /api/airtable/tables/:baseId
 * @desc    Get a list of tables within a specific base
 * @access  Private
 */
router.get('/tables/:baseId', protect, airtableController.getTables);

/**
 * @route   GET /api/airtable/fields/:baseId/:tableId
 * @desc    Get a list of fields from a specific table
 * @access  Private
 */
router.get('/fields/:baseId/:tableId', protect, airtableController.getFields);

module.exports = router;
