const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/willComp"
const connectToMongo = () => {
    mongoose.connect(url,() => {
        console.log("Database connected successful");
    })
}
module.exports = connectToMongo;