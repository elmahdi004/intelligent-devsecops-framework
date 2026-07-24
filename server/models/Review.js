const mongoose = require('mongoose')

const Review = new mongoose.Schema(
    {
        ProductId : 
        {
            type:String,
            required:true,
        },
        UserId : 
        {
            type:String,
            required:true,
        },
        Username : 
        {
            type:String,
            required:true
        },
        Rating : 
        {
            type : Number,
            required : true
        },
        Comment : 
        {
            type : String,
            required : true
        }
    },
    {timestamps : true}
)

const model = mongoose.model('Reviews',Review)

module.exports = model