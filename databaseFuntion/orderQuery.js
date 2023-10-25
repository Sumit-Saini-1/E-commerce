const { connection } = require("../Models/db");
const uuid = require("uuid");

function newOrder(uid, pid, quantity, bill, addressLine1, country, state, district, pincode) {
    return new Promise(async function (resolve, reject) {
        const oid = uuid.v4();
        let query = "INSERT INTO orders(oid,uid,pid,quantity,bill,billstatus,orderstatus,orderdate,addressLine1,country,state,district,pincode) VALUES(?,?,?,?,?,?,?,now(),?,?,?,?,?)";
        let data = [oid, uid, pid, quantity, bill, "paid", "waiting for packing", addressLine1, country, state, district, pincode];
        connection.query(query, data, async function (err, results, fields) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

function myOrdersDb(uid) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders NATURAL JOIN products WHERE uid=? ORDER BY orderdate DESC";
        let data = [uid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

function cancelOrderDb(oid) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE orders SET orderstatus=? WHERE oid=?";
        let data = ["cancelled", oid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}


function receivedOrderDb(sid) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders INNER JOIN products ON orders.pid=products.pid WHERE seller=? and orderstatus=? ";
        let data = [sid, "waiting for packing"];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    })
}

function dispachedToDb(oid, dispachedto) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE orders SET orderstatus=?,dispachtime=now(),nextdest=?,curloc=? WHERE oid=?";
        let data = ["dispatched", dispachedto,"dispatched to "+dispachedto, oid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}


function ordersOutDb(sid) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders INNER JOIN products ON orders.pid=products.pid WHERE seller=? and (orderstatus!=? AND orderstatus!=?) ";
        let data = [sid, "waiting for packing", "cancelled"];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    })
}

function findToReceiveOrderDb(location) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders WHERE nextdest=? and curloc!=?";
        let data = [location, location];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        })
    });
}

function findToShipOrderDb(location) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders WHERE curloc=?";
        let data = [location];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        })
    });
}

function receivedDB(oid, loc) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE orders SET curloc=? WHERE oid=?";
        let data = [loc, oid];
        connection.query(query, data, function (err, results) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    });
}

function shipToDb(oid, shipto) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE orders SET orderstatus=?,nextdest=?,curloc=? WHERE oid=?";
        let data = ["shipped", shipto, "shipped to "+shipto, oid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function ordersTodeliverDb(pincode){
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders WHERE pincode=? and curloc=? and orderstatus!=?";
        let data = [pincode,"shipped to Out for Delivery","cancelled"];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

function deliveredDb(oid){
    return new Promise((resolve, reject) => {
        let query = "UPDATE orders SET orderstatus=?,nextdest=?,curloc=?,deliverydate=now() WHERE oid=?";
        let data = ["delivered", "delivered", "delivered",oid];
        connection.query(query, data, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function monthlyReportDb(seller,month,year){
    return new Promise((resolve, reject) => {
        let query="SELECT * FROM orders INNER JOIN products ON orders.pid=products.pid WHERE seller=? and MONTH(orderdate)=? and YEAR(orderdate)=?";
        let data=[seller,month,year];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

function yearlyReportDb(seller,year){
    return new Promise((resolve, reject) => {
        let query="SELECT * FROM orders INNER JOIN products ON orders.pid=products.pid WHERE seller=? and YEAR(orderdate)=?";
        let data=[seller,year];
        connection.query(query,data,function(err,results,fields){
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = {
    newOrder,
    myOrdersDb,
    cancelOrderDb,
    receivedOrderDb,
    dispachedToDb,
    ordersOutDb,
    findToReceiveOrderDb,
    findToShipOrderDb,
    receivedDB,
    shipToDb,
    deliveredDb,
    ordersTodeliverDb,
    monthlyReportDb,
    yearlyReportDb
}