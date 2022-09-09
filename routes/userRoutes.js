const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/me').get(authController.protect, userController.getUser);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// if all below routes need to be protected to auth users
//can use router.use(authController.protect) because middleware is executed in sequence
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );
////////////////////////////////////
// STRIPE tip
////////////////////////////////////

router.get('/checkout-session', userController.getStripeSession);

// only admin can access below routes
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:email')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
