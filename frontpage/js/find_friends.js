document.addEventListener("keydown", get_users);



function get_users(event){
    if(event.key === "Enter"){
        console.log("Rätt");
        fetch("../../database/users.json")
        .then(r => r.json()).then(resource => find_friend(resource));
    }
    
}

function find_friend(usersArray){
    let username = document.querySelector("#username").value;
    for(let i = 0; i < usersArray.length;i++){
        if(usersArray[i].username === username){
            console.log(usersArray[i]);
        }
    }
    console.log("User not found :(");
}