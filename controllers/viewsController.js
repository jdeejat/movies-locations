const catchAsync = require('../utils/asyncCatch');
const Movie = require('../models/movieModel');
const AppError = require('../utils/appErrorClass');
const APIfeatures = require('../utils/APIfeatures');

////////////////////////////////////
// MAIN route handler
////////////////////////////////////

// Overview page
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get data from movie model
  const features = new APIfeatures(Movie.find(), req.query)
    .filterOnFields()
    .paginate();

  const movies = await features.query;

  if (!movies) {
    return next(new AppError('No movies found', 404));
  }

  // 2) Build template id done in overview.pug and in loadMore.pug

  // 3) Render template
  if (req.query.page) {
    res.status(200).render('loadMore', {
      movies,
    });
  } else {
    res.status(200).render('overview', {
      title: 'Oveview',
      movies,
    });
  }
});

// Movie page by id
exports.getMovie = catchAsync(async (req, res, next) => {
  // 1) Get movie by id
  const movie = await Movie.findById(req.params.id).populate({
    path: 'latestComments',
    select: 'text date rating name',
    options: { limit: 5, sort: { date: -1 } },
  });

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  // //2) get data from TMDB api
  // const request = await fetch(
  //   `https://api.themoviedb.org/3/movie/${movie.tmdb.id}?api_key=${process.env.TMDB_API_KEY}`
  // );
  // const tmdbMovie = await request.json();
  // // get images from TMDB api
  // const request2 = await fetch(
  //   `https://api.themoviedb.org/3/movie/${movie.tmdb.id}/images?api_key=${process.env.TMDB_API_KEY}`
  // );
  // const images = await request2.json();
  // tmdbMovie.images = images.backdrops.slice(1, 4);

  res.status(200).render('movie', {
    title: movie.title,
    movie,
    // tmdbMovie,
  });
});

// Login page
exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

// Signup page
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};

// Account page
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
    // user data is passed in the locals object
  });
};
