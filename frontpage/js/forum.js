import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";
if (localStorage.getItem("counter_for_forum") === null) {
    localStorage.setItem("counter_for_forum", 0);
}

export function init_forum() {
    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
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
    document.querySelector("#chat").addEventListener("click", init_forum);
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
    async function the_whole_juser_element_gets_click_event(event) {

        document.querySelectorAll(".profile_dom").forEach(profile_dom => {
            profile_dom.addEventListener("click", async (event) => {
                const username = localStorage.getItem("username");
                const targetUsername = event.target.querySelector(".username").innerHTML;

                let response_user1 = await fetch(`./frontpage/php/chat.php?username=${username}&targetUsername=${targetUsername}`)
                let response_data = await response_user1.json();
                console.log(response_data);
                localStorage.setItem("loggedID", response_data.loggedID);
                console.log(localStorage);

                let response2 = await fetch(`./frontpage/php/chat.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response_data),
                })

                const resource2 = await response2.json(); // Här får vi chatloggen!
                console.log(resource2);


                profile_dom.querySelector("#profile_wrapper").classList.add("selected");
                profile_dom.querySelector("#profile_wrapper").style.backgroundColor = "rgb(114, 49, 114)";
                profile_dom.querySelector(".username").style.color = "white";
            });
        })
        document.querySelectorAll(".profile_picture").forEach(profile_dom => {
            profile_dom.addEventListener("click", async (event) => {
                console.log(event.target.parentElement.querySelector(".username").innerHTML)
                event.stopImmediatePropagation();
            });
        })

        document.querySelectorAll(".username").forEach(profile_dom => {
            profile_dom.addEventListener("click", async (event) => {
                console.log(event.target.parentElement.querySelector(".username").innerHTML)
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
            <div id="profile_picture"></div>
            <div id="the_post_text"><p>${document.querySelector("textarea").value}</p></div>
        `;

        if (counter_value % 2 !== 0) {

            document.querySelector("#forum_display").appendChild(post_dom);
            post_dom.style.gridColumn = `1/2`;
            post_dom.style.gridRow = `${counter_value} / ${counter_value}`;

        }
        else {
            document.querySelector("#forum_display").appendChild(post_dom);
            post_dom.style.gridColumn = `2/3`;
            post_dom.style.gridRow = `${counter_value} / ${counter_value + 1}`;
        }


        document.querySelector("textarea").value = "";
        localStorage.removeItem("counter_for_forum");
        localStorage.setItem("counter_for_forum", counter_value);
        console.log(localStorage);
        send_message(post_dom);
    });
}

async function send_message(the_post_dom) {

    let body_for_fetch = {
        username: localStorage.getItem("username"),
        message: the_post_dom.querySelector("#the_post_text > p").innerHTML,
    }

    let response = await fetch("./frontpage/php/forum.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    let data = await response.json();
    console.log(data);
}


