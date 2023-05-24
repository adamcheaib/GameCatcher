import { search_for_game } from "../../utils/fetch_functions.js";
import { searched_game_information } from "../../utils/fetch_functions.js";
import { general_notifications, general_notifications_search } from "../../utils/functions.js";

export async function search_popup(event) {
    if (document.querySelector(".display_game_dom") != null) {
        document.querySelector(".display_game_dom").remove(); // Tar bort spel informationen (som finns till höger) om man har klickat på ett spel utanför search function
    }
    const dialog_dom = document.createElement("dialog");
    document.body.appendChild(dialog_dom);
    dialog_dom.id = "search_dialog";
    dialog_dom.showModal();
    dialog_dom.innerHTML = `
        <div>
            <div id="dialogCloseButtonContainer">
                <span>X</span>
            </div>
            
            <div id="searchBarContainer">
                <input type="text" placeholder="Search for games..."><button>Search</button>
            </div>
    
            <div id="search_results"></div>
        </div>
        `;

    async function init_search(event) {
        const dom_search_results = document.getElementById("search_results");
        dom_search_results.innerHTML = "<h1 id='search_status'>Getting game list...</h1>";
        const search_results = await search_for_game();

        if (search_results.length != 0) {
            console.log(search_results);

            dom_search_results.innerHTML = "";
            search_results.forEach(game => {
                const game_box = document.createElement("div");
                game_box.innerHTML = `
                    <div class="game_text_wrapper">
                        <div class="game_text">${game.name}</div>
                        </div>
                    </div>`;

                game_box.style.backgroundImage = `url(${game.background_image})`
                game_box.classList.add("gamesSearchResults");
                game_box.addEventListener("click", display_searched_game_information);

                async function display_searched_game_information(event) {
                    const searched_game_dialog = document.createElement("dialog");
                    let response = await searched_game_information(game.name);

                    let the_clicked_game = response.results[0];

                    let the_ratings = "";

                    if (the_clicked_game.ratings.length === 0) {
                        the_ratings = "This game has no Rating";
                    } else {
                        for (let i = 0; i < the_clicked_game.ratings.length; i++) {
                            the_ratings += `<div class="rating">${the_clicked_game.ratings[i].percent}</div>`;

                        }
                    }

                    console.log(the_clicked_game);

                    searched_game_dialog.id = "searched_game_dialog";
                    searched_game_dialog.innerHTML = `
                        <div class="searched_game_information">

                            <div id="add_to_collection_container">
                                <div id="liked_games_button">Add to liked games</div>
                                <div class="search_game_dialog_close_button">X</div>
                            </div>
                        
                            <h2>${the_clicked_game.name}</h2>
                            <div id="gmage" class="searched_game_image" style="background-image: url(${game.background_image})"></div>
                            
                            <div id="gext" class="searched_game_text">
                                This game is really good wow i really like it, dam it makes me feel  pretty cool. I like Minecraft.
                            </div>
                        
                            <div id="rating_header">Rating</div>
                        
                                <div id="wrapper_ratings">
                                    ${the_ratings}
                                </div>
                        
                            <div id="rating_names_wrapper">
                                <div class="rating_name">${1}</div>
                            </div>                       

                            <div id="gameplay"></div>
                        </div> 
                        `

                    dialog_dom.appendChild(searched_game_dialog);
                    searched_game_dialog.showModal();
                    document.querySelector("#liked_games_button").addEventListener("click", async (event) => {

                        const parentNode = event.target.parentNode;
                        const notification = document.createElement("span");
                        parentNode.insertBefore(notification, parentNode.querySelector("h2"));
                        notification.id = "game_collection_notification";
                        notification.style.gridColumn = "1 / 3";
                        notification.style.textAlign = "center";

                        if (event.target.textContent === "Add to liked games") {
                            let send_object = {
                                name: the_clicked_game.name,
                                image: the_clicked_game.background_image,
                                username: localStorage.getItem("username"),
                            };
                            fetch("../frontpage/php/game_collection.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(send_object),
                            }).then(r => r.json()).then(data => {
                                console.log(data);
                                console.log("Helo!");
                            });

                            notification.textContent = "Added to your list!";
                            notification.style.color = "lightgreen";
                            notification.style.fontWeight = "bold";
                            console.log(parentNode);
                            event.target.textContent = "Remove game from your list";

                            event.target.style.pointerEvents = "none";
                            event.target.style.opacity = "40%";

                            setTimeout(() => { event.target.style.pointerEvents = "all"; event.target.style.opacity = "100%"; notification.remove() }, 3000);
                        } else {
                            let body_for_fetch = {
                                username: localStorage.getItem("username"),
                                the_game_to_delete: localStorage.getItem("selected_game"),
                            }

                            let response = await fetch("./frontpage/php/game_collection.php", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body_for_fetch),
                            });

                            notification.textContent = "Removed from your list!";
                            notification.style.color = "red";
                            notification.style.fontWeight = "bold";
                            event.target.textContent = "Add to liked games";

                            event.target.style.pointerEvents = "none";
                            event.target.style.opacity = "40%";

                            setTimeout(() => { event.target.style.pointerEvents = "all"; event.target.style.opacity = "100%"; notification.remove() }, 3000);
                        }

                    });
                    document.querySelector(".search_game_dialog_close_button").addEventListener("click", (event) => searched_game_dialog.remove());
                }

                dom_search_results.appendChild(game_box);
            })
        } else {
            dom_search_results.innerHTML = "<h1 id='search_status'>No games were found...</h1>";
        }
    }

    const searchfield_input = document.querySelector("#searchBarContainer > input");
    searchfield_input.addEventListener("keyup", async (event) => {
        if (event.key === "Enter") {
            init_search();
        };
    });

    const search_button = document.querySelector("#searchBarContainer > button");
    search_button.addEventListener("click", init_search);

    const close_button = dialog_dom.querySelector("#dialogCloseButtonContainer > span");
    close_button.addEventListener("click", () => dialog_dom.remove());

}

