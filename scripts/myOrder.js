const productsContainer=document.getElementById("productsContainer");

fetch("/order/getMyOrder").then(function(response){
    if(response.status=200){
        return response.json();
    }
    else{
        console.log("something went wrong");
    }
}).then(function(orders){
    // console.log(orders);
    orders.forEach(order => {
        showOrders(order);
    });
}).catch(function(err){
    console.log(err);
});

function showOrders(order) {
    const orderNode = document.createElement("div");
    orderNode.className = "orderNode";

    const image = document.createElement("img");
    image.src = order.image;
    orderNode.appendChild(image);

    const name = document.createElement("div");
    name.innerText = order.name;
    orderNode.appendChild(name);

    const quantity = document.createElement("div");
    quantity.innerText = "Quantity: " + order.quantity;
    orderNode.appendChild(quantity);

    const orderstatus = document.createElement("div");
    orderstatus.innerText = "Status: " + order.orderstatus;
    orderNode.appendChild(orderstatus);

    const actions = document.createElement("div");
    actions.className = "orderAction";

    if(order.orderstatus!="delivered"&&order.orderstatus!="cancelled"){
        const cancel = document.createElement("span");
        cancel.innerText = "Cancel";
        cancel.id = "cancel";
        cancel.addEventListener("click", function (ev) {
            fetch("/order/cancelOrder",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({oid:order.oid,pid:order.pid})
            }).then(function(response){
                if(response.status==200){
                    alert("cancelled");
                    actions.remove(cancel);
                }
                else{
                    console.log("something went wrong");
                }
            }).catch(function(err){
                console.log("there is some error");
            });
        });
        actions.appendChild(cancel);
    }

    orderNode.appendChild(actions);
    productsContainer.appendChild(orderNode);
}