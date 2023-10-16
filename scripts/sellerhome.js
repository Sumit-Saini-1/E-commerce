const body = document.getElementById("body");
const ordersContainer = document.getElementById("productsContainer");
// const listofstore=["Ambala","Panchkula","Kurukshetra","Karnal","Kaithal","Pehwa","YamunaNagar","Kaithal"];
const listofstore=["Chandigarh","Delhi","Haryana","Himachal","Punjab","Rajasthan","Uttar Pardesh"];

loadProduct();

function loadProduct() {
    fetch("/order/receivedOrders").then(function (response) {
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

    const address=document.createElement("div");
    address.innerText="Address to deliver : "+order.addressLine1+"\n"+order.district+","+order.state+"\n"+order.pincode;
    orderNode.appendChild(address);

    const nearbyhub=document.createElement("div");
    const select=document.createElement("select");
    select.id="selectedStore";
    listofstore.forEach(s=>{
        const opt=document.createElement("option");
        opt.innerText=s;
        opt.value=s;
        select.appendChild(opt);
    })
    nearbyhub.innerText="Select nearby store for dispatch to:";
    nearbyhub.appendChild(select);
    orderNode.appendChild(nearbyhub);

    const actions = document.createElement("div");
    actions.className = "orderAction";
    if (order.orderstatus != "cancelled"&&order.orderstatus != "dispatched") {
        const dispatch = document.createElement("span");
        dispatch.innerText = "Dispatch";
        dispatch.id = "dispatch";
        dispatch.addEventListener("click", function (ev) {
            
            // console.log("dispached",select.value,order);
            fetch("/order/dispatched",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({dispatchedTo:select.value,order:order.oid})
            }).then(function(response){
                if(response.status==200){
                    alert("order dispatched successfully");
                    ordersContainer.removeChild(orderNode);
                }
                else{
                    console.log("something went wrong");
                }
            }).catch(function(err){
                console.log("there is some problem");
            });
        });
        actions.appendChild(dispatch);
    }

    orderNode.appendChild(actions);
    ordersContainer.appendChild(orderNode);
}