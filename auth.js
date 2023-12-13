const isLogin = function (req, res, next) {
    if (!req.session.isLoggedIn) {
        res.status(401).send("not loggedin");
        return;
    }
    next();
}

const isAdmin=function(req,res,next){
    if (!req.session.isLoggedIn) {
        res.status(401).send("not loggedin");
        return;
    }
    if(req.session.role!="admin"){
        res.status(401).send("not authorized to use this page");
        return;
    }
    next();
}

const isSeller=function(req,res,next){
    if (!req.session.isLoggedIn) {
        res.status(401).send("not loggedin");
        return;
    }
    if(req.session.role!="seller"){
        res.status(401).send("not authorized to use this page");
        return;
    }
    next();
}

const isDistributor=function(req,res,next){
    if (!req.session.isLoggedIn) {
        res.status(401).send("not loggedin");
        return;
    }
    if(req.session.role!="distributor"){
        res.status(401).send("not authorized to use this page");
        return;
    }
    next();
}
const isDeliveryPerson=function(req,res,next){
    if (!req.session.isLoggedIn) {
        res.status(401).send("not loggedin");
        return;
    }
    if(req.session.role!="delivery"){
        res.status(401).send("not authorized to use this page");
        return;
    }
    next();
}
module.exports = {
    isLogin,
    isAdmin,
    isSeller,
    isDistributor,
    isDeliveryPerson
}