import { fetch_all_games, } from "../../utils/fetch_functions.js";
import { init_forum, stop_all_intervals } from "./forum.js";
import { init_collection } from "./game_collection.js";
import { game_scroll, genre_scroll, registration_notification } from "../../utils/functions.js";
import { init_friends_page } from "./find_friends.js";
import { search_popup } from "./search_game.js";


// Ifall ingen användare är inloggad, skickas besökaren tillbaka till login/register-sidan.
// Annars är man kvar på hemsidan och den selekterar Action som genre och PC som platform per automatik.
if (!window.localStorage.hasOwnProperty("username")) {
    window.location.replace("../login_register");
}
else {
    if (localStorage.getItem("selected_genre") === null && localStorage.getItem("platform_selected") === null) {
        localStorage.setItem("selected_genre", "action");
        localStorage.setItem("platform_selected", "4");
    }
    init_frontpage();
    fetch_all_games();
}


export function init_frontpage() {
    // Används i Forum/Chat sidan för att stoppa forumet/chattens live-funktionalitet.
    stop_all_intervals();

    // Tömmer hela body:n för att ladda frontpage för att inte ha oönskade HTML-element på sidan.
    document.body.innerHTML = "";

    // Laddar frontpage-CSS:et och appendar den nya HTML:n.
    document.querySelector("link").setAttribute("href", "./css/frontpage.css");
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
                        <p>Let's begin todays game browsing</p>
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
                        <div id="currently_shown_games"><h1 id="currently_shown_genre">Action,</h1><h1 id="currently_shown_platform">PC</h1></div>
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
                        
                <div id="general_notifications_container"></div>
                <div id="general_notifications_container_search"></div>
            </div>
        </div>`;

    // Här lägger vi alla navigations funktionerna på sidebaren.
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#friends").addEventListener("click", init_friends_page);
    document.querySelector("#settings").addEventListener("click", show_settings)
    document.querySelector("#profile").addEventListener("click", go_to_own_profile);


    // Laddar alla genre i genre_scroll:n så att man har de från början.
    document.querySelectorAll("#genre_wrapper div").forEach(async genre => {

        // Lägger EventListener så att när man klickar så highlightas den selekterade.
        genre.addEventListener("click", () => {
            localStorage.removeItem("selected_genre"); // Detta är för att man har clickat på en ny genre
            localStorage.setItem("selected_genre", genre.querySelector(".genre_text").innerHTML);
            game_scroll();

            const genre_scroll_names = document.querySelectorAll(".genre_text");
            genre_scroll_names.forEach(genre_dom => {
                const genre_name = genre_dom.textContent;
                if (localStorage.getItem("selected_genre") === genre_name) {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1.15)";
                    genre_dom.parentElement.parentElement.style.border = "2px solid white";
                    document.getElementById("currently_shown_genre").textContent = genre_name + ","
                } else {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1)";
                    genre_dom.parentElement.parentElement.style.border = "none";
                }
            })

        });
    })

    // Kollar om man har en custom-profil bild. Om man inte har det så väljs den default_profile_pic.svg
    if (localStorage.getItem("profile_picture") == "undefined") {
        document.getElementById("profile").style.backgroundImage = `url(../frontpage/general_media/default_profile_pic.svg)`;
    } else {
        document.getElementById("profile").style.backgroundImage = `url(./profile/images/${localStorage.profile_picture})`;
    }

    // Användarens profilbild visas på frontpage.


    // Lägger EventListener så att när man klickar så highlightas den selekterade.
    document.querySelectorAll(".platform").forEach(platform => {

        platform.addEventListener("click", () => {
            localStorage.removeItem("platform_selected");
            localStorage.setItem("platform_selected", platform.dataset.id);
            game_scroll();

            // Kan kanske abstraheras.
            const all_platform_buttons = document.querySelectorAll(".platform");
            all_platform_buttons.forEach(platform_dom => {
                const platform_id = platform_dom.dataset.id;
                const platform_name = platform_dom.id.replace("_", " ");
                if (localStorage.getItem("platform_selected") == platform_id) {
                    platform_dom.style.transform = "scale(1.15)";
                    platform_dom.style.border = "2px solid white";
                    document.getElementById("currently_shown_platform").textContent = platform_name;
                } else {
                    platform_dom.style.transform = "scale(1)";
                    platform_dom.style.border = "none";
                }
            })
        })
    })
    genre_scroll();
    game_scroll();

    // Lägger eventListener på search-knappen.
    const search_icon_button = document.getElementById("search_function");
    search_icon_button.addEventListener("click", search_popup);

}


// Pop-up funktionen för User-Settings.
function show_settings(event) {
    registration_notification("Manage Account", "account_management");
    document.querySelector("#change_username").addEventListener("click", init_changeUserSettings_DOM);
    document.querySelector("#change_password").addEventListener("click", init_changeUserSettings_DOM);

    // Lägger till EventListener till Logout-knappen.
    document.querySelector("#logout").addEventListener("click", () => {
        localStorage.clear();
        window.location.replace("../login_register");
    })
}


// Skapar Input fälten i User-settings om man vill ändra Username eller Lösenord.
function init_changeUserSettings_DOM(event) {
    // Ändra så att man kan ändra mellan "Change Password" och "Change Username" om man redan har klickat på en av dem.
    document.querySelector("#change_username").removeEventListener("click", init_changeUserSettings_DOM)
    document.querySelector("#change_username").addEventListener("mouseover", element => element.target.style.backgroundColor = "rgb(73, 73, 112)")
    document.querySelector("#change_password").removeEventListener("click", init_changeUserSettings_DOM)
    document.querySelector("#change_password").addEventListener("mouseover", element => element.target.style.backgroundColor = "rgb(73, 73, 112)")
    event.target.parentElement.style.height = "45vh"



    let parent = event.target.parentElement;
    let paragraph = document.createElement("p");
    paragraph.setAttribute("id", "changed_message")
    paragraph.textContent = "Enter new value"
    let input = document.createElement("input")
    let button = document.createElement("button")
    button.textContent = "Submit!"

    // Kontrollerar vad det är man vill ändra.
    if (event.target.textContent === "Change Username") {
        button.setAttribute("id", "change_username")
    } else {
        button.setAttribute("id", "change_password")
    }
    parent.append(paragraph);
    parent.append(input);
    parent.append(button)
    button.addEventListener("click", change_username_password)
}


// Skickar de nya värden baserat på om man ändrar Username eller Password. Skickar en request baserat på vad det är man har valt att göra.
function change_username_password(event) {
    let action;
    let check = event.target.id;
    let user = localStorage.getItem("username");
    let changed_value = document.querySelector("input").value;
    console.log(localStorage);

    if (check === "change_username") {
        action = "change_username"
    } else {
        action = "change_password"
    }

    let request = new Request("./profile/php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            username: user,
            new_value: changed_value,
            change: action,
        }),

    });

    fetch(request)
        .then(resource => resource.json())
        .then(data => {
            if (data.action === "Fail") {
                document.getElementById("changed_message").textContent = "Try something else!"
            }
            if (data.action === "change_username") {
                localStorage.setItem("username", changed_value);
                document.getElementById("changed_message").textContent = "Username changed!"
                location.reload();
                console.log(localStorage);

            }
            if (data.action === "change_password") {
                document.getElementById("changed_message").textContent = "Password changed!"
            }
        })
}

// Lägger eventListener på profilen så att man kan gå till sen egen sida.
document.querySelector("#profile").addEventListener("click", go_to_own_profile);
function go_to_own_profile(event) {
    window.location.replace(`./profile?username=${localStorage.getItem("username")}`);
}


