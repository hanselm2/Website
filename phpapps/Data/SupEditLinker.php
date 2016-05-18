<?php
$sql='localhost';
$username='handhre1_Control';
$password=$_SESSION['sup'];
$db="handhre1_functions";
$con=mysqli_connect($sql, $username, $password);
$dbcon=mysqli_select_db($db, $con);
if (!$dbcon)
{
    if (isset($_COOKIE['logged']))
    {
      setcookie('logged', 'end', time()-3600);
    }
    header('Location: login.php');
}
?>