import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";


export async function init_friends_page() {



    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    document.querySelector("link").setAttribute("href", "./frontpage/css/friends_page.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div class="selected" ">Add Friends</div>
            <div class="unselected" >Pending</div>
            <div class="unselected" >Blocked</div>
        </div>
        <div id="search_wrapper">
            <input id="search"></input>
            <div id="search_image"></div>
        </div>
        <div id="display"></div>
    
    `;

    document.querySelector("#search_image").addEventListener("click", find_friend);
}

async function find_friend() {
    let account_name = document.querySelector("input").value;
    let response = await fetch(`./frontpage/php/find_friend.php?account_name=${account_name}`);
    let account_data = await response.text();
    console.log(account_data);
}

document.querySelector("#main_page").addEventListener("click", init_frontpage);
document.querySelector("#chat").addEventListener("click", init_forum)
document.querySelector("#saved").addEventListener("click", init_collection);
