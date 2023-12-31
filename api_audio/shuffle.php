<?php
    require_once "../php_functions/login_register_functions.php";
    require_once "../php_functions/general.php";
    session_start();
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    $con = createConnection();

    $decoded = decodeToken($_SESSION["token"]);
    $decoded = json_decode(json_encode($decoded), true);
    $user = $decoded["data"]["user"];

    $query_style = $con->prepare("SELECT style from user where username = ?");
    $query_style->bind_param('s', $user);
    $query_style->bind_result($style);
    $query_style->execute();
    $query_style->fetch();
    $query_style->close();

    $query_random = $con->query("select a.id album_id, file, g.name author, a.picture picture, c.title title, c.id song_id from songs c, album_contains i, album a, artist g where i.song = c.id and a.id = i.album and a.artist = g.id and c.style = $style and a.active = 1 order by rand()");
    $list_data = [];

    while($row = $query_random->fetch_array(MYSQLI_ASSOC)){
        $list_data[] = $row;
    }
    $data["random_list"] = $list_data;

    $con->close();
    echo json_encode($data);