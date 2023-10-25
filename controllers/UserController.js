const { 
    findUserByUserName,
    createNewUser,
    updatePasswordByUserId,
    updateIsEmailVerified,
    addressFromDb,
} = require("../databaseFuntion/userQuery");
const { createToken, verifyToken } = require("../utils/jsontokens");
const {sendMail}=require("../utils/nodemail");


const loadDashboard = (req, res) => {
    try {
        if (req.session.role == "admin") {
            res.render("adminhome", { name: req.session.name });
            return;
        }
        if(req.session.role=="seller"){
            res.render("sellerHome");
            return;
        }
        if(req.session.role=="distributor"){
            res.redirect("/distributor/readyForShipping");
            return;
        }
        res.render("home", { name: req.session.name });
    } catch (error) {
        console.log(error);
    }
}
const loadLogin = (req, res) => {
    try {
        if (req.session.isLoggedIn) {
            res.redirect("/");
            return;
        }
        res.render("login");
    } catch (error) {
        console.log(error);
    }
}
async function login(req, res) {
    try {
        const user = await findUserByUserName(req.body.username);
        if (user) {
            if (user.password == req.body.password) {
                if (user.isemailverified=="Y") {
                    req.session.isLoggedIn = true;
                    req.session.username = user.username;
                    req.session.name = user.name;
                    req.session._id = user.uid;
                    req.session.role = user.role;
                    res.redirect("/");
                    return;
                } else {
                    // sendVerificationMail(user.name,user.username,user._id);
                    res.status(402).send("verify your email first");
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
async function signup(req, res) {
    const body = req.body;
    try {
        const user = await createNewUser(body.name, body.mobile, body.username, body.password,"customer"/*body.role*/);
        if (user) {
            if (user == "user already exist") {
                res.status(409).send("user already exist");
                return;
            }
            const token = createToken(user.uid);
            const subject = 'Email Verification';
            const text = `Hi ${user.name}!There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://localhost:2000/verify/${token} Thanks`;
            sendMail(user.username, subject, text );
            res.redirect("/login");
        }
        else {
            res.status(500).send("error");
        }
    } catch (error) {
        res.status(500).send("error");
    }
}

async function changePassword(req, res) {
    const newPass = req.body.npass;
    const userId = req.body.userId;
    const changed = await updatePasswordByUserId(userId, newPass);
    if (changed) {
        const token = createToken(userId);
        const name = req.session.name;
        const subject = "password changed";
        const text = "There, your account's password changed recently. if that was not you click following link within 10 minutes to change password http://localhost:2000/changePassword/" + token+" Thanks";
        if (req.session.username) {
            sendMail(req.session.username, subject, `Hi ${name}!`+text);
        }
        // sendMail(name, req.session.username, userId, subject, text);
        res.status(200).send("password updated successfully");
    }
    else {
        res.status(500).end(JSON.stringify(err));
    }
}

function changePasswordUsingForgotLink(req, res) {
    const { token} = req.params;
    verifyToken(token).then(function (decoded) {
        res.render("changePass", { userId: decoded.userId, name: null });
    }).catch(function (err) {
        res.send("Email verification failed, possibly the link is invalid or expired");
    });
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

async function forgotPasswordEmail(req, res) {
    const username = req.body.username;
    const user = await findUserByUserName(username);
    if (user) {
        const name = user.name;
        const userId = user.uid;
        const subject = "password change link";
        const token = createToken(userId);
        const text = `Hi ${name}!`+"There, you have clicked on forgot password. Please follow the given link to change password http://localhost:2000/changePassword/" + token+" Thanks";
        if (sendMail(username, subject, text)) {
            res.status(200).send("mail sent");
            return;
        }
    }
    else {
        res.status(404).send("this email not registered with us");
    }
}

function getAdress(req,res){
    const uid=req.session._id;
    addressFromDb(uid).then(function(address){
        res.status(200).json(address);
    }).catch(function(err){
        res.status(500).send("success");
    })
}

module.exports = {
    loadDashboard,
    loadLogin,
    login,
    signup,
    verifyEmail,
    changePassword,
    forgotPasswordEmail,
    changePasswordUsingForgotLink,
    getAdress
}