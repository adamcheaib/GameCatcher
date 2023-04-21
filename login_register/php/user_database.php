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

if ($action = "register") {
    $new_user = ["username" => $username, "password" => $password];


}

if ($action == "login") {   
    if ($username == "" or $password == "") {
        $message = ["Error" => "Invalid Credentials"];
        sendJSON($message, 400);
    }
        // CHECK THE JSON FILE IF THE USER EXISTS AND SEND BACK A SUCCESS MESSAGE
}

?>