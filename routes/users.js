const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const usersController = require('../controllers/users');

// ALL FUNCTIONALITY HAS BEEN MOVED TO THE USERS CONTROLLER

router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.register))

router.route('/login')
    .get(usersController.renderLogin)
    // If failureFlash: true then redirect to '/login'
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), usersController.login)

router.get('/logout', usersController.logout);

module.exports = router;