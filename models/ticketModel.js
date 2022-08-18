const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bycript = require('bcrypt');

// MONGOOSE CONFIG

// users schema
const userSchema = new mongoose.Schema({
  userName: {
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpires: Date,
});

////////////////////////////////////
// MIDDLEWARE
////////////////////////////////////

// DOCUMENT MIDDLEWARE
// encrypt password
userSchema.pre('save', async function (next) {
  // only run if modified password
  if (!this.isModified('password')) return next();
  // use bcrypt to encrypt password
  this.password = await bycript.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// if password changed, set passwordChangedAt to current time
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); // isNew is true when creating a new user
  this.passwordChangedAt = Date.now() - 1000; // 1 second ago to make sure jwt is created after password change
  next();
});

// QUERY MIDDLEWARE
// increment __v when updating user with query (this does not work with Document save)
userSchema.pre(
  [
    'findOneAndUpdate',
    'findOneByIdAndUpdate',
    'updateOne',
    'update',
    'updateMany',
  ],
  function (next) {
    // prohibit to update password
    this.update({}, { $inc: { __v: 1 } });
    next();
  }
);

////////////////////////////////////
// INSTANCE METHODS
////////////////////////////////////

// compare password with hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycript.compare(candidatePassword, userPassword);
};

// check if password has been changed after last login so JWT should be invalidated
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

// create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

////////////////////////////////////
// Model
////////////////////////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;
