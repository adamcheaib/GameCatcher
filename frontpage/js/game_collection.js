import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";

export async function init_collection() {
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    if (document.querySelector(".friends_list") !== null) {
        document.querySelector(".friends_list").remove();
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
        a_favorite_game_dom.innerHTML = `
            
            <div class="text_for_game_collection_box">
                <p>${collection_data[i].name}</p>
                <div class="delete_button_for_game"></div>
            </div>
    
        `;
        a_favorite_game_dom.setAttribute("id", `${collection_data[i].name}`)
        a_favorite_game_dom.style.backgroundImage = `url(${collection_data[i].image})`;
        document.querySelector(".collection_grid_container").appendChild(a_favorite_game_dom);
    }

    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)

    document.querySelectorAll(".delete_button_for_game").forEach((button) => {
        button.addEventListener("click", async () => {
            button.parentElement.parentElement.remove();
            let body_for_fetch = {
                username: localStorage.getItem("username"),
                the_game_to_delete: button.parentElement.querySelector("p").innerHTML,
            }
            console.log(body_for_fetch.the_game_to_delete);
            let response = await fetch("./frontpage/php/game_collection.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body_for_fetch),
            });
            let data = await response.text();
            console.log(data);
        })
    })

}

document.querySelector("#saved").addEventListener("click", init_collection)
