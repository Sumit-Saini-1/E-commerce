const {createNewDeliveryPerson,findDeliveryPersonBYusername}=require("../databaseFuntion/deliverPersonQuery")
const {deliveredDb,ordersTodeliverDb}=require("../databaseFuntion/orderQuery");

function loadLogInPage(req,res){
    res.render("deliveryLogin");
}

function loadDeliveryPage(req,res){
    ordersTodeliverDb(req.session.pincode).then(function(orders){
        res.render("delivery",{orders:orders});
    }).catch(function(err){
        res.render("delivery",{orders:[]});
    })
}


function logIn(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    findDeliveryPersonBYusername(username).then(function (deliveryPerson) {
        if (deliveryPerson) {
            if (deliveryPerson.password == password) {
                req.session.isLoggedIn = true;
                req.session.username = deliveryPerson.username;
                req.session.pincode=deliveryPerson.areaassigned;
                req.session.role = deliveryPerson.role;
                
                res.status(200).send("success");
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

function delivered(req,res){
    const oid=req.body.oid;
    deliveredDb(oid).then(function(result){
        res.status(200).send("success");
    }).catch(function(){
        res.status(500).send("ERROR");
    });
}

module.exports={
    loadDeliveryPage,
    logIn,
    delivered,
    loadLogInPage
}