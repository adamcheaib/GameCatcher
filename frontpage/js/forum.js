document.querySelector("#chat").addEventListener("click", init_forum)

function init_forum() {
    document.querySelector("link").setAttribute("href", "./frontpage/css/forum.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="forum_display"></div>
        <textarea></textarea>
        <button>Send</button>
    `;

    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
}