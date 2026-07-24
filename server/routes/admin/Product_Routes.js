const express = require('express')
const {
    handleAddProduct,
    handleEditProduct,
    handleRemoveProduct,
    handleGetProducts
    } = require('../../controllers/admin/Product_Controller')
const {upload} = require('../../utility/cloudinary')
const {adminMiddleware} = require("../../middleware/adminMiddleware.js")
const ProductRouter = express.Router();

ProductRouter.post('/create',adminMiddleware,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),handleAddProduct);
ProductRouter.put('/edit/:id',adminMiddleware,handleEditProduct);
ProductRouter.delete('/remove/:id',adminMiddleware,handleRemoveProduct);
ProductRouter.get('/fetchAll',adminMiddleware,handleGetProducts);

module.exports = ProductRouter;