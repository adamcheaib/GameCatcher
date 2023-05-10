import { init_frontpage } from "./front_page.js";
import { init_collection } from "./game_collection.js";
localStorage.setItem("counter_for_forum", 0);
if (localStorage.getItem("counter_for_forum") === null) {
    localStorage.setItem("counter_for_forum", 0);
}

console.log(localStorage);
export function init_forum() {
    document.querySelector("link").setAttribute("href", "./frontpage/css/forum.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display"></div>
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

        let counter_value = parseInt(localStorage.getItem("counter_for_forum"));
        counter_value += 1;
        let post_dom = document.createElement("div");
        console.log(counter_value);
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
    });
}

