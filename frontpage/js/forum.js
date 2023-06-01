import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";
import { loading_screen, remove_loading_screen } from "../../utils/functions.js";

let all_intervals = []; // Intervall-array som används senare för att cleara alla intervals.

export function init_forum(user) {

    // Tar bort display_game_dom-rutan om man hade klickat på ett spel tidigare.
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }

    document.querySelector("#chat").removeEventListener("click", init_forum);
    document.querySelector("link").setAttribute("href", "./css/forum.css");

    // Skapar DOM-elementen för containern för vänlistan.
    let friends_list = document.createElement("div");
    friends_list.classList.add("friends_list");
    let timer_display_dom = document.createElement("div");
    timer_display_dom.classList.add("timer_display");
    timer_display_dom.innerHTML = `
        <div class="timer_counter">10</div>
        <div class="fetch_chat_now_btn">Refresh Chat</div>
    `;
    document.querySelector("#frontpage_wrapper").appendChild(timer_display_dom);
    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display"></div>
        <textarea></textarea>
        <button id="send">Send</button>
    `;

    // Denna bit kod gör så att det inte appendas fler timer displays om man klickar på forum knappen
    if (document.querySelectorAll(".timer_display").length >= 2) {
        document.querySelectorAll(".timer_display")[1].remove();
    }

    document.querySelector("#frontpage_wrapper").appendChild(friends_list)

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    // Här anropas funktionen som skapar en DOM-element för varje vän man har i sin vänlista. Ger varje vän-DOM en eventListener för att fetcha chatter.
    get_all_friends(user);

    // Gör så att man kan börja skicka meddelanden.
    init_send_message_functionality();
    document.getElementById("send").disabled = true;
}


async function get_all_friends(user) {

    // Lagrar inloggade användarens username i objektet som ska skickas till find_friends.php
    let body_for_fetch = {
        the_user: localStorage.getItem("username"),
        find_all_friends: true,
    }

    // Skickar fetchen tillsammans med body:n till find_friends.php och in i respektiv if-sats som kollar om nyckeln "find_all_friends" (i PHP-filen) 
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let friend_data = await response.json();

    // Skapar dom för alla vänner i sin friends-list och appendar deras användarnamn till div:en som har klassen "username".
    for (let i = 0; i < friend_data.length; i++) {
        let profile_dom = document.createElement("div");
        profile_dom.classList.add("profile_dom");
        profile_dom.innerHTML = `
            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${friend_data[i]}</div>
            </div>
        `;
        document.querySelector(".friends_list").appendChild(profile_dom);
    }

    // Lägger default profile picture för alla profiler i vänlistan.
    document.querySelectorAll(".profile_picture").forEach((profile_pic) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })

    // Ger allt i account elementen inuti forumet ett click event så det inte är bara en del som kan clickas
    the_whole_juser_element_gets_click_event(user);
}

// Ett försök till att ge hela profile_dom eventListener och inte bara själva rutan.
export async function the_whole_juser_element_gets_click_event(user) {
    document.querySelectorAll(".profile_dom").forEach(async (profile_dom, index) => {
        profile_dom.classList.add("unselected");
        // per klick av profile_dom så skapas det en interval men samtidgt så clears det i början så att det inte blir så att fler kör samtidgt
        profile_dom.addEventListener("click", fetch_chat)

    })
}

// Fetchar chatloggen
async function fetch_chat(event) {
    stop_all_intervals();

    document.querySelector("#forum_display").innerHTML = "";

    // Resettar timer:n när funktionen anropas igen.
    if (document.querySelector(".timer_counter").textContent != 10) {
        document.querySelector(".timer_counter").textContent = 10;
    }

    // Knappen är disablad tills man har valt en vän.
    document.getElementById("send").disabled = false;

    // Lagrar inloggad användarnamn och den man har klickat på.
    const username = localStorage.getItem("username");
    const targetUsername = event.target.querySelector(".username").innerHTML;

    loading_screen();
    let response_user1 = await fetch(`./php/chat.php?username=${username}&targetUsername=${targetUsername}`);

    let response_data = await response_user1.json();
    

    // Lagrar den inloggade användarens id och den användarens id som man har klickat på i localStorage.
    localStorage.setItem("loggedOnID", response_data.loggedID);
    localStorage.setItem("targetUserID", response_data.user2_id);

    // Objektet som skickas för att fetcha chatID.
    let fetch_body_first = {
        get_chatlog_id: true,
        loggedID: response_data.loggedID,
        user2_id: response_data.user2_id,
    }

    let response2 = await fetch(`./php/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fetch_body_first),
    })


    // Här får vi chatid:et!
    let chat_id = await response2.json();
    

    // Lagrar chatID:t.
    localStorage.setItem("selected_chat_id", chat_id.chatid);

    // Gör så att alla andra som inte är selekterade får sina default färget.
    document.querySelectorAll(".profile_dom").forEach(all_profile_doms => {
        if (event.target.querySelector(".username") !== all_profile_doms.querySelector(".username")) {
            all_profile_doms.querySelector("#profile_wrapper").style.backgroundColor = "lightgray";
            all_profile_doms.querySelector(".username").style.color = "black";
        };
    })

    // Denna som är klickat behåller sin lila färg. 
    event.target.parentElement.querySelector("#profile_wrapper").classList.add("selected");
    event.target.parentElement.querySelector("#profile_wrapper").style.backgroundColor = "rgb(114, 49, 114)";
    event.target.parentElement.querySelector(".username").style.color = "white";


    // Skickar användarnas ID för att kontrollera om det finns en chattlogg mellan båda.
    let body_for_fetch2 = {
        chatid: localStorage.getItem("selected_chat_id"),
        da_user_logged_in: response_data.loggedID,
        target_user: response_data.user2_id,
    };

    // Här skickas de till chat.php
    let response_all_previous_messages = await fetch(`./php/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch2),
    })


    if (response_user1.ok && response2.ok && response_all_previous_messages.ok) {
        remove_loading_screen();
    }

    // Fetchar hela chatloggen.
    let data3 = await response_all_previous_messages.json();


    // Här kontrollerar den om chatloggen är tom
    if (data3.length !== 0) {
        data3.forEach(each_message => {

            let message_dom = document.createElement("div");
            message_dom.classList.add("post_dom");
            message_dom.innerHTML = `
            <div id="profile_picture"></div >
            <div id="username">${each_message.username}</div>
            <div id="the_post_text">
            <p>${each_message.message}</p>
            </div>
            `;

            // FORTSÄTT HÄR MED BILDERNA!
            // if (each_message.profile_picture !== "undefined") {
            //     message_dom.querySelector("#profile_picture").style.backgroundImage = 'url(./profile/images/' + each_message.profile_picture;
            // } else {
            //     message_dom.querySelector("#profile_picture").style.backgroundImage = "hej";

            // }

            document.querySelector("#forum_display").appendChild(message_dom)
        })
    }

    // Counter för när chatten skall uppdateras!
    let time_counter = setInterval(() => {
        let timer = document.querySelector(".timer_counter").textContent;

        if (timer == 0) {
            fetch_chat(event);
            timer = 10;

        }
        timer--;
        document.querySelector(".timer_counter").textContent = timer;
    }, 1000);

    all_intervals.push(time_counter);


    // Loading screen tillagd!
    let interval_id = setInterval(async () => {
        fetch_chat(event);
    }, 10000);

    all_intervals.push(interval_id);
    document.querySelector(".fetch_chat_now_btn").addEventListener("click", function refresh_chat(button) {
        document.querySelector(".timer_counter").textContent = 1;
    });
};

export function stop_all_intervals() { // Om man loopar igenom alla och använder clearTimeout så försvinner alla timers
    all_intervals.forEach(each_interval => {
        clearInterval(each_interval);
    })

}


// Funktionen för att man ska kunna skicka meddelanden.
function init_send_message_functionality() {

    // Lägger till eventListener så att man kan börja skicka meddelanden.
    document.querySelector("button").addEventListener("click", () => {
        // Här skapar man en "offline" meddelande som man skickar och som sedan skickas till chat.php för att lagras i chatlogs.json
        let post_dom = document.createElement("div");
        post_dom.classList.add("post_dom");

        post_dom.innerHTML = `
            <div id="profile_picture"></div >
            <div id="username">${localStorage.getItem("username")}</div>
            <div id="the_post_text"><p>${document.querySelector("textarea").value}</p></div>
        `;

        document.querySelector("#forum_display").appendChild(post_dom);

        document.querySelector("textarea").value = "";
        // Anropar send_message med själva elementet som man har precis skapat.
        send_message(post_dom);
    });
}

// Funktionen som faktiskt skickar det man har skrivit till chat.php
async function send_message(the_post_dom) {

    // Skapar ett objekt som innehåller båda användarnas ID:n och textContenten för meddelandet som har skrivits.
    let body_for_fetch = {
        chatid: localStorage.getItem("selected_chat_id"),
        message: the_post_dom.querySelector("#the_post_text > p").innerHTML,
        loggedOnID: localStorage.getItem("loggedOnID"),
        targetUserID: localStorage.getItem("targetUserID")
    }

    let response = await fetch("./php/forum.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

}

