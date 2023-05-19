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

    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display"></div>
        <textarea></textarea>
        <button>Send</button>
    `;

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum);
    create_post();
}

document.querySelector("#chat").addEventListener("click", init_forum)

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
        console.log(localStorage)
        send_message(post_dom);
    });
}

async function send_message(the_post_dom) {

    let body_for_fetch = {
        username: localStorage.getItem("username"),
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


