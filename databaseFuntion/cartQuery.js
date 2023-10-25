const uuid = require("uuid");
const { connection } = require("../Models/db");

function getAllCartItemsDB(user) {
    return new Promise((resolve, reject) => {
        let query="SELECT * FROM cart INNER JOIN products ON cart.product=products.pid WHERE user=? ";
        let data=[user];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

function deleteFromCartDB(cid) {
    return new Promise((resolve, reject) => {
        let query="DELETE FROM cart WHERE cid=?";
        let data=[cid];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function updateCartQuantityDB(cid, quantity) {
    return new Promise((resolve, reject) => {
        let query="UPDATE cart SET quantity=? WHERE cid=?";
        let data=[quantity,cid];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function findProductInCartDB(product) {
    return new Promise((resolve, reject) => {
        let query="SELECT * FROM cart WHERE product=?";
        let data=[product];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            if(results[0]){
                resolve(results[0]);
                return;
            }
            else{
                resolve(false);
            }
        });
    });
}

function addNewItemToCartDB(cartItem) {
    return new Promise((resolve, reject) => {
        const cid = uuid.v4();
        let query = "INSERT INTO cart(cid,user,product,quantity) VALUES(?,?,?,?)";
        let data = [cid, cartItem.user, cartItem.product, cartItem.quantity];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(cartItem);
            return;
        });
    });
}


module.exports = {
    getAllCartItemsDB,
    deleteFromCartDB,
    updateCartQuantityDB,
    findProductInCartDB,
    addNewItemToCartDB
}