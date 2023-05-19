"use strict"
get_preset_information()

function get_preset_information(){
    fetch("../../../../database/users.json")
    .then(resource => resource.json())
    .then(users => {
        users.forEach(user => {
            if(user.username === localStorage.username){
                document.getElementById("profile_image").style.backgroundImage = `url(./profile/images/${user.profile_picture})`;
                document.getElementById("favorite_game_image").style.backgroundImage = `url(./profile/images/${user.favorite_game_images})`;
                document.querySelector("main").style.backgroundImage = `url(./profile/images/${user.banner_picture})`;
                document.getElementById("comment_profile").style.backgroundImage = `url(./profile/images/${user.profile_picture})`;

                show_messages(user.profile_comments, user.profile_picture);
                localStorage.setItem("profile_picture", user.profile_picture);

            }
        });
    })

}

let friends = document.getElementById("friends");
friends.addEventListener("click", show_friends);

let favorite_game = document.querySelector("#upload_favorite_game");
favorite_game.addEventListener("change", upload_picture);

let profile_picture = document.querySelector("#profile_pic_form");
profile_picture.addEventListener("change", upload_picture);

let banner_picture = document.querySelector("#banner_picture");
banner_picture.addEventListener("change", upload_picture);

function show_friends(event){
    console.log(event);
    let body = document.querySelector("body");
    body.innerHTML = `
    <body>
        <main>
            <header>
                <img alt="">
                <h2>Callw</h2>
            </header>
        </main>
    <section>
        <div id="menu">
            <p id="friends">Friends</p>
            <p id="about">About</p>
        </div>
    </section>
    <div id="friends_list">
        <div>
        <div id="profile_forum">
        
        </div>
    </div>
    </div>
    </body>
    `;
    let your_profile = document.querySelector("#about");
    your_profile.addEventListener("click", go_back);
}

function go_back(event){
    let body = document.querySelector("body");
    body.innerHTML = `
    <body>
    <main>
        <header>
            <img id="profile_image" src="./profile/php/images/200022490340-0-1000.png" alt="Profile Picture">
            <form id="profile_pic_form"  action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
                <input type="file" id="upload_profile_picture" name="upload"></input>
                <button type="submit">UPLOAD</button>
            </form>
            
            <h2>Callw</h2>
        </header>
    </main>
<section>
    <div id="menu">
       <p id="friends">Friends</p>
       <p id="about">About</p>
    </div>
</section>
<div id="split">
    <div id="nav">
        <div>home</div>
        <div>games</div>
        <div>chat</div>
        <div>settings</div>
    </div>
    <div id="profile_stuff">
        <div id="feeling">
            <p>How i'm feeling</p>
            <p>Mood</p>
            <p id="emoji"></p>
        </div>

        <div id="transparency"></div>

        <div id="favorite">
            <p>Favorite Game</p>
            <img id="favorite_game_image" alt="Favorite Game">
        </div>
        <form id="upload" action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
            <input type="file" id="upload_favorite" name="upload"></input>
            <button type="submit">UPLOAD</button>
        </form>
        
    </div>

    <div id="profile_forum">
        <div class="comments_section">
            <img id="comment_profile" alt="Profile Picture">
            <input id="message" name="profile_message" type="text" placeholder="Write something..." >
            <button id="send_message">Send Message!</button>
        </div>
    </div>
</div>

</body>
`
fetch("../../../../database/users.json")
    .then(resource => resource.json())
    .then(users => {
        users.forEach(user => {
            if(user.username === localStorage.username){
                document.getElementById("profile_image").src = "./profile/images/" + user.profile_picture;
                document.getElementById("favorite_game_image").src = "./profile/images/" + user.favorite_game_images;
            }
        });
    })

let message = document.querySelector("#send_message");
message.addEventListener("click", send_message);
let friends = document.getElementById("friends");
friends.addEventListener("click", show_friends);

}

function upload_picture(event){
    event.preventDefault();
    let image;
    let formData;
    if(event.target.id === "upload_profile_picture"){
        image = document.querySelector("#profile_image");
        formData = new FormData(profile_picture);
        formData.append("action", "profile_picture");
    }
    if(event.target.id === "upload_banner_picture"){
        image = document.querySelector("main");
        formData = new FormData(banner_picture);
        formData.append("action", "banner_picture");
    }
    if(event.target.id === "upload_favorite"){
        image = document.querySelector("#favorite_game_image");
        formData = new FormData(favorite_game);
        formData.append("action", "favorite_game_picture");
    }

    formData.append("username", localStorage.username);

    let request = new Request("./profile/php/upload.php", {
        method: "POST",
        body: formData,
    });
    
    fetch(request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            image.style.backgroundImage = `url(./profile/images/${data.filename})`;
        })
}

let message = document.querySelector("#send_message");
message.addEventListener("click", send_message);

function send_message(event){
    event.preventDefault();
    let section = document.querySelector("#profile_forum")
    let message = document.querySelector("#message").value
    let div = document.createElement("div");
    div.textContent = message;
    div.classList.add("comments_section");
   

    let request = new Request("/frontpage/profile/php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            text: message,
            username: localStorage.username,
            
        }),

    });

    fetch(request)
        .then(resource => resource.json())
        .then(data => { console.log(data)
            console.log(localStorage);
        div.innerHTML = `
            <div class="profile_picture" style='background-image: url("./profile/images/${localStorage.profile_picture}")'></div>
            <p>${message}</p>
            <p id="timestamp">${data.timestamp}</p>
            <div class="delete">delete</div>
            `
            document.querySelector(".delete").addEventListener("click", remove_comment);
        })

        

    section.appendChild(div)
}
function show_messages(messages) {
    console.log(messages);
    for(let i = 0;i < messages.length;i++){
        let section = document.querySelector("#profile_forum")
        let div = document.createElement("div");
        
        div.classList.add("comments_section");

        div.innerHTML = `
        <div class="profile_picture" style='background-image: url("./profile/images/${localStorage.profile_picture}");'></div>
        <p>${messages[i].message}</p>
        <p id="timestamp">${messages[i].timestamp}</p>
        <div class="delete">delete</div>
        `
        section.appendChild(div)  
        let deleteButtons = document.querySelectorAll(".delete");
            deleteButtons.forEach(button => {
            button.addEventListener("click", remove_comment);
        });
    }
}



function remove_comment(event){
    console.log(event);
    let timestamp = event.target.parentElement.querySelector("#timestamp").innerHTML;
    console.log(timestamp);
    let request = new Request("/frontpage/profile/php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            timestamp: timestamp,
            username: localStorage.username,
        }),

    });
    fetch(request)
        .then(resource => resource.json())
        .then(data => { console.log(data)
            event.target.parentElement.remove();
        })
}