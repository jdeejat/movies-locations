const express = require('express');
const movieController = require('../controllers/movieController');
const commentRoutes = require('./commentRoutes');
// alternative way to import with destructuring
//const { getTenMovies } = require('./../controllers/movieController');

const router = express.Router();

// implementing nested routes
router.use('/:movieId/comments', commentRoutes);

// GEO routes
// /filmed-within/100/center/51.2466368,6.8236344/unit/km
router
  .route('/filmed-within/:distance/center/:latlng')
  .get(movieController.getMoviesWithin);

router.route('/distances-to/:latlng').get(movieController.getDistancesTo);

// alias routes
router.route('/top').get(movieController.aliasTop, movieController.getMovies);

// get  movies
router.route('/:id').get(movieController.getOneMovie);
router
  .route('/')
  .get(movieController.getMovies)
  .post(movieController.createMovie);

// get by year
// routers can be used with param or within GET, POST...
router.param('year', movieController.checkYear);
router.route('/:year').get(movieController.getMoviesByYear);

// aggregation stats routes
router.route('/stats').get(movieController.getMovieStats);
router.route('/stats/:year').get(movieController.getMovieStatsByYear);

module.exports = router;
