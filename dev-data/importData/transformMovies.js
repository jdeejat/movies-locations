const fs = require('fs');

// import
const movies = JSON.parse(fs.readFileSync('./mergedMoviesTMDB.json', 'utf-8'));

const transformedMovies = [];
// transform data
// eslint-disable-next-line array-callback-return
movies.map((movie) => {
  // new movie object
  const newMovieObj = {
    year: movie.tmdb.year,
    title: movie.tmdb.title,
    type: 'Movie',
    tmdb: {
      id: movie.tmdb.id,
      overview: movie.tmdb.overview,
      genres: movie.tmdb.genre_ids,
      poster: `https://image.tmdb.org/t/p/original${movie.tmdb.poster_path}`,
      releaseDate: movie.tmdb.release_date,
      popularity: movie.tmdb.popularity,
      voteAverage: movie.tmdb.vote_average,
      voteCount: movie.tmdb.vote_count,
    },
    atlasLink: movie.articleLink,
    locations: [],
  };
  // locations array
  // eslint-disable-next-line array-callback-return
  movie.locationInfo.map((location) => {
    const newLocationObj = {
      type: 'Point',
      pointName: location.placeName,
      googleMapsLink: location.link,
      coordinates: [location.lng, location.lat],
    };
    newMovieObj.locations.push(newLocationObj);
  });
  // push to transformedMovies array
  transformedMovies.push(newMovieObj);
});

// write to file
fs.writeFileSync('./atlasMovies.json', JSON.stringify(transformedMovies));
