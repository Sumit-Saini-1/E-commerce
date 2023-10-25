const fs = require("fs");
const { connection } = require("../Models/db");
const uuid = require("uuid");

function totalProductDB(){
    return new Promise((resolve, reject) => {
        let query="SELECT COUNT(*) AS totalProduct FROM products WHERE approved=?"
        let data=['Y'];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(results[0].totalProduct);
        });
    });
}

function addNewProduct(name, image, description, price, rating, stock, brand, category, timeOfAdd, seller) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO PRODUCTS(pid,name,image,description,price,rating,stock,brand,category,timeOfAdd,seller) VALUES(?,?,?,?,?,?,?,?,?,now(),?)";
        const pid = uuid.v4();
        connection.query(query, [pid, name, image, description, price, rating, stock, brand, category, seller], function (err, results, fields) {
            if (err) {
                console.log("12............", err);
                reject(err);
                return;
            }
            resolve(results);
            return;
        });
    });
}

function findProductById(pid) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM products WHERE pid=?";
        connection.query(query, [pid], function (err, results, fields) {
            if (err) {
                console.log("27............\n", err);
                reject(err);
                return;
            }
            if (results[0]) {
                resolve(results[0]);
                return;
            }
            resolve(false);
        });
    });
}

function findProductsForPage(page,perpage) {
    const contentOnOne = perpage;
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM products WHERE approved='Y' ORDER BY timeofadd DESC LIMIT ?,? ";
        let data = [page * contentOnOne, contentOnOne];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("47............\n", err);
                reject(err);
                return;
            }
            if (results[0]) {
                resolve(results);
                return;
            }
            resolve(false);
        });
    });
}

function findProductsNotAproved(page) {
    const contentOnOne = 5;
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM products WHERE approved='N' ORDER BY timeofadd DESC LIMIT ?,? ";
        let data = [page * contentOnOne, contentOnOne];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("67............\n", err);
                reject(err);
                return;
            }
            if (results[0]) {
                resolve(results);
                return;
            }
            resolve(false);
        });
    });
}

function addProductToApproved(pid) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE products SET approved=? WHERE pid=?";
        let data = ["Y", pid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("86............\n", err);
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function addProductToRejected(pid) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE products SET approved=? WHERE pid=?";
        let data = ["R", pid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("102............\n", err);
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function isThisLastPage(page,perpage,approved) {
    return new Promise(async (resolve, reject) => {
        let query="SELECT CEILING(COUNT(*) / ?) AS totalPages FROM products WHERE approved=?"
        let data=[perpage,approved];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            const isLast = page >= results[0].totalPages;
            // console.log("total",results[0].totalPages,"cur",page,"islast",page >= results[0].totalPages);
            resolve(isLast);
        });
    });

}

function updateProductDB(pid, name, description, price, stock, brand, category) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE products SET name=?,description=?,price=?,stock=?,brand=?,category=? WHERE pid=?";
        let data = [name, description, price, stock, brand, category, pid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("130............\n", err);
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function deleteProductDB(product) {
    return new Promise((resolve, reject) => {
        let query = "DELETE FROM products WHERE pid=?";
        let data = [product.pid];
        connection.query(query, data, function (err, results) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (fs.existsSync("./Productimages/" + product.image)) {
                fs.unlink("./Productimages/" + product.image, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    } else {
                        resolve(true);
                        return;
                    }
                });
            }
            else {
                resolve(true);
                return;
            }
        });
    });
}

function updateStock(pid, newStock) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE products SET stock=? WHERE pid=?";
        let data = [newStock, pid];
        connection.query(query, data, function (err, results, fields) {
            if(err){
                reject(err);
            }
            resolve(true);
        });
    })

}

function findMyProductsDb(page,sid,perpage) {
    const contentOnOne = perpage;
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM products WHERE seller=? ORDER BY timeofadd DESC LIMIT ?,? ";
        let data = [sid,page * contentOnOne, contentOnOne];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("47............\n", err);
                reject(err);
                return;
            }
            if (results[0]) {
                resolve(results);
                return;
            }
            resolve(false);
        });
    });
}

module.exports = {
    addNewProduct,
    findProductById,
    findProductsForPage,
    updateProductDB,
    deleteProductDB,
    isThisLastPage,
    findProductsNotAproved,
    addProductToApproved,
    addProductToRejected,
    updateStock,
    findMyProductsDb,
    totalProductDB
}