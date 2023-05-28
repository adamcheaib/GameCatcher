<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $userDatabase = json_decode(file_get_contents("../../../database/users.json"), true);
    // var_dump($userDatabase);

    $username_to_send = $_GET["username"];
    $userWithoutPasswords;

    foreach ($userDatabase as $registeredUser) {

        if ($registeredUser["username"] == $username_to_send) {
            $singleUser = ["username" => $registeredUser["username"], "profile_picture" => $registeredUser["profile_picture"]];
            if(array_key_exists("profile_comments", $registeredUser) === false){
                $registeredUser["profile_comments"] = NULL;
            }
            else{
                $singleUser["profile_comments"] = $registeredUser["profile_comments"];
            }
            if (array_key_exists("banner_picture", $registeredUser) === false) {
                $singleUser["banner_picture"] = NULL;
            } else {
                $singleUser["banner_picture"] = $registeredUser["banner_picture"];
            }
            if(array_key_exists("favorite_game_images", $registeredUser) === false){
                $registeredUser["favorite_game_images"] = NULL;
            }
            else{
                $singleUser["favorite_game_images"] = $registeredUser["favorite_game_images"];
            }

            if (array_key_exists("profile_comments", $registeredUser) === false) {
                $singleUser["profile_comments"] = NULL;
            }

            else {
                $singleUser["profile_comments"] = $registeredUser["profile_comments"];
            }

            http_response_code(200);
            echo json_encode($singleUser);
            exit();
        }


    }

}

?>