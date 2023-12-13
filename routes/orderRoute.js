const express= require('express');
const orderRoute=express();
const { isLogin,isSeller } = require('../auth');
const {createOrder,getMyOrders,cancelOrder,getReceivedOrders,dispached,ordersOut}=require("../controllers/OrderController");
orderRoute.use(express.static("Productimages"));

orderRoute.post("/placeOrder",isLogin,createOrder);
orderRoute.get("/getMyOrder",isLogin,getMyOrders);
orderRoute.post("/cancelOrder",isLogin,cancelOrder);
orderRoute.get("/receivedOrders",isSeller,getReceivedOrders);
orderRoute.post("/dispatched",isSeller,dispached);
orderRoute.get("/orderOut",isSeller,ordersOut);

module.exports={
    orderRoute
}