const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const newpass=document.getElementById("newPass");
const confirmPass=document.getElementById("confirmPass");
const update=document.getElementById("update");

newpass.addEventListener("input",function(ev){
    const npass=newpass.value.trim();
    const oneDigit=document.getElementById("oneDigit");
    const oneCapLetter=document.getElementById("oneCapLetter");
    const oneSmLetter=document.getElementById("oneSmLetter");
    const oneSpecChar=document.getElementById("oneSpecChar");
    const passLength=document.getElementById("passLength");
    if(/^(?=.*\d).{1,}$/.test(npass)){
        oneDigit.style.color="green";
    }
    else{
        oneDigit.style.color="red";
    }

    if(/^(?=.*[A-Z]).{1,}$/.test(npass)){
        oneCapLetter.style.color="green";
    }
    else{
        oneCapLetter.style.color="red";
    }

    if(/^(?=.*[a-z]).{1,}$/.test(npass)){
        oneSmLetter.style.color="green";
    }
    else{
        oneSmLetter.style.color="red";
    }

    if(/^(?=.*[!@#$%^&*]).{1,}$/.test(npass)){
        oneSpecChar.style.color="green";
    }
    else{
        oneSpecChar.style.color="red";
    }

    if(npass.length>7){
        passLength.style.color="green";
    }
    else{
        passLength.style.color="red";
    }
})

update.addEventListener("click",function(ev){
    ev.preventDefault();
    const npass=newpass.value.trim();
    const cpass=confirmPass.value.trim();
    if (!re.test(npass)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    if(npass!=cpass){
        alert("new password and confirm password should be shame");
        return;
    }
    fetch("/changePassword",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({npass,userId})
    }).then(function(response){
        if(response.status==200){
            alert("password updated");
            newpass.value="";
            confirmPass.value="";
        }
        else{
            alert("password didn't update");
        }
    }).catch(function(){
        console.log("something went wrong");
    });
});