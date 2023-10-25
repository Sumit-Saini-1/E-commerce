const {connection}=require("../Models/db");
const uuid = require("uuid");

function createNewSeller(name, mobile, username, password, role,buisness_name,buisnesstype,aadharno,aadharimage) {
    return new Promise(async function (resolve, reject) {
        const seller = await findSellerByUserName(username);
        if (seller) {
            resolve("seller already exist");
            return;
        }
        const sid = uuid.v4();
        let query="INSERT INTO sellers(sid,name,mobile,username,password,role,buisness_name,buisnesstype,aadharno,aadharimage) VALUES(?,?,?,?,?,?,?,?,?,?)";
        let data=[sid,name,mobile,username,password,role,buisness_name,buisnesstype,aadharno,aadharimage];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
            }
            resolve(findSellerByUserName(username));
        });
    });
}

function findSellerByUserName(username) {
    return new Promise(function (resolve, reject) {
        let query="SELECT * FROM sellers WHERE username='"+username+"'";
        connection.query(query,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
}
function findSellerBySid(sid) {
    return new Promise(function (resolve, reject) {
        let query="SELECT * FROM sellers WHERE sid='"+sid+"'";
        connection.query(query,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
}

function updatePasswordBysellerId(sellerId,newPassword){
    return new Promise(function (resolve, reject) {
        let query="UPDATE sellers SET password=? WHERE sid=?";
        const data=[newPassword,sellerId];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(false);
                return;
            }
            resolve(true);
        });
    });
}

function updateIsEmailVerified(id){
    return new Promise(function (resolve, reject) {
        let query="UPDATE sellers SET isemailverified	=? WHERE sid=?";
        const data=["Y",id];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(false);
                return;
            }
            resolve(true);
        });
    });
}

function findSellersNotAproved(page){
    const contentOnOne = 6;
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM sellers WHERE allowed='N' LIMIT ?,? ";
        let data = [page * contentOnOne, contentOnOne];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("71............\n", err);
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
function addSellerToApproved(sid){
    return new Promise((resolve, reject) => {
        let query = "UPDATE sellers SET allowed=? WHERE sid=?";
        let data = ["Y", sid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("89............\n", err);
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}
function addSellerToRejected(sid){
    return new Promise((resolve, reject) => {
        let query = "UPDATE sellers SET allowed=? WHERE sid=?";
        let data = ["R", sid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                console.log("104............\n", err);
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}


module.exports = {
    createNewSeller,
    findSellerByUserName,
    updatePasswordBysellerId,
    updateIsEmailVerified,
    findSellersNotAproved,
    addSellerToApproved,
    addSellerToRejected,
    findSellerBySid
}