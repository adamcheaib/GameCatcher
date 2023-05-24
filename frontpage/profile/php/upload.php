<?php
ini_set("display_errors", 1);
$filename = "../../../database/users.json";
$data = file_get_contents($filename);
$users = json_decode($data, true);
require_once "../../php/functions.php";

$json = file_get_contents("php://input");
$info = json_decode($json, true);

if(!file_exists("../images/")){
    mkdir("../images/");
}

if(isset($_FILES["upload"])){
    $username = $_POST["username"];
    $source = $_FILES["upload"]["tmp_name"];
    $name = $_FILES["upload"]["name"];
    $size = $_FILES["upload"]["size"];
    $destination = "../images/".$name;

    if(move_uploaded_file($source, $destination)){
        header("Content-Type: application/json");
        http_response_code(201);
        echo json_encode([
            "message" => "Success!",
            "filename" => $name,
            "size" => $size,
            "action" => $_POST["action"],
        ]);
        foreach ($users as $index => $user) {
            if ($user["username"] === $username) {
                if($_POST["action"] === "profile_picture"){
                    $users[$index]["profile_picture"] = $name;
                    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
                }
                if($_POST["action"] === "banner_picture"){
                    $users[$index]["banner_picture"] = $name;
                    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
                }
                if($_POST["action"] === "favorite_game_picture"){
                    $users[$index]["favorite_game_images"] = $name;
                    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
                } 
            }
          }
        exit();
    }
}  
?>

<?php
if(isset($info["text"])){    
    foreach($users as $index => $user) {
        if ($user["username"] === $info["username"]) {
            if (!isset($users[$index]["profile_comments"])) {
                $users[$index]["profile_comments"] = [];
            }
            $message = $info["text"];
            $date = date('Y-m-d H:i:s');

            $comment = [
                "message" => $message,
                "timestamp" => $date
            ];

            $users[$index]["profile_comments"][] = $comment;
            file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
            $message = ([
                "message" => "Success!",
                "timestamp" => $date,
            ]);
            echo json_encode($message);
            exit();
        }
    }
}
?>

<?php
if(isset($info["action"])){
    $username = $info["username"];
    foreach ($users as $index => $user) {
        if ($user["username"] === $info["username"]){
            foreach ($users[$index]["profile_comments"] as $commentIndex => $comment) {
                if($comment["timestamp"] === $info["timestamp"]){
                    array_splice($users[$index]["profile_comments"], $commentIndex, 1);
                    break; 
                }
            }
        }
    }
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    echo json_encode($message);
    exit();
}
?>
<?php
if(isset($info["change"])){
    $username = $info["username"];
    foreach ($users as $index => $user) {
        if ($user["username"] === $info["username"]){
            if($info["change"] === "change_username"){
                $users[$index]["username"] = $info["new_value"];
            }else{
                $users[$index]["password"] = $info["new_value"];
            }
        }
    }
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    echo json_encode($message);
    exit();
}
?>