let message = document.querySelector("#send_message");
let banner_picture = document.querySelector("#banner_picture");
let profile_picture = document.querySelector("#profile_pic_form");
let favorite_game = document.querySelector("#upload_favorite_game");

// Plockar ut användarnamnet man försöker fetcha profilen på. Det gör vi genom att plocka ut användarnamnet från URL:n.
const profile_to_fetch = window.location.search.split("?username=")[1];

// Kör funktonen med användarnamnet som argument.
get_all_users(profile_to_fetch);

async function get_all_users(username) {
    try {
        const response = await fetch(`./php/profiles.php?username=${username}`);
        const user = await response.json();

        if (username === localStorage.getItem("username")) {
            go_to_own_profile(user)
        } else {
            other_users_profiles(user);
        }


    } catch (err) {
        console.log(err);
    }
}

async function go_to_own_profile(user) {

    /*
    Visar den inloggade användarens sida tillsammans med alla sina profilbilder, banner_picture, och status meddelanden.
    Här behålls input-elementen så att man kan ändra sina bilder osv.
    */

    if (user.username === localStorage.username) {
        document.querySelector("h2").textContent = user.username;
        if (user.profile_picture == "undefined") {
            document.querySelector("#profile_image").style.backgroundImage = "url(../../frontpage/general_media/default_profile_pic.svg)"
            document.getElementById("comment_profile").style.backgroundImage = "url(../../frontpage/general_media/default_profile_pic.svg)";
        } else {
            document.querySelector("#profile_image").style.backgroundImage = `url(./images/${user.profile_picture})`;
            document.getElementById("comment_profile").style.backgroundImage = `url(./images/${user.profile_picture})`;
        }
        if (user.banner_picture === null) {
            document.querySelector("main").style.backgroundColor = "rgb(73, 73, 112)"
        } else {
            document.querySelector("main").style.backgroundImage = `url(./images/${user.banner_picture})`;
        }
        if (!user.hasOwnProperty('favorite_game_images')) {
            document.querySelector("#favorite_game_image").style.backgroundColor = "rgb(73, 73, 112)"
        } else {
            document.querySelector("#favorite_game_image").style.backgroundImage = `url(./images/${user.favorite_game_images})`;
        }
        if (user.hasOwnProperty("profile_comments")) {
            show_messages(user.profile_comments, user);
        }
        localStorage.setItem("profile_picture", user.profile_picture);
    }
    favorite_game.addEventListener("change", upload_picture);

    profile_picture.addEventListener("change", upload_picture);

    banner_picture.addEventListener("change", upload_picture);

    message.addEventListener("click", send_message);
};


function other_users_profiles(other_user) {
    // Tar bort alla input-elementen så att man ej kan ändra bilderna och visar användarens profil_bild, banner_bild, status_meddelanden.
    // Med andra ord, så visas en användare som INTE är den som är inloggad!
    document.getElementById("upload_banner_picture").remove();
    document.getElementById("upload_profile_picture").remove();
    document.getElementById("upload_favorite").remove();
    document.querySelector(".send_message_section").remove();

    document.querySelector("h2").textContent = other_user.username;
    if (other_user.profile_picture === "undefined") {
        document.querySelector("#profile_image").style.backgroundImage = "url(../../frontpage/general_media/default_profile_pic.svg)"
    } else {
        document.querySelector("#profile_image").style.backgroundImage = `url(./images/${other_user.profile_picture})`;
    }
    if (other_user.banner_picture === null) {
        document.querySelector("main").style.backgroundColor = "rgb(73, 73, 112)"
    } else {
        document.querySelector("main").style.backgroundImage = `url(./images/${other_user.banner_picture})`;
    }
    if (!other_user.hasOwnProperty('favorite_game_images')) {
        document.querySelector("#favorite_game_image").style.backgroundColor = "rgb(73, 73, 112)"
    } else {
        document.querySelector("#favorite_game_image").style.backgroundImage = `url(./images/${other_user.favorite_game_images})`;
    }
    if (other_user.hasOwnProperty("profile_comments")) {
        show_messages(other_user.profile_comments, other_user);
    }

    document.querySelectorAll(".delete").forEach(delete_button => delete_button.remove());
}


