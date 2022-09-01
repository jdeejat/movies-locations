const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
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
const viewRoutes = require('./routes/viewRoutes');

////////////////////////////////////
//APP CONFIG
////////////////////////////////////

const app = express();
// EXPRESS - serving static files
app.use(express.static(path.join(__dirname, 'public'))); // __dirname is a global variable that holds the current directory. `${__dirname}/public`
// Usu pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // instead of `${__dirname}/views` use path module

////////////////////////////////////
// MIDDLEWARE
////////////////////////////////////

// HELMET - set security HTTP headers

app.use(
  helmet({
    contentSecurityPolicy: false,
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
    //     baseUri: ["'self'"],
    //     fontSrc: ["'self'", 'https:', 'data:'],
    //     scriptSrc: [
    //       "'self'",
    //       'https:',
    //       'http:',
    //       'blob:',
    //       'https://*.mapbox.com',
    //       'https://js.stripe.com',
    //       'https://m.stripe.network',
    //       'https://*.cloudflare.com',
    //     ],
    //     frameSrc: ["'self'", 'https://js.stripe.com'],
    //     objectSrc: ["'none'"],
    //     styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    //     workerSrc: [
    //       "'self'",
    //       'data:',
    //       'blob:',
    //       'https://*.tiles.mapbox.com',
    //       'https://api.mapbox.com',
    //       'https://events.mapbox.com',
    //       'https://m.stripe.network',
    //     ],
    //     childSrc: ["'self'", 'blob:'],
    //     imgSrc: ["'self'", 'data:', 'blob:'],
    //     formAction: ["'self'"],
    //     connectSrc: [
    //       "'self'",
    //       "'unsafe-inline'",
    //       'data:',
    //       'blob:',
    //       'https://*.stripe.com',
    //       'https://*.mapbox.com',
    //       'https://*.cloudflare.com/',
    //       'https://bundle.js:*',
    //       'ws://localhost:*/',
    //     ],
    //     upgradeInsecureRequests: [],
    //   },
    // },
  })
);

// MORGAN - development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// EXPRESS - body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // this is to parse form data
app.use(cookieParser());

// TEST middleware example
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log('Test Middleware:', req.method, req.path, req.cookies);
//   next();
// });

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
// WEBSITE ROUTES
app.use('/', viewRoutes);

// MOUNT API ROUTES
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
