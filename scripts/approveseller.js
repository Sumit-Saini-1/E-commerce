const sellerContainer = document.getElementById("listContainer");
const loadMore = document.getElementById("loadMore");

let page = 0;
loadSeller();

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

loadMore.addEventListener("click", function (ev) {
    ev.preventDefault();
    page++;
    loadSeller();
})

function loadSeller() {
    fetch("/seller/getSellersToApprove/"+page).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        const sellers=data.sellers;
        const isLast=data.isLast;
        if(isLast){
            loadMore.style.visibility="hidden";
        }
        sellers.forEach(seller => {
            // console.log(seller);
            showSeller(seller);
        });
    }).catch(function (err) {
        console.log("Error", err);
    });
}

function showSeller(seller) {
    const sellerNode = document.createElement("div");
    sellerNode.className = "sellerNode";

    const name = document.createElement("div");
    name.innerText = seller.name;
    sellerNode.appendChild(name);

    const username=document.createElement("div");
    username.innerText=seller.username;
    sellerNode.appendChild(username);

    const buisnessname=document.createElement("div");
    buisnessname.innerText=seller.buisness_name;
    sellerNode.appendChild(buisnessname);
    
    const buisnesstype=document.createElement("div");
    buisnesstype.innerText=seller.buisnesstype;
    sellerNode.appendChild(buisnesstype);


    sellerNode.addEventListener("click",function(ev){
        window.location.href="/admin/sellerDetail/"+seller.sid;
    });
    sellerContainer.appendChild(sellerNode);
}

// function showSeller(seller) {
//     const sellerNode = document.createElement("div");
//     sellerNode.className = "sellerNode";

//     const name = document.createElement("div");
//     name.innerText = seller.name;
//     sellerNode.appendChild(name);

//     const mobile=document.createElement("div");
//     mobile.innerText=seller.mobile;
//     sellerNode.appendChild(mobile);

//     const username=document.createElement("div");
//     username.innerText=seller.username;
//     sellerNode.appendChild(username);

//     const buisnessname=document.createElement("div");
//     buisnessname.innerText=seller.buisness_name;
//     sellerNode.appendChild(buisnessname);
    
//     const buisnesstype=document.createElement("div");
//     buisnesstype.innerText=seller.buisnesstype;
//     sellerNode.appendChild(buisnesstype);

//     const aadharno=document.createElement("div");
//     aadharno.innerText=seller.aadharno;
//     sellerNode.appendChild(aadharno);
    
//     const aadhar=document.createElement("img");
//     aadhar.src=seller.aadharimage;
//     sellerNode.appendChild(aadhar);

//     const actions = document.createElement("div");
//     actions.className = "sellerAction";
//     const approve = document.createElement("span");
//     approve.innerText = "Approve";
//     approve.id = "approve";
//     approve.addEventListener("click",function(ev){
//         fetch("/seller/approveseller/"+seller.sid).then(function(response){
//             if(response.status==200){
//                 alert("seller approved");
//                 sellerContainer.removeChild(sellerNode);
//             }
//             else{
//                 alert("Not Approved");
//                 return;
//             }
//         }).catch(function(err){
//             alert("Something went wrong");
//             return;
//         });
//     })
//     actions.appendChild(approve);

//     const reject = document.createElement("span");
//     reject.innerText = "Reject";
//     reject.id = "reject";
//     reject.addEventListener("click", function (ev) {
//         fetch("/seller/rejectseller/"+seller.sid).then(function (response) {
//             if (response.status == 200) {
//                 alert("seller rejected");
//                 sellerContainer.removeChild(sellerNode);
//             }
//             else {
//                 console.log("something went wrong");
//             }
//         })
//     });
//     actions.appendChild(reject);

//     sellerNode.appendChild(actions);
//     sellerContainer.appendChild(sellerNode);
// }