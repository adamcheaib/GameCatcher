<?php
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        $all_users = json_decode(file_get_contents("../../database/users.json"), true);
        
        $user_alternatives = [];
        $username = $_GET["find_account_name"];

        for ($i = 0; $i < count($all_users); $i++) { 
            if(str_contains($all_users[$i]["username"], $username) == true){
                $all_users[$i]["password"] = ""; // tar bort passwords på alla när den skickar men inte i självaste json filen
                array_push($user_alternatives, $all_users[$i]);
            }
            
        }
        header("Content-Type: application/json");
        echo json_encode($user_alternatives);
        exit();
    }

    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $all_users = json_decode(file_get_contents("../../database/users.json"), true);
        $fetch_data = json_decode(file_get_contents("php://input"), true);
        
        if(array_key_exists("user_that_wants_to_befriend", $fetch_data) === true){
            for ($j = 0; $j < count($all_users); $j++) { 
                if($all_users[$j]["username"] === $fetch_data["the_request_user"]){
                    $all_users[$j]["pending"] = [];
                    $all_users[$j]["pending"][] = $fetch_data["user_that_wants_to_befriend"];
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($all_users[$j]);
                    exit();
                }
            }
        }

        if(array_key_exists("all_pending", $fetch_data) === true){

            for ($w = 0; $w < count($all_users); $w++) { 
                if($all_users[$w]["username"] === $fetch_data["the_request_user"] && array_key_exists("pending", $all_users[$w]) == true){
                    $all_pending = [];
                    for ($o = 0; $o < count($all_users[$w]["pending"]); $o++) { 
                        $all_pending[] = $all_users[$w]["pending"][$o];
                    }
                    header("Content-Type: application/json");
                    echo json_encode($all_pending);
                    exit();
                }
            }
        }

    }

?>