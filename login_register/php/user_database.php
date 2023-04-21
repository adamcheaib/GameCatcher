<?php

ini_set("display_errors", 1);

function sendJSON($message, $http_code = 200) {
    header("content-type: application/json");
    http_response_code($http_code);
    echo json_encode($message);
    exit();
}

$filename = "../../database/users.json";
if(file_exists($filename)){
    $data = file_get_contents($filename);
    $users = json_decode($data, true);
} else {
    $data = [];
}

$received_data = json_decode(file_get_contents("php://input"), true);
$action = $received_data["action"];
$username = $received_data["username"];
$password = $received_data["password"];


if ($action == "register") {
    if ($users == null) {
        $users = [];
    }

    $id = 0;
    if (1 < count($users)) {
        $new_user = ["username" => $username, "password" => $password];
        foreach ($users as  $single_user) {
            if ($id < $single_user["id"]) {
                $id = $single_user["id"];
            }
        }
    }
    $new_user["id"] = $id + 1;
    $users[] = $new_user;
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["username" => $new_user["username"]];
    sendJSON($message);
}

if ($action == "login") {
    foreach ($users as $single_user) {
        if($username == $single_user["username"] and $password == $single_user["password"]) {
            $message = ["username" => $single_user["username"], "message" => "Login successful!"];
            sendJSON($message);
        }
    } 

    $message = ["Error" => "User not found"];
    sendJSON($message, 404);

}
?>