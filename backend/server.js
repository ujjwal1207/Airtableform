// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session'); // <-- 1. Import express-session
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const airtableRoutes = require('./routes/airtableRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// --- 2. CONFIGURE SESSION MIDDLEWARE ---
// This must come BEFORE passport.session()
app.use(session({
  secret: process.env.JWT_SECRET, // A secret to sign the session ID cookie
  resave: false,
  saveUninitialized: false, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
  }
}));

// --- PASSPORT INITIALIZATION ---
app.use(passport.initialize());
app.use(passport.session()); // <-- 3. Allow passport to use the session

require('./config/Passport.config.js');

// ... rest of the file is the same ...

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/airtable', airtableRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
