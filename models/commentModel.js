const mongoose = require('mongoose');
const validator = require('validator');

const Movie = require('./movieModel');

// MONGOOSE CONFIG

// comments schema
const commentsSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

////////////////////////////////////
// INDEXES
////////////////////////////////////

// to make sure that each user can only comment once per movie
// only works if there are no duplicates already in the database
commentsSchema.index({ movie_id: 1, user_id: 1 }, { unique: true });

////////////////////////////////////
// STATIC METHODS
////////////////////////////////////

// calculate average rating for a movie
commentsSchema.statics.calculateAverageRating = async function (movieId) {
  // in static method this. refers to model
  const obj = await this.aggregate([
    {
      $match: { movie_id: movieId },
    },
    {
      $group: {
        _id: '$movie_id',
        averageRating: { $avg: '$rating' },
        nuberOfRatings: { $sum: 1 },
      },
    },
  ]);
  if (obj.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      commentsAvgRating: obj[0].averageRating,
      commentsWithRatingCount: obj[0].nuberOfRatings,
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      commentsAvgRating: null,
      commentsWithRatingCount: 0,
    });
  }
};

// call calculateAverageRating() on every comment create
commentsSchema.post('save', async function () {
  // this. points to current document
  // but this.constructor points to model
  await this.constructor.calculateAverageRating(this.movie_id);
});

// call calculateAverageRating() on every comment delete
// delete is executed with query method. to get document from query use docs argument
// eslint-disable-next-line prefer-arrow-callback
commentsSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) await doc.constructor.calculateAverageRating(doc.movie_id);
});

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
const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
