const express = require('express');
const cartRoute = express();
const { isLogin } = require('../auth');

cartRoute.use(express.static("Productimages"));
cartRoute.use(express.static("SellerIdentity"));

const { getAllCartItems, addToCart,deleteFromCart,updateCartQuantity } = require("../controllers/CartController");

cartRoute.get("/getAllCartItems", isLogin, getAllCartItems);

cartRoute.post("/addToCart", addToCart);

cartRoute.post("/deleteFromCart", deleteFromCart);

cartRoute.post("/updateCart", updateCartQuantity);

cartRoute.get("/gotoCart", isLogin, function (req, res) {
    res.render("cart", { name: req.session.name });
});

module.exports = {
    cartRoute
}