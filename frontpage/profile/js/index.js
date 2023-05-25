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

                if(user.profile_comments.length !== 0){
                    show_messages(user.profile_comments);
                }
                localStorage.setItem("profile_picture", user.profile_picture);

            }
        });
    })

}

let favorite_game = document.querySelector("#upload_favorite_game");
favorite_game.addEventListener("change", upload_picture);

let profile_picture = document.querySelector("#profile_pic_form");
profile_picture.addEventListener("change", upload_picture);

let banner_picture = document.querySelector("#banner_picture");
banner_picture.addEventListener("change", upload_picture);

function upload_picture(event){
    event.preventDefault();
    let image;
    let formData;
    let check_profile_pic = false;
    if(event.target.id === "upload_profile_picture"){
        image = document.querySelector("#profile_image");
        formData = new FormData(profile_picture);
        formData.append("action", "profile_picture");
        check_profile_pic = true;
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
    formData.append("username", localStorage.getItem("username"));

    let request = new Request("./profile/php/upload.php", {
        method: "POST",
        body: formData,
    });
    
    fetch(request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            image.style.backgroundImage = `url(./profile/images/${data.filename})`;

            if(check_profile_pic === true){
                localStorage.setItem("profile_picture", data.filename);
                document.getElementById("comment_profile").style.backgroundImage = `url(./profile/images/${localStorage.getItem("profile_picture")})`;
                document.querySelectorAll(".profile_picture").forEach(element => {
                    console.log(element);
                    element.style.backgroundImage = `url(./profile/images/${localStorage.getItem("profile_picture")})`;
                })
            }
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
            username: localStorage.getItem("username"),
        }),

    });

    fetch(request)
        .then(resource => resource.json())
        .then(data => { 
            div.innerHTML = `
                <div class="profile_picture" style='background-image: url("./profile/images/${localStorage.getItem("profile_picture")}")'></div>
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
        <div class="profile_picture" style='background-image: url("./profile/images/${localStorage.getItem("profile_picture")}'></div>
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
    let timestamp = event.target.parentElement.querySelector("#timestamp").innerHTML;
    let request = new Request("/frontpage/profile/php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            action: "remove",
            timestamp: timestamp,
            username: localStorage.getItem("username"),
        }),

    });
    fetch(request)
        .then(resource => resource.json())
        .then(data => { console.log(data)
            event.target.parentElement.remove();
        })
}

