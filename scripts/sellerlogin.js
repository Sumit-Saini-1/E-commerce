const submit=document.getElementById("submit");

submit.addEventListener("click",function(ev){
    ev.preventDefault();
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();
    const mailre=/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if(!mailre.test(username)){
        alert("Enter a valid email");
        return;
    }
    if(password.length<8){
        alert("Password should atleast 8 character long");
        return;
    }
    fetch("/seller/login",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({username,password})
    }).then(function (response) {
        if(response.status==401){
            alert("password not matched");
        }
        else if(response.status==402){
            alert("verify your email first");
        }
        else if(response.status==404){
            alert("User not exist please signup");
        }
        else if(response.status==405){
            alert("not approved yet as a seller");
        }
        else if (response.status === 200) {
            if(response.redirected){
                window.location.href="/seller/home";
            }
        } 
        else {
            console.log("Something went wrong");
        }
    }).catch(function(err){
        console.log(err);
    });
});