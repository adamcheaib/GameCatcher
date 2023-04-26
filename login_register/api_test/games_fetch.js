"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.
const fetch_button = document.getElementById("fetch");
fetch_button.addEventListener("click", TEST_fetch_all_games)

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "&key=a25ef91c11654298888f4907971ad496";
let prefix = "https://api.rawg.io/api/";
let page = 1;

if (page == 1) {
    document.getElementById("previous").disabled = true;
}

async function TEST_fetch_all_games() { // Fetches games based on genre!
    let proper_prefix = prefix + `games?page=${page}${api_key}`;
    const link = new Request(proper_prefix);

    try {
        const resource = await (await fetch(link)).json();
        console.log(resource);

    } catch (error) {
        alert("Something went wrong!");
    }
};

async function TEST_fetch_genre_games(event) {
    const checkbox = document.getElementById("horror").name; // Add the element thingy where the name of the genre is generated from!

    async function fetch_specific_genre(genre) {
        try {
            const genre_fetch = prefix + `games?page=${page}&genres=${genre}${api_key}`;
            const resource = await (await fetch(genre_fetch)).json();
            console.log(resource);
        } catch (err) {
            console.log(err);
        }
    }

    fetch_specific_genre(checkbox);
}


document.getElementById("fetch").addEventListener("click", TEST_fetch_genre_games);
document.getElementById("next").addEventListener("click", next_page);
document.getElementById("previous").addEventListener("click", previous_page);



function append_fetch_result(games_array) {
    games_array.forEach(game => {
        const game_image = document.createElement("img");
        const parent = document.getElementById("game_preview");
        const image_link = game.short_screenshots[1].image;
        game_image.src = image_link;
        parent.appendChild(game_image);
    })

}













// Test
function next_page() {
    page++;
    if (page >= 1) {
        document.getElementById("previous").disabled = false;
    }
    TEST_fetch_all_games();
}

function previous_page(event) {
    if (page >= 1) {
        page--;
        event.target.disabled = true;
        TEST_fetch_all_games();
    } else {
        event.target.disabled = false;
        page--;
        TEST_fetch_all_games();
    }
}