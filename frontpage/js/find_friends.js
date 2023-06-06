import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";
import { loading_screen, registration_notification, remove_loading_screen, } from "../../utils/functions.js";
import { stop_all_intervals } from "./forum.js";

// Laddar friends_pagen.
export async function init_friends_page() {
    stop_all_intervals();

    // Tar bort display_game_dom rutan om man redan har klickat på ett spel sen tidigare.
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }

    // Rensar Friends_list om man har varit inne på forum-sidan.
    if (document.querySelector(".friends_list") !== null) {
        document.querySelector(".friends_list").remove();
    }

    // Tar bort timer:n ifall man har varit inne på forum-sidan.
    if (document.querySelector(".timer_display") !== null) {
        document.querySelector(".timer_display").remove();
    }

    // Ändrar CSS-fil
    document.querySelector("link").setAttribute("href", "./css/friends_page.css");

    // Ändrar center_piece's HTML och justerar sidan så att den får den passande looken.
    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="display"></div>
    `;

    // Anropar funktionen som hämtar den inloggade användarens vänlista och skapar DOMs av dem på direkten efter att man navigerar till sidan.
    show_my_friends()

    document.querySelector("#chat").addEventListener("click", init_forum);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);

}

// Funktionen som skapar DOMs av sin vänlista.
async function show_my_friends(event) {

    document.querySelector("#display").innerHTML = "";

    // Highlightar rätt section man är i. Annars får alla "selected"-klassen och blir gröna.
    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected" ">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="display"></div>
    `;

    let body_for_fetch = {
        the_user: localStorage.getItem("username"),
        find_all_friends: true,
    }
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen()
    }

    // Här kommer en användares vänlista i en array.
    let friend_data = await response.json();

    const friends_display = document.getElementById("display");

    // Om man inte har vänner i sin vänlista så skickas det "undefined". Därför behöver man denna kontrollen.
    if (Array.isArray(friend_data)) {

        // Skapar en dom för varje vän.
        for (let i = 0; i < friend_data.length; i++) {

            let profile_dom = document.createElement("div");
            profile_dom.classList.add("profile_dom");
            profile_dom.innerHTML = `
            
            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${friend_data[i]}</div>
                
                <div class="chat"></div>
                <div class="more_options">...</div>
                </div>
                
                `;

            friends_display.appendChild(profile_dom);
        }
    } else {
        // Om man inte har vänner så står detta istället!
        friends_display.innerHTML = `<h1>No friends in your friendlist</h1>`;
        friends_display.style.color = "black";
    }

    // Appendar profilbilder till varje vän i sin vänlista.
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/chat.svg)`
        profile_pic.addEventListener("click", take_to_chat)
    })


    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)

    // Lägger till eventListener på de "3 punkterna" i varje DOM-element som triggar funktionen "show_options"
    document.querySelectorAll(".more_options").forEach(element => {
        element.addEventListener("click", show_options);
    });
}

// Show_options funktionen visar en ruta där man kan antingen besöka en användarens profil eller blocka dem.
function show_options(event) {
    // Här kontrollerar man vilken sektion man är i sin friends_page.
    if (document.getElementById("my_friends").classList.contains("selected")) {

        registration_notification("Options", "show_options_blocked");
        event.target.parentElement.children[1].classList.add("show_profile");
        document.getElementById("visit_profile").addEventListener("click", visit_profile)
        document.getElementById("block_user").addEventListener("click", block_unblock_user);
        event.target.parentElement.children[1].setAttribute("id", "to_be_blocked");
    } else {
        // Här är vad som sker om man inte på "My friends"-sektionen.
        registration_notification("Options", "show_options_unblocked");
        document.getElementById("unblock_user").addEventListener("click", block_unblock_user);
        event.target.parentElement.children[1].setAttribute("id", "to_be_unblocked");
    }
}

// Funktion för att unblocka eller blocka en användare.
async function block_unblock_user(event) {
    let actions;
    let user;

    // Om man väljer att blocka en användare så får variabeln "actions" värdet "block" och variabeln "user":s värde blir den användaren man har klicakt på.
    if (event.target.id === "block_user") {
        actions = "block";
        user = document.getElementById("to_be_blocked").textContent;
    }

    // Samma sak som tidigare fast här är det om man vill unblocka.
    if (event.target.id === "unblock_user") {
        actions = "unblock";
        user = document.getElementById("to_be_unblocked").textContent;
    }

    // Här skickas objektet baserat på om man vill blocka eller unblocka.
    const block_response = await fetch("./php/find_friend.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: user,
            me: localStorage.getItem("username"),
            action: actions,
        })
    })

    loading_screen();

    if (block_response.ok) {
        remove_loading_screen();
    }

    const data = await block_response.json()

    // Här är resultatet som kommer direkt in efter att man har blockat.
    if (data.action === "block") {
        show_my_friends();
        document.querySelector("dialog").remove();
    }

    // Här är resultatet som kommer direkt in efter att man har unblockat.
    if (data.action === "unblock") {
        init_blocked_users()
        document.querySelector("dialog").remove();
    }

    document.querySelector("#add_friends").addEventListener("click", init_add_friends);
}



// Funktionen för att skicka en friend-request.
async function send_friend_request(event) {
    // Plockar ut användarnamnet på den användaren man har klickat på.
    let username = event.target.parentElement.querySelector(".username").innerHTML;

    // Skapar ett objekt som innehåller vem det är som skickar requesten (AKA den inloggade) och vilken användare det är man vill adda.
    let body_for_fetch = {
        user_that_wants_to_befriend: localStorage.getItem("username"),
        the_request_user: username,
    }

    // Skickar den där uppe.
    // Denna ska antingen justeras här eller i dokumentationen att det står rätt METHOD.
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen()
    }

    event.target.parentElement.remove();

    let data = await response.json();
}


// Funktionen för att söka efter en vän att lägga till som vän.
async function find_user() {
    document.querySelector("#display").innerHTML = "";
    // Använder sen av valuen man har skrivit in för att söka.
    let find_account_name = document.querySelector("input").value;

    // Plockar ut den inloggade användarens användarnamn och skickar det i en GET-request.
    let request_account_name = localStorage.getItem("username");
    let response = await fetch(`./php/find_friend.php?find_account_name=${find_account_name}&request_account_name=${request_account_name}`);
    let account_data = await response.json();



    // Hämtar en fetch som hämtar en användarens alla användare för att sedan kontrollera om den redan finns så att man inte kan skicka request till samma!
    let response_for_all_friends = await fetch(`./php/find_friend.php`, {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({ the_user: localStorage.getItem("username"), find_all_friends: true })
    });

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    } else {
        remove_loading_screen();
    }

    let all_friends_of_user = await response_for_all_friends.json();
    // let the_check = "";
    for (let i = 0; i < account_data.length; i++) {

        let image_name = "";
        if (account_data[i].username !== localStorage.getItem("username")) {
            // Kollar att den man är loggad in som inte finns med  i account_data så att man inte kan adda sig själv
            if (account_data[i].profile_picture == "undefined") {
                image_name = "./general_media/default_profile_pic.svg";
            } else {
                account_data[i].profile_picture = "./profile/images/" + account_data[i].profile_picture;
                image_name = account_data[i].profile_picture;


            }
            loading_screen();
            let responses = await fetch(`../database/users.json`);

            if (responses.ok) {
                remove_loading_screen();
            } else {
                remove_loading_screen();
                alert("Something went wrong!");
            }

            let users = await responses.json();
            for (let j = 0; j < users.length; j++) {
                // Kontrollerar ifall en användare är blockat av den som är inloggad eller vice-versa.
                if (users[j].hasOwnProperty("blocked")) {
                    if (users[j].username === localStorage.getItem("username")) {
                        if (users[j].blocked.includes(account_data[0].username)) {
                            return;
                        }
                    }
                }
            }

            // Skapar en DOM av sökresultatet baserat på de kontrollerna som sker längre upp.
            let profile_dom = document.createElement("div");
            profile_dom.classList.add("profile_dom");
            profile_dom.innerHTML = `

            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${account_data[i].username}</div>
                
                <div class="add_friend">Add Friend</div>
                <div class="block_friend">Block</div>
            </div>

            `;


            // Appendar och fixar profilbilden.
            document.querySelector("#display").appendChild(profile_dom);
            const profile_pic = profile_dom.querySelector(".profile_picture");
            profile_pic.style.backgroundImage = `url(${image_name})`;
            profile_pic.style.borderRadius = "50%";


            document.querySelectorAll(".add_friend").forEach((add_btn) => {
                add_btn.addEventListener("click", send_friend_request);
            })

            // Kollar ifall den inloggade användaren redan har någon av konton i sökresultatet redan finns i sin vänlista
            document.querySelectorAll(".username").forEach(username => {
                for (let i = 0; i < all_friends_of_user.length; i++) {
                    if (username.textContent === all_friends_of_user[i]) {
                        profile_dom.remove();
                    }

                }
            })
        }

    }
}

// Funktionen som visar pending friend requests.
async function get_all_pending_friend_requests(event) {
    document.querySelector("#center_piece").innerHTML = ""

    // Visar rätt vald sektion av #friends sidan.
    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
                <div id="my_friends" class="unselected">My Friends</div>
                <div id="add_friends" class="unselected">Add Friends</div>
                <div id="pending" class="selected">Pending</div>
                <div id="blocked" class="unselected">Blocked</div>
            </div>
            <div id="search_wrapper">
                <input id="search"></input>
                <div id="search_image"></div>
            </div>
            <div id="display"></div>
        `;


    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)

    let username = localStorage.getItem("username");

    // Skapar ett objekt som innehåller den inloggade användarens användarnamn och action på vad det är man vill göra.
    let body_for_fetch = {
        all_pending: "get_all_pending",
        the_request_user: username,
    }

    // Skickar objektet från ovan.
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let data = await response.json();

    // Skapar en DOM av varje pending request.
    for (let i = 0; i < data.length; i++) {
        let pending_dom = document.createElement("div");
        pending_dom.classList.add("pending_wrapper")
        pending_dom.innerHTML = `
            <div class="profile_picture"></div>
            <div class="account_username_pending">${data[i]}</div>
            <div class="wrapper_for_alternatives">
                <div class="accept">Accept</div>
                <div class="decline">Decline</div>
            </div>
        `;

        document.querySelector("#display").appendChild(pending_dom);

        // Lägger en profilbild för varje.
        document.querySelectorAll(".profile_picture").forEach(pic => {
            pic.style.backgroundImage = "url(./general_media/default_profile_pic.svg)";
        })

        // Gör så att man kan acceptera requesten.
        document.querySelectorAll(".accept").forEach(accept_btn => {
            accept_btn.addEventListener("click", add_friend)
        });

        // Gör så att man kan decline requesten.
        document.querySelectorAll(".decline").forEach(decline_btn => {
            decline_btn.addEventListener("click", decline_friend)
        });
    }
}


