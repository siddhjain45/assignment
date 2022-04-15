const express = require("express");
const User = require('../modals/user')
const Event = require('../modals/events')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fetchUser = require("../middleware/jwtVerify")

// route api for create new event
router.post('/createEvent',fetchUser,async (req,res)=>{
    
    try{const {title,desc,mode}=req.body;
    
    const event = new Event({
        title,desc,mode,
        users:req.user.id
        
    })
    await event.save();
    res.json({event:event});
}catch(e){
    console.log(e);
    res.json({err:"smething went wrong"})
}

})

//route for invite the users
router.post('/inviteUser',fetchUser,async (req,res)=>{
    const {eventId,userID} = req.body;

    const event = await Event.findOne({_id:eventId,users:req.user.id})
    if(!event) return res.json({success:false,msg:"no event "});

    let inviteUser = event.invitedUsers
    inviteUser.push(userID)

    const updateEvent = await Event.findByIdAndUpdate({_id:eventId},{invitedUsers:inviteUser},{new:true})

    res.json({upd:updateEvent})
    
})

// getting list of partucular created events and events in which the are invited of logged in user
router.get('/list',fetchUser,async (req,res)=>{
    const event = await Event.find({users:req.user.id})
    const invitedEvents = await Event.find({invitedUsers:req.user.id})

    res.json({succes:true,createdEvents:event,invited:invitedEvents})
})

// route to get all the events details and invited users list
router.get('/getEvents',fetchUser,async (req,res)=>{
    const events = await Event.find().populate("users","-password")

    res.json({success:true,eventDetails:events})
})

// api for updating event not added much functionallity like the check for the express-validator or updating receiving data
router.put('/updateEvent/:_id',fetchUser,async (req,res)=>{
    const {title,desc,mode} = req.body
    const _id=req.params._id

    const updatedEvent = await Event.findByIdAndUpdate({_id:_id},{title,desc,mode},{new:true})

    res.jsont({success:true,event:updatedEvent})

})
module.exports=router;