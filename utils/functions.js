"use strict"
import { api_key } from "./fetch_functions.js";
/*To-Do: Denna är det som ska köras i varje game click då den ska displaya allt om spelet*/


function show_game_display_dom(game_data) {
    let the_dom = document.createElement("div");
    the_dom.classList.add("display_game_dom");
    let the_parent_dom = document.querySelector("#frontpage_wrapper");



    the_dom.innerHTML = `
        <div id="liked_games_button">Add to liked games</div>

        <h2>${game_data.name}</h2>
        <div id="game_image"></div>
        <div id="game_text">
            This game is really good
            wow i really like it, dam it makes me feel 
            pretty cool. I like Minecraft.
        </div>
        <div id="rating_header">Rating</div>
        <div id="wrapper_ratings">
            <div class="rating">${game_data.ratings[0].percent}</div>
            <div class="rating">${game_data.ratings[1].percent}</div>
            <div class="rating">${game_data.ratings[2].percent}</div>
        </div>
        <div id="rating_names_wrapper">
            <div class="rating_name">${game_data.ratings[0].title}</div>
            <div class="rating_name">${game_data.ratings[1].title}</div>
            <div class="rating_name">${game_data.ratings[2].title}</div>
        </div>
        <div id="gameplay"></div>
    `;

    let counter_for_interval = [1]; // behöver passa by refrence för att den sen ska kunna resetas
    the_parent_dom.appendChild(the_dom);
    document.querySelector("#gameplay").style.backgroundImage = `url(${game_data.short_screenshots[counter_for_interval].image})`
    setInterval(() => {
        counter_for_interval[0] += 1;
        // document.querySelector("#gameplay").style.backgroundImage = `url(${game_data.short_screenshots[counter_for_interval].image})`
        if (counter_for_interval[0] === game_data.short_screenshots.length - 1) {
            counter_for_interval[0] = 1
        }
    }, 3000);
    document.querySelector("#liked_games_button").addEventListener("click", async () => {
        let send_object = {
            name: game_data.name,
            image: game_data.background_image,
            username: localStorage.getItem("username"),
        };
        fetch("../frontpage/php/game_collection.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(send_object),
        }).then(r => r.json()).then(data => {
            console.log(data);
            alert("added");
        });
    });
    document.querySelector("#game_image").style.backgroundImage = `url(${game_data.background_image})`;

}


