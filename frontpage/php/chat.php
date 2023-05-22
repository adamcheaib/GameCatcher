<?php

require_once "./functions.php";

ini_set("display_errors", 1);


$chatlog_path = "../../database/chatlogs.json";
$chat_database = json_decode(file_get_contents($chatlog_path), true);

$user_database_path = "../../database/users.json";
$user_database = json_decode(file_get_contents($user_database_path), true);

$toSend;

// Denna gör så att vi hittar och ser att users finns och retunerar ID:sen som vi ska använda
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

    $loggedID = $receivedInformation["loggedID"];
    $chatTargetID = $receivedInformation["user2_id"];

    if ($chat_database == null) {
        $chat_database = [];
    }



    if (count($chat_database) != 0) {

        for ($i = 0; $i < count($chat_database); $i++) {
            $first_person = $chat_database[$i]["chat_between"][0];
            $second_person = $chat_database[$i]["chat_between"][1];

            for ($index = 0; $index < count($chat_database[$i]["chat_between"]); $index++) {
                $send_chatlog = $chat_database[$i]["chatlog"];

                if ($loggedID == $first_person["user1_id"] and $chatTargetID == $second_person["user2_id"] or $chatTargetID == $first_person["user1_id"] and $loggedID == $second_person["user2_id"]) {
                    $message = ["message" => "First loop!"];
                    sendJSON($send_chatlog);
                } elseif ($chatTargetID == $first_person["user1_id"] and $loggedID == $second_person["user2_id"]) {
                    $message = ["message" => "Second loop!"];
                    sendJSON($send_chatlog);
                }
            }
        }

    } else {

        $chatlog = [
            "chatid" => 1,
            "chat_between" => [
                [
                    "user1_id" => $loggedOnUsername,
                    "profile_picture" => "Somewhere"
                ],
                [
                    "user2_id" => $chatTargetUser,
                    "profile_picture" => "Somewhere"
                ],
            ],
            "chatlog" => [],
        ];

        $chat_database[] = $chatlog;
        file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
    }



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