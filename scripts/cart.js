const productsContainer = document.getElementById("productsContainer");
const addressContainer = document.getElementById("addressContainer");
const saveAdress = document.getElementById("saveAdress");
const addressid = document.getElementById("address");
const countryid = document.getElementById("country");
const stateid = document.getElementById("state");
const districtid = document.getElementById("district");
const pincodeid = document.getElementById("pincode");

let cartItems;
let total = 0;

fetch("/cart/getAllCartItems").then(function (response) {
    if (response.status == 200) {
        return response.json();
    }
    else {
        console.log("something went wrong ");
    }
}).then(function (items) {
    cartItems = items;
    items.forEach(cartItem => {

        showProduct(cartItem);
    });
    if (items.length == 0) {
        billContainer.innerHTML = "";
    }
    else {
        showBill(cartItems);
    }
}).catch(function (err) {
    console.log("error");
});

fetch("/getAddress").then(function(response){
    if(response.status==200){
        return response.json();
    }
    else{
        console.log("somethng went wrong");
    }
})
.then(function(address){
    addressid.value=address.addressLine1;
    countryid.value=address.country;
    stateid.value=address.state;
    districtid.value=address.district;
    pincodeid.value=address.pincode;
}).catch(function(err){
    console.log("something wrong");
})

function showProduct(cartItem) {
    const quantity = cartItem.quantity;
    const productNode = document.createElement("div");
    productNode.className = "productNode";

    const image = document.createElement("img");
    image.src = cartItem.image;
    productNode.appendChild(image);

    const name = document.createElement("div");
    name.innerText = cartItem.name;
    productNode.appendChild(name);

    const price = document.createElement("div");
    price.innerText = "Price: " + cartItem.price;
    productNode.appendChild(price);

    const quantitydiv = document.createElement("div");
    quantitydiv.innerText = "Quanrity: " + quantity;
    productNode.appendChild(quantitydiv);

    const incdecqt = document.createElement("div");
    incdecqt.className = "incdecqt";

    const incbt = document.createElement("div");
    incbt.innerText = "+";
    incbt.addEventListener("click", function (ev) {
        increaseQuantity(cartItem, quantitydiv);
    });
    incdecqt.appendChild(incbt);

    const decbt = document.createElement("div");
    decbt.innerText = "-";
    decbt.addEventListener("click", function (ev) {
        decreaseQuantity(cartItem, quantitydiv);
    });
    incdecqt.appendChild(decbt);

    productNode.appendChild(incdecqt);


    const actions = document.createElement("div");
    actions.className = "productAction";

    const deleteFromCart = document.createElement("span");
    deleteFromCart.innerText = "Delete";
    deleteFromCart.id = "deleteFromCart";
    deleteFromCart.addEventListener("click", function (ev) {
        deleteFromCartList(cartItem, productNode);
    });
    actions.appendChild(deleteFromCart);

    const viewDesc = document.createElement("span");
    viewDesc.innerText = "View Detail";
    viewDesc.id = "viewdesc";
    viewDesc.addEventListener("click", function (ev) {
        viewPopup(cartItem);
    });
    actions.appendChild(viewDesc);

    productNode.appendChild(actions);


    productsContainer.appendChild(productNode);
}

function deleteFromCartList(cartItem, productNode) {
    fetch("/cart/deleteFromCart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cartItem })
    }).then(function (response) {
        if (response.status == 200) {
            console.log("dleted");
            productsContainer.removeChild(productNode);
            cartItems = cartItems.filter((item) => item.cid != cartItem.cid)
            billContainer.innerHTML = "";
            if (cartItems.length != 0) {
                total = 0;
                showBill(cartItems);
            }
            console.log(cartItems);
        }
        else {
            console.log("something went wrong");
        }
    }).catch(function (err) {
        console.log("Error");
    })
}

