<?php

require_once "./functions.php";

ini_set("display_errors", 1);


$chatlog_path = "../../database/chatlogs.json";
$chat_database = json_decode(file_get_contents($chatlog_path), true);

$user_database_path = "../../database/users.json";
$user_database = json_decode(file_get_contents($user_database_path), true);

$toSend;


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $loggedOnUsername = $_GET["username"];
    $chatTargetUser = $_GET["targetUsername"];

    for ($i = 0; $i < count($user_database); $i++) {
        if ($loggedOnUsername == $user_database[$i]["username"]) {
            $toSend["loggedID"] = $user_database[$i]["id"];
            $toSend["loggedUsername"] = $user_database[$i]["username"];
        }

    }

    for ($i = 0; $i < count($user_database); $i++) {
        if ($chatTargetUser == $user_database[$i]["username"]) {
            $toSend["user2_id"] = $user_database[$i]["id"];
            $toSend["user2_username"] = $user_database[$i]["username"];
        }

    }


    sendJSON($toSend);
}



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $receivedInformation = json_decode(file_get_contents("php://input"), true);
    $loggedOnUsername = $receivedInformation["userID1"];
    $chatTargetUser = $receivedInformation["userID2"];

    if ($chat_database == null) {
        $chat_database = [];
    }

    $chatlog = [
        "chatid" => 1,
        "chat_between" => [
            [
                "userid1" => $loggedOnUsername,
                "profile_picture" => "Somewhere"
            ],
            [
                "userid2" => $chatTargetUser,
                "profile" => "hi there"
            ],
        ],
        "chatlog" => [],
    ];

    $chat_database[] = $chatlog;
    file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
}

// $id = 0;
//     if (0 <= count($users)) {
//         $new_user = ["username" => $username, "password" => $password, "favorite_games" => []];
//         foreach ($users as $single_user) {
//             if ($id < $single_user["id"]) {
//                 $id = $single_user["id"];
//             }
//         }
//     }
// $new_user["id"] = $id + 1;


?>