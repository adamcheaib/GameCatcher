import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";
import { loading_screen, remove_loading_screen } from "../../utils/functions.js";

let all_intervals = [];

if (localStorage.getItem("counter_for_forum") === null) {
    localStorage.setItem("counter_for_forum", 0);
}


export function init_forum(user) {
    localStorage.removeItem("where_att");
    localStorage.setItem("where_att", "forum");

    localStorage.removeItem("all_timeouts");
    localStorage.setItem("all_timeouts", JSON.stringify({ timeouts: [] }));

    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    document.querySelector("#chat").removeEventListener("click", init_forum);
    document.querySelector("link").setAttribute("href", "./css/forum.css");
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

    document.querySelector("#frontpage_wrapper").appendChild(friends_list)

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    get_all_friends(user);
    create_post();
    document.getElementById("send").disabled = true;
}

document.querySelector("#chat").addEventListener("click", init_forum)

async function get_all_friends(user) {

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
        remove_loading_screen();
    }

    let friend_data = await response.json();
    console.log(friend_data);

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
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/chat.svg)`
    })

    // Ger allt i account elementen inuti forumet ett click event så det inte är bara en del som kan clickas
    the_whole_juser_element_gets_click_event(user);
}
export async function the_whole_juser_element_gets_click_event(user) {
    document.querySelectorAll(".profile_dom").forEach(async (profile_dom, index) => {
        profile_dom.classList.add("unselected");
        // per klick av profile_dom så skapas det en interval men samtidgt så clears det i början så att det inte blir så att fler kör samtidgt
        profile_dom.addEventListener("click", fetch_chat)

    })
}

async function fetch_chat(event) {

    stop_all_intervals();

    if (document.querySelector(".timer_counter").textContent != 10) {
        document.querySelector(".timer_counter").textContent = 10;
    }


    document.getElementById("send").disabled = false;
    stop_all_intervals();
    document.querySelector("#forum_display").innerHTML = "";
    localStorage.removeItem("selected_chat_id")

    document.querySelector("#forum_display").innerHTML = "";
    const username = localStorage.getItem("username");
    const targetUsername = event.target.querySelector(".username").innerHTML;

    loading_screen();
    let response_user1 = await fetch(`./php/chat.php?username=${username}&targetUsername=${targetUsername}`);

    let response_data = await response_user1.json();
    localStorage.setItem("loggedOnID", response_data.loggedID);

    let fetch_bod_first = {
        get_chatlog_id: true,
        loggedID: response_data.loggedID,
        user2_id: response_data.user2_id,
    }

    let response2 = await fetch(`./php/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fetch_bod_first),
    })

    let chat_id = await response2.json(); // Här får vi chatid:et!

    console.log(chat_id);
    localStorage.setItem("selected_chat_id", chat_id.chatid)

    document.querySelectorAll(".profile_dom").forEach(friends => {
        // if (event.target.parentElement.querySelector(".username").textContent === friends.)
        if (event.target.querySelector(".username") !== friends.querySelector(".username")) {
            friends.querySelector("#profile_wrapper").style.backgroundColor = "lightgray";
            friends.querySelector(".username").style.color = "black";
        };
    })
    console.log(event.target.parentElement.querySelector(".username").textContent);

    event.target.parentElement.querySelector("#profile_wrapper").classList.add("selected");
    event.target.parentElement.querySelector("#profile_wrapper").style.backgroundColor = "rgb(114, 49, 114)";
    event.target.parentElement.querySelector(".username").style.color = "white";

    let body_for_fetch2 = {
        chatid: localStorage.getItem("selected_chat_id"),
        da_user_logged_in: response_data.loggedID,
        target_user: response_data.user2_id,
    };

    let response_all_previous_messages = await fetch(`./php/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch2),
    })

    if (response_user1.ok && response2.ok && response_all_previous_messages.ok) {
        remove_loading_screen();
    }
    let data3 = await response_all_previous_messages.json();

    console.log(data3);

    if (data3.count !== 0 && data3 !== null) {
        data3.forEach(each_message => {
            let message_dom = document.createElement("div");
            message_dom.classList.add("post_dom");
            message_dom.innerHTML = `
            <div id="profile_picture"></div >
            <div id="username">A Username Fix It</div>
            <div id="the_post_text">
                <p>${each_message}</p>
            </div>
        `
            document.querySelector("#forum_display").appendChild(message_dom)
        })
    }

    // Counter för när chatten skall uppdateras!
    let time_counter = setInterval(() => {
        let timer = document.querySelector(".timer_counter").textContent;

        if (timer == 0) {
            timer = 10;
        }
        timer--;
        document.querySelector(".timer_counter").textContent = timer;
    }, 1000);

    all_intervals.push(time_counter);


    // Loading screen tillagd!
    let interval_id = setInterval(async () => {

        document.querySelector("#forum_display").innerHTML = "";


        localStorage.removeItem("selected_chat_id")

        document.querySelector("#forum_display").innerHTML = "";
        const username = localStorage.getItem("username");
        const targetUsername = event.target.querySelector(".username").innerHTML;

        let response_user1 = await fetch(`./php/chat.php?username=${username}&targetUsername=${targetUsername}`)
        let response_data = await response_user1.json();
        console.log(response_data);




        let fetch_bod_first = {
            get_chatlog_id: true,
            loggedID: response_data.loggedID,
            user2_id: response_data.user2_id,
        }

        let response2 = await fetch(`./php/chat.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fetch_bod_first),
        })

        let chat_id = await response2.json(); // Här får vi chatid:et!

        console.log(chat_id);
        localStorage.setItem("selected_chat_id", chat_id.chatid)



        event.target.parentElement.querySelector("#profile_wrapper").classList.add("selected");
        event.target.parentElement.querySelector("#profile_wrapper").style.backgroundColor = "rgb(114, 49, 114)";
        event.target.parentElement.querySelector(".username").style.color = "white";

        let body_for_fetch2 = {
            chatid: localStorage.getItem("selected_chat_id"),
            da_user_logged_in: response_data.loggedID,
            target_user: response_data.user2_id,
        };

        let response_all_previous_messages = await fetch(`./php/chat.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body_for_fetch2),
        })

        let data3 = await response_all_previous_messages.json();

        console.log(data3);

        if (data3.count !== 0 && data3 !== null) {
            data3.forEach(each_message => {
                let message_dom = document.createElement("div");
                message_dom.classList.add("post_dom");
                message_dom.innerHTML = `
                <div id="profile_picture"></div >
                <div id="username">A Username Fix It</div>
                <div id="the_post_text">
                    <p>${each_message}</p>
                </div>
        `
                document.querySelector("#forum_display").appendChild(message_dom)
            })
        }

    }, 10000);

    all_intervals.push(interval_id);
    document.querySelector(".fetch_chat_now_btn").addEventListener("click", function refresh_chat(button) {
        fetch_chat(event);
        button.target.removeEventListener("click", refresh_chat)
    });
};




export function stop_all_intervals() { // Om man loopar igenom alla och använder clearTimeout så försvinner alla timers
    all_intervals.forEach(each_interval => {
        clearInterval(each_interval);
    })

}


function create_post() {

    document.querySelector("button").addEventListener("click", () => {
        let counter_value = parseInt(localStorage.getItem("counter_for_forum"));
        counter_value += 1;
        let post_dom = document.createElement("div");
        post_dom.classList.add("post_dom");

        post_dom.innerHTML = `
            <div id="profile_picture"></div >
            <div id="username">${localStorage.getItem("username")}</div>
            <div id="the_post_text"><p>${document.querySelector("textarea").value}</p></div>
        `;

        document.querySelector("#forum_display").appendChild(post_dom);

        document.querySelector("textarea").value = "";
        localStorage.removeItem("counter_for_forum");
        localStorage.setItem("counter_for_forum", counter_value);
        console.log(localStorage);
        send_message(post_dom);
    });
}

async function send_message(the_post_dom) {

    let body_for_fetch = {
        chatid: localStorage.getItem("selected_chat_id"),
        message: the_post_dom.querySelector("#the_post_text > p").innerHTML,
        username: localStorage.getItem("")
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

