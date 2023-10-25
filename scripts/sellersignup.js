const submit = document.getElementById("submit");
const nameid = document.getElementById("name");
const mobileid = document.getElementById("mobile");
const usernameid = document.getElementById("username");
const passwordid = document.getElementById("password");
const businessnameid = document.getElementById("businessname");
const businesstypeid = document.getElementById("businesstype");
const aadharnoid = document.getElementById("aadharno");
const aadharid = document.getElementById("aadhar");

const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const mbre=/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
const mailre=/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
const allowedtypes=["image/jpeg","image/jpg","image/png"];


submit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const name=nameid.value.trim();
    const mobile=mobileid.value.trim();
    const username=usernameid.value.trim();
    const password=passwordid.value.trim();
    const businessname=businessnameid.value.trim();
    const businesstype=businesstypeid.value.trim();
    const aadharno=aadharnoid.value.trim();
    const aadhar=aadharid.value.trim();


    if (name == "") {
        alert("name must be entered");
        return false;
    }
    if (!mbre.test(mobile)) {
        alert("Enter a valid mobile number");
        return false;
    }
    if(!mailre.test(username)){
        alert("Enter a valid email");
        return;
    }
    if (!re.test(password)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    if(businessname==""){
        alert("Business name must be entered");
        return false;
    }
    if(businesstype==""){
        alert("Business type must be entered");
        return false;
    }
    if(aadharno==""||aadharno.length!=12){
        alert("Enter a valid aadhar no");
        return false;
    }
    if(!aadhar){
        alert("Aadhar must be uploaded");
        return false;
    }
    if(!checkFile()){
        return false;
    }
    const formData = new FormData(document.getElementById("signupForm"));
    fetch("/seller/signup", {
        method: "POST",
        body: formData
    }).then(function (response) {
        
        if (response.status === 200) {
            window.location.href="/seller/login";
        }
        else if(response.status===409){
            alert("user already exist");
        }
        else {
            console.log("Something went wrong");
        }
    });
});

aadharid.addEventListener("change",function(ev){
    checkFile();
});

function checkFile(){
    const file=aadharid.files[0];
    if(!allowedtypes.includes(file.type)){
        alert("invalid file type. Please upload a jpeg or png.");
        return false;
    }
    const size=file.size;
    if(size>250000){
        alert("image size should be less than 250kb");
        return false;
    }
    return true;
}