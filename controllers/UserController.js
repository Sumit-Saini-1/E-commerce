const {
    findUserByUserName,
    createNewUser,
    updatePasswordByUserId,
    updateIsEmailVerified,
    addressFromDb,
} = require("../databaseFuntion/userQuery");
const { createToken, verifyToken } = require("../utils/jsontokens");
const { sendMail } = require("../utils/mailjet");

async function login(req, res) {
    try {
        const user = await findUserByUserName(req.body.username);

        if (user) {
            if (user.password == req.body.password) {
                if (user.isemailverified == "Y") {
                    req.session.isLoggedIn = true;
                    req.session.username = user.username;
                    req.session.name = user.name;
                    req.session._id = user.uid;
                    req.session.role = user.role;
                    res.status(200).json({ "name": user.name, "userId": user.uid, "role": user.role });
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
        const user = await createNewUser(body.name, body.mobile, body.username, body.password, "customer"/*body.role*/);
        if (user) {
            if (user == "user already exist") {
                res.status(409).send("user already exist");
                return;
            }
            else {
                const token = createToken(user.uid);
                const subject = 'Email Verification';
                const text = `<h2>Hi ${user.name}! There</h2>
                <p>You have recently visited our website and entered your email</p>
                <p><a href="http://localhost:2000/verify/${token}">Click here</a> to verify your account, and to proceed further.</p>`;
                sendMail(user.username, user.name, subject, text);
                res.status(200).send("success")
            }
        }
        else {
            res.status(500).send("error");
        }
    } catch (error) {
        res.status(500).send("error");
    }
}

function checkIsLogin(req, res) {
    if (req.session.isLoggedIn) {
        res.status(200).send("logged in")
    }
    else {
        res.status(401).send("not logged in");
    }
}

async function changePassword(req, res) {
    try {
        const newPass = req.body.npass;
        let userId = req.body.userId;
        if (userId == "userId") {
            userId = req.session._id;
        }
        const changed = await updatePasswordByUserId(userId, newPass);
        if (changed) {
            const token = createToken(userId);
            const name = req.session.name;
            const subject = "password changed";
            const text = `<p>Hi ${name}! There, you have clicked on forgot password. Please follow the given <a href="http://localhost:2000/changePassword/${token}">link</a> to change password Thanks</p>`;

            if (req.session.username) {
                sendMail(req.session.username, name, subject, text);
            }
            // sendMail(name, req.session.username, userId, subject, text);
            res.status(200).send("password updated successfully");
        }
        else {
            res.status(500).end(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).end("err");
    }
}

function changePasswordUsingForgotLink(req, res) {
    const { token } = req.params;
    verifyToken(token).then(function (decoded) {
        // res.render("changePass", { userId: decoded.userId, name: null });
        res.writeHead(302, {
            Location: 'http://localhost:5173/resetPassword/' + decoded.userId
        });
        res.end();
    }).catch(function (err) {
        res.status(500).send("Email verification failed, possibly the link is invalid or expired");
    });
}

function verifyEmail(req, res) {
    const { token } = req.params;
    verifyToken(token).then(function (decoded) {
        updateIsEmailVerified(decoded.userId).then(function (updated) {
            if (updated) {
                res.writeHead(302, {
                    Location: 'http://localhost:5173/'
                });
                res.end();
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
    try {
        if (user) {
            const name = user.name;
            const userId = user.uid;
            const subject = "password change link";
            const token = createToken(userId);
            const text = `<p>Hi ${name}! There, you have clicked on forgot password. Please follow the given <a href="http://localhost:2000/changePassword/${token}">link</a> to change password Thanks</p>`;
            sendMail(username, name, subject, text).then(response => {
                // console.log(res);
                res.status(200).send("mail sent");
                return;
            });

        }
        else {
            res.status(404).send("this email not registered with us");
        }
    } catch (error) {
        console.log(error)
    }
}

function getAdress(req, res) {
    const uid = req.session._id;
    addressFromDb(uid).then(function (address) {
        res.status(200).json(address);
    }).catch(function (err) {
        res.status(500).send("success");
    })
}

module.exports = {
    login,
    signup,
    verifyEmail,
    changePassword,
    forgotPasswordEmail,
    changePasswordUsingForgotLink,
    getAdress,
    checkIsLogin
}