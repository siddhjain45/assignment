const express = require("express");
const User = require('../modals/user')

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fetchUser = require("../middleware/jwtVerify")

// roye for signup
router.post('/signup',async (req,res)=>{
    const {name,email,username,password} = req.body;

   try{
    const olduser = await User.findOne({email: email });  // find for user in database if exist.
    if (olduser) return res.json({ success: false, mes: "user already exist" });
     
    
    encryptedPassword = await bcrypt.hash(password, 10); // hashing password

    // if user not exist then we will sent otp to given user email
    const user = new User({  //  store data into the database
        name,
        email,
        username,
        password: encryptedPassword
    });
    await user.save();
    res.json({success:true,user:user})

   }catch(e){
       console.log(e)
    //    res.json({err:"error"})
    res.json({success:false,msg:"msh"})
   
   }


})

// route for login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;  // getting input from user
    try {
        if (!email || !password) {   // validating user input
            success = false
            return res.status(400).json({ mes: "please fill all fields" });
        }

        const user = await User.findOne({ email });  // finding user in database

        if (!user) {
            success = false
            return res.status(400).json({ mes: "invalid users details" });
        }

        const compare_pass = await bcrypt.compare(password, user.password)  // if user exist then compare password of user.

        if (!compare_pass) {
            success = false
            return res.status(401).json({ success, mes: "invalid details" });
        }
        const token = jwt.sign(  // generation token of logged user
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            process.env.SECRET_KEY
        )
        success = true
        res.status(201).json({ success: true, mes: token });  // returning response

    } catch (error) {
        console.log(error);
        res.json({ error });

    }

})

// route for change password
router.post('/changepassword', fetchUser, async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;

        const user1 = await User.findOne({ _id: req.user.id });

        const compare = await bcrypt.compare(oldpassword, user1.password);

        if (!compare) {
            success = false
            return res.status(401).json({ success, mes: "incorrect password" });
        }
        encryptedPassword = await bcrypt.hash(newpassword, 10); // hashing password

        const newuser = await User.findByIdAndUpdate({ _id: req.user.id }, { password: encryptedPassword }, { new: true })
        res.status(201).json({ success: true, msg: "password update successfully!!", user: newuser })
    }
    catch (e) {
        console.log(e)
        return res.json({ success: false, msg: "something went wrong" });

    }
})


//........................................ routes for reset password.........................

//Route 1 : post route which get the email from user and then send a link to user
router.post('/resetpassword', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, msg: "invalid email address" })

    secret = process.env.SECRET_KEY + user.password;
    let payload = {
        id: user._id,
        email: user.email
    }

    let token = await jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:5000/edupedia/auth/resetpassword/${user._id}/${token}`;

    res.json({ link: link })
})

// Route 2 : get route to verify the link i.e, id and token 
router.get('/resetpassword/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json({ success: false, msg: "invalid user" })

    try {
        secret = process.env.SECRET_KEY + user.password;
        let payload = jwt.verify(token, secret)
        res.status(201).json({ success: true, msg: "token verified for the user" })
    }
    catch (e) {
        console.log(e);
        res.json({ e })
    }

})

//Route:3:post route for update/reset password in db by verify the link
router.post('/resetpassword/:id/:token', async (req, res) => {

    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ success: false, msg: "invalid user" })

    try {
        secret = process.env.SECRET_KEY + user.password;
        let payload = jwt.verify(token, secret)
        encryptedPassword = await bcrypt.hash(password, 10); // hashing password

        const newuser = await User.findByIdAndUpdate({ _id: id }, { password: encryptedPassword }, { new: true })

        res.status(201).json({ success: true, msg: "password reset succ" })
    }
    catch (e) {
        console.log(e);
        res.json({ e })
    }

})
module.exports=router