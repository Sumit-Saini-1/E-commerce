const express= require('express');
const {isAdmin}=require("../auth");
const adminRoute=express();
adminRoute.use(express.static("Productimages"));
adminRoute.use(express.static("SellerIdentity"));

const {loadHomePage,loadAproveProductPage,loadApproveSellerPage,loadSellerDetailPage,loadCreateDstributorPage,createDistributor}=require("../controllers/adminController");

adminRoute.get("/home",isAdmin,loadHomePage);
adminRoute.get("/productToAprovePage",isAdmin,loadAproveProductPage);
adminRoute.get("/sellerToApprove",isAdmin,loadApproveSellerPage);
adminRoute.get("/sellerDetail/:sid",isAdmin,loadSellerDetailPage);
adminRoute.get("/createDistributor",isAdmin,loadCreateDstributorPage);
adminRoute.post("/createDistributor",isAdmin,createDistributor);

adminRoute.get("*", function (req, res) {
    res.redirect("/admin/home");
});

module.exports={
    adminRoute
}