<?php

function sendJSON($message, $http_code = 200) {
    header("content-type: application/json");
    http_response_code($http_code);
    echo json_encode($message);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $logged_on_user = json_decode(file_get_contents("php://input"), true);
    
    file_put_contents("../../database/logged_on_user.json", json_encode($logged_on_user, JSON_PRETTY_PRINT));
    
    sendJSON($logged_on_user);
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $currently_logged_on = json_decode(file_get_contents("../../database/logged_on_user.json"), true);

    if ($currently_logged_on != null) {
        $message = ["logged_on_user" => $currently_logged_on["logged_on_user"]];
        sendJSON($message);
    } else {
        $message = ["error" => "error"];
        sendJSON($message, 404);
    }
}
?>