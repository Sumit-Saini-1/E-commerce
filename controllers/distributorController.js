const { findDistributorByUsernameDb } = require("../databaseFuntion/distributorQuery");
const {createNewDeliveryPerson,findDeliveryPersonBYusername}=require("../databaseFuntion/deliverPersonQuery")
const {findToReceiveOrderDb,findToShipOrderDb,receivedDB,shipToDb,deliveredDb}=require("../databaseFuntion/orderQuery");

function loadToShipPage(req, res) {
    res.render("toShip");
}
function loadToReceivePage(req, res) {
    res.render("toRecieve");
}

function loadLogInPage(req, res) {
    res.render("distributorLogin");
}

function loadcreateDeliveryPersonPage(req, res) {
    res.render("createDeliveryPerson");
}

function logIn(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    findDistributorByUsernameDb(username).then(function (distributor) {
        if (distributor) {
            if (distributor.password == password) {
                req.session.isLoggedIn = true;
                req.session.username = distributor.username;
                if(distributor.level=="state"){
                    req.session.loc=distributor.state;
                }
                else{
                    req.session.loc=distributor.district;
                }
                req.session.sid = distributor.did;
                req.session.role = distributor.role;
                res.redirect("/distributor/readyForShipping");
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

function toRecieve(req,res){
    const loc=req.session.loc;
    findToReceiveOrderDb(loc).then(function(orders){
        res.status(200).json(orders);
    }).catch(function(err){
        res.status(500).send("ERROR");
    })
}
function received(req,res){
    const order=req.body.order;
    const loc=req.session.loc;
    receivedDB(order.oid,loc).then(function(f){
        res.status(200).send("receved");
    }).catch(function(err){
        res.status(500).send("ERROR");
    })
}

function toShip(req,res){
    const loc=req.session.loc;
    findToShipOrderDb(loc).then(function(orders){
        res.status(200).json(orders);
    }).catch(function(err){
        res.status(500).send("ERROR");
    })
}

function shipped(req,res){
    
    const order=req.body.order;
    const shipto=req.body.shipto;
    shipToDb(order.oid,shipto).then(function(f){
        res.status(200).send("Success");
    }).catch(function(err){
        res.status(500).send("ERROR");
    })
}



function createDeliveryPerson(req,res){
    const body=req.body;
    findDeliveryPersonBYusername(body.username).then(function(deliveryPerson){
        if(deliveryPerson){
            res.status(409).send("user already exist");
            return;
        }
        createNewDeliveryPerson(body.username,body.password,body.name,body.pincode).then(function(){
            res.status(200).send("success");
        }).catch(function(err){
            res.status(500).send("ERROR");
        })
    }).catch(function(err){
        res.status(500).send("ERROR");
    });
}

module.exports = {
    loadToShipPage,
    loadLogInPage,
    logIn,
    toRecieve,
    loadToReceivePage,
    received,
    toShip,
    shipped,
    createDeliveryPerson,
    loadcreateDeliveryPersonPage
}