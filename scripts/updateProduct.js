const updateProductSubmit = document.getElementById("updateProductSubmit");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const productBrand = document.getElementById("productBrand");
const productCategory = document.getElementById("productCategory");

updateProductSubmit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const name = productName.value.trim();
    const desc = productDescription.value.trim();
    const price = productPrice.value.trim();
    const quantity = productQuantity.value;
    const brand = productBrand.value.trim();
    const category = productCategory.value.trim();
    if (!name) {
        alert("Enter Product Name");
        return;
    }
    if (!desc) {
        alert("Enter Product Description");
        return;
    }
    if (!price) {
        alert("Enter Product price");
        return;
    }
    if (!quantity) {
        alert("Enter Product quantity");
        return;
    }
    if (!brand) {
        alert("Enter Product Brand");
        return;
    }
    if (!category) {
        alert("Enter Product Brand");
        return;
    }

    const formData = new FormData();
    formData.append("pId",pId);
    formData.append("name", name);
    formData.append("Description", desc);
    formData.append("price", price);
    formData.append("stock", quantity);
    formData.append("brand", brand);
    formData.append("category", category);
    fetch("/product/updateProduct", {
        method: "POST",
        body: formData
    }).then(function (response) {
        if (response.status === 200) {
            alert("product updated");
            window.location.href="/";
        }
        else if (response.status == 422) {
            alert("Enter all details");
        }
        else {
            console.log("Something went wrong");
        }
    }).catch(function (err) {
        console.log("something went wrong");
    });

});