import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";

export function init_forum() {
    document.querySelector("link").setAttribute("href", "./frontpage/css/forum.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display">
            <div class="part_of_forum" id="first_part"></div>
            <div class="part_of_forum" id="second_part"></div>
        </div>
        <textarea></textarea>
        <button>Send</button>
    `;

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    create_post();
}

document.querySelector("#chat").addEventListener("click", init_forum)

function create_post() {

    document.querySelector("button").addEventListener("click", () => {
        let post_dom = document.createElement("div");
        post_dom.classList.add("post_dom");
        post_dom.innerHTML = `
            <div id="profile_picture"></div>
            <div id="the_post_text">${document.querySelector("textarea").value}</div>
        `;
        document.querySelector("#first_part").appendChild(post_dom);
        document.querySelector("textarea").value = "";
    })
}