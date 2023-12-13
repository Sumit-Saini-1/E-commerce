const {addNewProduct,findProductById,findProductsForPage,updateProductDB,deleteProductDB,isThisLastPage, findProductsNotAproved,addProductToApproved,addProductToRejected,findMyProductsDb,totalProductDB,searchProductDb}=require("../databaseFuntion/productQuery");

function totalProduct(req,res){
    totalProductDB().then(function(totalProduct){
        res.status(200).json({totalProduct});
    }).catch(function (err) {
        res.status(500).send("ERROR");
    });
}


function addProduct(req, res) {
    const body = req.body;
    const name = body.name;
    const image = req.file.filename;
    const Description = body.Description;
    const price = body.price;
    const rating = 0;
    const stock = body.stock;
    const brand = body.brand;
    const category = body.category;
    const timeOfAdd = new Date();
    const seller=req.session.sid;
    if (!name || !image || !Description || !price || !stock || !brand || !category || !timeOfAdd) {
        res.status(422).send("Enter all details");
        return;
    }

    addNewProduct(name,image,Description,price,rating,stock,brand,category,timeOfAdd,seller).then(function(product){
        if(product){
            res.status(200).json(product);
        }
        else{
            res.status(500).send("Error");
        }
    }).catch(function(err){
        res.status(500).send("Error");
    });
}

function toAproveProducts(req,res){
    const page=req.params.page;
    findProductsNotAproved(page).then(async function (products) {
        const isLast=await isThisLastPage(parseInt(page)+1,8,'N');
        if(products==false){
            products=[];
        }
        res.status(200).json({products,isLast});
        return;
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function approveProduct(req,res){
    const pid=req.params.pid;
    addProductToApproved(pid).then(function(approved){
        if(approved){
            res.status(200).send("approved");
        }
    }).catch(function(err){
        res.status(500).send("error");
    })
}

function rejectProduct(req,res){
    const pid=req.params.pid;
    addProductToRejected(pid).then(function(rejected){
        if(rejected){
            res.status(200).send("rejected");
        }
    }).catch(function(err){
        res.status(500).send("error");
    })
}

function updateProduct(req, res) {
    const body = req.body;
    const pid = body.pId;
    const name = body.name;
    // const image = req.file.filename;
    const description = body.Description;
    const price = body.price;
    // const rating = 0;
    const stock = body.stock;
    const brand = body.brand;
    const category = body.category;

    if (!name || !description || !price || !stock || !brand || !category) {
        res.status(422).send("Enter all details");
        return;
    }

    updateProductDB(pid,name,description,price,stock,brand,category).then(function (updated) {
        if(updated){
            res.status(200).send("success");
        }
        else{
            res.status(500).send("error");
        }
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function getProducts(req, res) {
    const page = req.body.page;
    const perpage=req.body.perpage;
    findProductsForPage(page,perpage).then(async function (products) {
        const isLast=await isThisLastPage(parseInt(page)+1,perpage,'Y');
        if(products==false){
            products=[];
        }
        res.status(200).json({products,isLast});
        return;
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function deleteProduct(req, res) {
    if(req.session.role!="admin"&&req.session.role!="seller"){
        res.status(401).send("not authorized to use this page");
        return;
    }
    const product = req.body.product;
    deleteProductDB(product).then(function (deleted) {
        if (deleted){
            
            res.status(200).send("Product Deleted");
        }
        else{
            res.status(500).send("Error");
        }
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function myProducts(req, res) {
    const page = req.params.page;
    const perpage = parseInt(req.params.perpage);
    
    findMyProductsDb(page,req.session.sid,perpage).then(async function (products) {
        
        // const isLast=await isThisLastPage(page+1);
        const isLast=false;
        if(products==false){
            products=[];
        }
        res.status(200).json({products,isLast});
        return;
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function searchProduct(req,res){
    const searchText=req.body.searchText;
    searchProductDb(searchText).then(products=>{
        if(products){
            res.status(200).json(products);
        }
        else{
            res.status(200).json([]);
        }
    }).catch(err=>{
        res.status(500).json(err);
    })
}
module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    toAproveProducts,
    approveProduct,
    rejectProduct,
    myProducts,
    totalProduct,
    searchProduct
}