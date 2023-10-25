const submit = document.getElementById("submit");

submit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const nameid = document.getElementById("name");
    const mobileid = document.getElementById("mobile");
    const usernameid = document.getElementById("username");
    const passwordid = document.getElementById("password");

    const name=nameid.value.trim();
    const mobile=mobileid.value.trim();
    const username=usernameid.value.trim();
    const password=passwordid.value.trim();

    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const mbre=/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const mailre=/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

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
    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, mobile, username, password })
    }).then(function (response) {
        
        if (response.status === 200) {
            window.location.href="/login";
            usernameid.value="";
            passwordid.value="";
            nameid.value="";
            mobileid.value="";
        }
        else if(response.status===409){
            alert("user already exist");
        }
        else {
            console.log("Something went wrong");
        }
    });
});