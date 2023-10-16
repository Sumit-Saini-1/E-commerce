const approveBt = document.getElementById("approveBt");
const rejectBt = document.getElementById("rejectBt");

approveBt.addEventListener("click", function (ev) {
    fetch("/seller/approveseller/" + sid).then(function (response) {
        if (response.status == 200) {
            alert("seller approved");
            // sellerContainer.removeChild(sellerNode);
            history.back();
        }
        else {
            alert("Not Approved");
            return;
        }
    }).catch(function (err) {
        alert("Something went wrong");
        return;
    });
});
rejectBt.addEventListener("click", function (ev) {
    fetch("/seller/rejectseller/" + sid).then(function (response) {
        if (response.status == 200) {
            alert("seller rejected");
            // sellerContainer.removeChild(sellerNode);
            history.back();
        }
        else {
            console.log("something went wrong");
        }
    })
});