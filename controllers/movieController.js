const Movie = require('../models/movieModel');

const APIfeatures = require('../utils/APIfeatures');
const catchAsync = require('../utils/asyncCatch');
const AppError = require('../utils/appErrorClass');

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

exports.getMovies = catchAsync(async (req, res, next) => {
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
});

// exaple of non-async function
exports.getMoviesByYear = (req, res, next) => {
  Movie.find({
    year: req.params.year * 1,
  })
    .select('title year poster _id')
    .exec((err, movies) => {
      // if (err)
      //   return res.status(500).json({
      //     status: 'error',
      //     message: err,
      //   });

      // this is replacement for the above if statement with appError class
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: 'success',
        data: { movies },
      });
    });
};

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newMovie },
  });
});

//////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////

exports.checkYear = (req, res, next, year) => {
  if (year.length !== 4)
    return next(new AppError('Please provide a valid year', 400));
  next();
};

//////////////////////////////////////////////////
// AGGREGATION QUERY
//////////////////////////////////////////////////

exports.getMovieStats = catchAsync(async (req, res, next) => {
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
});

exports.getMovieStatsByYear = catchAsync(async (req, res, next) => {
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
});
