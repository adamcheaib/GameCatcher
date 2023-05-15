"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "key=7537434a316c4729b0ac0130147be146";
let prefix = "https://api.rawg.io/api/";



async function fetch_all_games(page = 1) { // Fetches games based on genre!
    const link = prefix + `games?page=${page}&` + api_key;
    try {
        const resource = await (await fetch(link)).json();
        console.log(resource);
        return resource;

    } catch (error) {
        alert("Something went wrong!");
    }
};

fetch_all_games();

async function TEST_fetch_genre_games(event) {
    // Fetch genre based on a certain DOM that contains the name of the genre. The name of the genre will be placed within the "genre" variable.
    let genre = "action";
    try {
        const link = prefix + `games?page=1&genres=${genre}&` + api_key;
        const resource = await (await fetch(link)).json();
        console.log(resource);
    } catch (err) {
        console.log(err);
    }
};



async function search_game_event(event) {

    async function search_for_game(game_name) {
        /*
        PC: id 4,
        Nintendo_Switch: id 7,
        Xbox Series X: id 186,
        Playstation 5: id 187
        */
        try {
            const link = prefix + `games?search=${game_name}&platforms=4,187,18,186&search_precise=true&` + api_key;
            const resource = await (await fetch(link)).json();
            console.log(resource);
            resource.results.forEach(game => {
                if (!game.name.includes("Demo") && !game.name.includes("Trial") && !game.name.includes("DEMO")) {
                    // I våran conditions, fixa att man undviker demos osv.
                    console.log(game.name);
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    await search_for_game("The witcher"); // Make it so that the string argument is based on a input field.
};


async function specific_game_event(event) {

    async function specific_game_search(id) {
        const link = prefix + `games/${id}?` + api_key;

        try {
            const specific_game_fetched = await (await fetch(link)).json();
            console.log(specific_game_fetched);
        } catch (err) {
            console.log(err);
        }
    };

    await specific_game_search("3498"); // Make it so that the game ID is saved somewhere (maybe as a dataset-attribute) and then fetch game information from the API
}





