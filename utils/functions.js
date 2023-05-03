"use strict"

function popUpFunction(message) {
    button.disabled = true;
    console.log("hef");
    body = document.querySelector("body");
    document.querySelector("div").style.opacity = "0.5";

    popup = document.createElement("div");
    exit_button = document.createElement("div");

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
    div = event.originalTarget.parentElement;
    div.remove();
    button.disabled = false;
    document.querySelector("div").style.opacity = "1";
}

// Fetch games based on the genre!

function TEST_fetch_games(count) { // Fetches games based on genre!
    let link = prefix + "games?&key=a25ef91c11654298888f4907971ad496";
    fetch(link).then(r => r.json()).then(game => {
        console.log(game);
        game.results.forEach(desc => {
            desc.genres.forEach(gameNew => {
                if (gameNew.name == "Adventure") { // Choose the genre that you want to search for!
                    console.log(desc.name);
                }
            })
        })
    });
};
