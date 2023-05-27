import { registration_notification } from "../../utils/functions.js"
"use strict"

// Om en användare redan är inloggad så gör denna if-satsen att man åker tillbaka till Frontpagen.
if (window.localStorage.hasOwnProperty("username")) {
    window.location.replace("../frontpage");
}

const form = document.getElementById("form");

// Dessa plockar ut input-fieldsen genom att selektera dem genom deras CSS-attribut.
const username_field = document.querySelector("form > input[name=username]");
const password_field = document.querySelector("form > input[name=password]");

// Tömmer username field och lösenord fielden när man först besöker hemsidan.
username_field.value = "";
password_field.value = "";

// Lägger till eventListener på hela Form HTML-elementet.
form.addEventListener("submit", register_or_login);

// Kontrollerar om det är inloggning eller registreringsfunktionen. Anropar antingen inloggnings-funktionen eller registreringsfunktionen
function register_or_login(event) {
    event.preventDefault();
    const username_value = username_field.value;
    const password_value = password_field.value;
    const submit_button = document.querySelector("button[type=submit]");
    if (submit_button.textContent == "LOGIN") {
        tryToLogin({ username: username_value, password: password_value });
    } else {
        tryToRegister({ username: username_value, password: password_value });
    }
}

// Försöker att logga in användaren genom en POST-request till user_database.php och kollar om användarnamnet OCH lösenordet stämmer överens med någon av de i databasen
async function tryToLogin(login_object) {
    try {
        const response = await fetch("./php/user_database.php", {
            method: "POST",
            header: { "Content-type": "application/json" },
            body: JSON.stringify({ username: login_object.username, password: login_object.password, action: "login" })
        });

        const resource = await response.json();


        if (!response.ok) {
            registration_notification(resource.message, "registration_notification"); // Anropar notifikationen för att ge feedback till användaren ifall användaren ej finns!
        } else {
            localStorage.setItem("username", resource.username); // Sparar användarens användarnamn i localStorage för att kunna identifiera inloggad användaren.
            localStorage.setItem("profile_picture", resource.profile_picture);
            window.location.replace("../frontpage");
        }
        username_field.value = "";
        password_field.value = "";
    } catch (error) {
        registration_notification(error.message, "registration_notification"); // Lägger till notifikation ifall något skulle gå snett med fetchen!
    }
};

// Denna funktionen försöker lägga till en användare i databasen. Ger notifikation beroende på om det går eller inte går att registrera en användare.
async function tryToRegister(register_object) {
    try {
        const response = await fetch("../login_register/php/user_database.php", {
            method: "POST",
            header: { "Content-type": "application/json" },
            body: JSON.stringify({ username: register_object.username, password: register_object.password, action: "register" })
        });

        const resource = await response.json();

        // Lägger till notifikation ifall användarnamnet redan finns!
        if (!response.ok) {
            registration_notification(resource.message, "registration_notification");
        } else {
            registration_notification(resource.message, "registration_notification");
        }

    } catch (err) {
        registration_notification("Oops! Something went wrong...", "registration_notification"); // Lägger till notifikation ifall något skulle gå snett med fetchen!
    }
}


// Denna biten är för att lägga till transition på att byta sidan mellan Login och Register.
const register_page = document.getElementById("too_register");
register_page.addEventListener("click", (event) => {
    document.getElementById("container").style.filter = "blur(1.5rem)";
    setTimeout(() => document.getElementById("container").style.filter = "blur(0)", 200);
});


// Detta ändrar mellan Login och Register.
register_page.addEventListener("click", register);
function register(event) {
    setTimeout(
        () => {
            let container = document.querySelector("#container");
            container.classList.toggle("registration");

            if (container.classList.contains("registration")) {
                document.querySelector("h1").style.color = "white";
                document.querySelector("#too_register").textContent = "Already have an account? click here to log in!"
                document.querySelector("button").textContent = "REGISTER"
                document.querySelector("h1").innerHTML = "Register";
                document.querySelector("#container").style.backgroundImage = "url(./media/registration.jpg)";

            }
            else {
                document.querySelector("h1").style.color = "black";
                document.querySelector("h1").innerHTML = "Login";
                document.querySelector("button").textContent = "LOGIN"
                document.querySelector("#too_register").innerHTML = "Don't have an account? Click here to register"
                const register_page = document.getElementById("too_register");
                register_page.addEventListener("click", register);

                document.querySelector("#container").style.backgroundImage = "url(./media/login.jpg)";
            }

        }
        , 200)
}