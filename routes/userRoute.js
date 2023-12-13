const express= require('express');
const userRoute=express();
const {
    login,
    signup,
    verifyEmail,
    changePassword,
    forgotPasswordEmail,
    changePasswordUsingForgotLink,
    getAdress,
    checkIsLogin
}=require('../controllers/UserController');
const { isLogin } = require('../auth');

userRoute.get("/getUserId",isLogin,function(req,res){
    let user=req.session._id;
    res.status(200).json({user});
})

userRoute.post("/login",login);

userRoute.post("/signup", signup);

userRoute.get("/checkAuthentication",checkIsLogin)

userRoute.post("/changePassword",changePassword);

userRoute.get("/changePassword/:token",changePasswordUsingForgotLink);

userRoute.get("/verify/:token",verifyEmail);

userRoute.post("/forgotPasswordEmail",forgotPasswordEmail),
userRoute.get("/getAddress",isLogin,getAdress);

userRoute.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    req.session.destroy();
    res.status(200).send("logout");
});

module.exports=userRoute;