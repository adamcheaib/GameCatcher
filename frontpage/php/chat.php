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



if ($_SERVER["REQUEST_METHOD"] === "POST") 
    $receivedInformation = json_decode(file_get_contents("php://input"), true);
    $loggedOnUserId = $receivedInformation["loggedID"];
    $chatTargetUserId = $receivedInformation["user2_id"];
    $the_latest_id = 1;
    echo $loggedOnUserId;
    echo "\n";
    echo $chatTargetUserId;
    echo "\n";
    // skickar chat id om userna stämmer överens med det som skickades i php://input
    if($chat_database != null or count($chat_database) > 0){
        for ($i = 0; $i < count($chat_database); $i++) 
        { 
            $the_latest_id = $chat_database[$i]["chatid"];
            for ($j = 0; $j < count($chat_database[$i]["chat_between"]); $j++) 
            { 
                if($chat_database[$i]["chat_between"][$j] === $loggedOnUserId){
                    if($chat_database[$i]["chat_between"][$j] === $chatTargetUserId )
                    {
                        echo $chat_database[$i]["chatid"];
                        exit();
                    }
                } 
                if($chat_database[$i]["chat_between"][$j] === $chatTargetUserId)
                {
                    if($chat_database[$i]["chat_between"][$j] === $loggedOnUserId)
                    {
                        echo $chat_database[$i]["chatid"];
                        exit();
                    } 
                } 
            } 
        }
        
        // Här körs koden om den inte hittar de två personerna id man skickar inte hittas
        $chatlog = [
            "chatid" => $the_latest_id + 1,
            "chat_between" => [ 
                $loggedOnUserId,
                $chatTargetUserId
            ],
            "chatlog" => [],
        ];
    
        $chat_database[] = $chatlog;
        file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
        sendJSON(["First chat has been created"]);
        exit();
    }


    else{
        
        if ($chat_database == null) {
            $chat_database = [];
        }
    
        $chatlog = [
            "chatid" => $the_latest_id,
            "chat_between" => [ 
                $loggedOnUserId,
                $chatTargetUserId
            ],
            "chatlog" => [],
        ];
        $chat_database[] = $chatlog;
        file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
        sendJSON(["First chat has been created"]);
        exit();
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