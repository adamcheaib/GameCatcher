<?php
require_once "./functions.php";

// Skapar meddelanden och sparar dem. Tanken med detta är att det ska skapa meddelanden på direkten när man väl har skickat.
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message_data = json_decode(file_get_contents("php://input"), true);
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);
    $all_chats = json_decode(file_get_contents("../../database/chatlogs.json"), true);
    for ($i = 0; $i < count($all_chats); $i++) {
        if ($all_chats[$i]["chatid"] == $message_data["chatid"]) {
            $toSend = [];
            for ($index = 0; $index < count($all_users); $index++) {
                if ($message_data["loggedOnID"] == $all_users[$index]["id"]) {
                    $toSend["username"] = $all_users[$index]["username"];
                    $toSend["profile_picture"] = $all_users[$index]["profile_picture"];
                    $toSend["message"] = $message_data["message"];
                    $all_chats[$i]["chatlog"][] = $toSend;
                    file_put_contents("../../database/chatlogs.json", json_encode($all_chats, JSON_PRETTY_PRINT));
                    http_response_code(200);
                    sendJSON($toSend);
                    
                }

            }
        }
    }
}

else{
    http_response_code(405);
    sendJSON(["message" => "Wrong http method, only execept POST requests"]);
}

?>