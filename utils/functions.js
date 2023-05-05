"use strict"

function popUpFunction(message) {
    const body = document.querySelector("body");
    document.querySelector("div").style.opacity = "0.5";

    const popup = document.createElement("div");
    const exit_button = document.createElement("div");

    body.appendChild(popup);
    popup.classList.add("popup");
    popup.textContent = message;

    popup.style.opacity = "1"
    exit_button.classList.add("exit")
    exit_button.textContent = "X"
    exit_button.addEventListener("click", remove_message)
    popup.appendChild(exit_button);
}
function remove_message(event) {
    console.log(event);
    const div = event.originalTarget.parentElement;
    div.remove();
    button.disabled = false;
    document.querySelector("div").style.opacity = "1";
}

// Modafucka hello elliot
