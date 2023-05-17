"use strict"

function registration_notification(textContent) {
    const registration_dialog = document.createElement("dialog");
    registration_dialog.style.height = "100vh";
    registration_dialog.style.width = "100vw";
    registration_dialog.style.backgroundColor = "black";
    registration_dialog.style.opacity = 0.6;

    const registration_notification_container = document.createElement("div");
    registration_notification_container.className = "registration_notification";
    registration_notification_container.innerHTML = `
    <h3>Registration is successfull!</h3>
    <button id="close">Close</button>
    `;

    registration_dialog.appendChild(registration_notification_container);
    document.body.appendChild(registration_dialog);
    registration_dialog.showModal();
    document.querySelector("#close").addEventListener("click", () => registration_dialog.remove());
}


document.querySelector("button").addEventListener("click", registration_notification);