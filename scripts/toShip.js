const ordersContainer = document.getElementById("orderContainer");

loadProduct();

function loadProduct() {
    fetch("/distributor/toShip").then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (orders) {
        // console.log(orders);
        orders.forEach(order => {
            if (order.orderstatus != "cancelled") {
                showOrder(order);
            }
        });
    }).catch(function (err) {
        console.log("Error", err);
    });
}

function showOrder(order) {

    const orderNode = document.createElement("div");
    orderNode.className = "orderNode";

    const orderid = document.createElement("div");
    orderid.innerText = "Orderid: " + order.oid;
    orderNode.appendChild(orderid);

    const quantity = document.createElement("div");
    quantity.innerText = "Quantity: " + order.quantity;
    orderNode.appendChild(quantity);

    const billstatus = document.createElement("div");
    billstatus.innerText = "Bill status: " + order.billstatus;
    orderNode.appendChild(billstatus);

    const address = document.createElement("div");
    address.innerText = "Address to deliver : " + order.addressLine1 + "\n" + order.district + "," + order.state + "\n" + order.pincode;
    orderNode.appendChild(address);

    const shipto = document.createElement("div");
    const select = document.createElement("select");
    select.id = "selectedStore";
    const list = [order.district, order.state, "Out for Delivery"];
    list.forEach(s => {
        const opt = document.createElement("option");
        opt.innerText = s;
        opt.value = s;
        select.appendChild(opt);
    })
    shipto.innerText = "Select nearby store for dispatch to:";
    shipto.appendChild(select);
    orderNode.appendChild(shipto);

    const actions = document.createElement("div");
    actions.className = "orderAction";
    if (order.orderstatus != "cancelled") {
        const ship = document.createElement("span");
        ship.innerText = "Ship";
        ship.id = "ship";
        ship.addEventListener("click", function (ev) {
            fetch("/distributor/shipped", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order: order, shipto: select.value })
            }).then(function (response) {
                if (response.status == 200) {
                    ordersContainer.removeChild(orderNode);
                }
                else {
                    console.log("something went wrong");
                }
            }).catch(function (err) {
                console.log("something went wrong");
            });
        });
        actions.appendChild(ship);
    }
    orderNode.appendChild(actions);

    ordersContainer.appendChild(orderNode);
}