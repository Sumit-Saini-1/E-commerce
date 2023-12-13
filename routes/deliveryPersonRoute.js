const express= require("express");
const deliveryRoute=express();
const {logIn,delivered,ordersToDeliver}=require("../controllers/deliveryPersonController");
const {isDeliveryPerson}=require("../auth");


deliveryRoute.post("/login",logIn);

deliveryRoute.post("/delivered",isDeliveryPerson,delivered);
deliveryRoute.get("/ordersToDeliver",isDeliveryPerson,ordersToDeliver);

deliveryRoute.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    req.session.destroy();
    res.status(200).send("logout");
});

module.exports={
    deliveryRoute
}