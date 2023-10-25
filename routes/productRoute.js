const express= require('express');
const productRoute=express();
const { isLogin,isAdmin,isSeller } = require('../auth');
const {addProduct,getProducts,deleteProduct,showUpdateProductPage,updateProduct,loadAddProductPage,toAproveProducts,approveProduct,rejectProduct,myProducts,totalProduct}=require("../controllers/ProductController");
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

productRoute.get("/addProduct",isSeller,loadAddProductPage);
productRoute.post("/addProduct",isSeller,isLogin,addProduct);


productRoute.post("/deleteProduct",isAdmin,deleteProduct);

productRoute.get("/productsToAprove/:page",isAdmin,toAproveProducts);
productRoute.get("/approveProduct/:pid",isAdmin,approveProduct);
productRoute.get("/rejectProduct/:pid",isAdmin,rejectProduct);

productRoute.get("/updateProduct/:pid",isSeller,showUpdateProductPage);
productRoute.post("/updateProduct",isSeller,updateProduct);

productRoute.get("/myPostedProducts/:page/:perpage",isSeller,myProducts);



module.exports={
    productRoute
}