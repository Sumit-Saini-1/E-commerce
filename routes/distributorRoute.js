const express= require("express");
const distributorRoute=express();
const {loadToShipPage,loadLogInPage,logIn,loadToReceivePage,toRecieve,received,toShip,shipped,createDeliveryPerson,loadcreateDeliveryPersonPage}=require("../controllers/distributorController");
const {isDistributor}=require("../auth");

distributorRoute.get("/login",loadLogInPage);
distributorRoute.post("/login",logIn);
distributorRoute.get("/readyForShipping",isDistributor,loadToShipPage);
distributorRoute.get("/reaching",isDistributor,loadToReceivePage);
distributorRoute.get("/toReceive",isDistributor,toRecieve);
distributorRoute.get("/toShip",isDistributor,toShip);

distributorRoute.post("/received",isDistributor,received);
distributorRoute.post("/shipped",isDistributor,shipped);

distributorRoute.get("/createDeliveryPerson",isDistributor,loadcreateDeliveryPersonPage);
distributorRoute.post("/createDeliveryPerson",isDistributor,createDeliveryPerson);

distributorRoute.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/distributor/login");
});


distributorRoute.get("*", function (req, res) {
    res.redirect("/distributor/readyForShipping");
});
module.exports={
    distributorRoute
}