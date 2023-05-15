const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const campgroundsController = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary/index');
//const upload = multer({dest: 'uploads/'}) // 'dest' is the destination path for the files, in this case it is 'uploads/'
const upload = multer({storage}); // Store the files in storage that we made in cloudinary/index

// ALL FUNCTIONALITY HAS BEEN MOVED TO THE CAMPGROUNDS CONTROLLER

router.route('/') // The path for everything under router.route
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground))

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm))

module.exports = router;