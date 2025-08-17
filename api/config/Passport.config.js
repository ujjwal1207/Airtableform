// config/Passport.config.js
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const crypto = require('crypto');
const User = require('../models/User.model.js'); 
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// --- Helper functions (Unchanged) ---
function base64URLEncode(str) {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

// --- Airtable OAuth2 Strategy ---
const airtableStrategy = new OAuth2Strategy({
    authorizationURL: 'https://airtable.com/oauth2/v1/authorize',
    tokenURL: 'https://airtable.com/oauth2/v1/token',
    clientID: process.env.AIRTABLE_CLIENT_ID,
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + '/auth/airtable/callback',
    passReqToCallback: true,
    state: true,

    // --- THIS IS THE FIX: Force credentials to be sent in the header ---
    customHeaders: {
      'Authorization': 'Basic ' + Buffer.from(process.env.AIRTABLE_CLIENT_ID + ':' + process.env.AIRTABLE_CLIENT_SECRET).toString('base64')
    }
    // -----------------------------------------------------------------
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { id: airtableId, email, name } = profile;
      if (!airtableId) { throw new Error("Airtable profile did not contain an ID."); }
      let user = await User.findOne({ airtableId });
      if (user) {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
      } else {
        user = new User({ airtableId, name: name || email, email, accessToken, refreshToken });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      console.error('Error in Airtable strategy callback:', error);
      return done(error, false);
    }
  }
);

// --- Manually Add the PKCE and Scope Parameters (Unchanged) ---
airtableStrategy.authorizationParams = function(options) {
  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  const code_challenge = base64URLEncode(sha256(code_verifier));
  if (this._oauth2._pkceStateStore) {
      this._oauth2._pkceStateStore.store(this._oauth2._request, code_verifier, (err) => {
        if (err) { console.error("Error storing PKCE verifier:", err); }
      });
  } else {
      this._oauth2.pkce = { code_verifier: code_verifier };
  }
  return {
    scope: 'data.records:read data.records:write schema.bases:read user.email:read',
    code_challenge: code_challenge,
    code_challenge_method: 'S256',
  };
};

airtableStrategy.tokenParams = function(options) {
  if (this._oauth2._pkceStateStore) {
    return new Promise((resolve, reject) => {
      this._oauth2._pkceStateStore.verify(this._oauth2._request, (err, verifier) => {
        if (err) { return reject(err); }
        resolve({ code_verifier: verifier });
      });
    });
  }
  return { code_verifier: this._oauth2.pkce.code_verifier };
};

airtableStrategy.userProfile = async function(accessToken, done) {
    try {
        const response = await fetch('https://api.airtable.com/v0/meta/whoami', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) { throw new Error(`Failed to fetch user profile: ${response.statusText}`); }
        const profile = await response.json();
        done(null, profile);
    } catch (error) {
        done(error);
    }
};

passport.use('airtable', airtableStrategy);

// --- JWT Strategy (Unchanged) ---
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) { token = req.cookies['jwt']; }
    return token;
};
const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};
passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) { return done(null, user); }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// --- Session Support (Unchanged) ---
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
