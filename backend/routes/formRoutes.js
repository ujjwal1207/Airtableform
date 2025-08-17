// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const formController = require('../controllers/formController');

// Middleware to protect routes that require a logged-in user
const protect = passport.authenticate('jwt', { session: false });

// Create a new form
router.post('/', protect, formController.createForm);

// Update an existing form
router.put('/:id', protect, formController.updateForm);

// Get all forms for the logged-in user
router.get('/', protect, formController.getForms);

// Get a single form's configuration (publicly accessible)
router.get('/:id', formController.getFormById);

// Get a single form's configuration for editing (protected)
router.get('/edit/:id', protect, formController.getFormForEdit);

// Submit a response to a form (publicly accessible)
router.post('/:id/submit', formController.submitForm);

module.exports = router;