const {findSellerBySid}=require("../databaseFuntion/sellerQuery");
const {createDistributorDb,findDistributorByUsernameDb}=require("../databaseFuntion/distributorQuery");

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
    createDistributor
}