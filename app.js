const express = require('express');
const morgan = require('morgan');
//security
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// error modules
const AppError = require('./utils/appErrorClass');
const errorController = require('./controllers/errorController');

// in app modules
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');

////////////////////////////////////
//APP CONFIG
////////////////////////////////////

const app = express();

////////////////////////////////////
// MIDDLEWARE
////////////////////////////////////

// HELMET - set security HTTP headers
app.use(helmet());

// middleware example
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   req.requestTime = new Date().toISOString();
//   next();
// });

// MORGAN - development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// EXPRESS - body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// MONGOSANITIZE - Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// XSS - Data sanitization against XSS
app.use(xss());

// HPP - prevent parameter pollution
app.use(
  hpp({
    // this will allow to sort on multiple fileds in APIfeatures
    whitelist: ['title', 'year', 'runtime', 'genre'],
  })
);

// EXPRESS - serving static files
app.use(express.static(`${__dirname}/public`)); // __dirname is a global variable that holds the current directory

// RATE LIMIT - limit requests to 1 per second
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

////////////////////////////////////
// ROUTES
////////////////////////////////////
/* Ways of routing:
Simple way to route application is to use app.get('/api/v1/movies', getTenMovies);
Alternative to above is app.route('/api/v1/movies').get(getTenMovies) and can be chained with other methods .create .delete .put
Second alternative is to use router middleware 
*/
// MOUNT ROUTES
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/comments', commentRoutes);

///////////////////////////////////////
// ERROR handling
////////////////////////////////////
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'error',
  //   message: `Route ${req.originalUrl} not found`,
  // });
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorController);

// EXPORT APP
module.exports = app;
