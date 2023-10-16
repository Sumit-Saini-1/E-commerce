const {getAllCartItemsDB,deleteFromCartDB}=require("../databaseFuntion/cartQuery");
const {newOrder,myOrdersDb,cancelOrderDb,receivedOrderDb,dispachedToDb,ordersOutDb}=require("../databaseFuntion/orderQuery");
const {updateStock}=require("../databaseFuntion/productQuery");
const {addAddressOfUser}=require("../databaseFuntion/userQuery");

function createOrder(req,res){
    const uid=req.session._id;
    const body=req.body;
    
    getAllCartItemsDB(uid).then(function(cartItems){

        const total=body.total;
        let sum=0;
        cartItems.forEach(item=>{
            sum=sum+(item.quantity*item.price);
        });
        if(total<sum){
            res.status(406).send("payment is not full");
            return;
        }
        cartItems.forEach((item,i,items) => {
            if(item.quantity<=item.stock){
                
                newOrder(uid,item.pid,item.quantity,item.price*item.quantity,body.address,body.country,body.state,body.district,body.pincode).then(async function(order){
                    if(order){
                        const newstock=item.stock-item.quantity;
                        await updateStock(item.pid,newstock);
                        await deleteFromCartDB(item.cid);
                        await addAddressOfUser(uid,body.address,body.country,body.state,body.district,body.pincode);
                        if(i==items.length-1){
                            res.status(200).send("placed");
                        }
                    }
                }).catch(function(err){
                    res.status(500).send("ERROR");
                });
            }
        });
    }).catch(function(err){
        res.status(500).send("Error");
    });
}

function myOrderPage(req,res){
    res.render("myOrder",{ name: req.session.name })
}

function getMyOrders(req,res){
    const uid=req.session._id;
    myOrdersDb(uid).then(function(orders){
        res.status(200).json(orders);
    }).catch(function(err){
        res.status(500).send("Error");
    })
}

function cancelOrder(req,res){
    const body=req.body;
    cancelOrderDb(body.oid).then(function(canceled){
        res.status(200).send("canceled");
    }).catch(function(err){
        res.status(500).send("ERROR");
    });
}

function getReceivedOrders(req,res){
    const sid=req.session.sid;
    // console.log(sid);
    receivedOrderDb(sid).then(function(orders){
        res.status(200).json(orders);
    }).catch(function(err){
        res.status(500).send("Error");
    });
}

function dispached(req,res){
    const body=req.body;
    // console.log(body);
    dispachedToDb(body.order,body.dispatchedTo).then(function(result){
        res.status(200).send("dispatched");
    }).catch(function(err){
        res.status(500).send("ERROR");
    });
}

function ordersOut(req,res){
    const sid=req.session.sid;
    // console.log(sid);
    ordersOutDb(sid).then(function(orders){
        // console.log(orders);
        res.status(200).json(orders);
    }).catch(function(err){
        res.status(500).send("Error");
    });
}

module.exports={
    createOrder,
    myOrderPage,
    getMyOrders,
    cancelOrder,
    getReceivedOrders,
    dispached,
    ordersOut
}