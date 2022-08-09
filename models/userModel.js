const mongoose = require('mongoose');

// MONGOOSE CONFIG

// users schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email is already in use'],
  },
  password: String,
});

// Model
const User = mongoose.model('User', userSchema);

module.exports = User;
