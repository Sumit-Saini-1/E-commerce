const { findDeliveryPersonBYusername, } = require("../databaseFuntion/deliverPersonQuery")
const { deliveredDb,ordersTodeliverDb } = require("../databaseFuntion/orderQuery");

function logIn(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    findDeliveryPersonBYusername(username).then(function (deliveryPerson) {
        if (deliveryPerson) {
            if (deliveryPerson.password == password) {
                req.session.isLoggedIn = true;
                req.session.username = deliveryPerson.username;
                req.session.pincode = deliveryPerson.areaassigned;
                req.session.role = deliveryPerson.role;

                res.status(200).json({ deid: deliveryPerson.deid, role: deliveryPerson.role });
                return;
            }
            else {

                res.status(401).send("invalid credential");
                return;
            }
        }
        else {
            res.status(404).send("user not found");
        }
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

function ordersToDeliver(req,res){
    ordersTodeliverDb(req.session.pincode).then(function(orders){
        res.status(200).json({orders:orders});
    }).catch(function(err){
        res.status(500).send("Error");
    })
}

function delivered(req, res) {
    const oid = req.body.oid;
    deliveredDb(oid).then(function (result) {
        res.status(200).send("success");
    }).catch(function () {
        res.status(500).send("ERROR");
    });
}

module.exports = {
    logIn,
    delivered,
    ordersToDeliver
}