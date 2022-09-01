const Movie = require('../models/movieModel');

const APIfeatures = require('../utils/APIfeatures');
const catchAsync = require('../utils/asyncCatch');
const AppError = require('../utils/appErrorClass');

const factory = require('./handlerFactory');

//////////////////////////////////////////////////
// ALIASES
//////////////////////////////////////////////////

exports.aliasTop = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = 'lastupdated';
  req.query.fields = 'title,year,type,tmdb,-_id';
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
exports.getOneMovie = factory.getOne(Movie);

exports.getMovies = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIfeatures(Movie.find(), req.query)
    .filterOnFields()
    .paginate()
    .sortQuery()
    .selectFields();

  const movies = await features.query; // run stats with .explain()

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

//////////////////////////////////////////////////
// GEO HANDLERS
//////////////////////////////////////////////////

// 'locations.coordinates': {$geoWithin: { $centerSphere: [ [ 7.304534912109376, 50.6372220337556 ], 0.18963071132646298 ]}}}
// /filmed-within/100/center/51.2466368,6.8236344/unit/km

exports.getMoviesWithin = catchAsync(async (req, res, next) => {
  const unit = req.query.unit || 'km';
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutde and longitude in the format lat,lng',
        400
      )
    );
  }
  const movies = await Movie.find({
    'locations.coordinates': {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: { movies },
  });
});

exports.getDistancesTo = catchAsync(async (req, res, next) => {
  const unit = req.query.unit || 'km';
  const { latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutde and longitude in the format lat,lng',
        400
      )
    );
  }

  const distances = await Movie.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        title: 1,
        //locations: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    //results: distance.length,
    data: distances,
  });
});
