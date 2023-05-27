import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";
//import { init_profile } from "../../profile/js/index.js";
import { loading_screen, registration_notification, remove_loading_screen, } from "../../utils/functions.js";

// TO-DO: Man måste också göra en sent nyckel i users.json user objecten för att båda parter ska veta att de har blivit vännet
// nu får bara ena user pending medanst andra har ingen anning om den har blivit acceptad eller inte man måste skicka
// en till fetch när man personen clickar  


export async function init_friends_page() {

    localStorage.removeItem("where_att");
    localStorage.setItem("where_att", "friends_page");

    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    if (document.querySelector(".friends_list") !== null) {
        document.querySelector(".friends_list").remove();
    }
    document.querySelector("link").setAttribute("href", "./css/friends_page.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="display"></div>
    
    `;

    show_my_friends()

    document.querySelector("#chat").addEventListener("click", init_forum);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);

}

async function show_my_friends(event) {

    document.querySelector("#display").innerHTML = "";

    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected" ">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="display"></div>

    `;
    let body_for_fetch = {
        the_user: localStorage.getItem("username"),
        find_all_friends: true,
    }
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen()
    }

    let friend_data = await response.json();
    console.log(friend_data);

    const friends_display = document.getElementById("display");

    if (Array.isArray(friend_data)) {

        for (let i = 0; i < friend_data.length; i++) {

            let profile_dom = document.createElement("div");
            profile_dom.classList.add("profile_dom");
            profile_dom.innerHTML = `
            
            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${friend_data[i]}</div>
                
                <div class="chat"></div>
                <div class="more_options">...</div>
                </div>
                
                `;

            friends_display.appendChild(profile_dom);
        }
    } else {
        friends_display.innerHTML = `<h1>${friend_data.message}...</h1>`;
        friends_display.style.color = "black";
    }
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/chat.svg)`
        profile_pic.addEventListener("click", take_to_chat)
    })


    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)


    document.querySelectorAll(".more_options").forEach(element => {
        element.addEventListener("click", show_options);
    });
}

function show_options(event) {
    if (document.getElementById("my_friends").classList.contains("selected")) {

        registration_notification("Options", "show_options_blocked");
        event.target.parentElement.children[1].classList.add("show_profile");
        document.getElementById("visit_profile").addEventListener("click", visit_profile)
        document.getElementById("block_user").addEventListener("click", block_unblock_user);
        event.target.parentElement.children[1].setAttribute("id", "to_be_blocked");
    } else {
        registration_notification("Options", "show_options_unblocked");
        document.getElementById("unblock_user").addEventListener("click", block_unblock_user);
        event.target.parentElement.children[1].setAttribute("id", "to_be_unblocked");
    }
}

async function block_unblock_user(event) {
    let actions;
    let user;
    if (event.target.id === "block_user") {
        actions = "block";
        user = document.getElementById("to_be_blocked").textContent;
    }
    if (event.target.id === "unblock_user") {
        actions = "unblock";
        user = document.getElementById("to_be_unblocked").textContent;
    }

    const block_response = await fetch("./php/find_friend.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: user,
            me: localStorage.getItem("username"),
            action: actions,
        })
    })

    loading_screen();

    if (block_response.ok) {
        remove_loading_screen();
    }

    const data = await block_response.json()

    if (data.action === "block") {
        show_my_friends();
        document.querySelector("dialog").remove();

    }
    if (data.action === "unblock") {
        init_blocked_users()
        document.querySelector("dialog").remove();
    }

    document.querySelector("#add_friends").addEventListener("click", init_add_friends);
}




async function send_friend_request(event) {
    let username = event.target.parentElement.querySelector(".username").innerHTML;
    let body_for_fetch = {
        user_that_wants_to_befriend: localStorage.getItem("username"),
        the_request_user: username,
    }
    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen()
    }

    event.target.parentElement.remove();

    let data = await response.json();
    console.log(data);
}


async function find_user() {
    document.querySelector("#display").innerHTML = "";
    let find_account_name = document.querySelector("input").value;
    let request_account_name = localStorage.getItem("username");
    let response = await fetch(`./php/find_friend.php?find_account_name=${find_account_name}&request_account_name=${request_account_name}`);
    let account_data = await response.json();
    console.log(account_data);

    let response_for_all_friends = await fetch(`./php/find_friend.php`, {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({ the_user: localStorage.getItem("username"), find_all_friends: true })
    });

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let all_friends_of_user = await response_for_all_friends.json();
    console.log(all_friends_of_user);
    let the_check = "";
    for (let i = 0; i < account_data.length; i++) {
        if (account_data[i].profile_picture == "undefined") {
            account_data[i].profile_picture = "./general_media/default_profile_pic.svg";
        } else {
            const image_name = account_data[i].profile_picture;
            console.log(image_name);
            account_data[i].profile_picture = "./profile/images/" + image_name;
        }

        if (the_check !== "stop") {
            if (account_data[i].username !== localStorage.getItem("username")) {
                // Kollar att den man är loggad in som inte finns med  i account_data så att man inte kan adda sig själv
                account_data[i].profile_picture = "./general_media/default_profile_pic.svg";
                if (account_data[i].profile_picture == "undefined" || account_data[i].profile_picture == "./general_media/default_profile_pic.svg") {
                    account_data[i].profile_picture = "./general_media/default_profile_pic.svg";
                } else {
                    const image_name = account_data[i].profile_picture;
                    console.log(image_name);
                    account_data[i].profile_picture = "./profile/images/" + image_name;
                }
                console.log(account_data[i].username);
                let responses = await fetch(`../database/users.json`);
                loading_screen();

                if (responses.ok) {
                    remove_loading_screen();
                }

                let users = await responses.json();
                for (let i = 0; i < users.length; i++) {

                    if (users[i].hasOwnProperty("blocked")) {
                        if (users[i].username === localStorage.getItem("username")) {
                            if (users[i].blocked.includes(account_data[0].username)) {
                                return;
                            }
                        }
                    }
                }

                let profile_dom = document.createElement("div");
                profile_dom.classList.add("profile_dom");
                profile_dom.innerHTML = `

            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${account_data[i].username}</div>
                
                <div class="add_friend">Add Friend</div>
                <div class="block_friend">Block</div>
            </div>

            `;

                document.querySelector("#display").appendChild(profile_dom);
                document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
                    profile_pic.style.backgroundImage = `url(${account_data[index].profile_picture})`;
                    profile_pic.style.borderRadius = "50%";
                })

                document.querySelectorAll(".add_friend").forEach((add_btn) => {
                    add_btn.addEventListener("click", send_friend_request);
                })

            }
        }
    }
}

async function get_all_pending_friend_requests(event) {
    document.querySelector("#center_piece").innerHTML = ""

    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
                <div id="my_friends" class="unselected">My Friends</div>
                <div id="add_friends" class="unselected">Add Friends</div>
                <div id="pending" class="selected">Pending</div>
                <div id="blocked" class="unselected">Blocked</div>
            </div>
            <div id="search_wrapper">
                <input id="search"></input>
                <div id="search_image"></div>
            </div>
            <div id="display"></div>
        `;


    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)

    let username = localStorage.getItem("username");
    let body_for_fetch = {
        all_pending: "get_all_pending",
        the_request_user: username,
    }

    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let pending_dom = document.createElement("div");
        pending_dom.classList.add("pending_wrapper")
        pending_dom.innerHTML = `
            <div class="profile_picture"></div>
            <div class="account_username_pending">${data[i]}</div>
            <div class="wrapper_for_alternatives">
                <div class="accept">Accept</div>
                <div class="decline">Decline</div>
            </div>
        `;

        document.querySelector("#display").appendChild(pending_dom);
        document.querySelectorAll(".profile_picture").forEach(pic => {
            pic.style.backgroundImage = "url(./general_media/default_profile_pic.svg)";
        })

        document.querySelectorAll(".accept").forEach(accept_btn => {
            accept_btn.addEventListener("click", add_friend)
        });
        document.querySelectorAll(".decline").forEach(decline_btn => {
            decline_btn.addEventListener("click", decline_friend)
        });
    }
}


