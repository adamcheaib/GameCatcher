"use strict"

const input_section = document.getElementById("input_section");
const form = input_section.querySelector("form");
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