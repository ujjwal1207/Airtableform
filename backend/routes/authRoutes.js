// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

/**
 * @route   GET /auth/airtable
 * @desc    Starts the Airtable OAuth2 login flow.
 * @access  Public
 * This is the endpoint your frontend button should link to.
 * The `passport.authenticate('airtable')` middleware handles the redirect.
 */
router.get('/airtable', passport.authenticate('airtable'));

/**
 * @route   GET /auth/airtable/callback
 * @desc    The callback URL Airtable redirects to after user consent.
 * @access  Public
 */
router.get(
  '/airtable/callback',
  passport.authenticate('airtable', { 
    failureRedirect: `${process.env.FRONTEND_URL}/?login=failed` 
  }),
  authController.handleCallback
);

/**
 * @route   GET /auth/user
 * @desc    Gets the currently logged-in user's data.
 * @access  Private
 */
router.get(
  '/user', 
  passport.authenticate('jwt', { session: false }), 
  authController.getCurrentUser
);

/**
 * @route   POST /auth/logout
 * @desc    Logs the user out by clearing the JWT cookie.
 * @access  Public
 */
router.post('/logout', authController.logout);

module.exports = router;
