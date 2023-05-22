/*function change_username_password(event){
    let change;
    let new_value = event.target.value
    if(event.target.value === "change_username"){
        change = "change_username"
    }else{
        change = "change_password"
    }

    let request = new Request("/frontpage/profile/php/upload.php", {
        method: "POST",
        body: JSON.stringify({
            action: change,
            username: localStorage.getItem("username"),
            change: new_value,
        }),

    });

    fetch(request)
        .then(resource => resource.json())
        .then(data => {console.log(data)})
}*/