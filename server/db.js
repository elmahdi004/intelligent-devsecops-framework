const mongoose = require('mongoose')

function DB_Connect(){
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Atlas : Connected"))
    .catch((e) => console.log(`--- MongodB Atlas : Connection error --- \n ${e}`))
}

module.exports = DB_Connect