async function fetch_game_by_plattform_and_genre(genre, platform) {

    try {
        const url = `https://api.rawg.io/api/games?${api_key}&genres=${genre.toLowerCase()}&platforms=${platform}`
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function search_game(game_name) {
    let prefix = "https://api.rawg.io/api/";
    /*
    PC: id 4,
    Nintendo_Switch: id 7,
    Xbox Series X: id 186,
    Playstation 5: id 187
    */
    try {
        let the_right_one = []
        const link = prefix + `games?search=${game_name}&platforms=4,187,18,186&search_precise=true&` + api_key;
        const resource = await (await fetch(link)).json();
        resource.results.forEach(game => {
            if (game_name === game.name) {
                // I våran conditions, fixa att man undviker demos osv.
                the_right_one.push(game);

            }
        })
        return the_right_one;
    } catch (err) {
        console.log(err)
    }
}

export async function game_scroll() { // Scroll function for the displayed genres.    
    let index2 = 0;
    let counter2 = 0;

    if (counter2 === 0) {
        document.querySelector("#first_arrow2").style.backgroundColor = "gray";
        document.querySelector("#first_arrow2").removeEventListener("click", click_right_arrow)
        document.querySelector("#second_arrow2").style.backgroundColor = "black";
    }

    let games_data = await fetch_game_by_plattform_and_genre(localStorage.getItem("selected_genre"), localStorage.getItem("platform_selected"));


    let game_names = [];
    let game_images = [];
    games_data.results.forEach(game => {
        game_names.push(game.name);
        game_images.push(game.background_image);
    });

    /*Denna behövs för att refreshen av spel ska funka då om man klickar på en pil så ska de fyra nya s
    spelen visas
    */

    let wrapper = document.querySelector("#games_wrapper");
    wrapper.innerHTML = "";
    for (let n = 1; n <= 4; n++) {
        let game_dom = document.createElement("div");
        game_dom.classList.add(`game_${n}`);
        wrapper.appendChild(game_dom)

    }

    let all_dom_boxes = document.querySelectorAll("#games_wrapper div");


    for (let i = 0; i < 4; i++) {
        all_dom_boxes[i].style.backgroundImage = `url(${game_images[i]})`
        all_dom_boxes[i].innerHTML = `
        <div class="game_text_wrapper">
            <div class="game_text">${game_names[i]}</div>
        </div>
      `;
    }


    async function click_right_arrow() {

        if (counter2 === game_names.length - 4) {
            document.querySelector("#second_arrow2").style.backgroundColor = "gray";
            document.querySelector("#second_arrow2").removeEventListener("click", click_right_arrow)
        }
        else {
            index2 += 1;
            counter2 += 1;
            if (counter2 !== 0) {
                document.querySelector("#first_arrow2").style.backgroundColor = "black";
                document.querySelector("#first_arrow2").addEventListener("click", click_left_arrow);
            }


            let the_new_game_images = [];
            let the_new_game_names = [];


            for (let i = index2; i < (4 + index2); i++) {
                the_new_game_images.push(game_images[i]);
                the_new_game_names.push(game_names[i]);
            }


            for (let i = 0; i < 4; i++) {
                all_dom_boxes[i].style.backgroundImage = `url(${the_new_game_images[i]})`
                all_dom_boxes[i].innerHTML = `
                <div class="game_text_wrapper">
                  <div class="game_text">${the_new_game_names[i]}</div>
                </div>
                
            `;
            }
        }

        /*Denna gör så att varje spel kan clickas det måste vara fler för att alla tas bort där uppe kom ihåg det*/
        document.querySelectorAll("#games_wrapper div .game_text_wrapper").forEach(game => {
            game.addEventListener("click", async () => {
                localStorage.removeItem("selected_game") // behövs varje gång för att vi ska bara kunna ha en selected_game
                localStorage.setItem("selected_game", game.querySelector(".game_text").innerHTML);
                let the_game = await search_game(localStorage.getItem("selected_game"));
                if (document.querySelector(".display_game_dom") !== null) {
                    document.querySelector(".display_game_dom").remove();
                }

                show_game_display_dom(the_game[0]);
            })
        })
    }

    console.log(localStorage);

    async function click_left_arrow(event) {
        if (counter2 === 0) {
            document.querySelector("#first_arrow2").style.backgroundColor = "gray";
            document.querySelector("#first_arrow2").removeEventListener("click", click_left_arrow)
        }
        else {
            index2 -= 1;
            counter2 -= 1;
            if (counter2 !== game_names.length - 4) {

                document.querySelector("#second_arrow2").style.backgroundColor = "black";
                document.querySelector("#second_arrow2").addEventListener("click", click_right_arrow)
            }
            else {
                document.querySelector("#second_arrow2").style.backgroundColor = "black";
                document.querySelector("#second_arrow2").addEventListener("click", click_right_arrow)
            }
            if (counter2 === 0) {
                document.querySelector("#first_arrow2").style.backgroundColor = "gray";
                document.querySelector("#first_arrow2").removeEventListener("click", click_left_arrow)
            }
            else {
                document.querySelector("#first_arrow2").style.backgroundColor = "black";
                document.querySelector("#first_arrow2").addEventListener("click", click_left_arrow)
            }


            let the_new_games_images = [];
            let the_new_games_names = [];


            for (let i = index2; i < (4 + index2); i++) {
                the_new_games_images.push(game_images[i]);
                the_new_games_names.push(game_names[i]);
            }


            for (let i = 0; i < 4; i++) {
                all_dom_boxes[i].style.backgroundImage = `url(${the_new_games_images[i]})`
                all_dom_boxes[i].innerHTML = `
                <div class="game_text_wrapper">
                <div class="game_text">${the_new_games_names[i]}</div>
                </div>
                
            `;
            }
            /*Denna gör så att varje spel kan clickas det måste vara fler för att alla tas bort där uppe kom ihåg det*/
            document.querySelectorAll("#games_wrapper div .game_text_wrapper").forEach(game => {
                game.addEventListener("click", async () => {
                    localStorage.removeItem("selected_game") // behövs varje gång för att vi ska bara kunna ha en selected_game
                    localStorage.setItem("selected_game", game.querySelector(".game_text").innerHTML);
                    let the_game = await search_game(localStorage.getItem("selected_game"));

                    if (document.querySelector(".display_game_dom") !== null) {
                        document.querySelector(".display_game_dom").remove();
                    }

                    show_game_display_dom(the_game[0]);
                })
            })
        }
    }

    document.querySelector("#second_arrow2").addEventListener("click", click_right_arrow);
    document.querySelector("#first_arrow2").addEventListener("click", click_left_arrow);

    /*Denna gör så att varje spel kan clickas det måste vara fler för att alla tas bort där uppe kom ihåg det*/
    document.querySelectorAll("#games_wrapper div .game_text_wrapper").forEach(game => {
        game.addEventListener("click", async () => {
            localStorage.removeItem("selected_game") // behövs varje gång för att vi ska bara kunna ha en selected_game
            localStorage.setItem("selected_game", game.querySelector(".game_text").innerHTML);
            let the_game = await search_game(localStorage.getItem("selected_game"));
            if (document.querySelector(".display_game_dom") !== null) {
                document.querySelector(".display_game_dom").remove();
            }
            show_game_display_dom(the_game[0]);
        })
    })
}


export async function genre_scroll() { // Scroll function for the displayed genres.    
    let index = 0;
    let counter = 0;

    if (counter === 0) {
        document.querySelector("#first_arrow").style.backgroundColor = "gray";
        document.querySelector("#first_arrow").removeEventListener("click", click_right_arrow)
    }

    let response = await fetch("https://api.rawg.io/api/genres?" + api_key);
    let genre_data = await response.json();

    let genre_names = [];
    let genre_images = [];

    genre_data.results.forEach(genre => {
        genre_names.push(genre.name);
        genre_images.push(genre.image_background);
    });

    let all_dom_boxes = document.querySelectorAll("#genre_wrapper div");

    for (let i = 0; i < 4; i++) {
        all_dom_boxes[i].style.backgroundImage = `url(${genre_images[i]})`
        all_dom_boxes[i].innerHTML = `
        <div class="genre_text_wrapper">
            <div class="genre_text">${genre_names[i]}</div>
        </div>
      `;
    }


    function click_right_arrow() {

        if (counter === genre_names.length - 4) {
            document.querySelector("#second_arrow").style.backgroundColor = "gray";
            document.querySelector("#second_arrow").removeEventListener("click", click_right_arrow)
        }
        else {
            index += 1;
            counter += 1;
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

export function popUpFunction(message) {
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

export function remove_message(event) {
    const div = event.originalTarget.parentElement;
    div.remove();
    button.disabled = false;
    document.querySelector("div").style.opacity = "1";
}
