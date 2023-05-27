import { search_for_game } from "../../utils/fetch_functions.js";
import { searched_game_information } from "../../utils/fetch_functions.js";



// Den här functionen gör att man får popup rutan med sökfältet när man klickar på förstornings glaset i frontpage
export async function search_popup(event) {

    // Tar bort display_game_dom ifall det redan finns en om ett vist spel.
    if (document.querySelector(".display_game_dom") != null) {
        document.querySelector(".display_game_dom").remove(); // Tar bort spel informationen (som finns till höger) om man har klickat på ett spel utanför search function
    }

    // Fixa en funktion som skapar en dialog element istället och sedan kan man ändra dens innerHTML.
    // Men här skapas en dialog-element som vi sedan pillar med dens innerHTML.
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

    // Anropar search_funktionen som söker efter det man har angivit i input-fielden och fixar designen, resultatet, eventListeners osv...
    init_search();
    const searchfield_input = document.querySelector("#searchBarContainer > input");

    // Att init_search söks om man skulle trycka på Enter-knappen.
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


async function init_search() {

    // Selekterar dialog-elementet som har skapats. 
    let dialog_dom = document.querySelector("#search_dialog");
    const dom_search_results = document.getElementById("search_results");
    dom_search_results.innerHTML = "<h1 id='search_status'>Getting game list...</h1>";
    const search_results = await search_for_game();

    // Om sökresultatet inte är noll, så visas resultatet.
    if (search_results.length != 0) {

        dom_search_results.innerHTML = "";
        search_results.forEach(game => {

            // Här skapas varje div för varje spel som kommer med sökresultatet.
            const game_box = document.createElement("div");
            game_box.innerHTML = `
                <div class="game_text_wrapper">
                    <div class="game_text">${game.name}</div>
                    </div>
                </div>`;

            game_box.style.backgroundImage = `url(${game.background_image})`
            game_box.classList.add("gamesSearchResults");
            game_box.addEventListener("click", display_searched_game_information);

            // Funktionen som visar ett spels information när man väl har klickat på den och att man kan gilla spelet osv.
            async function display_searched_game_information(event) {
                // Hämtar sökresultatet.
                let response = await searched_game_information(game.name);
                let the_clicked_game = response.results[0];

                const user_favorite_library = await (await fetch("../login_register/php/user_database.php", {
                    method: "PATCH",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ username: localStorage.getItem("username"), action: "favorite_library" })
                })).json();

                // Skapar Dialog-elementet.
                const searched_game_dialog = document.createElement("dialog");

                let the_ratings = "";

                // Här skapar den element för ratings för spelet. Den baseras på hur många ratings det finns för varje spel.
                if (the_clicked_game.ratings.length === 0) {
                    the_ratings = "This game has no Rating";
                } else {
                    for (let i = 0; i < the_clicked_game.ratings.length; i++) {
                        the_ratings += `<div class="rating">${the_clicked_game.ratings[i].percent}</div>`;

                    }
                }

                const random_gameplay_image = the_clicked_game.short_screenshots[Math.floor(Math.random() * the_clicked_game.short_screenshots.length)].image;

                // Skapar DOM-element för varje spel med sin rätt information dvs namnet, ratings, knappen för att gilla spelet osv.
                searched_game_dialog.id = "searched_game_dialog";
                searched_game_dialog.innerHTML = `
                <div class="searched_game_information">
                
                <div id="add_to_collection_container">
                <div id="liked_games_button">Add to liked games</div>
                <div class="search_game_dialog_close_button">X</div>
                </div>
                
                <h2>${the_clicked_game.name}</h2>
                <div id="image" class="searched_game_image" style="background-image: url(${game.background_image})"></div>
                
                
                
                <div id="rating_header">Rating</div>
                
                <div id="wrapper_ratings">
                ${the_ratings}
                </div>
                
                
                <div id="gameplay" style="background-image: url(${random_gameplay_image})"></div>
                </div> 
                `;


                // Appendar elementet till body:n
                dialog_dom.appendChild(searched_game_dialog);
                // Gör så att dialog:en visas.
                searched_game_dialog.showModal();
                const like_or_remove_button = document.getElementById("liked_games_button");

                // Ändrar så att like-knappen ändras till "Remove game from collection"
                user_favorite_library.fav_games.forEach(game => {
                    if (game.name === the_clicked_game.name) {
                        like_or_remove_button.textContent = "Remove game from collection";
                    }
                })

                // Denna fixar så att knappens innehåll ska vara rätt dvs om man ska "remove game" eller "add to liked games"
                document.querySelector("#liked_games_button").addEventListener("click", async (event) => {
                    const parentNode = event.target.parentNode;
                    const notification = document.createElement("span");
                    parentNode.insertBefore(notification, parentNode.querySelector("h2"));
                    notification.id = "game_collection_notification";
                    notification.style.gridColumn = "1 / 3";
                    notification.style.textAlign = "center";

                    // Baserat på textContenten på knappen så fetchas olika. Om det är "Add to liked games" så skickas den till användarens favorit-spel.
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
                        // Detta disablar eventListeners på knappen så att man inte kan spamma knappen och orsaka errors.
                        setTimeout(() => { event.target.style.pointerEvents = "all"; event.target.style.opacity = "100%"; notification.remove() }, 3000);
                    } else {
                        // Om det står "Remove from game collection" så tar den bort spelet från användarens favorit-spel.
                        let body_for_fetch = {
                            username: localStorage.getItem("username"),
                            the_game_to_delete: the_clicked_game.name,
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
                        // Detta disablar eventListeners på knappen så att man inte kan spamma knappen och orsaka errors.
                        setTimeout(() => { event.target.style.pointerEvents = "all"; event.target.style.opacity = "100%"; notification.remove() }, 3000);
                    }

                });
                document.querySelector(".search_game_dialog_close_button").addEventListener("click", (event) => searched_game_dialog.remove());
            }
            // Appendar varje spels "box" till sökresultatet.
            dom_search_results.appendChild(game_box);
        })
    } else {
        // Om sök resultatet är 0 så visas detta istället.
        dom_search_results.innerHTML = "<h1 id='search_status'>No games were found...</h1>";
    }
}


