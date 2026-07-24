const mongoose = require('mongoose')

const Banner = new mongoose.Schema(
    {
        BannerImage : {
            type : String
        }
    }
)

const model = mongoose.model('Banners',Banner)

module.exports = model