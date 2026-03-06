document.getElementById("signin-btn").addEventListener("click",function(){
    const userNameInput =document.getElementById("user-name");
    const userName = userNameInput.value;
    // console.log(userName);
    const  passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    // console.log(password);
    if(userName === "admin" && password === "admin123" ){
        alert('sign in Succesfull');
        window.location.assign("./dashbord.html");
    }else{
        alert("sign in Failed");
        return;
    }

})