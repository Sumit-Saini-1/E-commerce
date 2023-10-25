const body = document.getElementById("body");
const ordersContainer = document.getElementById("productsContainer");

loadProduct();

function loadProduct() {
    fetch("/order/orderOut").then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (orders) {
        // console.log(orders);
        orders.forEach(order => {
            showOrder(order);
        });
    }).catch(function (err) {
        console.log("Error", err);
    });
}

function showOrder(order) {
    const orderNode = document.createElement("div");
    orderNode.className = "orderNode";

    const image = document.createElement("img");
    image.src = order.image;
    orderNode.appendChild(image);

    const name = document.createElement("div");
    name.innerText = order.name;
    orderNode.appendChild(name);

    const quantity = document.createElement("div");
    quantity.innerText = "Quantity: "+order.quantity;
    orderNode.appendChild(quantity);

    const billstatus = document.createElement("div");
    billstatus.innerText = "Bill status: "+order.billstatus;
    orderNode.appendChild(billstatus);

    const orderstatus = document.createElement("div");
    orderstatus.innerText = "Order status: "+order.orderstatus;
    orderNode.appendChild(orderstatus);
    
    ordersContainer.appendChild(orderNode);
}