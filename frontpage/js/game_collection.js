document.querySelector("#saved").addEventListener("click", init_collection)

function init_collection() {
    document.querySelector("link").setAttribute("href", "./frontpage/css/collection.css");

    document.querySelector("#center_piece").innerHTML = `

        <div class="collection_header">Ya games</div>
        <div class="collection_grid_container"></div>
        <div class="clear_button">Clear</div>
    
    `

    document.querySelector(".collection_grid_container").innerHTML = `
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
    `
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
}