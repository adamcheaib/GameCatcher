"use strict"

const input_section = document.getElementById("input_section");
const form = input_section.querySelector("form");

form.addEventListener("click", tryToLogin);

function tryToLogin(event) {
    event.preventDefault();
    const username_field = document.querySelector("form > input:nth-child(1)");
    const password_field = document.querySelector("form > input:nth-child(2)");

    fetch("./php/user_database.php", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: username_field.value, password: password_field.value })
    })

}