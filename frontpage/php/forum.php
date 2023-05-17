<?php
    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $message_data = json_decode(file_get_contents("php://input"), true);
        $all_users = json_decode(file_get_contents("../../database/users.json"), true);
        
        for($i = 0; $i < count($all_users); $i++){
            if($all_users[$i]["username"] === $message_data["username"]){
                $new_user = $all_users[$i];
                if(array_key_exists("messages", $new_user) === false){
                    $new_user["messages"] = [];
                    array_push($new_user["messages"], $message_data); 
                    
                    array_splice($all_users, $i, 1);
                    array_push($all_users, $new_user);
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($new_user);
                    exit();
                }
                else{
                    array_push($new_user["messages"], $message_data); 
                    array_splice($all_users, $i, 1);
                    
                    array_push($all_users, $new_user);
                    file_put_contents("../../database/users.json", json_encode($all_users,JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($new_user);
                    exit();
                }


                
            }
        }
    }

?>