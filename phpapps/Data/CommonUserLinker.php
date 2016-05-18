<?php
$sql="localhost";
$db="handhre1_Users";
$username="handhre1_LowLog";
$password="%~Gf!+PUQ5MQ";
$con=mysqli_connect($sql, $username,$password);
mysqli_select_db($db, $con);
$appTable=$_SESSION["UserREF"] . "_APPS";
$loadTable=$_SESSION["UserREF"] . "_FILES";
?>
