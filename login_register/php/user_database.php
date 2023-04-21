<?php

ini_set("display_errors", 1);

$filname = "../../database/users.json";
if(file_exists($filename)){
    $data = file_get_contents($filename);
    $users = json_decode($data, true);
}

function sendJSON($message, $http_code = 200) {
    header("content-type: application/json");
    http_response_code($http_code);
    echo json_encode($message);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$password = $data["password"];

if ($username == "" or $password == "") {
    $message = ["Error" => "Invalid Credentials"];
    sendJSON($message, 400);
}

$message = ["Login"]
?>