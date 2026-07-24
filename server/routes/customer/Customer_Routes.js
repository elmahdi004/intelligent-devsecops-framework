const express = require('express')
const {
    getProducts,
    getProductDetails,
    getSimilarProducts,
    getFeaturedandLatest
    } = require('../../controllers/customer/Customer_Controller')
    const {authMiddleware} = require("../../middleware/authMiddleware");
const CustomerRouter = express.Router();

CustomerRouter.get('/fetch',getProducts);
CustomerRouter.get('/fetchProduct',getProductDetails);
CustomerRouter.get('/similarProducts',getSimilarProducts);
CustomerRouter.get('/featured-latest',getFeaturedandLatest);

module.exports = CustomerRouter;