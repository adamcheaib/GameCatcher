import { init_frontpage } from "./front_page.js";
import { init_forum } from "./forum.js";
import { init_collection } from "./game_collection.js";




export async function init_friends_page() {



    if (document.querySelector(".display_game_dom") !== null) {
        document.querySelector(".display_game_dom").remove();
    }
    document.querySelector("link").setAttribute("href", "./frontpage/css/friends_page.css");

    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="add_friends" class="selected" ">Add Friends</div>
            <div id="pending" class="unselected" >Pending</div>
            <div id="blocked" class="unselected" >Blocked</div>
        </div>
        <div id="search_wrapper">
            <input id="search"></input>
            <div id="search_image"></div>
        </div>
        <div id="display"></div>
    
    `;

    document.querySelector("#search_image").addEventListener("click", find_friend);

    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
}



async function send_friend_request(event) {
    let username = event.target.parentElement.querySelector(".username").innerHTML;
    let body_for_fetch = {
        user_that_wants_to_befriend: localStorage.getItem("username"),
        the_request_user: username,
    }
    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    let data = await response.json();
    console.log(data);
}


async function find_friend() {
    document.querySelector("#display").innerHTML = "";
    let find_account_name = document.querySelector("input").value;
    let request_account_name = localStorage.getItem("username");
    let response = await fetch(`./frontpage/php/find_friend.php?find_account_name=${find_account_name}&request_account_name=${request_account_name}`);
    let account_data = await response.json();
    console.log(account_data);
    for (let i = 0; i < account_data.length; i++) {
        if (account_data[i].profile_picture === undefined) {
            account_data[i].profile_picture = "./frontpage/general_media/default_profile_pic.svg";
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
    }
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(${account_data[index].profile_picture})`
    })

    document.querySelectorAll(".add_friend").forEach((add_btn) => {
        add_btn.addEventListener("click", send_friend_request);
    })

}


async function get_all_pending_friend_requests(event) {


    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
                <div id="add_friends" class="unselected">Add Friends</div>
                <div id="pending" class="selected" >Pending</div>
                <div id="blocked" class="unselected" >Blocked</div>
            </div>
            <div id="search_wrapper">
                <input id="search"></input>
                <div id="search_image"></div>
            </div>
            <div id="display"></div>
        `;

    document.querySelector("#add_friends").addEventListener("click", init_friends_page) // Måste ha denna kod rad här för att await väntar på att fetchen har skickat så då körs inte denna rad

    let username = localStorage.getItem("username");
    let body_for_fetch = {
        all_pending: "get_all_pending",
        the_request_user: username,
    }
    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    let data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let pending_dom = document.createElement("div");
        pending_dom.innerHTML = `
            <div class="account_username_pending">${data[i]}<div>
        `;

        document.querySelector("#display").appendChild(pending_dom);
    }

}



document.querySelector("#main_page").addEventListener("click", init_frontpage);
document.querySelector("#chat").addEventListener("click", init_forum)
document.querySelector("#saved").addEventListener("click", init_collection);
