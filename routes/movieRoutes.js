const express = require('express');
const movieController = require('../controllers/movieController');
// alternative way to import with destructuring
//const { getTenMovies } = require('./../controllers/movieController');

const router = express.Router();

router.param('year', movieController.checkYear);

router.route('/').get(movieController.getTenMovies);
router.route('/:year').get(movieController.getMoviesByYear);

module.exports = router;
