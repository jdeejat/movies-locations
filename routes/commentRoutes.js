const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

// mergeParams: true allows us to access the movieId param from nested routes
const router = express.Router({ mergeParams: true });

// only authenticated users can pass through this route
router.use(authController.protect);

router
  .route('/')
  .get(commentController.getAllComments)
  .post(commentController.createComment);

router
  .route('/:id')
  .get(commentController.getComment)
  .delete(commentController.deleteComment);

module.exports = router;
