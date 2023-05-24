import { fetch_all_games } from "../../utils/fetch_functions.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";
import { game_scroll, genre_scroll, registration_notification, } from "../../utils/functions.js";
import { init_friends_page } from "./find_friends.js";
import { search_popup } from "./search_game.js";



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
                
                <div id="general_notifications_container"></div>
                <div id="general_notifications_container_search"></div>


                <footer>
                    <button>Logout</button>
                </footer>
        </div>
    </div>`;
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#friends").addEventListener("click", init_friends_page);

    document.querySelectorAll("#genre_wrapper div").forEach(genre => {
        genre.addEventListener("click", () => {
            localStorage.removeItem("selected_genre"); // Detta är för att man har clickat på en ny genre
            localStorage.setItem("selected_genre", genre.querySelector(".genre_text").innerHTML);
            game_scroll();
        });
    })

    document.getElementById("profile").style.backgroundImage = `url(/frontpage/profile/images/${localStorage.getItem("profile_picture")})`

    document.querySelectorAll(".platform").forEach(platform => {
        platform.addEventListener("click", () => {
            localStorage.removeItem("platform_selected");
            localStorage.setItem("platform_selected", platform.dataset.id);
            game_scroll();
        })
    })
    genre_scroll();
    game_scroll();

    const search_icon_button = document.getElementById("search_function");
    search_icon_button.addEventListener("click", search_popup);

    document.querySelector("button").addEventListener("click", () => {
        console.log("click");
        localStorage.clear();
        window.location.replace("./login_register");
    })
}

document.querySelector("#settings").addEventListener("click", show_settings)

function show_settings(event){
    console.log(event);
    registration_notification("Manage Account", "account_management");
    document.querySelector("#change_username").addEventListener("click", new_value);
    document.querySelector("#change_password").addEventListener("click", new_value);

    document.querySelector("#logout").addEventListener("click", ("click", () => {
        console.log("click");
        localStorage.clear();
        window.location.replace("./login_register");
    }))
}

function new_value(event){
    event.target.parentElement.style.height = "40vh"
    let parent = event.target.parentElement;
    let paragraph = document.createElement("p");
    paragraph.setAttribute("id", "changed_message")
    paragraph.textContent = "Enter new value"
    let input = document.createElement("input")
    let button = document.createElement("button")
    button.textContent = "Submit!"

    if(event.target.textContent === "Change Username"){
        button.setAttribute("id", "change_username")
    }else{
        button.setAttribute("id", "change_password")
    }
    parent.append(paragraph);
    parent.append(input);
    parent.append(button)
    button.addEventListener("click", change_username_password)
}

function change_username_password(event){ 
    let action;
    let check = event.target.id;
    let user = localStorage.getItem("username");
    let changed_value = document.querySelector("input").value;
    console.log(localStorage); 

    if(check === "change_username"){
        fetch("../../../../database/users.json")
            .then(resource => resource.json())
            .then(users => {
                for(let i = 0; i < users.length; i++){
                    if(users[i].username === changed_value){
                        document.getElementById("changed_message").textContent = "Username already taken, try another one!"
                        console.log("AJAJAJ");
                        return false;
                    }
                }
            })
            action = "change_username"        
    }else{
        action = "change_password"
    }

    let request = new Request("/frontpage/profile/php/upload.php", {
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
            console.log(data)
            document.getElementById("changed_message").textContent = "Success!"
        })
        localStorage.setItem("username", changed_value);
        //location.reload();
        console.log(localStorage);  
}

