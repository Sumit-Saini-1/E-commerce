const saveAdress = document.getElementById("saveAdress");
saveAdress.addEventListener("click", function (ev) {
    ev.preventDefault();
    const addressid = document.getElementById("address");
    const countryid = document.getElementById("country");
    const stateid = document.getElementById("state");
    const districtid = document.getElementById("district");
    const pincodeid = document.getElementById("pincode");
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

    fetch("/order/createOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ address, country, state, district, pincode })
    }).then(function (response) {
        if (response.status = 200) {
            return response.json();
        }
        else {
            console.log("plese refresh and try")
        }
    }).then(function (data) {
        document.getElementById("addressContainer").style.display="none";
        showBill(data);
    }).catch(function (err) {
        console.log("something went wrong")
    });
});

const billContainer = document.getElementById("billContainer");

function showBill(data) {
    let total=0;
    const table = document.createElement("table");
    table.id="billtable";
    const tr = document.createElement("tr");
    tr.className="headrow";

    const product = document.createElement("th");
    product.innerHTML = "Product";
    product.className="headcol";
    tr.appendChild(product);

    const quantity = document.createElement("th");
    quantity.innerHTML = "Quantity";
    quantity.className="headcol";
    tr.appendChild(quantity);

    const billAmount = document.createElement("th");
    billAmount.innerHTML = "Bill Amount";
    billAmount.className="headcol";
    tr.appendChild(billAmount);

    table.appendChild(tr);

    data.forEach(element => {
        const tr = document.createElement("tr");
        tr.className="datarow";

        const product = document.createElement("td");
        product.innerHTML = element.product;
        product.className="datacol";
        tr.appendChild(product);

        const quantity = document.createElement("td");
        quantity.innerHTML = element.quantity;
        quantity.className="datacol";
        tr.appendChild(quantity);

        const billAmount = document.createElement("td");
        total=total+element.billamount;
        billAmount.innerHTML = element.billamount;
        billAmount.className="datacol";
        tr.appendChild(billAmount);

        table.appendChild(tr);
    });

    const lastrow=document.createElement("tr");
    const td=document.createElement("td");
    td.colSpan=2;
    td.innerHTML="Total Bill"
    td.className="totalbillcol"
    lastrow.appendChild(td);
    
    const totalbill=document.createElement("td");
    totalbill.innerHTML=total;
    totalbill.className="totalbillcol"
    lastrow.appendChild(totalbill);
    table.appendChild(lastrow);

    billContainer.appendChild(table);

    const paybt=document.createElement("div");
    paybt.id="paynow";
    paybt.innerText="pay";
    paybt.addEventListener("click",function(ev){
        fetch("/order/billpaid",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({data})
        }).then((response)=>{
            if(response.status==200){
                alert("payment completed");
                window.location.href="/";
            }
            else{
                console.log("payment is not suuccessful");
            }
        }).catch(function(err){
            console.log("something went wrong during payment");
        });
    });
    billContainer.appendChild(paybt);
}