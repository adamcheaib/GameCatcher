import { api_key } from "../utils/fetch_functions.js";

"use strict"
/*To-Do: Denna är det som ska köras i varje game click då den ska displaya allt om spelet*/

// Gör så att dialog:n removas istället för att de bara disablas. Vi removar den för att annars skapas en ny som då inte får några eventListeners
document.addEventListener("keydown", function remove_dialog(event) {
    if (event.key === "Escape") {
        document.querySelector("dialog").remove();
        event.target.removeEventListener("keydown", remove_dialog);
    }
})

// Funktionen som anropas när man klickar på någon av spelen (den som syns till höger).
function show_game_display_dom(game_data) {
    let the_dom = document.createElement("div");
    the_dom.classList.add("display_game_dom");
    let the_parent_dom = document.querySelector("#frontpage_wrapper");

    the_dom.innerHTML = `
    <div id="like_and_close_container">
        <div id="liked_games_button">Add to liked games</div>
        <span id="game_information_close_button">X</span>
    </div>

        <h2>${game_data.name}</h2>
        <div id="game_image"></div>
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

    the_parent_dom.appendChild(the_dom);

    document.querySelector("#gameplay").style.backgroundImage = `url(${game_data.short_screenshots[1].image})`

    // Lägger till EventListener så att den antingen 
    document.querySelector("#liked_games_button").addEventListener("click", async (event) => {

        const parentNode = event.target.parentNode;
        const notification = document.createElement("span");
        // Appendar notification-DOM:n ovanför H2:an som man har selektat.
        parentNode.insertBefore(notification, parentNode.querySelector("h2"));
        notification.id = "game_collection_notification";

        // Här kontrollerar det om vi vill ta bort eller lägga till baserat på textContent av #liked_games_button.
        if (event.target.textContent === "Add to liked games") {
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
                general_notifications();
            });

            notification.textContent = "Added to your list!";
            notification.style.color = "green";
            notification.style.gridRow = "2";
            notification.style.gridColumn = "1 / 4";
            notification.style.justifySelf = "center";
            console.log(parentNode);
            event.target.textContent = "Remove game from your list";

            event.target.style.pointerEvents = "none";

            setTimeout(() => { event.target.style.pointerEvents = "all"; notification.remove() }, 2000);
        } else {
            let body_for_fetch = {
                username: localStorage.getItem("username"),
                the_game_to_delete: localStorage.getItem("selected_game"),
            }

            let response = await fetch("./frontpage/php/game_collection.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body_for_fetch),
            });

            notification.textContent = "Removed from your list!";
            notification.style.color = "red";
            notification.style.gridRow = "2";
            notification.style.gridColumn = "1 / 4";
            notification.style.justifySelf = "center";
            event.target.textContent = "Add to liked games";

            event.target.style.pointerEvents = "none";

            setTimeout(() => { event.target.style.pointerEvents = "all"; notification.remove() }, 2000);
        }

    });


    document.querySelector("#game_image").style.backgroundImage = `url(${game_data.background_image})`;

    // Gör så att när vi klickar X-knappen på display_game_dom så tas highlighten bort igen och alla spelen får hover-effekt igen.
    document.getElementById("game_information_close_button").addEventListener("click", () => {
        document.querySelector(".display_game_dom").remove();
        document.querySelectorAll("#games_wrapper > div").forEach(game_dom => {
            game_dom.style.border = "none";
            game_dom.style.transform = "scale(1)";
            game_dom.addEventListener("mouseover", (event) => { event.target.parentElement.style.transform = "scale(1.1)" });
            game_dom.addEventListener("mouseout", event => event.target.parentElement.style.transform = "scale(1)");
            game_dom.addEventListener("click", event => event.target.parentElement.style.transform = "scale(1.1)");
        })
    });

}

// Detta är för att fetcha spel baserat på det valda genren och platform.
async function fetch_game_by_plattform_and_genre(genre, platform) {
    if (genre.includes(" ")) {
        genre = genre.replace(" ", "-");
    }
    let url = `https://api.rawg.io/api/games?${api_key}&genres=${genre.toLowerCase()}&platforms=${platform}`
    if (genre === "RPG") {
        url = `https://api.rawg.io/api/games?${api_key}&genres=5&platforms=${platform}`
    }
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

/* Anropas när man klickar på ett spel från game_scroll:n så söker den efter EXAKT det som står i DOM:ens .game_text och visar första spelet
i arrayen från sökresultatet som baserat på spelets namn 
*/
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


// Scroll function for the displayed genres. 
export async function game_scroll() {

    let index2 = 0;
    let counter2 = 0;

    // Här kontrolleras om de olika counter:n är 0 för att då disablas arrowsen för spel-scrollen.
    if (counter2 === 0) {
        document.querySelector("#first_arrow2").style.backgroundColor = "gray";
        document.querySelector("#first_arrow2").removeEventListener("click", click_right_arrow)
        document.querySelector("#second_arrow2").style.backgroundColor = "black";
    }

    // Varje gång game_scroll anropas så fetchas spelen.
    let games_data = await fetch_game_by_plattform_and_genre(localStorage.getItem("selected_genre"), localStorage.getItem("platform_selected"));


    let game_names = [];
    let game_images = [];

    // Filtrerar så att spelnamnet är i en seperat array och spelbilden är i en seperat array.
    games_data.results.forEach(game => {
        game_names.push(game.name);
        game_images.push(game.background_image);
    });


    let wrapper = document.querySelector("#games_wrapper");
    /* Denna behövs för att refreshen av spel ska funka då om man klickar på en pil så ska de fyra nya spelen visas */
    wrapper.innerHTML = "";

    // Appendar DOM:n för varje spel.
    for (let n = 1; n <= 4; n++) {
        let game_dom = document.createElement("div");
        game_dom.classList.add(`game_${n}`);
        wrapper.appendChild(game_dom)

    }

    let all_dom_boxes = document.querySelectorAll("#games_wrapper div");


    // Appendar spelens namn och bilder för varje spel-DOM.
    for (let i = 0; i < 4; i++) {
        all_dom_boxes[i].style.backgroundImage = `url(${game_images[i]})`
        all_dom_boxes[i].innerHTML = `
        <div class="game_text_wrapper">
            <div class="game_text">${game_names[i]}</div>
        </div>
      `;
    }


    async function click_right_arrow() {
        // Kontrollerar om counter2 är lika med arrayens (all_dom_boxes) längd minus 4 eftersom det är 4 spel som visas i taget.
        if (counter2 === game_names.length - 4) {
            // Om counter2 är lika stor som arrayens längd minus 4 så removas eventListenern och knappen blir grå. 
            document.querySelector("#second_arrow2").style.backgroundColor = "gray";
            document.querySelector("#second_arrow2").removeEventListener("click", click_right_arrow)
        }
        else {
            // Är counter2 inte lika med Arrayens längd minus 4 så körs samma funktion som tidigare.

            /* 
            Denna lägger effekten för när man klickar på en arrow.
            Anledningen till varför spelets bild och information hinner komma in trots att den körs längst upp är för att det är async och
            för att det finns en setTimeout som också på sätt och viss agerar som en async.
            */
            const fourth_game_box = document.querySelector(".game_4");
            console.log(fourth_game_box);
            fourth_game_box.style.left = "20px";
            fourth_game_box.style.opacity = "0%";
            fourth_game_box.style.filter = "blur(1.5rem)";
            setTimeout(() => {
                fourth_game_box.style.left = "0px";
                fourth_game_box.style.opacity = "100%";
                fourth_game_box.style.filter = "blur(0)";
            }, 200);

            index2 += 1;
            counter2 += 1;

            // Om counter2 INTE är lika med 0 så får left_arrow samma funktion fast i reverse dvs den får en EventListener. 
            if (counter2 !== 0) {
                document.querySelector("#first_arrow2").style.backgroundColor = "black";
                document.querySelector("#first_arrow2").addEventListener("click", click_left_arrow);
            }


            let the_new_game_images = [];
            let the_new_game_names = [];

            // Pushar in spelens namn och bilder i två seperata Arrays.
            for (let i = index2; i < (4 + index2); i++) {
                the_new_game_images.push(game_images[i]);
                the_new_game_names.push(game_names[i]);
            }

            // Appendar spelens bilder och namn i DOMs.
            for (let i = 0; i < 4; i++) {
                all_dom_boxes[i].style.backgroundImage = `url(${the_new_game_images[i]})`
                all_dom_boxes[i].innerHTML = `
                <div class="game_text_wrapper">
                  <div class="game_text">${the_new_game_names[i]}</div>
                </div>
                
            `;
            }

            // Detta ser till så att när man bläddrar i scrollen så behålls den selekterade spelet som highlighted.
            const all_game_boxes = document.querySelectorAll("#games_wrapper > div");
            all_game_boxes.forEach(async game_dom => {
                const game_name = game_dom.querySelector(".game_text").textContent;
                if (localStorage.getItem("selected_game") === game_name) {
                    game_dom.style.transform = "scale(1.15)";
                    game_dom.style.border = "2px solid white";
                } else {
                    game_dom.style.transform = "scale(1)";
                    game_dom.style.border = "none";
                }
            })
        }

        // Detta gör att om man redan har klickat på ett spel och vill klicka på ett nytt så visas det NYA spelets information.
        document.querySelectorAll("#games_wrapper div .game_text_wrapper").forEach(game => {
            game.addEventListener("click", async () => {
                localStorage.removeItem("selected_game") // behövs varje gång för att vi ska bara kunna ha en selected_game
                localStorage.setItem("selected_game", game.querySelector(".game_text").innerHTML);
                let the_game = await search_game(localStorage.getItem("selected_game"));


                // Här sätter den animationen för varje spel man har klickat.
                const all_game_boxes = document.querySelectorAll("#games_wrapper > div");
                all_game_boxes.forEach(async game_dom => {
                    const game_name = game_dom.querySelector(".game_text").textContent;
                    console.log(game_name);
                    if (localStorage.getItem("selected_game") === game_name) {
                        game_dom.style.transform = "scale(1.15)";
                        game_dom.style.border = "2px solid white";
                    } else {
                        game_dom.style.transform = "scale(1)";
                        game_dom.style.border = "none";
                    }
                })


                if (document.querySelector(".display_game_dom") !== null) {
                    document.querySelector(".display_game_dom").remove();
                }

                show_game_display_dom(the_game[0]);
            })
        })
    }

    // Gör precis som click_right_arrow funktionen fast för vänster pilen.
    async function click_left_arrow(event) {


        if (counter2 === 0) {
            document.querySelector("#first_arrow2").style.backgroundColor = "gray";
            document.querySelector("#first_arrow2").removeEventListener("click", click_left_arrow)
        }
        else {

            const first_game_box = document.querySelector(".game_1");
            console.log(first_game_box);
            first_game_box.style.right = "20px";
            first_game_box.style.opacity = "0%";
            first_game_box.style.filter = "blur(1.5rem)";
            setTimeout(() => {
                first_game_box.style.right = "0px";
                first_game_box.style.opacity = "100%";
                first_game_box.style.filter = "blur(0)";
            }, 200);

            index2 -= 1;
            counter2 -= 1;

            // If-satserna kontrollerar om du är längst till höger eller vänster och så omvandlar den passande arrow_knappen till grå och tar bort event.
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

                const all_game_boxes = document.querySelectorAll("#games_wrapper > div");
                all_game_boxes.forEach(async game_dom => {
                    const game_name = game_dom.querySelector(".game_text").textContent;
                    console.log(game_name);
                    if (localStorage.getItem("selected_game") === game_name) {
                        game_dom.style.transform = "scale(1.15)";
                        game_dom.style.border = "2px solid white";
                    } else {
                        game_dom.style.transform = "scale(1)";
                        game_dom.style.border = "none";
                    }
                })
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

    document.querySelectorAll("#games_wrapper div .game_text_wrapper").forEach(game => {
        game.addEventListener("click", async () => {
            localStorage.removeItem("selected_game") // behövs varje gång för att vi ska bara kunna ha en selected_game
            localStorage.setItem("selected_game", game.querySelector(".game_text").innerHTML);
            let the_game = await search_game(localStorage.getItem("selected_game"));

            // Kollar om användaren redan har spelet i sin library och i så fall blir #liked_games_button till "Remove Game"
            const user_favorite_library = await (await fetch("../login_register/php/user_database.php",
                {
                    method: "PATCH",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ username: localStorage.getItem("username"), action: "favorite_library" })
                })).json();

            const all_game_boxes = document.querySelectorAll("#games_wrapper > div");
            all_game_boxes.forEach(game_dom => {
                const game_name = game_dom.querySelector(".game_text").textContent;
                if (localStorage.getItem("selected_game") === game_name) {
                    game_dom.style.transform = "scale(1.15)";
                    game_dom.style.border = "2px solid white";
                } else {
                    game_dom.style.transform = "scale(1)";
                    game_dom.style.border = "none";
                }
            })

            if (document.querySelector(".display_game_dom") !== null) {
                document.querySelector(".display_game_dom").remove();
            }
            show_game_display_dom(the_game[0]);

            console.log(user_favorite_library);
            console.log(document.getElementById("liked_games_button"));

            user_favorite_library.fav_games.forEach(game => {
                if (game.name === localStorage.getItem("selected_game")) {
                    const like_or_remove_button = document.getElementById("liked_games_button");
                    like_or_remove_button.textContent = "Remove game from collection";
                }
            })


        })
    })
}

// Exakt det samma som game_scroll fast till genre_scrollen.
export async function genre_scroll() {
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

            const fourth_genre_box = document.getElementById("fourth_genra");
            fourth_genre_box.style.left = "20px";
            fourth_genre_box.style.opacity = "0%";
            fourth_genre_box.style.filter = "blur(1.5rem)";
            setTimeout(() => {
                fourth_genre_box.style.left = "0px";
                fourth_genre_box.style.opacity = "100%";
                fourth_genre_box.style.filter = "blur(0)";
            }, 200);


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
            const genre_scroll_names = document.querySelectorAll(".genre_text");
            genre_scroll_names.forEach(genre_dom => {
                const genre_name = genre_dom.textContent;
                if (localStorage.getItem("selected_genre") === genre_name) {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1.15)";
                    genre_dom.parentElement.parentElement.style.border = "2px solid white";
                } else {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1)";
                    genre_dom.parentElement.parentElement.style.border = "none";
                }
            })
        }
    }


    function click_left_arrow(event) {
        if (counter === 0) {
            document.querySelector("#first_arrow").style.backgroundColor = "gray";
            document.querySelector("#first_arrow").removeEventListener("click", click_left_arrow)
        }
        else {


            const first_box = document.getElementById("first_genra");
            first_box.style.right = "25px";
            first_box.style.opacity = "0%";
            first_box.style.filter = "blur(1.5rem)";
            setTimeout(() => {
                first_box.style.right = "0px";
                first_box.style.opacity = "100%";
                first_box.style.filter = "blur(0)";
            }, 200);

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

            const genre_scroll_names = document.querySelectorAll(".genre_text");
            genre_scroll_names.forEach(genre_dom => {
                const genre_name = genre_dom.textContent;
                if (localStorage.getItem("selected_genre") === genre_name) {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1.15)";
                    genre_dom.parentElement.parentElement.style.border = "2px solid white";
                } else {
                    genre_dom.parentElement.parentElement.style.transform = "scale(1)";
                    genre_dom.parentElement.parentElement.style.border = "none";
                }
            })

        }
    }

    document.querySelector("#second_arrow").addEventListener("click", click_right_arrow);
    document.querySelector("#first_arrow").addEventListener("click", click_left_arrow);

}


