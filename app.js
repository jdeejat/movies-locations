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
app.use(morgan('dev'));
app.use(express.json());
// MOUNT ROUTES
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', userRoutes);

///////////////////////////////////////

module.exports = app;
