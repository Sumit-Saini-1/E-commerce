const express= require('express');
const userRoute=express();
const {
    loadDashboard,
    loadLogin,
    login,
    signup,
    verifyEmail,
    changePassword,
    forgotPasswordEmail,
    changePasswordUsingForgotLink,
    getAdress
}=require('../controllers/UserController');
const { isLogin } = require('../auth');

// userRoute.use(express.static("Productimages"));
// userRoute.use(express.static("SellerIdentity"));


userRoute.get("/",isLogin, loadDashboard);
userRoute.get("/getUserId",isLogin,function(req,res){
    let user=req.session._id;
    res.status(200).json({user});
})

userRoute.get("/login", loadLogin);
userRoute.post("/login",login);

userRoute.get("/signup",  function(req, res) {
    res.render("signup");
});
userRoute.post("/signup", signup);

userRoute.get("/changePassword",isLogin,function(req,res){
    res.render("changePass",{userId:req.session._id,name: req.session.name});
});
userRoute.post("/changePassword",changePassword);

userRoute.get("/changePassword/:token",changePasswordUsingForgotLink);

userRoute.get("/verify/:token",verifyEmail);

userRoute.get("/forgotPassword",function(req,res){
    res.render("forgotPass",{name: null});
});

userRoute.post("/forgotPasswordEmail",forgotPasswordEmail),
userRoute.get("/getAddress",isLogin,getAdress);

userRoute.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/login");
});

module.exports=userRoute;