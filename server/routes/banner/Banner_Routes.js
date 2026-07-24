const express = require('express')
const {
    addBanner,
    getBannerImages,
    deleteBanner
} = require("../../controllers/banner/Banner_Controller")
const {upload} = require('../../utility/cloudinary')
const {authMiddleware} = require("../../middleware/authMiddleware")
const {adminMiddleware} = require("../../middleware/adminMiddleware")
const BannerRouter = express.Router();

BannerRouter.post('/add',adminMiddleware,upload.single('image'),addBanner);
BannerRouter.get('/fetchAll',getBannerImages);
BannerRouter.delete('/delete/:bannerId',adminMiddleware,deleteBanner);

module.exports = BannerRouter;