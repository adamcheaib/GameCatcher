"use strict"




export async function genre_scroll() { // Scroll function for the displayed genres.    
    let index = 0;
    let counter = 0;

    if (counter === 0) {
        document.querySelector("#first_arrow").style.backgroundColor = "gray";
        document.querySelector("#first_arrow").removeEventListener("click", click_right_arrow)
    }

    let response = await fetch("https://api.rawg.io/api/genres?key=a25ef91c11654298888f4907971ad496");
    let genre_data = await response.json();

    let genre_names = [];
    let genre_images = [];

    genre_data.results.forEach(genre => {
        genre_names.push(genre.name);
        genre_images.push(genre.image_background);
    });

    console.log(genre_images);
    console.log(genre_names);


    let all_dom_boxes = document.querySelectorAll("#genre_wrapper div");

    for (let i = 0; i < 4; i++) {
        all_dom_boxes[i].style.backgroundImage = `url(${genre_images[i]})`
        all_dom_boxes[i].innerHTML = `
        <div class="genre_text_wrapper">
            <div class="genre_text">${genre_names[i]}</div>
        </div>
      `;
        all_dom_boxes[i].addEventListener("click", (event) => {
            // console.log(event.target);
            const parent_node = document.getElementById("genre_wrapper");
            parent_node.querySelectorAll("div").forEach(genre_icon => genre_icon.style.transform = "scale(1)");
            window.localStorage.setItem("name", event.target.querySelector(".genre_text").textContent.toLowerCase());
            event.target.parentElement.style.transform = "scale(1.1)";
            console.log(window.localStorage);
        })
    }


    function click_right_arrow() {

        if (counter === genre_names.length - 4) {
            document.querySelector("#second_arrow").style.backgroundColor = "gray";
            document.querySelector("#second_arrow").removeEventListener("click", click_right_arrow)
        }
        else {
            index += 1;
            counter += 1;
            console.log(counter)
            if (counter !== 0) {
                document.querySelector("#first_arrow").style.backgroundColor = "black";
                document.querySelector("#first_arrow").addEventListener("click", click_left_arrow);
            }


            let the_new_genre_images = [];
            let the_new_genre_names = [];


            for (let i = index; i < (4 + index); i++) {
                the_new_genre_images.push(genre_images[i]);
                the_new_genre_names.push(genre_names[i]);
            }


            for (let i = 0; i < 4; i++) {
                all_dom_boxes[i].style.backgroundImage = `url(${the_new_genre_images[i]})`
                all_dom_boxes[i].innerHTML = `
                <div class="genre_text_wrapper">
                  <div class="genre_text">${the_new_genre_names[i]}</div>
                </div>
                
            `;
            }
        }


    }


    function click_left_arrow(event) {
        if (counter === 0) {
            document.querySelector("#first_arrow").style.backgroundColor = "gray";
            document.querySelector("#first_arrow").removeEventListener("click", click_left_arrow)
        }
        else {
            index -= 1;
            counter -= 1;
            if (counter !== genre_names.length - 4) {

                document.querySelector("#second_arrow").style.backgroundColor = "black";
                document.querySelector("#second_arrow").addEventListener("click", click_right_arrow)
            }
            if (counter === 0) {
                document.querySelector("#first_arrow").style.backgroundColor = "gray";
                document.querySelector("#first_arrow").removeEventListener("click", click_left_arrow)
            }
            else {
                document.querySelector("#first_arrow").style.backgroundColor = "black";
                document.querySelector("#first_arrow").addEventListener("click", click_left_arrow)
            }


            let the_new_genre_images = [];
            let the_new_genre_names = [];


            for (let i = index; i < (4 + index); i++) {
                the_new_genre_images.push(genre_images[i]);
                the_new_genre_names.push(genre_names[i]);
            }


            for (let i = 0; i < 4; i++) {
                all_dom_boxes[i].style.backgroundImage = `url(${the_new_genre_images[i]})`
                all_dom_boxes[i].innerHTML = `
                <div class="genre_text_wrapper">
                <div class="genre_text">${the_new_genre_names[i]}</div>
                </div>
                
            `;
            }

        }
    }

    document.querySelector("#second_arrow").addEventListener("click", click_right_arrow);
    document.querySelector("#first_arrow").addEventListener("click", click_left_arrow);

}
"use strict"

function popUpFunction(message) {
    const body = document.querySelector("body");
    document.querySelector("div").style.opacity = "0.5";

    const popup = document.createElement("div");
    const exit_button = document.createElement("div");

    body.appendChild(popup);
    popup.classList.add("popup");
    popup.textContent = message;

    popup.style.opacity = "1"
    exit_button.classList.add("exit")
    exit_button.textContent = "X"
    exit_button.addEventListener("click", remove_message)
    popup.appendChild(exit_button);
}
function remove_message(event) {
    console.log(event);
    const div = event.originalTarget.parentElement;
    div.remove();
    button.disabled = false;
    document.querySelector("div").style.opacity = "1";
}




genre_scroll()
