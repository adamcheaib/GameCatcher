<?php

require_once "./functions.php";

ini_set("display_errors", 1);

/* Sammanfattning av vad som händer här:
    1. Vi tar emot användarnamnen på de som är involverade i chatten.
    2. Vi skickar tillbaka de två användarnas ID.
    3. Baserat på deras ID, så hämtar vi rätt chatID.
    4. Baserat på chatID så skickar vi chatloggen av både användarna.
    */


$chatlog_path = "../../database/chatlogs.json";
$chat_database = json_decode(file_get_contents($chatlog_path), true);

$user_database_path = "../../database/users.json";
$user_database = json_decode(file_get_contents($user_database_path), true);

$toSend = [];

if ($chat_database == null) {
    $chat_database = [];
}
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

    $loggedOnUserId = $toSend["loggedID"];
    $chatTargetUserId = $toSend["user2_id"];

    if (count($chat_database) !== 0) {
        for ($i = 0; $i < count($chat_database); $i++) {


            $highest_id = $chat_database[$i]["chatid"];

            if ($chat_database[$i]["chat_between"][0] == $loggedOnUserId and $chat_database[$i]["chat_between"][1] == $chatTargetUserId) {
                sendJSON($toSend);
            }
            if ($chat_database[$i]["chat_between"][1] == $loggedOnUserId and $chat_database[$i]["chat_between"][0] == $chatTargetUserId) {
                sendJSON($toSend);
            }

        }
        // Creates a one if it does not exits

        $chatlog = [
            "chatid" => $highest_id + 1,
            "chat_between" => [
                $loggedOnUserId,
                $chatTargetUserId
            ],
            "chatlog" => []
        ];

        $chat_database[] = $chatlog;
        file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
        sendJSON($toSend);
    }


    if (count($chat_database) === 0) {
        $chatlog = [
            "chatid" => 1,
            "chat_between" => [
                $loggedOnUserId,
                $chatTargetUserId
            ],
            "chatlog" => []
        ];

        $chat_database[] = $chatlog;
        file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
        sendJSON($toSend);
    }


}



if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $receivedInformation = json_decode(file_get_contents("php://input"), true);

    // Behöver vara här annars får vi error för att de två variablena blir undefined array keys och då stoppas koden



    // Skickar chat id om userna stämmer överens med det som skickades i php://input
    if ($chat_database != null or count($chat_database) > 0) {
        $the_latest_id = 1;

        // Kollar om $receivedInformation har nyckeln "get_chatlog_id".
        if (array_key_exists("get_chatlog_id", $receivedInformation)) {

            // Ifall nyckeln existerar, så går den igenom chat_database och ifall den hittar rätt chatt så skickar den tillbaka chatloggen.
            $loggedOnUserId = $receivedInformation["loggedID"];
            $chatTargetUserId = $receivedInformation["user2_id"];
            for ($i = 0; $i < count($chat_database); $i++) {
                $the_latest_id = $chat_database[$i]["chatid"];


                // Det finns två if-satser för att kontrollera vilken användare som är inloggad. Om man nu vill fetcha samma chatt.
                if ($chat_database[$i]["chat_between"][0] === $loggedOnUserId and $chat_database[$i]["chat_between"][1] === $chatTargetUserId) {

                    echo json_encode(["chatid" => $the_latest_id]);
                    exit();
                }
                if ($chat_database[$i]["chat_between"][1] === $loggedOnUserId and $chat_database[$i]["chat_between"][0] === $chatTargetUserId) {

                    echo json_encode(["chatid" => $the_latest_id]);
                    exit();
                }

            }
            // Denna skickar tillbaka chatid som sedan används i JS.
            sendJSON(["chatid" => ($the_latest_id + 1)]);

        }

        // Här används chatID som skickades tidigare från if-satsen ovan.
        if (array_key_exists("chatid", $receivedInformation)) {
            $all_post_from_before = [];
            $highest_id = 1;

            for ($i = 0; $i < count($chat_database); $i++) {

                if ($receivedInformation["chatid"] == $chat_database[$i]["chatid"]) {
                    for ($eq = 0; $eq < count($chat_database[$i]["chatlog"]); $eq++) {
                        $all_post_from_before[] = $chat_database[$i]["chatlog"][$eq];
                    }

                }


            }
            // Skickar chatloggen mellan de två användarna.
            sendJSON($all_post_from_before);
        }

    }
}


?>