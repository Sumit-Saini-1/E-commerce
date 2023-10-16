const { createNewSeller, findSellerByUserName,updateIsEmailVerified,findSellersNotAproved,addSellerToApproved,addSellerToRejected } = require("../databaseFuntion/sellerQuery");
const {createToken,verifyToken}=require("../utils/jsontokens");
const {sendMail}=require("../utils/nodemail");

function loadsellerhome(req, res) {
    res.render("sellerHome");
}
function loadsellersignup(req, res) {
    res.render("sellersignup");
}
function loadsellerLogin(req, res) {
    res.render("sellerLogin");
}
function signupseller(req, res) {
    const body = req.body;
    createNewSeller(body.name, body.mobile, body.username, body.password, "seller", body.businessname, body.businesstype, body.aadharno, req.file.filename).then(function (seller) {
        if (seller == "seller already exist") {
            res.status(409).send("seller already exist");
            return;
        }
        const token = createToken(seller.sid);
        const subject = 'Email Verification';
        const text = `Hi ${seller.name}!There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://localhost:2000/seller/verify/${token} Thanks`;
        sendMail(seller.username, subject, text);
        res.redirect("/seller/login");
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("error");
    });
}

function loadMyProduct(req, res) {
    res.render("myProducts");
}

function loadOrderOut(req,res){
    res.render("ordersOut");
}
function logout(req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/seller/login");
}

async function loginseller(req, res) {
    try {
        const seller = await findSellerByUserName(req.body.username);
        if (seller) {
            if (seller.password == req.body.password) {
                if (seller.isemailverified == "N") {
                    // sendVerificationMail(user.name,user.username,user._id);
                    res.status(402).send("verify your email first");
                    return;
                    
                } 
                else if(seller.allowed=="N"){
                    res.status(405).send("not approved yet as a seller");
                    return;
                }
                else {
                    
                    req.session.isLoggedIn = true;
                    req.session.username = seller.username;
                    req.session.name = seller.name;
                    req.session.sid = seller.sid;
                    req.session.role = seller.role;
                    res.redirect("/seller/home");
                    return;
                }
            }
            else {
                res.status(401).send("invalid credential");
                return;
            }
        }
        res.status(404).send("user not found");
    } catch (error) {
        res.status(500).send("error");
    }
}

function verifyEmail(req, res) {
    const { token } = req.params;
    verifyToken(token).then(function (decoded) {
        updateIsEmailVerified(decoded.userId).then(function (updated) {
            if (updated) {
                res.redirect("/");
            }
            else {
                res.send("Email verification Failed");
            }
        }).catch(function (err) {
            res.send("Email verification Failed");
        });
    }).catch(function (err) {
        res.send("Email verification failed, possibly the link is invalid or expired");
    });
}

function toAproveSellers(req,res){
    const page=req.params.page;
    findSellersNotAproved(page).then(async function (sellers) {
        const isLast=false; //await isThisLastPage(page+1);
        if(sellers==false){
            sellers=[];
        }
        res.json({sellers,isLast});
        return;
    }).catch(function (err) {
        res.status(500).send("Error");
    });
}

function approveSeller(req,res){
    const sid=req.params.sid;
    addSellerToApproved(sid).then(function(approved){
        if(approved){
            res.status(200).send("approved");
        }
    }).catch(function(err){
        res.status(500).send("error");
    })
}

function rejectSeller(req,res){
    const sid=req.params.sid;
    addSellerToRejected(sid).then(function(rejected){
        if(rejected){
            res.status(200).send("rejected");
        }
    }).catch(function(err){
        res.status(500).send("error");
    })
}



module.exports = {
    loadsellerhome,
    loadsellersignup,
    loadsellerLogin,
    signupseller,
    loginseller,
    verifyEmail,
    toAproveSellers,
    approveSeller,
    rejectSeller,
    loadOrderOut,
    loadMyProduct,
    logout
}