function show_game_display_dom(game_data) {
    let the_dom = document.createElement("div");
    the_dom.classList.add("display_game_dom");
    let the_parent_dom = document.querySelector("#frontpage_wrapper");

    the_dom.innerHTML = `
    <div id="like_and_close_container">
        <div id="liked_games_button">Add to liked games</div>
        <span id="game_information_close_button">X</span>
    </div>

        <h2>${game_data.name}</h2>
        <div id="game_image"></div>
        <div id="rating_header">Rating</div>
        <div id="wrapper_ratings">
            <div class="rating">${game_data.ratings[0].percent}</div>
            <div class="rating">${game_data.ratings[1].percent}</div>
            <div class="rating">${game_data.ratings[2].percent}</div>
        </div>
        <div id="rating_names_wrapper">
            <div class="rating_name">${game_data.ratings[0].title}</div>
            <div class="rating_name">${game_data.ratings[1].title}</div>
            <div class="rating_name">${game_data.ratings[2].title}</div>
        </div>
        <div id="gameplay"></div>
    `;

    let counter_for_interval = [1]; // behöver passa by refrence för att den sen ska kunna resetas
    the_parent_dom.appendChild(the_dom);
    document.querySelector("#gameplay").style.backgroundImage = `url(${game_data.short_screenshots[counter_for_interval].image})`
    setInterval(() => {
        counter_for_interval[0] += 1;
        // document.querySelector("#gameplay").style.backgroundImage = `url(${game_data.short_screenshots[counter_for_interval].image})`
        if (counter_for_interval[0] === game_data.short_screenshots.length - 1) {
            counter_for_interval[0] = 1
        }
    }, 3000);
    document.querySelector("#liked_games_button").addEventListener("click", async (event) => {

        const parentNode = event.target.parentNode;
        const notification = document.createElement("span");
        parentNode.insertBefore(notification, parentNode.querySelector("h2"));
        notification.id = "game_collection_notification";

        if (event.target.textContent === "Add to liked games") {
            let send_object = {
                name: game_data.name,
                image: game_data.background_image,
                username: localStorage.getItem("username"),
            };
            fetch("../frontpage/php/game_collection.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(send_object),
            }).then(r => r.json()).then(data => {
                console.log(data);
                general_notifications();
            });

            notification.textContent = "Added to your list!";
            notification.style.color = "green";
            notification.style.gridRow = "2";
            notification.style.gridColumn = "1 / 4";
            notification.style.justifySelf = "center";
            console.log(parentNode);
            event.target.textContent = "Remove game from your list";

            event.target.style.pointerEvents = "none";

            setTimeout(() => { event.target.style.pointerEvents = "all"; notification.remove() }, 2000);
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
            notification.style.gridRow = "2";
            notification.style.gridColumn = "1 / 4";
            notification.style.justifySelf = "center";
            event.target.textContent = "Add to liked games";

            event.target.style.pointerEvents = "none";

            setTimeout(() => { event.target.style.pointerEvents = "all"; notification.remove() }, 2000);
        }

    });
    document.querySelector("#game_image").style.backgroundImage = `url(${game_data.background_image})`;
    document.getElementById("game_information_close_button").addEventListener("click", () => {
        document.querySelector(".display_game_dom").remove();
        document.querySelectorAll("#games_wrapper > div").forEach(game_dom => {
            game_dom.style.border = "none";
            game_dom.style.transform = "scale(1)";
            game_dom.addEventListener("mouseover", function hej(event) { event.target.parentElement.style.transform = "scale(1.1)" });
            game_dom.addEventListener("mouseout", event => event.target.parentElement.style.transform = "scale(1)");
        })
    });

}