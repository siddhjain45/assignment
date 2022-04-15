const jwt = require("jsonwebtoken");

const fetchUser = (req , res, next) =>{
    const token = req.header("auth-token");
    if(!token){
        res.status(401).json("please verify using valid token")
    }
    try {
        const data = jwt.verify(token,process.env.SECRET_KEY);
        req.user = data;
        next();
    } catch (error) {
        console.log(error);
        res.json({error});  
    }

}


module.exports = fetchUser;