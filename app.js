const express = require('express');
const mongoose = require('mongoose');

//APP CONFIG
const app = express();

// MONGOOSE CONFIG
const mov = mongoose.createConnection(
  `mongodb+srv://testUser:ZPbNqpukVqhZRS2@cluster0.4ioj6pf.mongodb.net/sample_mflix`
);
const movieSchema = new mongoose.Schema({
  year: Number,
});
const Movie = mov.model('Movie', movieSchema);

app.get('/api/v1/movies', (req, res) => {
  // send  10 movies to the client
  Movie.find({})
    .select('title year poster _id')
    .limit(10)
    .exec((err, movies) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(movies);
    });

  //   Movie.count({}, function (err, count) {
  //     console.log('Number of Movies:', count);
  //   });
});

app.get('/api/v1/movies/:year', (req, res) => {
  Movie.find({
    year: req.params.year * 1,
  })
    .select('title year poster _id')
    .exec((err, movies) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(movies);
    });
});

// listen for requests :)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
