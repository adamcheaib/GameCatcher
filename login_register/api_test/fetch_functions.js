"use strict"

// To control whether an object has a certain key you write: objectName.hasOwnProperty("keyname") <-- Returns TRUE or FALSE.
const fetch_button = document.getElementById("fetch");

// https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496
const api_key = "a25ef91c11654298888f4907971ad496";


const object1 = {
    name: "Adam",
    nationality: "Lebanese"
};


function fetch_games(fetch_object = { count, results, page, page_size }) {
    let link = "https://api.rawg.io/api/platforms?key=a25ef91c11654298888f4907971ad496";
    if (fetch_object.hasOwnProperty("count")) {
        console.log("YAY");
    }
}

fetch_games(object1);