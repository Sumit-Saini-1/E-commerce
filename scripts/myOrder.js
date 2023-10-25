const productsContainer = document.getElementById("productsContainer");

fetch("/order/getMyOrder").then(function (response) {
    if (response.status = 200) {
        return response.json();
    }
    else {
        console.log("something went wrong");
    }
}).then(function (orders) {
    // console.log(orders);
    orders.forEach(order => {
        showOrders(order);
    });
}).catch(function (err) {
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
    if(order.orderstatus=="dispatched"){
        orderstatus.innerText= "Status: Dispatched to " + order.nextdest;
        if(order.nextdest==order.curloc){
            orderstatus.innerText= "Status: Reached " + order.nextdest;
        }
    }
    if(order.orderstatus=="shipped"){
        if(order.nextdest=="Out for Delivery"){
            orderstatus.innerText= "Status: " + order.nextdest;
        }
        else{
            orderstatus.innerText= "Status: Shipped to " + order.nextdest;
            if(order.nextdest==order.curloc){
                orderstatus.innerText= "Status: Reached " + order.nextdest;
            }
        }
    }
    orderNode.appendChild(orderstatus);

    if (order.orderstatus != "delivered" && order.orderstatus != "cancelled") {
        const orderstatus = document.createElement("div");
        orderstatus.innerText = "Expected delivery: " + new Date(order.expecteddelivery).toDateString();
        orderNode.appendChild(orderstatus);
    }
    if(order.orderstatus == "delivered"){
        const orderstatus = document.createElement("div");
        orderstatus.innerText = "Delivered on: " + new Date(order.deliverydate).toDateString();
        orderNode.appendChild(orderstatus);
    }

    const actions = document.createElement("div");
    actions.className = "orderAction";

    if (order.orderstatus != "delivered" && order.orderstatus != "cancelled") {
        const cancel = document.createElement("span");
        cancel.innerText = "Cancel";
        cancel.id = "cancel";
        cancel.addEventListener("click", function (ev) {
            fetch("/order/cancelOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ oid: order.oid, pid: order.pid })
            }).then(function (response) {
                if (response.status == 200) {
                    alert("cancelled");
                    actions.remove(cancel);
                    orderstatus.innerText = "Status: " + "cancelled";
                }
                else {
                    console.log("something went wrong");
                }
            }).catch(function (err) {
                console.log("there is some error");
            });
        });
        actions.appendChild(cancel);
    }

    orderNode.appendChild(actions);
    productsContainer.appendChild(orderNode);
}