// ANVÄNDS INTE NÅGONSTANS.
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

// ANVÄNDS INTE NÅGONSTANS.
export function remove_message(event) {
    const div = event.originalTarget.parentElement;
    div.remove();
    button.disabled = false;
    document.querySelector("div").style.opacity = "1";
}


// Denna används istället för popUpFunctions för ALLA notifikationer.
export function registration_notification(dialog_box_text, action) {
    const registration_dialog = document.createElement("dialog");
    registration_dialog.style.height = "100vh";
    registration_dialog.style.width = "100vw";
    registration_dialog.style.backgroundColor = "white";
    registration_dialog.style.background = "rgba(0, 0, 0, 0.6)";
    const registration_notification_container = document.createElement("div");

    if (action === "account_management") {
        registration_notification_container.className = "account_management";
        registration_notification_container.innerHTML = `
        <h3>${dialog_box_text}</h3>
        <div id="change_username">Change Username</div>
        <div id="change_password">Change Password</div>
        <div id="logout">Logout</div>
        <button id="close">Close</button>
        `;
    }
    if (action === "show_options_blocked") {
        registration_notification_container.className = "show_options";
        registration_notification_container.innerHTML = `
        <h3>${dialog_box_text}</h3>
        <div id="visit_profile">Visit profile</div>
        <div id="block_user">Block User</div>
        <button id="close">Close</button>
        `;
    }
    if (action === "show_options_unblocked") {
        registration_notification_container.className = "show_options";
        registration_notification_container.innerHTML = `
        <h3>${dialog_box_text}</h3>
        <div id="unblock_user">Unblock User</div>
        <button id="close">Close</button>
        `;
    }
    if (action === "registration_notification") {
        registration_notification_container.className = "registration_notification";
        registration_notification_container.innerHTML = `
        <h3>${dialog_box_text}</h3>
        <button id="close">Close</button>
        `;
    }
    registration_dialog.appendChild(registration_notification_container);
    document.body.appendChild(registration_dialog);
    registration_dialog.showModal();
    document.querySelector("#close").addEventListener("click", () => registration_dialog.remove());
}
export function general_notifications(event) {
    const general_notifications_container = document.getElementById("general_notifications_container");

    const notification = document.createElement("div");
    notification.className = "general_notifications";
    notification.innerHTML = `
    <div style="background-color: purple; color: white; border-radius: 10px 10px 0 0">
        Notification!</div>
    Game has been sucessfully added!
</div>
    `;

    general_notifications_container.prepend(notification);

    setTimeout(() => {
        notification.remove();
    }, 2300);
}


// Det är den animerade notifikationen som är där nere som används BARA en gång.
export function general_notifications_search(event) {
    const search_dialog_notifications_container = document.getElementById("general_notifications_container_search");

    const notification = document.createElement("div");
    notification.className = "general_notifications";
    notification.innerHTML = `
    <div style="background-color: purple; color: white; border-radius: 10px 10px 0 0">
        Notification!</div>
    Game has been sucessfully added!
</div>`;

    search_dialog_notifications_container.prepend(notification);
    document.getElementById("searched_game_dialog").appendChild(search_dialog_notifications_container);
    3
    setTimeout(() => {
        notification.remove();
    }, 2300);
}

// Loading screenen för när man fetchar data.
export function loading_screen() {
    const cover = document.createElement("div");
    cover.id = "loading_cover";

    const loading_icon = document.createElement("div");
    loading_icon.id = "loading_icon";
    loading_icon.textContent = "Fetching data...";
    cover.appendChild(loading_icon);

    document.body.appendChild(cover);
}

// Tar bort loading screenen när man fetchar.
export function remove_loading_screen() {
    document.getElementById("loading_cover").remove();
}