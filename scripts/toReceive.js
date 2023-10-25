const ordersContainer = document.getElementById("orderContainer");
// const listofstore=["Ambala","Panchkula","Kurukshetra","Karnal","Kaithal","Pehwa","YamunaNagar","Kaithal"];
// const listofstore=["Chandigarh","Delhi","Haryana","Himachal","Punjab","Rajasthan","Uttar Pardesh"];

loadProduct();

function loadProduct() {
    fetch("/distributor/toReceive").then(function (response) {
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

    const actions = document.createElement("div");
    actions.className = "orderAction";
    if (order.orderstatus != "cancelled") {
        const receive = document.createElement("span");
        receive.innerText = "Receive";
        receive.id = "receive";
        receive.addEventListener("click", function (ev) {
            fetch("/distributor/received", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({order})
            }).then(function(response){
                if(response.status==200){
                    ordersContainer.removeChild(orderNode);
                }
                else{
                    console.log("something went wrong");
                }
            }).catch(function(err){
                console.log("something went wrong");
            });
        });
        actions.appendChild(receive);
    }

    orderNode.appendChild(actions);
    ordersContainer.appendChild(orderNode);
}