const express = require('express')
const {
    fetchAllOrders,
    updateOrderStatus ,
    deleteOrder 
    } = require('../../controllers/admin/Admin_Order_Controller.js')
const {adminMiddleware} = require("../../middleware/adminMiddleware.js")
const AdminOrderRouter = express.Router();

AdminOrderRouter.get('/fetchAll',adminMiddleware,fetchAllOrders);
AdminOrderRouter.post('/updateStatus/:orderId',adminMiddleware,updateOrderStatus);
AdminOrderRouter.delete('/delete/:orderId', adminMiddleware, deleteOrder);

module.exports = AdminOrderRouter;