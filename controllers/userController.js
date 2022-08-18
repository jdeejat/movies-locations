const User = require('../models/userModel');
const catchAsync = require('../utils/asyncCatch');
const AppError = require('../utils/appErrorClass');

// USER HANDLERS

////////////////////////////////////
// MAIN route handler
////////////////////////////////////

/*
// OPTION 1 get all users using normal callback function 
exports.getAllUsers = (req, res) => {
  User.find({})
    .select('name email _id')
    .exec((err, users) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(users);
    });
};
// OPTION 2 get all users using .then()
exports.getAllUsers = (req, res) => {
  User.find({})
    .select('name email _id')
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
*/

// OPTION 3 get all users using async/await
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name email _id');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

/* 
Moved to authController.js
exports.createUser = (req, res) => {
  // OPTION1 create user with method on new object
  // const newUser = new User(req.body);
  // newUser.save()
  // OPTION2 create user with method on model
  User.create(req.body, (err, user) => {
    if (err)
      return res.status(400).json({
        status: 'error',
        error: err,
      });
    res.status(201).json({
      status: 'success',
      data: { user },
    });
  });
};
*/

////////////////////////////////////
// :EMAIL route handler
////////////////////////////////////

// GET ONE USER

exports.getUser = (req, res) => {
  User.findOne({ email: req.params.email ? req.params.email : req.user.email })
    .select('name email _id')
    .populate({
      path: 'latestComments',
      select: 'text date -user_id',
      options: { limit: 10, sort: { date: -1 } },
    })
    .exec((err, user) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          error: err,
        });
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    });
};

// update user name and email
exports.updateMe = catchAsync(async (req, res, next) => {
  // 0) check if user sent password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // filter out unwanted fields from the request body
  const filteredBody = { name: req.body.name, email: req.body.email };

  // 1) get user from collection by id
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // 4) send response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// ADMIN only
exports.updateUser = async (req, res) => {
  // to prevent updating password with this method
  delete req.body.password;
  // patch method
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true, runValidators: true }
    );
    if (!user)
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

// delete user by email using async/await
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user)
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    res.status(200).json({
      status: 'success',
      message: 'User deleted',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};
