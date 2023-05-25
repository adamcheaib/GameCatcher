<?php

require_once "./functions.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);
    $old_user = [];


    for ($index = 0; $index < count($all_users); $index++) {
        if ($data["username"] == $all_users[$index]["username"]) {
            $old_user[0] = $all_users[$index];

            array_splice($all_users, $index, 1);

            if (array_key_exists("favorite_games", $old_user) == true) {

                $a_favorite_game = [
                    "name" => $data["name"],
                    "image" => $data["image"],
                ];

                $old_user[1]["favorite_games"][] = $a_favorite_game;
                $old_user_with_out_password_for_send = [
                    "username" => $old_user[0]["username"],
                    "favorite_games" => $old_user[0]["favorite_games"],
                ];
            }
            else

            if (array_key_exists("favorite_games", $old_user) == false) { 


                foreach ($old_user[0]["favorite_games"] as $game) {
                    if ($game["name"] == $data["name"]) {
                        $message = ["message" => "Remove game &#xe020;"];
                        sendJSON($message);
                    }
                }


                $old_user["favorite_games"] = [];
                $a_favorite_game = [
                    "name" => $data["name"],
                    "image" => $data["image"],
                ];
                $old_user[0]["favorite_games"][] = $a_favorite_game;
                $old_user_with_out_password_for_send = [
                    "username" => $old_user[0]["username"],
                    "favorite_games" => $old_user[0]["favorite_games"],
                ];
            }


            $all_users[] = $old_user[0];
            break;
        }
    }
    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
    sendJSON($old_user_with_out_password_for_send);
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $the_username = $_GET["username"];
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);
    for ($index2 = 0; $index2 < count($all_users); $index2++) {
        if ($the_username == $all_users[$index2]["username"]) {
            sendJSON($all_users[$index2]["favorite_games"]);
        }
    }
}


if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);
    $data = json_decode(file_get_contents("php://input"), true);
    for ($i = 0; $i < count($all_users); $i++) {
        if ($data["username"] == $all_users[$i]["username"]) {
            for ($j = 0; $j < count($all_users[$i]["favorite_games"]); $j++) {
                if ($all_users[$i]["favorite_games"][$j]["name"] == $data["the_game_to_delete"]) {
                    $deleted_game = array_splice($all_users[$i]["favorite_games"], $j, 1);
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    sendJSON($deleted_game);
                }
            }
        }
    }


}


if ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);
    $data = json_decode(file_get_contents("php://input"), true);
    for ($i = 0; $i < count($all_users); $i++) {
        if ($data["username"] == $all_users[$i]["username"]) {    
            $all_users[$i]["favorite_games"] = [];
            file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
            sendJSON($all_users[$i]["favorite_games"]);     
        }
    }
}

?>