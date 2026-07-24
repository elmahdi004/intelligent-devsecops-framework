const express = require('express')
const {
    handleAddToCart,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleFetchCartItems
} = require("../../controllers/customer/Cart_Controller")
const {authMiddleware} = require("../../middleware/authMiddleware");
const CartRouter = express.Router();

CartRouter.post('/add',handleAddToCart);
CartRouter.get('/fetch/:userId',handleFetchCartItems);
CartRouter.put('/update',authMiddleware,handleUpdateCartItem);
CartRouter.delete('/delete/:userId/:productId/:size',authMiddleware,handleDeleteCartItem);

module.exports = CartRouter;