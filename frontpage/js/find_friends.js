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
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected" ">Add Friends</div>
            <div id="pending" class="unselected" >Pending</div>
            <div id="blocked" class="unselected" >Blocked</div>
        </div>
        <div id="display"></div>
    
    `;

    show_my_friends()

    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#pending").addEventListener("click", get_all_pending_friend_requests);
}

async function show_my_friends(event){

    document.querySelector("#display").innerHTML = "";

    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="selected"> My Friends</div>
            <div id="add_friends" class="unselected" ">Add Friends</div>
            <div id="pending" class="unselected" >Pending</div>
            <div id="blocked" class="unselected" >Blocked</div>
        </div>
        <div id="display"></div>

    `;
    let body_for_fetch = {
        the_user: localStorage.getItem("username"),
        find_all_friends: true,
    }
    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    })

    let friend_data = await response.json();
    console.log(friend_data);

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

        document.querySelector("#display").appendChild(profile_dom);
    }
    document.querySelectorAll(".profile_picture").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./frontpage/general_media/default_profile_pic.svg)`
    })
    document.querySelectorAll(".chat").forEach((profile_pic, index) => {
        profile_pic.style.backgroundImage = `url(./frontpage/general_media/chat.svg)`
    })

    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
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

    event.target.parentElement.remove();

    let data = await response.json();
    console.log(data);
}


async function find_user() {
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
    document.querySelector("#center_piece").innerHTML = ""

    document.querySelector("#center_piece").innerHTML = `
            <div id="navigation">
                <div id="my_friends" class="unselected">My Friends</div>
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

    document.querySelector("#add_friends").addEventListener("click", init_add_friends)
    document.querySelector("#my_friends").addEventListener("click", show_my_friends)

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
            pic.style.backgroundImage = "url(./frontpage/general_media/default_profile_pic.svg)";
        })

        document.querySelectorAll(".accept").forEach(accept_btn => {
            accept_btn.addEventListener("click", add_friend)
        });
        document.querySelectorAll(".decline").forEach(decline_btn => {
            decline_btn.addEventListener("click", decline_friend)
        });
    }
   
}


function init_add_friends(){
    document.querySelector("#display").innerHTML = "";
    document.querySelector("#center_piece").innerHTML = `
        <div id="navigation">
            <div id="my_friends" class="unselected">My Friends</div>
            <div id="add_friends" class="selected">Add Friends</div>
            <div id="pending" class="unselected" >Pending</div>
            <div id="blocked" class="unselected" >Blocked</div>
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
}

async function add_friend(event){
    let added_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;
    console.log(added_friend_username)
    let body_for_fetch = {
        added_friend_username: added_friend_username,
        the_username: localStorage.getItem("username"),
        accepted_friend_request: true,
    }

    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    event.target.parentElement.parentElement.remove();
    let data = await response.json();
    console.log(data);

}

async function decline_friend(event){
    let declined_friend_username = event.target.parentElement.parentElement.querySelector(".account_username_pending").innerHTML;
    console.log(declined_friend_username)
    let body_for_fetch = {
        declined_friend_username: declined_friend_username,
        the_username: localStorage.getItem("username"),
    }
    let response = await fetch("./frontpage/php/find_friend.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_for_fetch)
    });

    let data = response.json();
    console.log(data);

    event.target.parentElement.parentElement.remove();
}

document.querySelector("#main_page").addEventListener("click", init_frontpage);
document.querySelector("#chat").addEventListener("click", init_forum)
document.querySelector("#saved").addEventListener("click", init_collection);
