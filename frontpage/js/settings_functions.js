"use strict"

function logout(event){
    let body = document.querySelector("body");
    window.localStorage.clear()
    body.innerHTML = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <link rel="stylesheet" href="../login_register/css/login.css">
            <script defer src="index.js"></script>
        </head>

        <body>
            <section id="container">
                <div id="flex_container">
                    <div id="input_section">
                        <div id="logo"></div>
                        <form action="INSERT_HERE" method="GET" id="form">
                            <input type="text" name="username" placeholder="Username">
                            <input type="password" name="password" placeholder="Password">
                            <button type="submit">LOGIN</button>
                        </form>
                        <div id="too_register">Don't have an account? Click here to register</div>
                    </div>
                </div>
            </section>

        </body>
        </html>
        `
        form.addEventListener("submit", register_or_login);
        register_page.addEventListener("click", register);
}

//document.querySelector("#settings").addEventListener("click", change_value)
function change_value(event){
    console.log(event);
    let username = window.localStorage.userid;
    let new_value;
    let effect;
    if(event.target.value === "change_username"){
        new_value = document.querySelector("#new_username").value;
        effect = "new_username";
    }
    if(event.target.value === "change_password"){
        new_value = document.querySelector("#new_password").value;
        effect = "new_password";
    }
    if(event.target.value === "change_email"){
        new_value = document.querySelector("#new_email").value;
        effect = "email";
    }

    fetch("./frontpage/php/settings_functions.php", {
        method: "PATCH",
        header: {"Content-type": "application/json" },
        body: JSON.stringify({ 
            username: username,
            value: new_value,
            action: effect,
        })
    })
}