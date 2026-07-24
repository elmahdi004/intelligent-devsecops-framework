const express = require('express')
const {
    handleSearchProducts
    } = require('../../controllers/customer/Search_Controller')
    const {authMiddleware} = require("../../middleware/authMiddleware");
const SearchRouter = express.Router();

SearchRouter.get('/:searchQuery',authMiddleware,handleSearchProducts);

module.exports = SearchRouter;