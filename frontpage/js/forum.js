import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";
import { fetch_all_chats } from "../../utils/functions.js";
import { stop_all_timeouts } from "../../utils/functions.js";
if (localStorage.getItem("counter_for_forum") === null) {
    localStorage.setItem("counter_for_forum", 0);
}

export function init_forum() {
    localStorage.removeItem("where_att");
    localStorage.setItem("where_att", "forum");

    localStorage.removeItem("all_timeouts");
    localStorage.setItem("all_timeouts", JSON.stringify({timeouts: []}));

    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    document.querySelector("#chat").removeEventListener("click", init_forum);
    document.querySelector("link").setAttribute("href", "./frontpage/css/forum.css");
    let friends_list = document.createElement("div");
    friends_list.classList.add("friends_list");
    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display"></div>
        <textarea></textarea>
        <button>Send</button>
    `;

    document.querySelector("#frontpage_wrapper").appendChild(friends_list)

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    get_all_friends();
    create_post();

}

document.querySelector("#chat").addEventListener("click", init_forum)

async function get_all_friends() {

    let body_for_fetch = {
        the_user: localStorage.getItem("username"),
        find_all_friends: true,
    }
    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

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
        profile_pic.style.backgroundImage = `url(./frontpage/general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./frontpage/general_media/chat.svg)`
    })

    // Ger allt i account elementen inuti forumet ett click event så det inte är bara en del som kan clickas
    async function the_whole_juser_element_gets_click_event() {

        document.querySelectorAll(".profile_dom").forEach((profile_dom,index) => {
            profile_dom.classList.add("unselected");

            profile_dom.addEventListener("click", fetch_all_chats);
        })
        document.querySelectorAll(".profile_picture").forEach(profile_dom => {
            profile_dom.addEventListener("click", async (event) => {
                profile_dom.addEventListener("click", fetch_all_chats);
                event.stopImmediatePropagation();
            });
        })

        document.querySelectorAll(".username").forEach(profile_dom => {
            profile_dom.addEventListener("click", async (event) => {
                profile_dom.addEventListener("click", fetch_all_chats);
                event.stopImmediatePropagation();
            });
        })
    }

    the_whole_juser_element_gets_click_event()
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
    }

    let response = await fetch("./frontpage/php/forum.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    let data = await response.json();
    console.log(data);
}

