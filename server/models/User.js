const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        Username : 
        {
            type:String,
            required:true,
            unique:true
        },
        Email : 
        {
            type:String,
            required:true,
            unique:true
        },
        Password : 
        {
            type:String,
            required:true
        },
        Role : 
        {
            type:String,
            default:"CUSTOMER"
        },
    }
)

const model = mongoose.model('Users',User)

module.exports = model