const User = require('../models/userModel');

// USER HANDLERS

// MAIN route handler
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

////////////////////////////////////
// EMAIL route handler
exports.getUser = (req, res) => {
  User.findOne({ email: req.params.email })
    .select('name email _id')
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

exports.updateUser = async (req, res) => {
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
