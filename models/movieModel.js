const mongoose = require('mongoose');

// MONGOOSE CONFIG

// movies
const movieSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  type: {
    type: String,
    default: 'manualAdd',
  },
  lastupdated: {
    type: Date,
    default: Date.now(),
  },
  poster: {
    type: String,
    default: 'https://dummyimage.com/640x360/fff/aaa',
  },
  fullplot: {
    type: String,
    // select: false, // will not return this field in the response but will throw 31254 error  and not allow exclusion inclusion togehter
  },
  genres: [String],
  cast: [String],
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
