<?php
$sql='localhost';
#$username='handhre1_LowLog';
$username='root';
#$password='access';
$password='';
$db="handhre1_functions";
$con=mysqli_connect($sql, $username, $password);
$dbcon=mysqli_select_db($con, $db);


?>
