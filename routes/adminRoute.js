const express= require('express');
const {isAdmin}=require("../auth");
const adminRoute=express();
adminRoute.use(express.static("Productimages"));
adminRoute.use(express.static("SellerIdentity"));

const {createDistributor}=require("../controllers/adminController");

adminRoute.post("/createDistributor",isAdmin,createDistributor);

module.exports={
    adminRoute
}