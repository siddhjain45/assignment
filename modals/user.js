const mongoose  = require("mongoose");

const userSchema = mongoose.Schema({
    name :String,
    email :String,
    username :String,
    password :String,
    date :{
        type :Date,
        default : Date.now
    },
})
module.exports = mongoose.model("user",userSchema);