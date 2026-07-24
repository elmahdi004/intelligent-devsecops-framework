const mongoose = require('mongoose')

const Product = new mongoose.Schema(
    {
        Image : 
        {
            type:Array,
            required:true,
        },
        Title : 
        {
            type:String,
            required:true
        },
        Description : 
        {
            type:String,
            required:true
        },
        Category : 
        {
            type:String,
            required:true
        },
        Brand : 
        {
            type:String,
            required:true
        },
        Price : 
        {
            type:Number,
            min : 1,
            required:true
        },
        SalePrice : 
        {
            type:Number,
            min : 1
        },
        Featured : 
        {
            type:String,
            required:true
        },
        Size : [
            {
                _id : false,
                size : {
                    type : String,
                    enum : ["XS","S","M","L","XL","XXL"],
                    required : true
                },
                quantity : {
                    type : Number,
                    min : 0,
                    required : true
                }
            }
        ]
    },
    {timestamps : true}
)

const model = mongoose.model('Products',Product)

module.exports = model