const express = require('express');
const morgan = require('morgan');
// in app modules
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');

///////////////////////////////////////
//APP CONFIG
const app = express();
// middleware example
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
// });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // __dirname is a global variable that holds the current directory

/* Ways of routing:
Simple way to route application is to use app.get('/api/v1/movies', getTenMovies);
Alternative to above is app.route('/api/v1/movies').get(getTenMovies) and can be chained with other methods .create .delete .put
Second alternative is to use router middleware 
*/
// MOUNT ROUTES
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', userRoutes);

///////////////////////////////////////

module.exports = app;
