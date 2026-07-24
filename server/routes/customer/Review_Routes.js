const express = require('express')
const {
    handleAddReview,
    handleGetReviews
    } = require('../../controllers/customer/Review_Controller')
    const {authMiddleware} = require("../../middleware/authMiddleware");
const ReviewRouter = express.Router();

ReviewRouter.post('/add',authMiddleware,handleAddReview);
ReviewRouter.get('/fetch/:productId',authMiddleware,handleGetReviews);

module.exports = ReviewRouter;