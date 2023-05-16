import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";

export async function init_collection() {
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    document.querySelector("link").setAttribute("href", "./frontpage/css/collection.css");

    document.querySelector("#center_piece").innerHTML = `

        <div class="collection_header">Ya games</div>
        <div class="collection_grid_container"></div>
        <div class="clear_button">Clear</div>
    
    `
    let response = await fetch(`./frontpage/php/game_collection.php?username=${localStorage.getItem("username")}`);
    let collection_data = await response.json();

    for (let i = 0; i < collection_data.length; i++) {
        let a_favorite_game_dom = document.createElement("div");
        a_favorite_game_dom.classList.add("collection_game");
        a_favorite_game_dom.style.backgroundImage = `url(${collection_data[i].image})`;
        document.querySelector(".collection_grid_container").appendChild(a_favorite_game_dom);
    }

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
}

document.querySelector("#saved").addEventListener("click", init_collection)
