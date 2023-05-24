<?php

require_once "./functions.php";

ini_set("display_errors", 1);


$chatlog_path = "../../database/chatlogs.json";
$chat_database = json_decode(file_get_contents($chatlog_path), true);

$user_database_path = "../../database/users.json";
$user_database = json_decode(file_get_contents($user_database_path), true);

$toSend = [];

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
    

    for ($i = 0; $i < count($chat_database); $i++) {
        
        $loggedOnUserId = $toSend["loggedID"];
        $chatTargetUserId =  $toSend["user2_id"];
       
        $highest_id = $chat_database[$i]["chatid"];
        
        if($chat_database[$i]["chat_between"][0] == $loggedOnUserId and $chat_database[$i]["chat_between"][1] == $chatTargetUserId){
           sendJSON($toSend);
        } 
        if($chat_database[$i]["chat_between"][1] == $loggedOnUserId and $chat_database[$i]["chat_between"][0] == $chatTargetUserId){
            sendJSON($toSend);
        }
        
    }
        // Creates a one if it does not exits
        if(count($chat_database) !== 0){
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
        }
        

        if(count($chat_database) === 0){
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
    
   
    
    // skickar chat id om userna stämmer överens med det som skickades i php://input
    if($chat_database != null or count($chat_database) > 0 ){
        $the_latest_id = 1;
        



        if(array_key_exists("get_chatlog_id", $receivedInformation)){
            
            $loggedOnUserId = $receivedInformation["loggedID"];
            $chatTargetUserId = $receivedInformation["user2_id"];
            for ($i = 0; $i < count($chat_database); $i++) 
            { 
                $the_latest_id = $chat_database[$i]["chatid"];
              
                if($chat_database[$i]["chat_between"][0] === $loggedOnUserId and $chat_database[$i]["chat_between"][1] === $chatTargetUserId){
                   
                    echo json_encode(["chatid" => $the_latest_id]); 
                    exit();
                } 
                if($chat_database[$i]["chat_between"][1] === $loggedOnUserId and $chat_database[$i]["chat_between"][0] === $chatTargetUserId){
                    
                    echo json_encode(["chatid" => $the_latest_id]); 
                    exit();
                }
                
            }

            sendJSON(["chatid" => ($the_latest_id + 1)]); 

        }
    

        if(array_key_exists("chatid", $receivedInformation)){
            $all_post_from_before = [];
            $highest_id = 1;
             
            for ($i = 0; $i < count($chat_database); $i++) 
            { 
                
                if($receivedInformation["chatid"] == $chat_database[$i]["chatid"]){
                    for ($eq = 0; $eq < count($chat_database[$i]["chatlog"]); $eq++) { 
                        $all_post_from_before[] = $chat_database[$i]["chatlog"][$eq];
                    }

                }
                
                
            }

            sendJSON($all_post_from_before);
        }
        
    }

    
    // elseif(count($chat_database) === 0){

    //     $loggedOnUserId = $receivedInformation["loggedID"];
    //     $chatTargetUserId = $receivedInformation["user2_id"];
        
    //     $chatlog = [
    //         "chatid" => 1,
    //         "chat_between" => [ 
    //             $loggedOnUserId,
    //             $chatTargetUserId
    //         ],
    //         "chatlog" => [],
    //     ];
    
    //     $chat_database[] = $chatlog;
    //     file_put_contents($chatlog_path, json_encode($chat_database, JSON_PRETTY_PRINT));
    //     echo ($chatlog["chatid"]);
    //     exit();
    // }

        // Här körs koden om den inte hittar de två personerna id man skickar inte hittas
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


// Fixa så att varje meddelande som skickas gör det i en PATCH-request.

?>