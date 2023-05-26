import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";

// Laddar den nuverande inloggade användarens game_collection.
export async function init_collection() {
    localStorage.setItem("where_att", "game_collection");

    // Om display_game_dom inte existerar så tar den bort hela elementet.
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }

    // Tar bort friends-list om man skulle gå till game_collection sidan. Finns här för att undvika buggen.
    if (document.querySelector(".friends_list") !== null) {
        document.querySelector(".friends_list").remove();
    }

    // Laddar rätt CSS-fil.
    document.querySelector("link").setAttribute("href", "./css/collection.css");

    // Ändrar själva HTML-elementen i center_piece HTML-elementet så att man får game_collection-looken.
    document.querySelector("#center_piece").innerHTML = `

        <div class="collection_header">Ya games</div>
        <div class="collection_grid_container"></div>
        <div class="clear_button">Clear</div>
    
    `
    // Fetchen här hämtar användarens favorit-spel dvs de som man har tryckt gilla på.
    let response = await fetch(`./php/game_collection.php?username=${localStorage.getItem("username")}`);
    let collection_data = await response.json();

    // Laddar alla spelen som har gillats av användaren och skapar HTML-element av dem.
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

    // Lägger EventListener på sidebar-knapparna så att man kan navigera tillbaka till de olika sidorna.
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)

    // Gör så att trash-knappen i game_collection tar bort själva spelet från användarens gillade-spel och tar bort HTML-elementet som finns för det spelet i game_collection.
    document.querySelectorAll(".delete_button_for_game").forEach((button) => {
        button.addEventListener("click", async () => {
            button.parentElement.parentElement.remove();
            let body_for_fetch = {
                username: localStorage.getItem("username"),
                the_game_to_delete: button.parentElement.querySelector("p").innerHTML,
            }
            let response = await fetch("./php/game_collection.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body_for_fetch),
            });
            let data = await response.text();
        })
    })

    document.querySelector(".clear_button").addEventListener("click", clear_all_games)
}

// Funktionen som clearar hela sin game_collection.
async function clear_all_games() {
    let response = await fetch("./frontpage/php/game_collection.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: localStorage.getItem("username") })

    })

    let data = await response.json();
    document.querySelector(".collection_grid_container").innerHTML = "";
}

document.querySelector("#saved").addEventListener("click", init_collection)
