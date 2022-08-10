const mongoose = require('mongoose');
const validator = require('validator');

// MONGOOSE CONFIG

// movies
const movieSchema = new mongoose.Schema(
  // schema definition
  {
    year: {
      type: Number,
      required: [true, 'Year is required'],
      // validate that year is from 1900 to current year
      validate: {
        validator: function (v) {
          return v >= 1900 && v <= new Date().getFullYear();
        },
        message: 'Year must be between 1900 and current year',
      },
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [70, 'Title is too long. Max 70 char.'],
    },
    type: {
      type: String,
      required: [true, 'Type is required.'],
      enum: {
        values: ['Movie', 'Series'],
        message: '{VALUE} is not supported',
      },
    },
    lastupdated: {
      type: Date,
      default: Date.now(),
    },
    poster: {
      type: String,
      default: 'https://dummyimage.com/640x360/fff/aaa',
      validate: [validator.isURL, 'Poster must be a valid URL'], // from npm validator
    },
    fullplot: {
      type: String,
      // select: false, // will not return this field in the response but will throw 31254 error  and not allow exclusion inclusion togehter
    },
    genres: [String],
    cast: [String],
  },
  // options
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL FIELDS
movieSchema.virtual('decade').get(function () {
  const substring = this.year.toString().substring(0, 3);
  const decade = substring.concat('0s');
  return decade;
});

// DOCUMENT MIDDLEWARE
// BEFORE all update and save operations
movieSchema.pre(
  [
    'save',
    'update',
    'updateOne',
    'updateMany',
    'findOneAndUpdate',
    'findByIdAndUpdate',
    'insertMany',
  ],
  function (next) {
    this.lastupdated = Date.now();
    next();
  }
);

// AFTER all delete operations
movieSchema.post(
  ['deleteOne', 'deleteMany', 'findOneAndDelete', 'findByIdAndDelete'],
  // eslint-disable-next-line prefer-arrow-callback
  function (doc, next) {
    // eslint-disable-next-line no-console
    console.log('Deleted movie: ', doc);
    next();
  }
);

// QUERY MIDDLEWARE
// using regular expression for find* methods
movieSchema.pre(/^find/, function (next) {
  this.find({ type: { $ne: 'dataLoad' } });
  next();
});

// movieSchema.post(/^find/, function (doc, next) {
//   console.log('Post middleware: ', doc);
//   next();
// });

// AGGREGATION MIDDLEWARE
movieSchema.pre('aggregate', function (next) {
  // remove type dataLoad
  this.pipeline().unshift({ $match: { type: { $ne: 'dataLoad' } } });
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