function increaseQuantity(cartItem, quantitydiv) {
    let quantity = cartItem.quantity;
    if (quantity == cartItem.stock) {
        alert("we have only " + cartItem.stock + " " + cartItem.name + " in our stock");
        return;
    }
    quantity++;
    fetch("/cart/updateCart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: cartItem.cid, quantity: quantity })
    }).then(function (response) {
        if (response.status == 200) {
            cartItem.quantity = quantity;
            quantitydiv.innerText = "Quanrity: " + quantity;
            billContainer.innerHTML = "";
            total = 0;
            showBill(cartItems);
        }
    }).catch(function (err) {
        console.log("something went wrong");
    });
}


function decreaseQuantity(cartItem, quantitydiv) {
    let quantity = cartItem.quantity;
    if (quantity == 1) {
        alert("can't be decrease more you can delete item");
        return;
    }
    quantity--;
    fetch("/cart/updateCart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: cartItem.cid, quantity: quantity })
    }).then(function (response) {
        if (response.status == 200) {
            cartItem.quantity = quantity;
            quantitydiv.innerText = "Quanrity: " + quantity;
            billContainer.innerHTML = "";
            total = 0;
            showBill(cartItems);
        }
    }).catch(function (err) {
        console.log("something went wrong");
    });
}


function showBill(data) {

    const table = document.createElement("table");
    table.id = "billtable";
    const tr = document.createElement("tr");
    tr.className = "headrow";

    const product = document.createElement("th");
    product.innerHTML = "Product";
    product.className = "headcol";
    tr.appendChild(product);

    const quantity = document.createElement("th");
    quantity.innerHTML = "Quantity";
    quantity.className = "headcol";
    tr.appendChild(quantity);

    const price = document.createElement("th");
    price.innerHTML = "Price";
    price.className = "headcol";
    tr.appendChild(price);

    const billAmount = document.createElement("th");
    billAmount.innerHTML = "Bill Amount";
    billAmount.className = "headcol";
    tr.appendChild(billAmount);

    table.appendChild(tr);

    data.forEach(element => {

        const tr = document.createElement("tr");
        tr.className = "datarow";

        const product = document.createElement("td");
        product.innerHTML = element.name;
        product.className = "datacol";
        tr.appendChild(product);

        const quantity = document.createElement("td");
        quantity.innerHTML = element.quantity;
        quantity.className = "datacol";
        tr.appendChild(quantity);

        const price = document.createElement("td");
        price.innerHTML = element.price
        price.className = "datacol";
        tr.appendChild(price);

        const billAmount = document.createElement("td");
        const billamt = element.quantity * element.price;
        total = total + billamt;
        billAmount.innerHTML = billamt;
        billAmount.className = "datacol";
        tr.appendChild(billAmount);

        table.appendChild(tr);
    });

    const lastrow = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.innerHTML = "Total Bill"
    td.className = "totalbillcol"
    lastrow.appendChild(td);

    const totalbill = document.createElement("td");
    totalbill.innerHTML = total;
    totalbill.className = "totalbillcol"
    lastrow.appendChild(totalbill);
    table.appendChild(lastrow);

    billContainer.appendChild(table);

    const paybt = document.createElement("div");
    paybt.id = "paynow";
    paybt.innerText = "Buy";
    paybt.addEventListener("click", function (ev) {
        addressContainer.style.display = "flex";
        productsContainer.style.display = "none";
        paybt.style.background = "gray";
    });
    billContainer.appendChild(paybt);
}


saveAdress.addEventListener("click", function (ev) {
    ev.preventDefault();

    const address = addressid.value.trim();
    const country = countryid.value.trim();
    const state = stateid.value.trim();
    const district = districtid.value.trim();
    const pincode = pincodeid.value.trim();
    if (address == "") {
        alert("Enter Address line1");
        return false;
    }
    if (country == "") {
        alert("Enter Country");
        return false;
    }
    if (state == "") {
        alert("Enter state");
        return false;
    }
    if (district == "") {
        alert("Enter district");
        return false;
    }
    if (pincode == "") {
        alert("Enter pincode");
        return false;
    }

    fetch("/order/placeOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ total, address, country, state, district, pincode })
    }).then(function (response) {
        if (response.status = 200) {
            alert("order placed")
            window.location.href = "/";
        }
        else {
            console.log("plese try again")
        }
    }).catch(function (err) {
        console.log("something went wrong")
    });
});