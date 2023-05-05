"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "&key=a25ef91c11654298888f4907971ad496";
let prefix = "https://api.rawg.io/api/";

async function TEST_fetch_all_games(page = 1) { // Fetches games based on genre!
    let proper_prefix = prefix + `games?page=${page}` + api_key;
    try {
        const resource = await (await fetch(proper_prefix)).json();
        // console.log(resource);
        return resource;

    } catch (error) {
        alert("Something went wrong!");
    }
};

TEST_fetch_all_games();

async function TEST_fetch_genre_games(event) {
    // Fetch genre based on a certain DOM that contains the name of the genre. The name of the genre will be placed within the "genre" variable.
    let genre = "action";
    try {
        const genre_fetch = prefix + `games?page=1&genres=${genre}` + api_key;
        const resource = await (await fetch(genre_fetch)).json();
        console.log(resource);
    } catch (err) {
        console.log(err);
    }
};

async function search_game_event(event) {

    async function search_for_game(game_name) {
        try {
            const search_game_fetch = prefix + `games?search=${game_name}&platforms=4,187,18,&search_precise=true` + api_key;
            const resource = await (await fetch(search_game_fetch)).json();
            console.log(resource);
            resource.results.forEach(game => {
                if (!game.name.includes("Demo") && !game.name.includes("Trial") && !game.name.includes("DEMO")) {
                    console.log(game.name);
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    await search_for_game("The witcher"); // Make it so that the string argument is based on a input field.
};


fetch("https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496").then(r => r.json()).then(console.log)