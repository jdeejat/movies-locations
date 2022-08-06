const Movie = require('../models/movieModel');

// MOVIES HANDLERS

// send  10 movies to the client
exports.getTenMovies = (req, res) => {
  Movie.find({})
    .select('title year poster _id')
    .limit(10)
    .exec((err, movies) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(movies);
    });
};

//   Movie.count({}, function (err, count) {
//     console.log('Number of Movies:', count);
//   });

exports.getMoviesByYear = (req, res) => {
  Movie.find({
    year: req.params.year * 1,
  })
    .select('title year poster _id')
    .exec((err, movies) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(movies);
    });
};

// MIDDLEWARE

exports.checkYear = (req, res, next, year) => {
  if (year.length !== 4) return res.status(400).send('Invalid year');
  next();
};
