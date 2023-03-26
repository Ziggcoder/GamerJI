require('dotenv').config();
const User = require("../model/m_user_info");

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./asyncHandler");
const rc = require('./../controllers/responseController');

const secretkey=process.env.SECRET_KEY
console.log("🚀 ~ file: auth.js:9 ~ secretkey:", process.env.SECRET_KEY)

const auth = asyncHandler(async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
   
    if (bearerHeader) {
        // console.log("barrer");
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        // console.log(bearerToken);
            const verifyUser = jwt.verify(bearerToken,secretkey);
            
            const user = await User.findOne({ _id:verifyUser._id },{password:0,otp:0,__v:0})
            req.user = user;
            req.tokenid = verifyUser;
            //console.log(`auth ${user}`);
            if(user==null){
                return rc.setResponse(res, {
                    error:"Invalid Session : Please Try After LogIn"
                });
            }else {
           //console.log(req.user);
            next();
            return;
        }
    } 
    else if(req.cookies){
            const token = req.cookies.cookie;
            const verifyUser = jwt.verify(token,secretkey);
            console.log(verifyUser);
            const user = await User.findOne({ _id: verifyUser._id })
            req.user = user;
            req.tokenid = verifyUser;
            next();
            return;

    }
    else{
        return rc.setResponse(res, {
            error:"Session Not Found : Please Try After LogIn"
        });
    }
})




module.exports = auth;