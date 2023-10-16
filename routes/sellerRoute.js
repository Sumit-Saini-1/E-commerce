const express= require('express');
const sellerRoute=express();
const {loadsellerhome,loadsellersignup,loadsellerLogin,signupseller,loginseller,verifyEmail,toAproveSellers,approveSeller,rejectSeller,loadOrderOut,loadMyProduct,logout}=require("../controllers/sellerController");
const multer = require('multer');
const {isSeller}=require("../auth");


const upload = multer({ 
    dest: 'SellerIdentity/',
    limits:{
        fileSize:250000
    } 
});
sellerRoute.use(upload.single("aadhar"));


sellerRoute.get("/home",isSeller,loadsellerhome);
sellerRoute.get("/signup",loadsellersignup);
sellerRoute.post("/signup",signupseller);

sellerRoute.get("/login",loadsellerLogin);
sellerRoute.post("/login",loginseller);

sellerRoute.get("/logout", logout);

sellerRoute.get("/verify/:token",verifyEmail);

sellerRoute.get("/getSellersToApprove/:page",toAproveSellers);
sellerRoute.get("/approveseller/:sid",approveSeller);
sellerRoute.get("/rejectseller/:sid",rejectSeller);
sellerRoute.get("/orderOut",isSeller,loadOrderOut);
sellerRoute.get("/myProduct",isSeller,loadMyProduct);


sellerRoute.get("*", function (req, res) {
    res.redirect("/seller/home");
});
module.exports={
    sellerRoute
}