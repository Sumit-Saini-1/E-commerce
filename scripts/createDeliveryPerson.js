const submit = document.getElementById("submit");
const usernameid = document.getElementById("username");
const passwordid = document.getElementById("password");
const nameid=document.getElementById("name");
const pincodeid = document.getElementById("pincode");

const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;



submit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const username=usernameid.value.trim();
    const password=passwordid.value.trim();
    const pincode=pincodeid.value.trim();
    const name=nameid.value.trim();
    
    if(username.length<5){
        alert("username must be of atleast 5 character");
        return;
    }
    if (!re.test(password)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    
    if(name==""){
        alert("name must be entered");
        return;
    }
    if(pincode==""){
        alert("pincode must be entered");
        return;
    }
    fetch("/distributor/createDeliveryPerson",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username,password,name,pincode })
    }).then(function(response){
        if(response.status==200){
            alert("created");
            usernameid.value="";
            passwordid.value="";
            nameid.value="";
            pincodeid.value="";
        }
        else if(response.status==409){
            alert("username already exist");
        }
        else{
            console.log("Something went wrong");
        }
    }).catch(function(err){
        console.log("there is something wrong in creating distributor");
    });
});