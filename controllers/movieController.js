const Movie = require('../models/movieModel');
const APIfeatures = require('../utils/APIfeatures');

//////////////////////////////////////////////////
// ALIASES
//////////////////////////////////////////////////

exports.aliasTop21 = (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = 'year,-metacritic';
  req.query.fields = 'title,year,poster,imdb,metacritic,plot,-_id';
  req.query.year = { gte: '2000' };
  next();
};

//////////////////////////////////////////////////
// MOVIES HANDLERS
//////////////////////////////////////////////////

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

//////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////

exports.checkYear = (req, res, next, year) => {
  if (year.length !== 4)
    return res.status(400).json({
      status: 'error',
      message: 'Invalid year',
    });
  next();
};

//////////////////////////////////////////////////
// AGGREGATION QUERY
//////////////////////////////////////////////////

exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $match: {
          metacritic: { $gte: 0 },
          year: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: '$type',
          numOfMovies: { $sum: 1 },
          avgRuntime: { $avg: '$runtime' },
          minRuntime: { $min: '$runtime' },
          maxRuntime: { $max: '$runtime' },
          avgRating: { $avg: '$metacritic' },
          minRating: { $min: '$metacritic' },
          maxRating: { $max: '$metacritic' },
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' },
        },
      },
      {
        $sort: {
          year: 1,
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getMovieStatsByYear = async (req, res) => {
  try {
    const paramYear = req.params.year * 1;

    const stats = await Movie.aggregate([
      {
        $match: {
          year: paramYear,
          released: {
            // first half of the year
            $gte: new Date(`${paramYear}-01-01`),
            $lte: new Date(`${paramYear}-06-30`),
          },
        },
      },
      { $unwind: '$countries' },
      {
        $group: {
          _id: { $month: '$released' },
          numOfMovies: { $sum: 1 },
          countries: { $addToSet: '$countries' },
          titles: { $push: '$title' },
        },
      },
      { $sort: { month: 1 } },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};
