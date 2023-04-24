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

function register(event) {
    let container = document.querySelector("#container");
    container.classList.toggle("registration");

    if (container.classList.contains("registration")) {
        document.querySelector("h1").style.color = "white";
        document.querySelector("#too_register").textContent = "Already have an account? click here to log in!"
        document.querySelector("button").textContent = "REGISTER"
        document.querySelector("h1").innerHTML = "Register";
        document.querySelector("#container").style.backgroundImage = "url(./login_register/media/443579.jpg)";

    }
    else {
        document.querySelector("h1").style.color = "black";
        document.querySelector("h1").innerHTML = "Login";
        document.querySelector("button").textContent = "LOGIN"
        document.querySelector("#too_register").innerHTML = "Don't have an account? Click here to register"
        const register_page = document.getElementById("too_register");
        register_page.addEventListener("click", register);

        document.querySelector("#container").style.backgroundImage = "url(./login_register/media/pxfuel.jpg)";
    }
}
