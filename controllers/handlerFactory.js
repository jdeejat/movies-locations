const catchAsync = require('../utils/asyncCatch');
const AppError = require('../utils/appErrorClass');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // save query to variable to manipulate before executing query
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    // execute query
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
