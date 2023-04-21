"use strict"

const form = document.getElementById("form");
console.log(form);

form.addEventListener("submit", tryToLogin);

function tryToLogin(event) {
    event.preventDefault();
    const username_field = document.querySelector("form > input:nth-child(1)");
    const password_field = document.querySelector("form > input:nth-child(2)");

    fetch("./login_register/php/user_database.php", {
        method: "POST",
        header: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username_field.value, password: password_field.value })
    })

}

const register_page = document.getElementById("too_register");
register_page.addEventListener("click", register);

function register(event){
    document.getElementById("container").classList.toggle("registration");
    
    document.querySelector("body").innerHTML = `
    <section id="container">
        <div id="flex_container">
            <div id="input_section">
                <div id="logo"></div>
                <form action="INSERT_HERE" method="GET" id="form">
                    <input type="text" name="username" placeholder="Username">
                    <input type="password" name="password" placeholder="Password">
                    <button type="submit">REGISTER</button>
                </form>
                <div id="too_register">Already have an account? Click here to log in!</div>
            </div>
        </div>
    </section>`
}