<?php
function sendJSON($message, $http_response = 200)
{
    header("Content-Type: application/json");
    http_response_code($http_response);
    echo json_encode($message);
    exit();
}
?>