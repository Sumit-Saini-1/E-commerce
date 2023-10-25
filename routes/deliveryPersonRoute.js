const express= require("express");
const deliveryRoute=express();
const {loadLogInPage,logIn,loadDeliveryPage,delivered}=require("../controllers/deliveryPersonController");
const {isDeliveryPerson}=require("../auth");



deliveryRoute.get("/login",loadLogInPage);
deliveryRoute.post("/login",logIn);
deliveryRoute.get("/home",isDeliveryPerson,loadDeliveryPage);
deliveryRoute.post("/delivered",isDeliveryPerson,delivered);

deliveryRoute.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/delivery/login");
});


deliveryRoute.get("*", function (req, res) {
    res.redirect("/delivery/home");
});
module.exports={
    deliveryRoute
}