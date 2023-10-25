const addProductSubmit = document.getElementById("addProductSubmit");
const productName = document.getElementById("productName");
const productDescription=document.getElementById("productDescription");
const productPrice=document.getElementById("productPrice");
const productQuantity=document.getElementById("productQuantity");
const productBrand=document.getElementById("productBrand");
const productCategory=document.getElementById("productCategory");
const productImage = document.getElementById("productImage");


addProductSubmit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const name = productName.value.trim();
    const desc=productDescription.value.trim();
    const price=productPrice.value.trim();
    const quantity=productQuantity.value;
    const brand=productBrand.value.trim();
    const category=productCategory.value.trim();
    if (!name) {
        alert("Enter Product Name");
        return;
    }
    if(!desc){
        alert("Enter Product Description");
        return;
    }
    if(!price){
        alert("Enter Product price");
        return;
    }
    if(!quantity){
        alert("Enter Product quantity");
        return;
    }
    if(!brand){
        alert("Enter Product Brand");
        return;
    }
    if(!category){
        alert("Enter Product Brand");
        return;
    }
    
    if (productImage.files[0]) {
        const formData = new FormData();
        formData.append("productImage", productImage.files[0]);
        formData.append("name",name);
        formData.append("Description",desc);
        formData.append("price",price);
        formData.append("stock",quantity);
        formData.append("brand",brand);
        formData.append("category",category);
        fetch("/product/addProduct", {
            method: "POST",
            body: formData
        }).then(function (response) {
            if (response.status === 200) {
                alert("product added");
                productImage.value="";
                productName.value="";
                productDescription.value="";
                productPrice.value="";
                productQuantity.value="";
                productBrand.value="";
                productCategory.value="";
            }
            else if(response.status==422){
                alert("Enter all details");
                return;
            }
            else {
                console.log("Something went wrong");
            }
        }).catch(function(err){
            console.log("something went wrong");
        });
    }
    else {
        alert("select a image");
        return;
    }
});


productImage.addEventListener("change",function(ev){
    const allowedtypes=["image/jpeg","image/jpg","image/png"];
    const file=productImage.files[0];
    if(!allowedtypes.includes(file.type)){
        alert("invalid file type. Please upload a jpeg or png.");
        addProductSubmit.disabled = true;
        return;
    }
    const size=file.size;
    if(size>250000){
        alert("image size should be less than 250kb");
        addProductSubmit.disabled = true;
        return;
    }
    addProductSubmit.disabled = false;
});