<?php
    require_once "../php_functions/general.php";
    session_start();
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    $con = createConnection();

    $song_id = $_GET["id_cancion"];
    $playlist_id = $_GET["id_lista"];

    $delete = $con->prepare("DELETE FROM playlist_includes where playlist = ? and song = ?");
    $delete->bind_param('ii', $playlist_id, $song_id);
    $delete->execute();
    $delete->close();
    $con->close();