require('dotenv').config({ path: '../config.env' });
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const Movie = require('../models/movieModel');

mongoose.connect(process.env.DATABASE_URL);

const missingUsers = new Set();

const linkUsersToComments = async () => {
  try {
    // find all movies and console log set with titles
    const movies = await Movie.find();
    const moviesSet = new Set();
    movies.forEach((movie) => {
      moviesSet.add(movie.title);
    });
    console.log(moviesSet);

    // find comments where user_id is null
    const comments = await Comment.find({ user_id: null });
    console.log(`Found ${comments.length} comments with null user_id`);

    // cont unique users on comments
    const usersOnComments = await Comment.find({}).distinct('name');
    console.log(`Found ${usersOnComments.length} unique users on comments`);

    // find all users
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    // loop through comments and link user to comment by name
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const user = users.find((u) => u.name === comment.name);
      if (user) {
        comment.user_id = user._id;
        await comment.save();
        // counter of comments linked to users
        console.log(`${i + 1}/${comments.length} comments linked to users`);
      } else {
        // add missing users to a missingUsers set
        missingUsers.add(comment.name);
      }
    }

    // count number of comments with user_id
    const commentsWithUserId = comments.filter((c) => c.user_id);
    console.log(`Found ${commentsWithUserId.length} comments with user_id`);
    console.log(
      `Missing users count: ${
        missingUsers.size
      } and here is the list: ${Array.from(missingUsers).join(', ')}`
    );

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

linkUsersToComments();
