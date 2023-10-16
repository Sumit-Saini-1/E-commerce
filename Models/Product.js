const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    name:String,
    image:String,
    Description:String,
    price:Number,
    rating:Number,
    stock:Number,
    brand:String,
    category:String,
    timeOfAdd:Date
});

const Product=mongoose.model("Product",productSchema);

module.exports=Product;