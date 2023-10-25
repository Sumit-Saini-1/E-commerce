const submit = document.getElementById("submit");
const levelid=document.getElementById("level");
const usernameid = document.getElementById("username");
const passwordid = document.getElementById("password");
const addressline1id = document.getElementById("addressline1");
const stateid = document.getElementById("state");
const districtid = document.getElementById("district");
const pincodeid = document.getElementById("pincode");

const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;



submit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const level=levelid.value;
    const username=usernameid.value.trim();
    const password=passwordid.value.trim();
    const address=addressline1id.value.trim();
    const state=stateid.value.trim();
    const district=districtid.value.trim();
    const pincode=pincodeid.value.trim();
    if(level=="none"){
        alert("select level of distributor");
        return;
    }
    if(username.length<5){
        alert("username must be of atleast 5 character");
        return;
    }
    if (!re.test(password)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    if(address==""){
        alert("address must be entered");
        return;
    }
    if(state==""){
        alert("state must be entered");
        return;
    }
    if(district==""){
        alert("district must be entered");
        return;
    }
    if(pincode==""){
        alert("pincode must be entered");
        return;
    }
    fetch("/admin/createDistributor",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username,password,address,state,district,pincode,level })
    }).then(function(response){
        if(response.status==200){
            alert("created");
            levelid.value="none";
            usernameid.value="";
            passwordid.value="";
            addressline1id.value="";
            stateid.value="";
            districtid.value="";
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