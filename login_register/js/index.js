"use strict"
const form = document.getElementById("form");
const to_register = document.getElementById("too_register");

const username_field = document.querySelector("form > input[name=username]");
const password_field = document.querySelector("form > input[name=password]");
username_field.value = "";
password_field.value = "";

console.log(sessionStorage);
console.log(localStorage);

form.addEventListener("submit", register_or_login);

function register_or_login(event) {
    event.preventDefault();
    const usernamee = username_field.value;
    const passwordd = password_field.value;
    const submit_button = document.querySelector("button[type=submit]");
    if (submit_button.textContent == "LOGIN") {
        tryToLogin({ username: usernamee, password: passwordd });
    } else {
        tryToRegister({ username: usernamee, password: passwordd });
    }
}


async function tryToLogin(login_object) {
    const feedback = document.getElementById("status");

    try {
        const response = await fetch("../login_register/php/user_database.php", {
            method: "POST",
            header: { "Content-type": "application/json" },
            body: JSON.stringify({ username: login_object.username, password: login_object.password, action: "login" })
        });

        const resource = await response.json();


        if (!response.ok) {
            alert(resource.message); // Add the popup function instead
        } else {
            alert(resource.message); // Add the popup function instead
            localStorage.setItem("username", resource.username);

            window.location.replace("http://localhost:1234/frontpage");
        }
        username_field.value = "";
        password_field.value = "";
    } catch (error) {
        alert(error.message) // Add the popup function or change the innerHTML so that plain text is shown of the current status!
    }
};

function tryToRegister(register_object) {
    fetch("../login_register/php/user_database.php", {
        method: "POST",
        header: { "Content-type": "application/json" },
        body: JSON.stringify({ username: register_object.username, password: register_object.password, action: "register" })
    })
}


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
        document.querySelector("#container").style.backgroundImage = "url(./media/443579.jpg)";

    }
    else {
        document.querySelector("h1").style.color = "black";
        document.querySelector("h1").innerHTML = "Login";
        document.querySelector("button").textContent = "LOGIN"
        document.querySelector("#too_register").innerHTML = "Don't have an account? Click here to register"
        const register_page = document.getElementById("too_register");
        register_page.addEventListener("click", register);

        document.querySelector("#container").style.backgroundImage = "url(./media/pxfuel.jpg)";
    }
}