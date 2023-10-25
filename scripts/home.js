const body = document.getElementById("body");
const productsContainer = document.getElementById("productsContainer");
// const loadMore = document.getElementById("loadMore");
const prodperpage = document.getElementById("prodperpage");
// const pageno=document.getElementById("pageno");
// const prev=document.getElementById("prev");
// const next=document.getElementById("next");

let page = 0;
let cart = [];
let items;

fetch("/product//totalProduct").then(function (response) {
    if (response.status == 200) {
        return response.json();
    }
    else {
        console.log("something went wrong");
    }
}).then(function (total) {
    items = total.totalProduct;
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

prodperpage.addEventListener("change", function (ev) {
    productsContainer.innerHTML = "";
    // loadMore.style.visibility="visible";
    page = 0;
    pagination();
    loadProduct(parseInt(prodperpage.value));
});


function loadProduct(perpage = 0) {
    fetch("/product/getProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ page, perpage })
    }).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        const products = data.products;
        const isLast = data.isLast;
        if (isLast) {
            // loadMore.style.visibility="hidden";
        }
        // if(products[0]){
        //     pageno.innerText=page+1;
        //     productsContainer.innerHTML="";
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
    const addToCart = document.createElement("span");
    addToCart.innerText = "Add To Cart";
    addToCart.id = "addToCart";
    addToCart.addEventListener("click", function (ev) {
        addToCartList(product);
    });
    actions.appendChild(addToCart);

    const viewDesc = document.createElement("span");
    viewDesc.innerText = "View Detail";
    viewDesc.id = "viewdesc";
    viewDesc.addEventListener("click", function (ev) {
        viewPopup(product);
    });
    actions.appendChild(viewDesc);

    productNode.appendChild(actions);
    productsContainer.appendChild(productNode);
}


function addToCartList(product) {
    if (cart.find((element) => element.product == product.pid)) {
        alert("already in cart");
        return;
    }
    let cartItem = { user: "userId", product: product.pid, price: product.price, quantity: 1 };
    fetch("/cart/addToCart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cartItem })
    }).then((response) => {
        if (response.status == 202) {
            alert("already in cart");
        }
        else if (response.status == 200) {
            return response.json();
        }
        else {
            alert("item cant be added to cart");
        }
    }).then(function (cartItem) {
        if (cartItem) {
            cart.push(cartItem);
            alert("added to cart");
        }
    }).catch(function (err) {
        console.log("something went wrong");
    })
    console.log(cart);
}

// next.addEventListener("click",function(ev){
//     ev.preventDefault();
//     page++;
//     loadProduct(parseInt(prodperpage.value));
// });
// prev.addEventListener("click",function(ev){
//     ev.preventDefault();
//     if(page>0){
//         page--;
//     }
//     loadProduct(parseInt(prodperpage.value));
// });