function init_add_friends() {
    document.querySelector("#display").innerHTML = "";
    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
            <div id="my_friends" class="unselected">My Friends</div>
            <div id="add_friends" class="selected">Add Friends</div>
            <div id="pending" class="unselected">Pending</div>
            <div id="blocked" class="unselected">Blocked</div>
        </div>
        <div id="search_wrapper">
            <input id="search"></input>
            <div id="search_image"></div>
        </div>
        <div id="display"></div>
        `;
    document.querySelector("#search_image").addEventListener("click", find_user)
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    document.querySelector("#blocked").addEventListener("click", init_blocked_users)
}

async function add_friend(event) {
    let added_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;
    console.log(added_friend_username)
    let body_for_fetch = {
        added_friend_username: added_friend_username,
        the_username: localStorage.getItem("username"),
        accepted_friend_request: true,
    }

    let response = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    loading_screen();


    event.target.parentElement.parentElement.remove();
    let data = await response.json();
    console.log(data);

    // Denna fetch behövs för att man måste skicka till usern som skickas 

    let a_fetch_body = {
        logged_in_user: localStorage.getItem("username"),
        added_friend_username2: event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML,
        send_back_for_user_that_sent_friend_req: true,
    };

    let response2 = await fetch("./php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a_fetch_body)
    });


    if (response.ok && response2.ok) {
        remove_loading_screen();
    }

    let data2 = await response2.json();

    console.log(data2)
}

async function decline_friend(event) {
    let declined_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;
    console.log(declined_friend_username)
    let body_for_fetch = {
        declined_friend_username: declined_friend_username,
        the_username: localStorage.getItem("username"),
    }
    let response = await fetch("./php/find_friend.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let data = response.json();
    console.log(data);

    event.target.parentElement.parentElement.remove();
}

async function init_blocked_users(event) {
    document.querySelector("#display").innerHTML = "";

    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
        <div id="my_friends" class="unselected">My Friends</div>
        <div id="add_friends" class="unselected">Add Friends</div>
        <div id="pending" class="unselected">Pending</div>
        <div id="blocked" class="selected">Blocked</div>
    </div>
            <div id="display"></div>
        `;
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
    let response = await fetch(`../database/users.json`);

    loading_screen();

    if (response.ok) {
        remove_loading_screen();
    }

    let users = await response.json();
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === localStorage.getItem("username")) {
            users[i].blocked.forEach(element => {
                let profile_dom = document.createElement("div");
                profile_dom.textContent = element
                profile_dom.classList.add("profile_dom");
                profile_dom.innerHTML = `

            <div id="profile_wrapper">
                <div class="profile_picture"></div>
                <div class="username">${element}</div>
                
                <div class="more_options">...</div>
            </div>

            `;
                document.querySelector("#display").appendChild(profile_dom);
            });
        }
    }
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./general_media/chat.svg)`
    })
    document.querySelectorAll(".more_options").forEach(element => {
        element.addEventListener("click", show_options);
    });
    document.querySelector("#main_page").addEventListener("click", init_frontpage);
    document.querySelector("#chat").addEventListener("click", init_forum)
    document.querySelector("#saved").addEventListener("click", init_collection);
    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
}


function take_to_chat(event) {
    let user = event.target.parentElement.children[1].textContent;
    init_forum(user)
}

async function visit_profile(event) {

    let user_profile = document.querySelector(".show_profile").textContent;
    console.log(user_profile);
    loading_screen();
    const response = await fetch("../database/users.json")


    if (response.ok) {
        remove_loading_screen();
    }

    const users = await response.json();
    document.querySelector("body").innerHTML = `
        <div id="whole_flex_display_wrapper">
            <main>
                <header>
                    <div id="profile_flex_div">
                        <div id="profile_image" alt="Profile Picture"></div>
                        <h2></h2>
                    </div>
                </header>
            </main>
            <div id="split">
                <div id="profile_stuff">
                    <div id="transparency"></div>
                    <div id="favorite">
                        <p>Favorite Game</p>
                        <div id="favorite_game_image" alt="Favorite Game"></div>
                    </div>
                </div>

                <div id="profile_forum">
                    <div id="chat_comments"></div>
                </div>
            </div>
        </div>
        <footer id="go_home">Go Home!</footer>

        <script src="./profile/js/index.js"></script>
        <script src="../../utils/functions.js"></script>`;

    document.querySelector("#go_home").addEventListener("click", go_home);
    function go_home(event) {
        window.location.replace("/index.html");
    }

    users.forEach(user => {
        if (user.username === user_profile) {
            console.log(user);
            document.querySelector("h2").textContent = user.username
            if (!user.hasOwnProperty('profile_picture')) {
                console.log("hrj");
                document.querySelector("#profile_image").style.backgroundImage = "url(./general_media/default_profile_pic.svg)"
            } else {
                console.log(user);
                document.querySelector("#profile_image").style.backgroundImage = `url(./profile/images/${user.profile_picture})`;
            }
            if (!user.hasOwnProperty('banner_picture')) {
                document.querySelector("main").style.backgroundColor = "rgb(73, 73, 112)"
            } else {
                document.querySelector("main").style.backgroundImage = `url(./profile/images/${user.banner_picture})`;
            }
            if (!user.hasOwnProperty('favorite_game_images')) {
                document.querySelector("#favorite_game_image").style.backgroundColor = "rgb(73, 73, 112)"
            } else {
                document.querySelector("#favorite_game_image").style.backgroundImage = `url(./profile/images/${user.favorite_game_images})`;
            }
            if (user.hasOwnProperty('profile_comments')) {
                console.log(element);
                let section = document.querySelector("#profile_forum")
                let div = document.createElement("div");
                div.classList.add("comments_section");
                div.innerHTML = `
                                <div class="profile_picture" style='background-image: url(./profile/images/${user.profile_picture}'></div>
                                <p>${element.message}</p>
                                <p id="timestamp">${element.timestamp}</p>
                                `
                section.appendChild(div)

            }

        }
    });



}