<?php
$sql='localhost';
$username='handhre1_Control';
$password=$_SESSION['sup'];
$db="handhre1_Super";
$con=mysqli_connect($sql, $username, $password);
$dbcon=mysqli_select_db($db, $con);
$appTable=$_SESSION['UserREF'] . "_APPS";
if (!$dbcon)
{
    if (isset($_COOKIE['logged']))
    {
      setcookie('logged', 'end', time()-3600);
    }
    header('Location: login.php');
}
?>