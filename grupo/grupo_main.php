<?php
    session_start();
    require_once "../square_image_creator/create_square_image.php";
    require_once "../php_functions/general.php";
    require_once "../php_functions/group_functions.php";
    require_once "../php_functions/login_register_functions.php";
    forbidAccess("group");

    $decoded = decodeToken($_SESSION["token"]);
    $decoded = json_decode(json_encode($decoded), true);

    $user = $decoded["data"]["user"];
    $artist_name = getGroupNameByMail($user);

    if(isset($_POST["completar"])){
        $image_ok = checkPhoto("foto");
        $avatar_ok = checkPhoto("foto-avatar");
        
        if($image_ok and $avatar_ok){
            $avatar = newPhotoPath("foto-avatar", "avatar", $user);
            $image = newPhotoPath("foto", "", $user);
            completeInformation($user, $_POST["bio"], $foto, $avatar);
        }
        
    }
    if(isset($_POST["actualizar-avatar"])){
        $avatar_ok = checkPhoto("foto-avatar-nueva");
        if($avatar_ok){
            $avatar = newPhotoPath("foto-avatar-nueva", "avatar", $user);
            updateAvatarPhoto($user, $avatar);
            echo "<div class=\"alert alert-success position-fixed bottom-0 start-50 translate-middle\" role=\"alert\">
                    Fotografía de avatar actualizada correctamente
                </div>";
        }else{
            echo "<div class=\"alert alert-danger position-fixed bottom-0 start-50 translate-middle\" role=\"alert\">
            Formato incorrecto
          </div>";
        }
    }elseif(isset($_POST["actualizar-foto"])){
        $image_ok = checkPhoto("foto-nueva");
        if($image_ok){
            $image = newPhotoPath("foto-nueva", "", $user);
            updateMainPhoto($user, $image);
            echo "<div class=\"alert alert-success position-fixed bottom-0 start-50 translate-middle\" role=\"alert\">
                    Fotografía principal actualizada correctamente
                </div>";
        }
    }

    if(isset($_POST["actualizar-bio"])){
        $bio = $_POST["bio"] != '' ? $_POST["bio"] : NULL;

        if($bio != NULL){
            $bio = strip_tags($bio);
            updateBio($user, $bio);
            echo "<div class=\"alert alert-success position-fixed bottom-0 start-50 translate-middle\" role=\"alert\">
                    Biografía actualizada correctamente
                </div>";
        }
    }elseif(isset($_POST["actualizar-datos"])){
        $pass = $_POST["pass"] != '' ? $_POST["pass"] : $_POST["pass-original"];

        updateGroupData($user, $pass);
        echo "<div class=\"alert alert-success position-fixed bottom-0 start-50 translate-middle\" role=\"alert\">
                Datos actualizados correctamente
            </div>";

    }
    if(isset($_POST["añadir-fotos"])){
        if(is_array($_FILES["fotos"])){
            $total = 0;       
            $cont = 0;
            $artist_id = getGroupID($user);
            foreach($_FILES["fotos"]["tmp_name"] as $key => $tmp_name){
                // var_dump($foto_op);
                $file_name = $_FILES['fotos']['name'][$key];
                $file_size =$_FILES['fotos']['size'][$key];
                $file_tmp =$_FILES['fotos']['tmp_name'][$key];
                $file_type=$_FILES['fotos']['type'][$key];
                if($file_name != ''){
                    $correct = checkPhotosArray("fotos", $key);
                    $total++;
                    if($correct){
                        $cont++;
                        $check_limit = checkPhotoLimit($user);
                        if($check_limit < 8){
                            $image_id = getAutoID("foto_grupo");
                            $path = newGroupPhotoPath($image_id, $file_type, $file_tmp, $user);
                            addGroupExtraPhoto($path, $artist_id);                    
                        }else{
                            $limit_reached = true;
                        }
                        
                    }
                }
                
            }
        }
    }
    if(isset($_POST["eliminar-foto"])){
        deletePhoto($_POST["id-foto"], "foto_grupo");
    }
    
    closeSession($_POST);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="../scripts/artist_main.js" defer></script>
    <script src="../scripts/jquery-3.2.1.min.js" defer></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N" crossorigin="anonymous"></script>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js" defer></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js" defer></script>
    <link rel="stylesheet" href="../estilos.css">
    <link rel="icon" type="image/png" href="../media/assets/favicon-32x32-modified.png" sizes="32x32" />
    <title><?php echo $artist_name; ?> | Perfil de grupo</title>
</head>
<body id="grupo-main">
    <?php
        $completed = checkInformationCompleted($user);
        if(!$completed){
            echo "<section class=\"form-group-completition gap-5\">
                    <img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\">
                    <h2>¡Bienvenido a Sonic Waves, $artist_name! Esperamos que encuentres en nuestra plataforma todo lo que necesites</h2>
                    <h3>Antes de continuar, por favor, completa la información que nos falta sobre ti, sólo será un momento.</h3>
                    <form class=\" gap-3 d-flex flex-column\" action=\"#\" method=\"post\" enctype=\"multipart/form-data\">
                        <legend>Biografía del grupo (5000 caracteres máximo)</legend>
                        <textarea maxlength=\"5000\" name=\"bio\" required rows=\"10\" cols=\"50\"></textarea>
                        <div>
                            <label for=\"foto\">Fotografía principal (asegúrate de que tenga una buena calidad, al menos 1920x1080)</label>
                            <input required type=\"file\" name=\"foto\">
                        </div>
                        <div>
                            <label for=\"foto-avatar\">Fotografía de avatar (dimensiones cuadradas, por ejemplo 400x400)</label>
                            <input required type=\"file\" name=\"foto-avatar\">
                        </div>
                        <button name='completar' style='--clr:#c49c23' class='btn-danger-own btn-completar-info-inicial'><span>Continuar</span><i></i></button>
                    </form>
                </section>";
        }else{
            menuGrupoDropdown();
            getGroupInfo($user);
            echo "<h2 class='text-center text-decoration-underline mb-4 mt-5'>Fotos de grupo</h2>";
            echo "<section class='container-fluid d-flex flex-column flex-lg-row mb-5'>
            <form class='form-fotos-extra-group' action='#' method='post' enctype='multipart/form-data'>
            <div class='d-flex flex-column align-items-center mb-4'>
                <legend class='text-center'>Añade hasta 8 fotos adicionales</legend>
                <span class='text-center'>(Recuerda usar fotos de alta calidad y panorámicas para su correcta visualización)</span>
            </div>
                <div class='row place-content-center gap-2 form-extra-fotos-grupo'>
                    <input name='fotos[]' type=\"file\" class=\"col-12 col-lg-4 custom-file-input\" multiple>
                    
                </div>
                <button name='añadir-fotos' style='--clr:#c49c23' class='btn-danger-own d-block mx-auto mt-4 mb-3'><span>Añadir fotos</span><i></i></button>
            </form>
            <div class='grid-fotos-group'>";
                getGroupExtraPhotos($user);
            echo "</div>";
            echo "</section>";
            if(isset($limit_reached)){
                echo "<div class=\"text-center mt-3 alert alert-warning\" role=\"alert\"> Has alcanzado el límite de fotos permitido.</div>";
            }
        }
        
    ?>
</body>
</html>
