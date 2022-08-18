require('dotenv').config({ path: '../../config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const Movie = require('../../models/movieModel');

mongoose.connect(process.env.DATABASE_URL);

// MONGOOSE CONFIG

// read the file
const moviesJSON = JSON.parse(
  fs.readFileSync('./moviesData2021.json', 'utf-8')
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
