<?php
require_once "./functions.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message_data = json_decode(file_get_contents("php://input"), true);
    $all_chats = json_decode(file_get_contents("../../database/chatlogs.json"), true);
    var_dump($message_data);
    for ($i = 0; $i < count($all_chats); $i++) {
        if($all_chats[$i]["chatid"] == $message_data["chatid"]){
            $all_chats[$i]["chatlog"][] = $message_data["message"];
            file_put_contents("../../database/chatlogs.json", json_encode($all_chats, JSON_PRETTY_PRINT));
        }
    }
}

?>