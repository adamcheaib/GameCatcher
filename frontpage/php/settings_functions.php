<?php
$filename = "../../database/users.json";
$json = file_get_contents($filename);
$users = json_decode($json, true);
$data = file_get_contents("php://input");

if(isset($data["action"])){
    if($data["action"] === "new_username"){
        $value = ["username"];
        $new_value = $_PATCH["new_username"];
    }
    if($data["action"] === "new_password"){
        $value = ["password"];
        $new_value = $_PATCH["new_password"];
    }
    if($data["action"] === "new_email"){
        $value = ["email"];
        $new_value = $_PATCH["new_email"];
    }
}
    $username = $data["username"];
    foreach ($users as $user) {
        if($user === $username){
            $user[$value] = $new_value;
            $new_users = json_encode($users);
            file_put_contents($filename, $new_users);
        }
    }
?>

