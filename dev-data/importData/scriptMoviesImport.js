require('dotenv').config({ path: '../../config.env' });
const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

// MONGOOSE CONFIG

// movies
const movieSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  type: {
    type: String,
    default: 'dataLoad',
  },
  lastupdated: {
    type: Date,
    default: Date.now(),
  },
  poster: {
    type: String,
    default: 'https://dummyimage.com/640x360/fff/aaa',
  },
  genres: [String],
  cast: [String],
});
const Movie = mongoose.model('Movie', movieSchema);

// read the file
const moviesJSON = JSON.parse(
  fs.readFileSync('./moviesDataForImport.json', 'utf-8')
);

// import the data
const importData = async () => {
  try {
    const countMoviesInDB = await Movie.countDocuments();
    await Movie.create(moviesJSON);
    const contMoviesLoaded = (await Movie.countDocuments()) - countMoviesInDB;
    console.log(`Successfully loaded ${contMoviesLoaded} movies`);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// this is to run the script with the command: node scriptMoviesImport.js --import
if (process.argv[2] === '--import') {
  importData();
}
