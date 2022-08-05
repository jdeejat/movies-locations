const express = require('express');
const movieController = require('./../controllers/movieController');
// alternative way to import with destructuring
const { getTenMovies } = require('./../controllers/movieController');

const router = express.Router();

//app.get('/api/v1/movies', getTenMovies);
// alternative to above and can be chained with other methods .create .delete .put
router.route('/').get(getTenMovies);
router.route('/:year').get(movieController.getMoviesByYear);

module.exports = router;
