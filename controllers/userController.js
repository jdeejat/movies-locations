const mongoose = require('mongoose');

// MONGOOSE CONFIG
const mov = mongoose.createConnection(
  `mongodb+srv://testUser:ZPbNqpukVqhZRS2@cluster0.4ioj6pf.mongodb.net/sample_mflix`
);
// users
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mov.model('User', userSchema);

// USER HANDLERS

exports.getAllUsers = (req, res) => {
  User.find({})
    .select('name email _id')
    .exec((err, users) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(users);
    });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'Not Implemented',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'Not Implemented',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'Not Implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'Not Implemented',
  });
};
