const uuid = require("uuid");
const { connection } = require("../Models/db");

function createNewDeliveryPerson(username,password,name,areaassigned){
    return new Promise((resolve, reject) => {
        const deid = uuid.v4();
        let query = "INSERT INTO deliveryperson(deid, username, password,name,areaassigned) VALUES(?,?,?,?,?)";
        let data = [deid, username, password,name,areaassigned];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
            return;
        });
    });
}

function findDeliveryPersonBYusername(username){
    return new Promise((resolve, reject) => {
        let query = "select * FROM deliveryperson WHERE username=?";
        let data = [username];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            if(results[0]){
                resolve(results[0]);
                return;
            }
            resolve(false);
        });
    })
}

module.exports={
    createNewDeliveryPerson,
    findDeliveryPersonBYusername
}