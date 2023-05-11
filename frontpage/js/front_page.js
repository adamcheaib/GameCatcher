import { init_forum } from "./forum.js";
// import { init_collection } from "./game_collection.js"; // Orsakar dublett i game_scroll pga att den körs två gånger
import { genre_scroll } from "../../utils/functions.js";


if (!localStorage.hasOwnProperty("username")) {
    window.location.replace("http://localhost:1234/login_register");
} else {
    init_frontpage();
}
// Hello

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
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing</p>
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
                            <div class="platform" id="platfrom_1"></div>
                            <div class="platform" id="platfrom_2"></div>
                            <div class="platform" id="platfrom_3"></div>
                            <div class="platform" id="platfrom_4"></div>
                        </div>

                    </div>

                    <div id="games">
                        <div id="first_arrow">=Z</div>
                        <div id="first_game"></div>
                        <div id="second_game"></div>
                        <div id="third_game"></div>
                        <div id="fourth_game"></div>
                        <div id="second_arrow"> Z= </div>
                    </div>
                </div>

                <footer>
                    Footer
                </footer>
        </div>

    </div>`;
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    genre_scroll();
}
