const {findSellerBySid}=require("../databaseFuntion/sellerQuery");
const {createDistributorDb,findDistributorByUsernameDb}=require("../databaseFuntion/distributorQuery");

function loadHomePage(req,res){
    res.render("adminhome",{ name: req.session.name});
}

function loadAproveProductPage(req,res){
    res.render("aproveProduct",{ name: req.session.name})
}

function loadApproveSellerPage(req,res){
    res.render("approveSeller",{name:req.session.name});
}

function loadSellerDetailPage(req,res){
    const sid=req.params.sid;
    findSellerBySid(sid).then(function(seller){
        res.render("sellerDetail",{name: req.session.name,seller:seller});
    }).catch(function(err){
        res.status(500).send(err);
    });
}

function loadCreateDstributorPage(req,res){
    res.render("createDistributor",{ name: req.session.name});
}

function createDistributor(req,res){
    const body=req.body;
    findDistributorByUsernameDb(body.username).then(function(distributor){
        if(distributor){
            res.status(409).send("user already exist");
            return;
        }
        createDistributorDb(body.username,body.password,body.address,body.state,body.district,body.pincode,body.level).then(function(){
            res.status(200).send("success");
        }).catch(function(err){
            res.status(500).send("ERROR");
        })
    }).catch(function(err){
        res.status(500).send("ERROR");
    });
}

module.exports={
    loadHomePage,
    loadAproveProductPage,
    loadApproveSellerPage,
    loadSellerDetailPage,
    loadCreateDstributorPage,
    createDistributor
}