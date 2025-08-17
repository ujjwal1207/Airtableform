router.get('/airtable/callback', (req, res, next) => {
  passport.authenticate('airtable', (err, user, info) => {
    // This block will catch the detailed error from Passport/Airtable
    if (err) {
      console.error("PASSPORT AUTHENTICATION ERROR:", err);
      // Also redirect with an error message in the URL for easier debugging
      return res.redirect(`${process.env.FRONTEND_URL}/?login=failed&error=${err.message}`);
    }
    // This block handles cases where authentication fails without a specific error
    if (!user) {
      console.error("PASSPORT AUTHENTICATION FAILED: No user was returned.", info);
      return res.redirect(`${process.env.FRONTEND_URL}/?login=failed&reason=nouser`);
    }
    // If successful, proceed with the original login flow
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("PASSPORT LOGIN ERROR:", loginErr);
        return next(loginErr);
      }
      return authController.handleCallback(req, res);
    });
  })(req, res, next);
});