const {getAllCartItemsDB,deleteFromCartDB,updateCartQuantityDB,findProductInCartDB,addNewItemToCartDB}=require("../databaseFuntion/cartQuery");

function getAllCartItems(req, res) {
    getAllCartItemsDB(req.session._id).then(function (cartItems) {
        res.status(200).json(cartItems);
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

async function addToCart(req, res) {
    const cartItem = req.body.cartItem;
    cartItem.user=req.session._id;
    const item = await findProductInCartDB(cartItem.product);
    if (item&&item.order_placed	=="NO") {
        res.status(202).send("item alread exist");
        return;
    }
    addNewItemToCartDB(cartItem).then(function (cartItem) {
        res.status(200).json(cartItem);
        return;
    }).catch(function (err) {
        res.status(500).send("error");
        return;
    });
}

function deleteFromCart(req, res) {
    const cartItem = req.body.cartItem;
    deleteFromCartDB(cartItem.cid).then(function (deletd) {
        if(deletd){
            res.status(200).send("deletd");
        }
        else{
            res.status(500).send("error");
        }
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

function updateCartQuantity(req, res) {
    const id = req.body._id;
    const quantity = req.body.quantity;
    updateCartQuantityDB(id,quantity).then(function (updated) {
        res.status(200).send("updated");
        return;
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

module.exports={
    getAllCartItems,
    addToCart,
    deleteFromCart,
    updateCartQuantity
}