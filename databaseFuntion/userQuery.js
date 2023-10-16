const {connection}=require("../Models/db");
const uuid = require("uuid");

function createNewUser(name, mobile, username, password, role) {
    return new Promise(async function (resolve, reject) {
        const user = await findUserByUserName(username);
        if (user) {
            resolve("user already exist");
            return;
        }
        const uid = uuid.v4();
        let query="INSERT INTO users(uid,name ,mobile ,username ,password ,role ) VALUES(?,?,?,?,?,?)";
        let data=[uid,name,mobile,username,password,role];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
            }
            resolve(findUserByUserName(username));
        });
    });
}

function findUserByUserName(username) {
    return new Promise(function (resolve, reject) {
        let query="SELECT * FROM users WHERE username='"+username+"'";
        connection.query(query,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
}

function updatePasswordByUserId(userId,newPassword){
    return new Promise(function (resolve, reject) {
        let query="UPDATE users SET password=? WHERE uid=?";
        const data=[newPassword,userId];
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
        let query="UPDATE users SET isemailverified	=? WHERE uid=?";
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

function addAddressOfUser(uid,addressLine1,country,state,district,pincode){
    return new Promise((resolve, reject) => {
        let query="UPDATE users SET addressLine1=?,country=?,state=?,district=?,pincode=? WHERE uid=?";
        const data=[addressLine1,country,state,district,pincode,uid];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(false);
                return;
            }
            resolve(true);
        });
    });
}

function addressFromDb(uid){
    return new Promise((resolve, reject) => {
        let query="SELECT addressLine1,country,state,district,pincode FROM users WHERE uid=?";
        const data=[uid];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
                return;
            }
            
            resolve(results[0]);
        });
    });
}

module.exports = {
    findUserByUserName,
    createNewUser,
    updatePasswordByUserId,
    updateIsEmailVerified,
    addAddressOfUser,
    addressFromDb
}