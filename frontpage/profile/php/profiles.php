<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $userDatabase = json_decode(file_get_contents("../../../database/users.json"), true);
    // var_dump($userDatabase);

    $username_to_send = $_GET["username"];
    $userWithoutPasswords;

    foreach ($userDatabase as $registeredUser) {

        if ($registeredUser["username"] == $username_to_send) {
            $singleUser = ["username" => $registeredUser["username"], "profile_picture" => $registeredUser["profile_picture"]];

            if ($registeredUser["banner_picture"] != NULL) {
                $singleUser["banner_picture"] = $registeredUser["banner_picture"];
            } else {
                $singleUser["banner_picture"] = NULL;
            }

            $singleUser["favorite_game_images"] = $registeredUser["favorite_game_images"];


            if ($registeredUser["profile_comments"] != NULL) {
                $singleUser["profile_comments"] = $registeredUser["profile_comments"];
            }

            http_response_code(200);
            echo json_encode($singleUser);
            exit();
        }


    }

}

?>