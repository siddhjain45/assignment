const mongoose  = require("mongoose");

const eventSchema = mongoose.Schema(
 {  
    title :String,
    desc :String,
    mode :String,
    users:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    invitedUsers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
},
    {
        timestamps:true
    }

)
module.exports = mongoose.model("events",eventSchema);