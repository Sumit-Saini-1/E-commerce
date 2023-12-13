const express= require('express');
const productRoute=express();
const { isLogin,isAdmin,isSeller } = require('../auth');
const {addProduct,getProducts,deleteProduct,updateProduct,toAproveProducts,approveProduct,rejectProduct,myProducts,totalProduct,searchProduct}=require("../controllers/ProductController");
const multer = require('multer');


const upload = multer({ 
    dest: 'Productimages/',
    limits:{
        fileSize:250000
    } 
});
productRoute.use(upload.single("productImage"));

productRoute.get("/totalProduct",isLogin,totalProduct);
productRoute.post("/getProducts",isLogin,getProducts);
productRoute.post("/addProduct",isSeller,isLogin,addProduct);
productRoute.post("/deleteProduct",isLogin,deleteProduct);

productRoute.get("/productsToAprove/:page",isAdmin,toAproveProducts);
productRoute.get("/approveProduct/:pid",isAdmin,approveProduct);
productRoute.get("/rejectProduct/:pid",isAdmin,rejectProduct);

productRoute.post("/updateProduct",isSeller,updateProduct);
productRoute.get("/myPostedProducts/:page/:perpage",isSeller,myProducts);

productRoute.post("/searchProduct",isLogin,searchProduct);

module.exports={
    productRoute
}