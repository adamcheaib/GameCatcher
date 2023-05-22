<?php
require_once "./functions.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message_data = json_decode(file_get_contents("php://input"), true);
    $all_users = json_decode(file_get_contents("../../database/users.json"), true);

    for ($i = 0; $i < count($all_users); $i++) {
    
    }
}

?>