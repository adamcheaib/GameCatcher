import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js"; // Orsakar dublett i game_scroll pga att den körs två gånger
import { genre_scroll } from "../../utils/functions.js";


if (!localStorage.hasOwnProperty("username")) {
    window.location.replace("http://localhost:1234/login_register");
} 
else{
    init_frontpage()
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
                        <div id="platfroms_Text">Platforms</div>
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
                                <div id="first_game"></div>
                                <div id="second_game"></div>
                                <div id="third_game"></div>
                                <div id="fourth_game"></div>
                            </div>
                        <div id="second_arrow2"> &#8594; </div>
                    </div>
                </div>

                <footer>
                    Footer
                </footer>
        </div>

    </div>`;
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);
    
    document.querySelectorAll("#genre_wrapper div").forEach(genre =>{
        genre.addEventListener("click", () =>{
            localStorage.removeItem("selected_genre"); // Detta är för att man har clickat på en ny genre
            localStorage.setItem("selected_genre", genre.querySelector(".genre_text").innerHTML);
            console.log(localStorage);
        });
    })

    document.querySelectorAll("#games_wrapper").forEach(game =>{
        game.addEventListener("click", () =>{
            console.log("click");
        });
    })

    document.querySelectorAll(".platform").forEach(platform =>{
        platform.addEventListener("click", () =>{
            localStorage.setItem("platform_selected", platform.dataset.id)
            console.log(localStorage);
        })
    })
    genre_scroll();
    game_scroll();
    
}

