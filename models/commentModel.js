const mongoose = require('mongoose');
const validator = require('validator');

// MONGOOSE CONFIG

// users schema
const userSchema = new mongoose.Schema(
  {
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
    text: {
      type: String,
      required: [true, 'Text is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie id is required'],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

////////////////////////////////////
// QUERY MIDDLEWARE
////////////////////////////////////

// >>>Moved out from Schema level to Query level in controller<<<
// populate user and movie on comments
// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user_id',
//     select: 'name email',
//   }).populate({
//     path: 'movie_id',
//     select: 'title year',
//   });

//   next();
// });

////////////////////////////////////
// Model
////////////////////////////////////
const Comment = mongoose.model('Comment', userSchema);

module.exports = Comment;
