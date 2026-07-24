const express = require('express')
const {
    createOrder,
    paymentValidator,
    fetchAllOrders,
    fetchOrderDetail
    } = require('../../controllers/customer/Order_Controller')
    const {authMiddleware} = require("../../middleware/authMiddleware");
const OrderRouter = express.Router();

OrderRouter.post('/create',authMiddleware,createOrder);
OrderRouter.post('/validate',authMiddleware,paymentValidator);
OrderRouter.get('/fetchAll/:userId',authMiddleware,fetchAllOrders);
OrderRouter.get('/details/:orderId',authMiddleware,fetchOrderDetail);

module.exports = OrderRouter;