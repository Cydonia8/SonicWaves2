<?php
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
     $dotenv = Dotenv\Dotenv::createImmutable('.');
     $dotenv->load();

     function createConnection(){
        $con = new mysqli('localhost','root','','sonicwaves');
        $con->set_charset("utf8");
        return $con;
    }

    function checkTokenIsValid(){
        if(isset($_SESSION["token"])){
            $decoded = decodeToken($_SESSION["token"]);
        }
    }

     function imageIndex($path){
        $new_path = preg_replace("`^.{1}`",'',$path);
        return $new_path;
    }
    
    function imageUser($user, $table, $identifier){
        $con = createConnection();
        $consulta = $con->prepare("SELECT avatar from $table where $identifier = ?");
        $consulta->bind_param('s',$user);
        $consulta->bind_result($avatar);
        $consulta->execute();
        $consulta->fetch();
        $consulta->close();
        $con->close();
        return $avatar;
    }

     function decodeToken($token){
        try{
            $jwt_dec = JWT::decode($token, new Key($_ENV["SECRET_KEY"], "HS256")); 
            return $jwt_dec;        
        } catch (UnexpectedValueException $e) {
            unset($_SESSION["token"]);
            echo "<meta http-equiv='refresh' content='0;url=login/login.php'>";
            return false;
        }catch(ExpiredException $e){
            unset($_SESSION["token"]);
            echo "<meta http-equiv='refresh' content='0;url=login/login.php'>";
            return false;
        }
    }

    function printMainMenu($location = "noindex"){

        if($location == "index"){
            if(isset($_SESSION["token"])){
                $token_decoded = decodeToken($_SESSION["token"]);
                $token_decoded = json_decode(json_encode($token_decoded), true);
                if($token_decoded["data"]["admin"]){
                    $avatar = imageUser("admin", "user", "username");
                    $avatar = imageIndex($avatar);
                    echo "<header class=\"header-index\">
                    <a href='index.php' class='enlace-index'><img src=\"media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"admin/admin_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }elseif($token_decoded["data"]["role"] == "user"){
                    $avatar = imageUser($token_decoded["data"]["user"], "user", "username");
                    $avatar = imageIndex($avatar);
                    echo "<header class=\"header-index\">
                    <a href='index.php' class='enlace-index'><img src=\"media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"reproductor/user_controller.php\">Reproductor</a></li>
                                <li><a href=\"contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"reproductor/reproductor.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }elseif($token_decoded["data"]["role"] == "group"){
                    $avatar = imageUser($token_decoded["data"]["user"], "artist", "mail");
                    $avatar = imageIndex($avatar);
                    echo "<header class=\"header-index\">
                    <a href='index.php' class='enlace-index'><img src=\"media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"grupo/grupo_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }else{
                    $avatar = imageUser($token_decoded["data"]["user"], "patrons", "mail");
                    $avatar = imageIndex($avatar);
                    echo "<header class=\"header-index\">
                    <a href='index.php' class='enlace-index'><img src=\"media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"patrons/patrons_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }
                
            }else{
                echo "<header class=\"header-index\">
                        <a href='index.php' class='enlace-index'><img src=\"media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"reproductor/user_controller.php\">Reproductor</a></li>
                                <li><a href=\"contacto/contacto.php\">Contacto</a></li>
                                <li><a href=\"login/login.php\">Iniciar sesión</a></li>
                            </ul>
                        </nav>
                    </header>";
            }
            
        }else{
            if(isset($_SESSION["token"])){
                if($token_decoded["data"]["admin"]){
                    $avatar = imageUser("admin", "user", "username");
                    echo "<header class=\"header-index\">
                        <a href='../index.php' class='enlace-index'><img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"../admin/admin_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }elseif($token_decoded["data"]["role"] == "user"){
                    $avatar = imageUser($token_decoded["data"]["user"], "user", "username");
                    echo "<header class=\"header-index\">
                    <a href='../index.php' class='enlace-index'><img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"../reproductor/reproductor.php\">Reproductor</a></li>
                                <li><a href=\"../contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }elseif($token_decoded["data"]["role"] == "group"){
                    $avatar = imageUser($token_decoded["data"]["user"], "artist", "mail");
                    echo "<header class=\"header-index\">
                    <a href='../index.php' class='enlace-index'><img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"../contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"../grupo/grupo_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }else{
                    $avatar = imageUser($token_decoded["data"]["user"], "patrons", "mail");
                    echo "<header class=\"header-index\">
                    <a href='../index.php' class='enlace-index'><img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"../contacto/contacto.php\">Contacto</a></li>
                                <li class=\"li-foto\">
                                    <div class=\"dropdown\">
                                        <img data-bs-toggle=\"dropdown\" aria-expanded=\"false\" class=\"rounded-circle dropdown-toggle\" src=\"$avatar\">
                                        <ul class=\"dropdown-menu\">
                                            <li><a class=\"dropdown-item\" href=\"../patrons/patrons_main.php\">Perfil</a></li>
                                            <li><form action=\"#\" method=\"post\"><input id=\"cerrar-user\" type=\"submit\" name=\"cerrar-sesion\" value=\"Cerrar sesión\"></form></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </header>";
                }
                
            }else{
                echo "<header class=\"header-index\">
                <a href='../index.php' class='enlace-index'><img src=\"../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"\"></a>
                        <nav>
                            <ul class=\"links-header\"> 
                                <li><a href=\"\">Reproductor</a></li>
                                <li><a href=\"../contacto/contacto.php\">Contacto</a></li>
                                <li><a href=\"../login/login.php\">Iniciar sesión</a></li>
                            </ul>
                        </nav>
                    </header>";
            }
        }
    }
    function closeSession($POST, $section = "noindex"){
        if($section == "noindex"){
            if(isset($_POST["cerrar-sesion"])){
                if(isset($_COOKIE['sesion'])){
                    setcookie("sesion","", time()-3600, '/');
                    unset($_SESSION['user']);
                    unset($_SESSION["user-type"]);
                    unset($_SESSION["token"]);
                    header("location:../index.php");
                }else{
                    unset($_SESSION['user']);
                    unset($_SESSION["user-type"]);
                    unset($_SESSION["token"]);
                    header("location:../index.php");
                }
                
            }
        }else{
            if(isset($_POST["cerrar-sesion"])){
                if(isset($_COOKIE['sesion'])){
                    unset($_SESSION['user']);
                    unset($_SESSION["user-type"]);
                    unset($_SESSION["token"]);
                    setcookie("sesion","", time()-3600, '/');              
                    echo "<meta http-equiv='refresh' content='0;url=index.php'>";
                }else{
                    unset($_SESSION['user']);
                    unset($_SESSION["user-type"]);
                    unset($_SESSION["token"]);
                    header("location:index.php");
                }
            }
        }    
    }
    
    function printFooter($path){
        echo "<footer id=\"footer\">
        <div class=\"container\">
            <div class=\"row\">
                <div class=\"col-md-3 d-flex flex-column align-items-center\">
                    <a href=\"$path/index.php\"><img src=\"$path/media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png\" alt=\"Logo de Sonic Waves\" class=\"img-fluid logo-footer\"></a>
                  <div class=\"footer-about\">
                      <p>All Rights Reserved | 2023</p>
                      <p>Sonic Waves es una filial de Revolver Music</p>
                  </div>
    
                </div>
                <div class=\"col-md-3 d-flex flex-column align-items-center\">
                    <div class=\"useful-link\">
                        <h2>Enlaces útiles</h2>
                        <img src=\"$path/assets/images/about/home_line.png\" alt=\"\" class=\"img-fluid\">
                        <div class=\"use-links\">
                            <li><a href=\"$path/index.php\"><i class=\"fa-solid fa-angles-right\"></i> Home</a></li>
                            <li><a href=\"$path/proximamente/proximamente.php\"><i class=\"fa-solid fa-angles-right\"></i>Próximamante: Dolby Atmos</a></li>
                            <li><a href=\"$path/reproductor/user_controller.php\"><i class=\"fa-solid fa-angles-right\"></i>Reproductor</a></li>
                            <li><a href=\"$path/contacto/contacto.php\"><i class=\"fa-solid fa-angles-right\"></i> Contacto</a></li>
                        </div>
                    </div>
    
                </div>
                <div class=\"col-md-3 d-flex flex-column align-items-center\">
                    <div class=\"social-links\">
                        <h2>Síguenos</h2>
                        <img src=\"$path/assets/images/about/home_line.png\" alt=\"\">
                        <div class=\"social-icons\">
                            <li><a href=\"\"><i class=\"fa-brands fa-twitter\"></i>Twitter</a></li>
                            <li><a href=\"\"><i class=\"fa-brands fa-instagram\"></i> Instagram</a></li>
                            <li><a href=\"\"><i class=\"fa-brands fa-bandcamp\"></i>Bandcamp</a></li>
                        </div>
                    </div>
                
    
                </div>
                <div class=\"col-md-3 d-flex flex-column align-items-center\">
                    <div class=\"address d-flex flex-column align-items-center\">
                        <h2>Nuestras oficinas</h2>
                        <img src=\"$path/assets/images/about/home_line.png\" alt=\"\" class=\"img-fluid\">
                        <div class=\"address-links\">
                            <li class=\"address1\"><i class=\"fa-solid fa-location-dot\"></i> 3 Abbey Rd, London
                            NW8 9AY, Reino Unido 
                               </li>
                               <li><a href=\"\"><i class=\"fa-solid fa-phone\"></i> +44 20 7266 7000</a></li>
                               <li><a href=\"\"><i class=\"fa-solid fa-envelope\"></i> sonicwaves@gmail.com</a></li>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
    
    </footer>";
    }

    function decodeCookie(){
        if(isset($_COOKIE['sesion'])){
            session_decode($_COOKIE['sesion']);
        }
    }
?>