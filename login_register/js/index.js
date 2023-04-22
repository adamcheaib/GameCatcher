"use strict"

const form = document.getElementById("form");
const to_register = document.getElementById("too_register");

form.addEventListener("submit", tryToLogin);


function tryToLogin(event) {
    event.preventDefault();
    const username_field = document.querySelector("form > input:nth-child(1)");
    const password_field = document.querySelector("form > input:nth-child(2)");

    fetch("./login_register/php/user_database.php", {
        method: "POST",
        header: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username_field.value, password: password_field.value, action: "login" })
    })
};


const register_page = document.getElementById("too_register");
register_page.addEventListener("click", register);

function register(event){
    let container = document.querySelector("#container");
    container.classList.toggle("registration");

    if(container.classList.contains("registration")){
        document.querySelector("#too_register").textContent = "Already have an account? click here to log in!"
        document.querySelector("button").textContent = "REGISTER"
        //document.querySelector("#container").style.backgroundImage = "url(../media/443579.jpg)";
        //fixa bild
    }
    else{
        document.querySelector("body").innerHTML = `
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
    `
    const register_page = document.getElementById("too_register");
    register_page.addEventListener("click", register);
    }
}