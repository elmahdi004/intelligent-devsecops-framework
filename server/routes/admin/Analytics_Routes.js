const express = require('express')
const {
    getSalesAnalytics,
    getOrderAnalytics,
    getProductAnalytics
    } = require('../../controllers/admin/Analytics_Controller')
    const {adminMiddleware} = require("../../middleware/adminMiddleware.js")
const AnalyticsRouter = express.Router();

AnalyticsRouter.post('/sales',adminMiddleware,getSalesAnalytics);
AnalyticsRouter.post('/orders',adminMiddleware,getOrderAnalytics);
AnalyticsRouter.post('/product',adminMiddleware,getProductAnalytics);

module.exports = AnalyticsRouter;