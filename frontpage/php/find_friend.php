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
                if($all_users[$j]["username"] === $fetch_data["the_request_user"] and array_key_exists("pending", $all_users[$j]) === false  ){
                    $all_users[$j]["pending"] = [];
                    $all_users[$j]["pending"][] = $fetch_data["user_that_wants_to_befriend"];
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($all_users[$j]);
                    exit();
                }
                elseif($all_users[$j]["username"] === $fetch_data["the_request_user"] and array_key_exists("pending", $all_users[$j]) === true){
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

        if(array_key_exists("accepted_friend_request", $fetch_data) === true){

            for ($w = 0; $w < count($all_users); $w++) { 
                if($all_users[$w]["username"] === $fetch_data["the_username"] && array_key_exists("friends", $all_users[$w]) == true){
                    $all_users[$w]["friends"][] = $fetch_data["added_friend_username"];
                    for ($n = 0; $n < count($all_users[$w]["pending"]); $n++) { 
                        if($fetch_data["added_friend_username"] === $all_users[$w]["pending"][$n]){
                            array_splice( $all_users[$w]["pending"], $n, 1);
                            break;
                        }
                    }
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($all_users[$w]);
                    exit();
                }
                elseif($all_users[$w]["username"] === $fetch_data["the_username"] && array_key_exists("friends", $all_users[$w]) !== true){
                    $all_users[$w]["friends"] = [];
                    $all_users[$w]["friends"][] = $fetch_data["added_friend_username"];
                    for ($n = 0; $n < count($all_users[$w]["pending"]); $n++) { 
                        if($fetch_data["added_friend_username"] === $all_users[$w]["pending"][$n]){
                            array_splice( $all_users[$w]["pending"], $n, 1);
                            break;
                        }
                    }
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    header("Content-Type: application/json");
                    echo json_encode($all_users[$w]);
                    exit();
                }
            }
        }


        if(array_key_exists("find_all_friends", $fetch_data) === true){
            for ($w = 0; $w < count($all_users); $w++) { 
                if($all_users[$w]["username"] === $fetch_data["the_user"] && array_key_exists("friends", $all_users[$w]) == true){
                    $all_friends = [];
                    for ($o = 0; $o < count($all_users[$w]["friends"]); $o++) { 
                        $all_friends[] = $all_users[$w]["friends"][$o];
                    }
                    header("Content-Type: application/json");
                    echo json_encode($all_friends);
                    exit();
                }
            }
        }


        if(array_key_exists("send_back_for_user_that_sent_friend_req", $fetch_data) === true){
            for ($w = 0; $w < count($all_users); $w++) { 
                if($all_users[$w]["username"] === $fetch_data["added_friend_username2"] && array_key_exists("friends", $all_users[$w]) == true){
                    $all_friends = [];
                    for ($o = 0; $o < count($all_users[$w]["friends"]); $o++) { 
                        $all_friends[] = $all_users[$w]["friends"][$o];
                    }
                    header("Content-Type: application/json");
                    $all_friends[] = $fetch_data["logged_in_user"];
                    $all_users[$w]["friends"] = $all_friends;
                    file_put_contents("../../database/users.json", json_encode($all_users, JSON_PRETTY_PRINT));
                    echo json_encode($all_friends);
                    exit();
                }
            }
        }

    }

    if($_SERVER["REQUEST_METHOD"] === "PATCH"){

    }

?>