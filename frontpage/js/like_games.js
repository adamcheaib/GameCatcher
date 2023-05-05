console.log(window.localStorage)
async function get_games(){
    let array = await TEST_fetch_all_games()
    let games = array.results;
    fetch("../frontpage/php/favorited_games.php", {
        method: "POST",
        header: { "Content-type": "application/json" },
        body: JSON.stringify({username: window.localStorage.userid,
        game: "game you clicked"})
    }) 
}

get_games()