const Movie = require('../models/movieModel');
const APIfeatures = require('../utils/APIfeatures');

// ALIASES

exports.aliasTop21 = (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = 'year,-metacritic';
  req.query.fields = 'title,year,poster,imdb,metacritic,plot,-_id';
  req.query.year = { gte: '2000' };
  next();
};

// MOVIES HANDLERS

/*
// send  10 movies to the client
exports.getTenMovies = (req, res) => {
  Movie.find({})
    .select('title year poster _id')
    .limit(10)
    .exec((err, movies) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: err,
        });
      res.status(200).json({
        status: 'success',
        data: { movies },
      });
    });
};

//   Movie.count({}, function (err, count) {
  //     console.log('Number of Movies:', count);
  //   });
*/

exports.getMovies = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIfeatures(Movie.find(), req.query)
      .filterOnFields()
      .paginate()
      .sortQuery()
      .selectFields();
    const movies = await features.query;

    // SEND response
    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getMoviesByYear = (req, res) => {
  Movie.find({
    year: req.params.year * 1,
  })
    .select('title year poster _id')
    .exec((err, movies) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: err,
        });
      res.status(200).json({
        status: 'success',
        data: { movies },
      });
    });
};

// MIDDLEWARE

exports.checkYear = (req, res, next, year) => {
  if (year.length !== 4)
    return res.status(400).json({
      status: 'error',
      message: 'Invalid year',
    });
  next();
};

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { newMovie },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};
