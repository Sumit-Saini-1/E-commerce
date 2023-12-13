const express = require('express');
const cartRoute = express();
const { isLogin } = require('../auth');

cartRoute.use(express.static("Productimages"));
cartRoute.use(express.static("SellerIdentity"));

const { getAllCartItems, addToCart,deleteFromCart,updateCartQuantity } = require("../controllers/CartController");

cartRoute.get("/getAllCartItems", isLogin, getAllCartItems);

cartRoute.post("/addToCart",isLogin, addToCart);

cartRoute.post("/deleteFromCart", deleteFromCart);

cartRoute.post("/updateCart", updateCartQuantity);


module.exports = {
    cartRoute
}