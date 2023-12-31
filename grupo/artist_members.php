<?php
    session_start();
    require_once "../php_functions/group_functions.php";
    require_once "../php_functions/general.php";
    require_once "../php_functions/login_register_functions.php";
    forbidAccess("group");

    $decoded = decodeToken($_SESSION["token"]);
    $decoded = json_decode(json_encode($decoded), true);
    $user = $decoded["data"]["user"];

    closeSession($_POST);
    $members = groupHasMembers($user);

    if(isset($_POST["agregar"])){
        $newuser = $_POST["usuario"];
        
        $is_member = userIsMember($user);
        $exists = userExists($user);
        if($exists == 1 and $is_member == 0){
            addNewMember($newuser, $user);
        }
    }
    elseif(isset($_POST["eliminar-miembro"])){
        $id = $_POST["usuario"];
        $deleted = removeMember($id);
    }

    if(isset($_POST["send-message"])){
        $msg = strip_tags($_POST["message"]);
        $message_sent = sendMessage($msg, $user);
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="" defer></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N" crossorigin="anonymous"></script>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <link rel="stylesheet" href="../estilos.css">
    <script src="../scripts/jquery-3.2.1.min.js" defer></script>
    <script src="../scripts/artist_members.js" defer></script>
    <link rel="icon" type="image/png" href="../media/assets/favicon-32x32-modified.png" sizes="32x32" />
    <title>Miembros</title>
</head>
<body id="grupo-miembros">
    <?php
        menuGrupoDropdown("position-static");
    ?>
    <section class="container-xl">
        <h1 class="text-center mb-4">Miembros del grupo</h1>
        <div class="d-flex flex-column flex-md-row group-members-container">
            <div class="w-50">
                <h2 class="text-center mb-5">Agregar nuevo miembro</h2>
                <form class="d-flex flex-column align-items-center mt-3" action="#" method="post">
                    <div class="input-field d-flex flex-column mb-3 w-75 gap-3">
                        <div class="input-visuals d-flex justify-content-between">
                            <label for="usuario">Nombre de usuario</label>
                            <ion-icon name="radio-outline"></ion-icon>
                        </div>
                        <input type="text" name="usuario" placeholder="Nombre de usuario" required>                    
                    </div>
                    
                    <input type="submit" name="agregar" value="Agregar miembro">
                </form>
                <?php
                    if(isset($exists)){
                        if($exists == 0){
                            echo "<div class=\"alert alert-danger text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Este usuario no existe en Sonic Waves
                            </div>";
                        }else{
                            if(isset($is_member) and $is_member != 0){
                                echo "<div class=\"alert alert-danger text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Este usuario ya pertenece a otro grupo
                            </div>";
                            }else{
                                echo "<div class=\"alert alert-success text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Usuario agregado como miembro de grupo
                            </div>";
                            header("Refresh:2; url=grupo_miembros.php");
                            }
                        }
                        
                    }
                ?>
            </div>
            <div class="w-50 d-flex flex-column align-items-center gap-3">
                <h2 class="text-center mb-5">Miembros actuales</h2>
                <?php
                    if($members == 0){
                        echo "<h3 class='text-center'>No hay miembros actualmente</h3>";
                    }else{
                        getGroupMembers($user);
                    }
                    if(isset($deleted) and $deleted){
                        echo "<div class=\"alert alert-danger text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Usuario eliminado correctamente.
                            </div>";
                            echo "<meta http-equiv='refresh' content='2;url=artist_members.php'>";
                    }
                ?>
            </div>
        </div>
        <?php
            if($members != 0){
                echo "<div>
                <h2 class=\"text-center mb-4 mt-4\">Enviar mensaje a miembros</h2>
            </div>
            <form action='#' method='post'>
                <textarea name='message'></textarea>
                <button style='--clr:#27b82b' class='btn-danger-own' type='submit' name='send-message'><span>Enviar mensaje</span><i></i></button>
            </form>";
            }
            if(isset($_POST["send-message"])){
                if($message_sent){
                    echo "<div class=\"alert alert-success text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Mensaje enviado a todos los miembros del grupo.
                            </div>";
                }else{
                    echo "<div class=\"alert alert-danger text-center mt-3 w-50 mx-auto\" role=\"alert\">
                                Se ha producido un error, no se ha podido enviar el mensaje.
                            </div>";
                }
            }
        ?>
        <!-- <div>
            <h2 class="text-center mb-4 mt-4">Enviar mensaje a miembros</h2>
        </div> -->
    </section>
</body>
</html>