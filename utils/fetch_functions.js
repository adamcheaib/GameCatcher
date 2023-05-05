"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "&key=a25ef91c11654298888f4907971ad496";
let prefix = "https://api.rawg.io/api/";

async function TEST_fetch_all_games(page = 1) { // Fetches games based on genre!
    let proper_prefix = prefix + `games?page=${page}${api_key}`;
    const link = new Request(proper_prefix);

    try {
        const resource = await (await fetch(link)).json();
        console.log(resource);
        return resource;

    } catch (error) {
        alert("Something went wrong!");
    }
};

TEST_fetch_all_games()

async function TEST_fetch_genre_games(event) {
    try {
        const genre_fetch = prefix + `games?page=1&genres=action${api_key}`;
        const resource = await (await fetch(genre_fetch)).json();
        console.log(resource);
    } catch (err) {
        console.log(err);
    }
}