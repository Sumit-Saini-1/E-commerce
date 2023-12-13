const {
  createNewSeller,
  findSellerByUserName,
  updateIsEmailVerified,
  findSellersNotAproved,
  addSellerToApproved,
  addSellerToRejected,
} = require("../databaseFuntion/sellerQuery");
const {
  monthlyReportDb,
  yearlyReportDb,
} = require("../databaseFuntion/orderQuery");
const { createToken, verifyToken } = require("../utils/jsontokens");
const { sendMail } = require("../utils/mailjet");

function signupseller(req, res) {
  const body = req.body;
  createNewSeller(
    body.name,
    body.mobile,
    body.username,
    body.password,
    "seller",
    body.businessname,
    body.businesstype,
    body.aadharno,
    req.file.filename
  )
    .then(function (seller) {
      if (seller == "seller already exist") {
        res.status(409).send("seller already exist");
        return;
      }
      const token = createToken(seller.sid);
      const subject = "Email Verification";
      const text = `<h2>Hi ${seller.name}! There</h2>
                <p>You have recently visited our website and entered your email</p>
                <p><a href="http://localhost:2000/seller/verify/${token}">Click here</a> to verify your account, and to proceed further.</p>`;
      sendMail(seller.username, seller.name, subject, text);
      res.status(200).send("success");
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send("error");
    });
}

function logout(req, res) {
  req.session.isLoggedIn = false;
  req.session.destroy();
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
        } else if (seller.allowed == "N") {
          res.status(405).send("not approved yet as a seller");
          return;
        } else {
          req.session.isLoggedIn = true;
          req.session.username = seller.username;
          req.session.name = seller.name;
          req.session.sid = seller.sid;
          req.session.role = seller.role;
          res.status(200).json({ name: seller.name, sId: seller.sid, role: seller.role });
          return;
        }
      } else {
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
  verifyToken(token)
    .then(function (decoded) {
      updateIsEmailVerified(decoded.userId)
        .then(function (updated) {
          if (updated) {
            if (updated) {
              res.writeHead(302, {
                Location: 'http://localhost:5173/'
              });
              res.end();
            }
          } else {
            res.send("Email verification Failed");
          }
        })
        .catch(function (err) {
          res.send("Email verification Failed");
        });
    })
    .catch(function (err) {
      res.send(
        "Email verification failed, possibly the link is invalid or expired"
      );
    });
}

function toAproveSellers(req, res) {
  const page = req.params.page;
  findSellersNotAproved(page)
    .then(async function (sellers) {
      const isLast = false; //await isThisLastPage(page+1);
      if (sellers == false) {
        sellers = [];
      }
      res.json({ sellers, isLast });
      return;
    })
    .catch(function (err) {
      res.status(500).send("Error");
    });
}

function approveSeller(req, res) {
  const sid = req.params.sid;
  addSellerToApproved(sid)
    .then(function (approved) {
      if (approved) {
        res.status(200).send("approved");
      }
    })
    .catch(function (err) {
      res.status(500).send("error");
    });
}

function rejectSeller(req, res) {
  const sid = req.params.sid;
  addSellerToRejected(sid)
    .then(function (rejected) {
      if (rejected) {
        res.status(200).send("rejected");
      }
    })
    .catch(function (err) {
      res.status(500).send("error");
    });
}

function monthlyReport(req, res) {
  const seller = req.session.sid;
  const year = req.body.year;
  const month = req.body.month;

  monthlyReportDb(seller, month, year)
    .then(function (data) {
      const report = reportPrepare(data);
      res.status(200).json(report);
    })
    .catch(function (err) {
      res.status(500).send("ERROR");
    });
}

function yearlyReport(req, res) {
  const seller = req.session.sid;
  // const date=new Date(req.body.year);
  const year = req.body.year;

  // console.log(year);
  yearlyReportDb(seller, year)
    .then(function (data) {
      const report = reportPrepare(data);
      res.status(200).json(report);
    })
    .catch(function (err) {
      res.status(500).send("ERROR");
    });
}

function reportPrepare(data) {
  const report = data.map((value) => {
    let total = 0;
    let c = 0;
    let d = 0;
    let dispatched = 0;
    data.forEach((t) => {
      if (value.pid == t.pid) {
        if (t.orderstatus == "cancelled") {
          c = c + t.count;
        } else if (t.orderstatus == "delivered") {
          d = d + t.count;
        } else if (t.orderstatus == "dispatched") {
          dispatched = dispatched + t.count;
        }
        total = total + t.count;
      }
    });
    return {
      pid: value.pid,
      name: value.name,
      received: total,
      canceled: c,
      delivered: d,
      dispatched: dispatched,
    };
  });
  const jsonObject = report.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  return uniqueArray;
}

module.exports = {
  signupseller,
  loginseller,
  verifyEmail,
  toAproveSellers,
  approveSeller,
  rejectSeller,
  logout,
  monthlyReport,
  yearlyReport,
};
