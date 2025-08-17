// controllers/authController.js
const jwt = require('jsonwebtoken');

/**
 * Handles the OAuth callback from Airtable.
 * This is executed after Passport successfully authenticates the user.
 */
exports.handleCallback = (req, res) => {
  // Passport attaches the authenticated user object to req.user
  const user = req.user;
  
  // Create the payload for our JSON Web Token
  const payload = { id: user.id, name: user.name };

  // Sign the token, giving it a 1-day expiration for the user's session
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Set the token in a secure, HTTP-only cookie.
res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Always secure in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none', // Explicitly set for cross-domain
});

  // --- THIS IS THE FIX ---
  // We explicitly redirect to the /dashboard page on the frontend.
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

/**
 * Gets the current user's profile information from the JWT payload.
 */
exports.getCurrentUser = (req, res) => {
  // If the 'protect' middleware succeeds, req.user is populated.
  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};

router.get(
  '/airtable/callback',
  passport.authenticate('airtable', { 
    failureRedirect: `${process.env.FRONTEND_URL}/?login=failed` 
  }),
  authController.handleCallback
);

/**
 * Clears the JWT cookie to log the user out.
 */
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully.' });
};
