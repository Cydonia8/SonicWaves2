<?php
    session_start();
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    $con = new mysqli('localhost', 'root','','sonicwaves');

    $playlist = $_GET["lista"];
    $song = $_GET["cancion"];

    $query = $con->prepare("SELECT count(*) from playlist_includes where playlist = ? and song = ?");
    $query->bind_param('ii', $playlist, $song);
    $query->bind_result($check);
    $query->execute();
    $query->fetch();
    $query->close();

    $last_song = $con->prepare("SELECT order from playlist_includes where playlist = ? order by order desc limit 1");
    $last_song->bind_param('i', $playlist);
    $last_song->bind_result($last);
    $last_song->execute();
    $last_song->fetch();
    $last_song->close();

    $order = $last != '' ? ++$last : 1;


    if($check == 0){
        $insert = $con->prepare("INSERT INTO playlist_includes (playlist, song, order) values (?,?,?)");
        $insert->bind_param('iii', $playlist, $song, $order);
        $insert->execute();
        $insert->close();
        http_response_code(200);
    }else{
        http_response_code(400);
    }
    
    $con->close();