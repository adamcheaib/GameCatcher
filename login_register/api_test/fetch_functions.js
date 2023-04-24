"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.
const fetch_button = document.getElementById("fetch");
fetch_button.addEventListener("click", fetch_games)

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "a25ef91c11654298888f4907971ad496";
let prefix = "https://api.rawg.io/api/";


const object1 = {
    name: "Adam",
    nationality: "Lebanese"
};


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


fetch_games({ type: "games" });