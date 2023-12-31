<?php
    session_start();
    require_once "../php_functions/group_functions.php";
    require_once "../php_functions/general.php";
    require_once "../php_functions/login_register_functions.php";
    forbidAccess("group");
    closeSession($_POST);

    $decoded = decodeToken($_SESSION["token"]);
    $decoded = json_decode(json_encode($decoded), true);

    $user = $decoded["data"]["user"];
    $artist_name = getGroupNameByMail($user);
    
    if(isset($_POST["cargar"])){
        $artist_id = getGroupID($user); 
        $size_array = [];
        $cont = 0;
        for($i = 1; $i <= $_SESSION["num_canciones"]; $i++){       
            if($_SESSION["recopilatorio"] == "no" or $_SESSION["recopilatorio"] == NULL){
                $size = $_FILES["archivo".$i]["size"] / pow(1024, 2);
                $size_array[$cont] =$size;
                $cont++;
            }
        }
   
        $filtered = array_filter($size_array, function ($exceeded){
            return $exceeded > 6;
        });

        if(empty($filtered)){
            $correct_sizes = true;
        }else{
            $correct_sizes = false;
        }

        if($correct_sizes){
            addAlbum($artist_id, $_SESSION["titulo_album"], $_SESSION["foto_album"], $_SESSION["lanzamiento"], 1);
            for($i = 1; $i <= $_SESSION["num_canciones"]; $i++){
                if($_SESSION["recopilatorio"] == "no" or $_SESSION["recopilatorio"] == NULL){
                    $title = $_POST["titulo".$i];
                    $duration = getDuration($_FILES["archivo".$i]["tmp_name"]);
                    $style = $_POST["estilo".$i];
                    $path = moveUploadedSong("archivo".$i, $user, $_SESSION["titulo_album"]);
                    $rows = addSong($title, $path, $duration, $style);
                    $song_id = getLastSongID();
                    linkSongToAlbum($_SESSION["id_album"], $song_id);
                }else{
                    $rows = linkSongToAlbum($_SESSION["id_album"], $_POST["cancion".$i]);
                }
            }
            unsetSessionVariable(array('titulo_album', 'lanzamiento', 'num_canciones', 'recopilatorio', 'foto_album'));
        }
    }

        
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../estilos.css">
    <link rel="icon" type="image/png" href="../media/assets/favicon-32x32-modified.png" sizes="32x32"/>
    <title><?php echo $artist_name; ?> | Añadir canciones</title>
</head>
<body id="grupo-nuevo-album">
    <?php
        menuGrupoDropdown("position-static");
    ?>

    <section class="container-añadir-canciones container-xl mt-4">
        <h1 class='text-center mb-4'>Añade las canciones del nuevo álbum</h1>
        <p class="text-center mb-4"><strong>Formato MP3, máximo 100mb por archivo</strong></p>
    <?php
        if(isset($_SESSION["foto_album"])){
            if($_SESSION["recopilatorio"]  == NULL){
                echo "<form class='d-flex flex-column align-items-center gap-3' action=\"#\" method=\"post\" enctype=\"multipart/form-data\">";
                generateInputs($_SESSION["num_canciones"]);
            }else{
                if($_SESSION["recopilatorio"] == "no"){
                    echo "<form class='d-flex flex-column align-items-center gap-3' action=\"#\" method=\"post\" enctype=\"multipart/form-data\">";
                    generateInputs($_SESSION["num_canciones"]);
                }else{
                    $artist_id = getGroupID($user);
                    echo "<script src=\"../scripts/add_greatest_hits.js\" defer></script>";
                    echo "<button style='--clr:#0A90DD' class='btn-danger-own reset-form-recopilatorio'><span>Reiniciar selección</span><i></i></button>";
                    echo "<form class='d-flex flex-column align-items-center gap-3' action=\"#\" method=\"post\">";
                    generateSelects($_SESSION["num_canciones"], $artist_id);
                    echo "</form>";
                }            
            }
        }elseif(isset($artist_id)){
            if($rows != 0){
                echo "<h2 class='text-center'>Álbum añadido correctamente. Volviendo al perfil principal...</h2>";
                // echo "<meta http-equiv='refresh' content='2;url=./grupo_main.php'>";
            }
        }else{
            echo "<h2>Faltan datos</h2>";
        }

    ?>
    </section>
    <div class="alert alert-danger d-none repeated w-50 text-center mt-5 mx-auto" role="alert">
        Has repetido canciones. Vuelve a añadirlas.
    </div>
    <?php
         if(isset ($correct_sizes) and !$correct_sizes){
            echo "<div class=\"alert alert-danger repeated w-50 text-center mt-5 mx-auto\" role=\"alert\">
            Alguna de las canciones superan el límite. Vuelve a añadirlas por favor.
        </div>";
        echo "mal";
        }
    ?>
</body>
</html>