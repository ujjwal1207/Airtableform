// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  airtableId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String 
  },
  // IMPORTANT: In a production app, you should encrypt these tokens before saving.
  accessToken: { 
    type: String, 
    required: true 
  },
  refreshToken: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
