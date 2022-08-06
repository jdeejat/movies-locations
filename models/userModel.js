const mongoose = require('mongoose');

// MONGOOSE CONFIG

// users schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

// Model
const User = mongoose.model('User', userSchema);

module.exports = User;