// Funktionen för att kunna ladda upp olika bilder (profil_bild och banner_bild).
function upload_picture(event) {
    event.preventDefault();
    let image;
    let formData;
    let check_profile_pic = false;

    // Kontrollerar event.targets ID för att identifiera vad det är den ska skicka till PHP-filen och vilken bild det är som ska skickas och vart den ska visas.
    if (event.target.id === "upload_profile_picture") {
        image = document.querySelector("#profile_image");
        formData = new FormData(profile_picture);
        formData.append("action", "profile_picture");
        check_profile_pic = true;
    }

    if (event.target.id === "upload_banner_picture") {
        image = document.querySelector("main");
        formData = new FormData(banner_picture);
        formData.append("action", "banner_picture");
    }

    if (event.target.id === "upload_favorite") {
        image = document.querySelector("#favorite_game_image");
        formData = new FormData(favorite_game);
        formData.append("action", "favorite_game_picture");
    }
    formData.append("username", localStorage.getItem("username"));

    let request = new Request("./php/upload.php", {
        method: "POST",
        body: formData,
    });

    // Här skickas det man laddar upp och det som skickas beror på event.targets ID.
    fetch(request)
        .then(response => response.json())
        .then(data => {
            image.style.backgroundImage = `url(./images/${data.filename})`;

            // if-satsen finns för att profilbilderna för varje kommentar ska OCKSÅ förändras!
            if (check_profile_pic === true) {
                localStorage.setItem("profile_picture", data.filename);
                document.getElementById("comment_profile").style.backgroundImage = `url(./images/${data.filename})`;
                document.querySelectorAll(".profile_picture").forEach(element => {
                    element.style.backgroundImage = `url(./images/${localStorage.getItem("profile_picture")})`;
                })
            }
        })
}


function send_message(event) {
    event.preventDefault();
    let section = document.querySelector("#profile_forum")
    let message = document.querySelector("#message").value
    if (message.length > 25) {
        alert("Message is too long, it needs to be shorter than 25 characters");
        // Return finns för att den ska stoppa funktionen!
        return;
    }

    let div = document.createElement("div");
    div.textContent = message;
    div.classList.add("comments_section");

    let request = new Request("./php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            text: message,
            username: localStorage.getItem("username"),
        }),

    });


    fetch(request)
        .then(resource => resource.json())
        .then(data => {
            // Skapar containern för varje status_meddelande.
            div.innerHTML = `
                <div id="chat_comments">
                <div class="profile_picture" style='background-image: url("./images/${localStorage.getItem("profile_picture")}'></div>
                <div id="text_message">
                <p>${message}</p>
                </div>
                </div>
                <div id="info_delete">
                <p id="timestamp">${data.timestamp}</p>
                <div class="delete">delete</div>
                </div>
                `
            document.querySelectorAll(".delete").forEach(element => element.addEventListener("click", remove_comment));
        })
    section.appendChild(div)
    document.querySelector("#message").value = "";
}


function show_messages(messages, { profile_picture }) {
    if (messages !== null) {
        for (let i = 0; i < messages.length; i++) {
            let section = document.querySelector("#profile_forum")
            let div = document.createElement("div");

            div.classList.add("comments_section");

            div.innerHTML = `
                    <div id="chat_comments">
                    <div class="profile_picture" style='background-image: url("./images/${profile_picture}'></div>
                    <div id="text_message">
                    <p>${messages[i].message}</p>
                    </div>
                    </div>
                    <div id="info_delete">
                    <p id="timestamp">${messages[i].timestamp}</p>
                    <div class="delete">delete</div>
                    </div>
            
            `;
            // Appendar meddelandet till meddelanden på sidan.
            section.appendChild(div);
            // Ger varje status_meddelande en delete knapp som tar bort kommentaren.
            let deleteButtons = document.querySelectorAll(".delete");
            deleteButtons.forEach(button => {
                button.addEventListener("click", remove_comment);
            });
        }
    }
}

// Tar bort status meddelanden.
function remove_comment(event) {
    let timestamp = event.target.parentElement.querySelector("#timestamp").innerHTML;
    let request = new Request("./php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            action: "remove",
            timestamp: timestamp,
            username: localStorage.getItem("username"),
        }),

    });
    fetch(request)
        .then(resource => resource.json())
        .then(data => {
            event.target.parentElement.parentElement.remove();
        })
}

// Lägger till eventListener på #go_home knappen så att man kan gå tillbaka till framsidan.
document.querySelector("#go_home").addEventListener("click", go_home)
function go_home(event) {
    window.location.href = "../../frontpage"
}