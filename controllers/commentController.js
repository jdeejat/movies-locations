const Comment = require('../models/commentModel');

const APIfeatures = require('../utils/APIfeatures');
const catchAsync = require('../utils/asyncCatch');
const AppError = require('../utils/appErrorClass');
const factory = require('./handlerFactory');

////////////////////////////////////
// HELPER functions
////////////////////////////////////

// GET ALL COMMENTS or COMMENTS BY MOVIE ID

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.movieId) filter = { movie: req.params.movieId };

  const features = new APIfeatures(Comment.find(filter), req.query)
    .filterOnFields()
    .paginate()
    .sortQuery()
    .selectFields();

  const comments = await features.query.pre(function () {
    // query level .pre middleware
    this.populate({
      path: 'user_id',
      select: 'name email',
    }).populate({
      path: 'movie_id',
      select: 'title year',
    });
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

// CREATE COMMENT

exports.createComment = catchAsync(async (req, res, next) => {
  if (req.params.movieId) req.body.movie_id = req.params.movieId;
  if (!req.body.movie_id) {
    return next(new AppError('Please provide a movie_id', 400));
  }
  // get user_id
  const comment = req.body;
  comment.user_id = req.user._id;
  comment.name = req.user.name;
  comment.email = req.user.email;

  const newComment = await Comment.create(comment);

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
});

// DELETE ONE COMMENT

exports.deleteComment = factory.deleteOne(Comment);

// GET ONE COMMENT

exports.getComment = factory.getOne(Comment, { path: 'user_id' });
