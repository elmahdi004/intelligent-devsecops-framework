const mongoose = require('mongoose')

const Cart = new mongoose.Schema(
    {
        UserId : 
        {
            type:mongoose.Schema.ObjectId,
            ref : 'Users',
            required : true
        },
        Items : [
            {
                ProductId : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'Products',
                    required : true
                },
                Size : {
                    type : String,
                    enum : ["XS","S","M","L","XL","XXL"],
                    required : true
                },
                Quantity : {
                    type : Number,
                    required : true,
                    min : 1
                },
                _id : false
            }
        ]
    },
    {
        timestamps : true
    }
)

const model = mongoose.model('Carts',Cart)

module.exports = model