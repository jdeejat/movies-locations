const mongoose = require('mongoose');
const validator = require('validator');
const bycript = require('bcrypt');

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
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation is required'],
    validate: {
      // this works only on save()
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password confirmation does not match password',
    },
  },
  photo: String,
  passwordChangedAt: Date,
});

// MIDDLEWARE
// encrypt password
userSchema.pre('save', async function (next) {
  // only run if modified password
  if (!this.isModified('password')) return next();
  // use bcrypt to encrypt password
  this.password = await bycript.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// INSTANCE METHODS
// compare password with hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycript.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Model
const User = mongoose.model('User', userSchema);

module.exports = User;
