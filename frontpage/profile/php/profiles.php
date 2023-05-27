<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $userDatabase = json_decode(file_get_contents("../../../database/users.json"), true);
    // var_dump($userDatabase);

    $userWithoutPasswords;

    foreach ($userDatabase as $registeredUser) {
        $singleUser = ["username" => $registeredUser["username"], "profile_picture" => $registeredUser["profile_picture"]];
        // var_dump($singleUser["banner_picture"]);
        // var_dump($userWithoutPasswords);
        if ($singleUser["banner_picture"] == NULL) {
            $singleUser["banner_picture"] = $registeredUser["banner_picture"];
        }
        $userWithoutPasswords[] = $singleUser;
    }

    http_response_code(200);
    echo json_encode($userWithoutPasswords);
    exit();
}

?>