// Laddar add_friends requesten sidan.
function init_add_friends() {
    document.querySelector("#display").innerHTML = "";
    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
            <div id="my_friends" class="unselected">My Friends</div>
            <div id="add_friends" class="selected">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="search_wrapper">
            <input id="search"></input>
            <div id="search_image"></div>
        </div>
        <div id="display"></div>
        `;
    document.querySelector("#search_image").addEventListener("click", find_user)
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
}

// Funktionen som skickar själva requesten.
async function add_friend(event) {
    // Plockar ut namnet på användarnamnet den användaren man vill lägga till.
    let added_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;

    // Lägger till användarens username i objektet som skickas sedan för att lägga till request.
    let body_for_fetch = {
        added_friend_username: added_friend_username,
        the_username: localStorage.getItem("username"),
        accepted_friend_request: true,
    }

    // Skickar friend requesten med användarnamnet till find_friend.php
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    loading_screen();


    // Tar bort själva den DOM:en som visar den användaren man har skickat friend-request på.
    event.target.parentElement.parentElement.remove();
    let data = await response.json();

    // Denna fetch behövs för att man måste skicka till user:n som skickas dvs så att den andre får requesten. 

    let a_fetch_body = {
        logged_in_user: localStorage.getItem("username"),
        added_friend_username2: event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML,
        send_back_for_user_that_sent_friend_req: true,
    };

    let response2 = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a_fetch_body)
    });


    if (response.ok && response2.ok) {
        remove_loading_screen();
    }

    let data2 = await response2.json();

}


// Funktionen som används för att declina en request.
async function decline_friend(event) {
    // Plockar ut användarens användarnamn.
    let declined_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;

    // Lägger till användarens (username) som man har nekat och den inloggade användaren (username) för att sedan skicka i en fetch.
    let body_for_fetch = {
        declined_friend_username: declined_friend_username,
        the_username: localStorage.getItem("username"),
    }

    // Skickar fetchen med objektet från ovan.
    let response = await fetch("./php/find_friend.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let data = response.json();

    // Tar bort DOM:n som visar den användaren som man har en pending request från.
    event.target.parentElement.parentElement.remove();
}

// Visar de användarna som är blockade. BEHÖVAR FIXAS!
async function init_blocked_users(event) {
    document.querySelector("#display").innerHTML = "";

    // Gör så att rätt sektion man har navigerat till är highlighted.
    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
        <div id="my_friends" class="unselected">My Friends</div>
        <div id="add_friends" class="unselected">Add Friends</div>
        <div id="pending" class="unselected">Pending</div>
        <div id="blocked" class="selected">Blocked</div>
    </div>
            <div id="display"></div>
        `;


    // Gör så att man kan navigera tillbaka till de tidigare sektionerna.
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    let response = await fetch(`../database/users.json`);

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let users = await response.json();

    // Gör en DOM element av alla användarna som man har blockat.
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === localStorage.getItem("username")) {
            users[i].blocked.forEach(element => {
                let profile_dom = document.createElement("div");
                profile_dom.textContent = element
                profile_dom.classList.add("profile_dom");
                profile_dom.innerHTML = `

            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${element}</div>
                
                <div class="more_options">...</div>
            </div>

            `;
                document.querySelector("#display").appendChild(profile_dom);
            });
        }
    }

    // Laddar deras profilbilderna.
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/chat.svg)`
    })
    document.querySelectorAll(".more_options").forEach(element => {
        element.addEventListener("click", show_options);
    });
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
}

// Gör så att när man klickar på chatknappen i sin vänlista så tas man till live-chatten.
function take_to_chat(event) {
    let user = event.target.parentElement.children[1].textContent;
    init_forum(user)
}

// Gör så att man kan besöka 
async function visit_profile(event) {

    let user_profile = document.querySelector(".show_profile").textContent;

    window.location.replace("./profile?username=" + user_profile);
}