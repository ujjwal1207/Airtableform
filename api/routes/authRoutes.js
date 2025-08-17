// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../controllers/authController')

/**
 * @route   GET /auth/airtable
 * @desc    Starts the Airtable OAuth2 login flow.
 * @access  Public
 * This is the endpoint your frontend button should link to.
 * The `passport.authenticate('airtable')` middleware handles the redirect.
 */
router.get('/airtable', passport.authenticate('airtable'))

/**
 * @route   GET /auth/airtable/callback
 * @desc    The callback URL Airtable redirects to after user consent.
 * @access  Public
 */
router.get('/airtable/callback', (req, res, next) => {
  passport.authenticate('airtable', (err, user, info) => {
    // This block will catch the detailed error from Passport/Airtable
    if (err) {
      console.error('PASSPORT AUTHENTICATION ERROR:', err)
      // Also redirect with an error message in the URL for easier debugging
      return res.redirect(
        `${process.env.FRONTEND_URL}/?login=failed&error=${err.message}`
      )
    }
    // This block handles cases where authentication fails without a specific error
    if (!user) {
      console.error(
        'PASSPORT AUTHENTICATION FAILED: No user was returned.',
        info
      )
      return res.redirect(
        `${process.env.FRONTEND_URL}/?login=failed&reason=nouser`
      )
    }
    // If successful, proceed with the original login flow
    req.logIn(user, loginErr => {
      if (loginErr) {
        console.error('PASSPORT LOGIN ERROR:', loginErr)
        return next(loginErr)
      }
      return authController.handleCallback(req, res)
    })
  })(req, res, next)
})

/**
 * @route   GET /auth/user
 * @desc    Gets the currently logged-in user's data.
 * @access  Private
 */
router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  authController.getCurrentUser
)

/**
 * @route   POST /auth/logout
 * @desc    Logs the user out by clearing the JWT cookie.
 * @access  Public
 */
router.post('/logout', authController.logout)

module.exports = router
