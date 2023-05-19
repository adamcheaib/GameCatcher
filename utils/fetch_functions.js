"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
export const api_key = "key=7537434a316c4729b0ac0130147be146";
let prefix = "https://api.rawg.io/api/";



export async function fetch_all_games(page = 1) { // Fetches games based on genre!
    const link = prefix + `games?page=${page}&` + api_key;
    try {
        const resource = await (await fetch(link)).json();
        return resource;

    } catch (error) {
        alert("TEST");
    }
};

// fetch_all_games();

async function TEST_fetch_genre_games(event) {
    // Fetch genre based on a certain DOM that contains the name of the genre. The name of the genre will be placed within the "genre" variable.
    let genre = "action";
    try {
        const link = prefix + `games?page=1&genres=${genre}&` + api_key;
        const resource = await (await fetch(link)).json();
    } catch (err) {
        console.log(err);
    }
};



export async function search_for_game(game_name = document.querySelector("#searchBarContainer > input").value) {
    /*
    PC: id 4,
    Nintendo_Switch: id 7,
    Xbox Series X: id 186,
    Playstation 5: id 187
    */
    try {
        const link = prefix + `games?search=${game_name}&platforms=4,187,18,186&search_precise=true&` + api_key;
        const resource = await (await fetch(link)).json();
        const filtered_results = [];
        resource.results.forEach(game => {
            if (!game.name.includes("Demo") && !game.name.includes("Trial") && !game.name.includes("DEMO")) {
                // I våran conditions, fixa att man undviker demos osv.
                filtered_results.push(game);
            }
        })
        return filtered_results;
    } catch (err) {
        console.log(err)
    }
}

export async function searched_game_information(game_name) {
    try {
        const link = prefix + `games?search=${game_name}&platforms=4,187,18,186&search_precise=true&` + api_key;
        const fetched_searched_game = await (await fetch(link)).json();
        return fetched_searched_game;
    }
    catch (err) {
        console.log(err)
    }
}

async function specific_game_event(event) {

    async function specific_game_search(id) {
        const link = prefix + `games/${id}?` + api_key;

        try {
            const specific_game_fetched = await (await fetch(link)).json();
        } catch (err) {
            console.log(err);
        }
    };

    await specific_game_search("3498"); // Make it so that the game ID is saved somewhere (maybe as a dataset-attribute) and then fetch game information from the API
}





