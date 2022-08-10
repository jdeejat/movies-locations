const express = require('express');
const movieController = require('../controllers/movieController');
// alternative way to import with destructuring
//const { getTenMovies } = require('./../controllers/movieController');

const router = express.Router();

router
  .route('/top-100-21')
  .get(movieController.aliasTop21, movieController.getMovies);

router.route('/stats').get(movieController.getMovieStats);
router.route('/stats/:year').get(movieController.getMovieStatsByYear);

router
  .route('/')
  .get(movieController.getMovies)
  .post(movieController.createMovie);

router.param('year', movieController.checkYear);
router.route('/:year').get(movieController.getMoviesByYear);

module.exports = router;
