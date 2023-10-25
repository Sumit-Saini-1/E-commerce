const { connection } = require("../Models/db");
const uuid = require("uuid");

function createDistributorDb(username, password, address, state, district, pincode, level) {
    return new Promise((resolve, reject) => {
        const did = uuid.v4();
        let query = "INSERT INTO distributors(did,username,password,address,state,district,pincode,level) VALUES(?,?,?,?,?,?,?,?)";
        let data = [did, username, password, address, state, district, pincode, level];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function findDistributorByUsernameDb(username) {
    return new Promise((resolve, reject) => {
        const did = new uuid.v4();
        let query = "SELECT * FROM distributors WHERE username=?";
        let data = [username];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
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


module.exports = {
    createDistributorDb,
    findDistributorByUsernameDb,
}