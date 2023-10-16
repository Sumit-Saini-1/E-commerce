const express = require('express');
const app = express();
const session = require("express-session");

const {connection} = require("./Models/db");
const userRouter = require('./routes/userRoute');
const { productRoute } = require("./routes/productRoute");
const { cartRoute } = require("./routes/cartRoute");
const {sellerRoute}=require("./routes/sellerRoute");
const {adminRoute}=require("./routes/adminRoute");
const {orderRoute}=require("./routes/orderRoute");
const {distributorRoute}=require("./routes/distributorRoute");
const {deliveryRoute}=require("./routes/deliveryPersonRoute");

app.set('view engine', 'ejs');

const sessionMiddleware = session({
    secret: "anything",
    resave: false,
    saveUninitialized: true
});
app.use(sessionMiddleware);
app.use(express.static("styles"));
app.use(express.static("scripts"));
app.use(express.static("Productimages"));
app.use(express.static("SellerIdentity"));
app.use(express.json());

app.use('/', userRouter);
app.use('/product', productRoute);
app.use('/cart', cartRoute);
app.use("/seller",sellerRoute);
app.use("/admin",adminRoute);
app.use("/order",orderRoute);
app.use("/distributor",distributorRoute);
app.use("/delivery",deliveryRoute);




app.get("*", function (req, res) {
    res.redirect("/");
});

connection.connect(function (err) {
    if(err){
        console.log(err);
    }
    else{
        console.log("connection created with Mysql successfully");
        app.listen(2000, function () {
            console.log("listening on 2000");
        });
    }
 });