require("./connectMongo")();
require("dotenv").config()

const express = require('express')
const app = express();

app.use(express.json());

app.use('/user',require('./routes/userAPI'))
app.use('/event',require('./routes/handleEvents'))


app.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT}!`)
})
