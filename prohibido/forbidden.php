<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../estilos.css">
    <script src="../scripts/forbidden.js" defer></script>
    <title>Document</title>
</head>
<body id="prohibido">
    <img src="../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png" alt="">
    <h1>Su sesión ha expirado.</h1>
    <?php
        echo "<meta http-equiv='refresh' content='3;url=../login/login.php'>";
    ?>
    <div class="container">
    <div class="equalizer"></div>
    </div>
</body>
</html>