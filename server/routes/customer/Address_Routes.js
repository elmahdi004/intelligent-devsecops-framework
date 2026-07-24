const express = require('express')
const {
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleFetchAddress
} = require("../../controllers/customer/Address_Controller")
const {authMiddleware} = require("../../middleware/authMiddleware");
const AddressRouter = express.Router();

AddressRouter.post('/add',authMiddleware,handleAddAddress);
AddressRouter.get('/fetch/:userId',authMiddleware,handleFetchAddress);
AddressRouter.put('/update/:userId/:addressId',authMiddleware,handleEditAddress);
AddressRouter.delete('/delete/:userId/:addressId',authMiddleware,handleDeleteAddress);

module.exports = AddressRouter;