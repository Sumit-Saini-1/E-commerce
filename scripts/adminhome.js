const productsContainer = document.getElementById("productsContainer");
// const loadMore = document.getElementById("loadMore");
const prodperpage=document.getElementById("prodperpage");

let page = 0;
let items;

fetch("/product/totalProduct").then(function (response) {
    if (response.status == 200) {
        return response.json();
    }
    else {
        console.log("something went wrong");
    }
}).then(function (total) {
    items = total.totalProduct;
    console.log(items);
    pagination();
    loadProduct(5);
}).catch(function (err) {
    console.log("something went wrong");
});

function pagination() {
    // $(".wrapper .item").slice(4).hide(); 


    $('#paging').pagination({

        // Total number of items present 
        // in wrapper class 

        items: items,

        // Items allowed on a single page 
        itemsOnPage: prodperpage.value,
        onPageClick: function (noofele) {
            page = noofele - 1;
            productsContainer.innerHTML = "";
            loadProduct(parseInt(prodperpage.value));
        }
    });
}

// loadMore.addEventListener("click", function (ev) {
//     ev.preventDefault();
//     page++;
//     loadProduct(parseInt(prodperpage.value));
// })

prodperpage.addEventListener("change",function(ev){
    productsContainer.innerHTML="";
    page=0;
    // loadMore.style.visibility="visible";
    pagination();
    loadProduct(parseInt(prodperpage.value));
});


function loadProduct(perpage=0) {
    fetch("/product/getProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ page,perpage })
    }).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        const products=data.products;
        // const isLast=data.isLast;
        // if(isLast){
        //     loadMore.style.visibility="hidden";
        // }
        products.forEach(product => {
            showProduct(product);
        });
    }).catch(function (err) {
        console.log("Error", err);
    });
}

function showProduct(product) {
    const productNode = document.createElement("div");
    productNode.className = "productNode";

    const image = document.createElement("img");
    image.src = product.image;
    productNode.appendChild(image);

    const name = document.createElement("div");
    name.innerText = product.name;
    productNode.appendChild(name);

    const price = document.createElement("div");
    price.innerText = "Price: " + product.price;
    productNode.appendChild(price);

    const actions = document.createElement("div");
    actions.className = "productAction";
    // const update = document.createElement("a");
    // update.innerText = "Update";
    // update.id = "update";
    // update.href="/product/updateProduct/"+product.pid;
    // actions.appendChild(update);

    const del = document.createElement("span");
    del.innerText = "Delete";
    del.id = "delete";
    del.addEventListener("click", function (ev) {
        fetch("/product/deleteProduct",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ product: product })
        }).then(function (response) {
            if (response.status == 200) {
                alert("Product Deleted");
                productsContainer.removeChild(productNode);
            }
            else {
                console.log("something went wrong");
            }
        })
    });
    actions.appendChild(del);

    productNode.appendChild(actions);
    productsContainer.appendChild(productNode);
}