const mongoose = require('mongoose')

const Order = new mongoose.Schema(
    {
        UserId : {
            type : String,
            required : true
        },
        CartId : {
            type : String,
            required : true
        },
        OrderItems : [
            {
                ProductId : {
                    type : String,
                    required : true
                },
                Title : {
                    type : String,
                    required : true
                },
                Image : {
                    type : Array,
                    required : true
                },
                Category : {
                    type : String,
                    required : true
                },
                Price : {
                    type : Number,
                    required : true
                },
                SalePrice : {
                    type : Number
                },
                Size : {
                    type : String,
                    enum : ["XS","S","M","L","XL","XXL"],
                    required : true
                },
                Quantity : {
                    type : Number,
                    required : true
                }
            }
        ],
        OrderAddress : {
            AddressId : {
                type : String,
                required : true
            },
            Address : {
                type : String,
                required : true
            },
            City : {
                type : String,
                required : true
            },
            Pincode : {
                type : String,
                required : true
            },
            Contact : {
                type : String,
                required : true
            },
            Landmark : {
                type : String
            },
        },
        OrderStatus : {
            type : String,
            required : true
        },
        PaymentMethod : {
            type : String,
            required : true
        },
        PaymentStatus : {
            type : String,
            required : true
        },
        OrderTotal : {
            type : Number,
            required : true
        },
        OrderCreationDate : {
            type : Date,
            required : true
        },
        OrderUpdationDate : {
            type : Date,
            required : true
        }
    }
)

const model = mongoose.model('Orders',Order)

module.exports = model