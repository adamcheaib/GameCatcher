<?php
$filename = "../../database/users.json";
$json = file_get_contents($filename);
$users = json_decode($json, true);
var_dump($users);

foreach ($users as $user) {
    if($user === $_POST["username"]){
        if(!in_array($game, $_POST["username"])){
            $user["liked_games"][] = $_POST["game"];
            $data = json_encode($user);
            file_put_contents($filename, $data);
        }else{
            for($i = 0; $i < $user["liked_games"];$i++){
                if($user[$i]["liked_games"] === $_POST["game"]){
                    $user["liked_games"]["the gaame to remove"].splice($i, 1);
                    $data = json_encode($user);
                    file_put_contents($filename, $data);
                }
            }
        }
    }
}
?>