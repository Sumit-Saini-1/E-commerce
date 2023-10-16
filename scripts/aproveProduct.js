const productsContainer = document.getElementById("productsContainer");
const loadMore = document.getElementById("loadMore");

let page = 0;
loadProduct();

loadMore.addEventListener("click", function (ev) {
    ev.preventDefault();
    page++;
    loadProduct();
})

function loadProduct() {
    fetch("/product/productsToAprove/"+page).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        const products=data.products;
        const isLast=data.isLast;
        if(isLast){
            loadMore.style.visibility="hidden";
        }
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
    image.addEventListener("click",function(ev){
        viewPopup(product);
    });

    productNode.appendChild(image);

    const name = document.createElement("div");
    name.innerText = product.name;
    productNode.appendChild(name);

    const price = document.createElement("div");
    price.innerText = "Price: " + product.price;
    productNode.appendChild(price);

    const actions = document.createElement("div");
    actions.className = "productAction";
    const approve = document.createElement("span");
    approve.innerText = "Approve";
    approve.id = "approve";
    approve.addEventListener("click",function(ev){
        fetch("/product/approveProduct/"+product.pid).then(function(response){
            if(response.status==200){
                alert("Product approved");
                productsContainer.removeChild(productNode);
            }
            else{
                alert("Not Approved");
                return;
            }
        }).catch(function(err){
            alert("Something went wrong");
            return;
        });
    })
    actions.appendChild(approve);

    const reject = document.createElement("span");
    reject.innerText = "Reject";
    reject.id = "reject";
    reject.addEventListener("click", function (ev) {
        fetch("/product/rejectProduct/"+product.pid).then(function (response) {
            if (response.status == 200) {
                alert("Product rejected");
                productsContainer.removeChild(productNode);
            }
            else {
                console.log("something went wrong");
            }
        })
    });
    actions.appendChild(reject);

    productNode.appendChild(actions);
    productsContainer.appendChild(productNode);
}