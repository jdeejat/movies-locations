const mongoose = require('mongoose');

// MONGOOSE CONFIG
const mov = mongoose.createConnection(
  `mongodb+srv://testUser:ZPbNqpukVqhZRS2@cluster0.4ioj6pf.mongodb.net/sample_mflix`
);
// movies
const movieSchema = new mongoose.Schema({
  year: Number,
});
const Movie = mov.model('Movie', movieSchema);

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
