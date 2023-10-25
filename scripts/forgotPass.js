const resetPassword=document.getElementById("resetPassword");
const email=document.getElementById("email");
const mailre=/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

resetPassword.addEventListener("click",function(ev){
    ev.preventDefault();
    const emailvalue=email.value.trim();
    if(!mailre.test(emailvalue)){
        alert("Enter a valid email");
        return;
    }
    fetch("/forgotPasswordEmail",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({username:emailvalue})
    }).then(function(response){
        if(response.status==200){
            alert("check your email");
            email.value="";
            return;
        }else if(response.status==404){
            alert("this email is not registered");
            return;
        }
        else{
            alert("something went wrong");
            return;
        }
    }).catch(function(err){
        console.log("something went wrong");
    })
});