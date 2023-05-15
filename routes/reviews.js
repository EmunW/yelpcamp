const express = require('express');
const router = express.Router({mergeParams: true}); // Need mergeParams to get the /:id from the URL
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviewsController = require('../controllers/reviews');

// ALL FUNCTIONALITY HAS BEEN MOVED TO THE REVIEWS CONTROLLER

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview))

module.exports = router;