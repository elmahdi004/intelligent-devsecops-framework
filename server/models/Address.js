const mongoose = require('mongoose')

const Address = new mongoose.Schema(
    {
        UserId : 
        {
            type:String,
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
    {
        timestamps : true
    }
)

const model = mongoose.model('Address',Address)

module.exports = model