const express = require('express');
//const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');
// const userController = require('../controllers/userController');

const router = express.Router();

router.get('/account', authController.protect, viewController.getAccount);

router.use(authController.setLoggedInUser);
// overview
router.get('/', viewController.getOverview);
// movie page by id
router.get('/movie/:id', viewController.getMovie);
// login & signup page
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);

module.exports = router;
