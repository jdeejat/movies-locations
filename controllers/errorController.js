const AppError = require('../utils/appErrorClass');

/////////////////////////////////////////
// HANDLERS for specific errors
/////////////////////////////////////////

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // use Object.values to loop over the object and get the values
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = 'Invalid token (wrong or expried). Please log in again';
  return new AppError(message, 401);
};

/////////////////////////////////////////
// Prod vs Dev
/////////////////////////////////////////

const errorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorProd = function (err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log error
    console.error('ERR', err);
    // send generic error message for unhandled errors
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

/////////////////////////////////////////
// ERROR HANDLING MIDDLEWARE
/////////////////////////////////////////

module.exports = (err, req, res, next) => {
  // you can see err by console.log(err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // copy err object to error
    let error = { ...err, name: err.name, code: err.code };

    // checking different error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    )
      error = handleJWTError();

    // sending error to the client
    errorProd(error, res);
  }
};
