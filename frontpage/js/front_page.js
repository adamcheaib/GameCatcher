import { fetch_all_games, search_for_game } from "../../utils/fetch_functions.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";
import { game_scroll, genre_scroll } from "../../utils/functions.js";

if (!window.localStorage.hasOwnProperty("username")) {
    window.location.replace("http://localhost:1234/login_register");
}
else {
    if (localStorage.getItem("selected_genre") === null) { // Denna finns för att om en användare är helt ny så ger den automatiskt en selected genre så att spelen inte blir tomma
        localStorage.setItem("selected_genre", "action");
    }
    if (localStorage.getItem("platform_selected") === null) { // Denna finns för att om en användare är helt ny så ger den automatiskt en selected platform så att spelen inte blir tomma
        localStorage.setItem("platform_selected", "4");
    }
    init_frontpage();
    fetch_all_games();
}

export function init_frontpage() {
    document.body.innerHTML = "";

    document.querySelector("link").setAttribute("href", "./frontpage/css/frontpage.css");
    document.body.innerHTML = `
        <div id="frontpage_wrapper">
            <div id="sidebar">
                <div id="main_page"></div>
                <div id="saved"></div>
                <div id="chat"></div>
                <div id="friends"></div>
                <div id="settings"></div>

            </div>


            <div id="center_piece">

                <div id="profile_and_welcome_text">
                    <div id="welcome_text">
                        <h1>Hello ${localStorage.getItem("username")}!</h1>
                        <p>Lets begin todays game browsing</p>
                    </div>

                    <div id="profile_and_welcome_text_wrapper">
                        <div id="search_function"></div>
                        <div id="profile"></div>
                    </div>
                </div>



                <div id="games_section">

                    <div id="genres">
                        <div id="first_arrow">&#8592;</div>
                            <div id="genre_wrapper">
                                <div id="first_genra"></div>
                                <div id="second_genra"></div>
                                <div id="third_genra"></div>
                                <div id="fourth_genra"></div>
                            </div>
                        <div id="second_arrow">&#8594;</div>
                    </div>

                    <div id="platfroms">
                        <div id="platfroms_Text"></div>
                        <div class="wrapper">
                            <div data-id="186" class="platform" id="Xbox"></div>
                            <div data-id="187" class="platform" id="Playstation"></div>
                            <div data-id="7" class="platform" id="Nintendo_Switch"></div>
                            <div data-id="4" class="platform" id="PC"></div>
                        </div>

                    </div>

                    <div id="games">
                        <div id="first_arrow2">&#8592;</div>
                            <div id="games_wrapper">
                                <div class="game_1"></div>
                                <div class="game_2"></div>
                                <div class="game_3"></div>
                                <div class="game_4"></div>
                            </div>
                        <div id="second_arrow2"> &#8594; </div>
                    </div>
                </div>

                <footer>
                    
                </footer>
        </div>

    </div>`;
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);

    document.querySelectorAll("#genre_wrapper div").forEach(genre => {
        genre.addEventListener("click", () => {
            localStorage.removeItem("selected_genre"); // Detta är för att man har clickat på en ny genre
            localStorage.setItem("selected_genre", genre.querySelector(".genre_text").innerHTML);
            game_scroll();
        });
    })


    document.querySelectorAll(".platform").forEach(platform => {
        platform.addEventListener("click", () => {
            localStorage.removeItem("platform_selected");
            localStorage.setItem("platform_selected", platform.dataset.id);
            console.log(localStorage);
            game_scroll();
        })
    })
    genre_scroll();
    game_scroll();

}

const search_icon_button = document.getElementById("search_function");
search_icon_button.addEventListener("click", search_popup);
const dialoger = document.createElement("dialog");

document.body.appendChild(dialoger);

async function search_popup(event) {
    dialoger.showModal();
    dialoger.innerHTML = `
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

    const search_button = document.querySelector("#searchBarContainer > button");

    search_button.addEventListener("click", async (event) => {
        const dom_search_results = document.getElementById("search_results");
        dom_search_results.innerHTML = "<h1 style='color: white'>Getting game list...</h1>";
        const search_results = await search_for_game();
        dom_search_results.innerHTML = "";
        console.log(search_results);
        search_results.forEach(game => {
            const game_box = document.createElement("div");
            game_box.innerHTML = `
            <div class="game_text_wrapper">
                <div class="game_text">${game.name}</div>
                </div>
            </div>`;
            game_box.style.backgroundImage = `url(${game.background_image})`
            game_box.classList.add("gamesSearchResults");
            dom_search_results.appendChild(game_box);
        })

    });

    const close_button = dialoger.querySelector("#dialogCloseButtonContainer > span");
    close_button.addEventListener("click", () => dialoger.close());
}