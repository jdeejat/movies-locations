const mongoose = require('mongoose');

// MONGOOSE CONFIG

// movies
const movieSchema = new mongoose.Schema({
  year: Number,
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
