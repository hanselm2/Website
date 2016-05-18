<?php
$sql='localhost';
$username='handhre1_LowLog';
$db="handhre1_functions";
$password="%~Gf!+PUQ5MQ";
$con=mysqli_connect($sql, $username, $password);
$dbcon=mysqli_select_db($db, $con);
//Put in loop in case of no connection?
$query="SELECT After_Pics.Source, Job, RemodelType, Before_Pics.Source FROM After_Pics INNER JOIN Before_Pics ON After_Pics.ID=Before_Pics.ImageNum  WHERE After_Pics.SlideShow='Yes'";
$result=mysqli_query($con, $query);
while($row=mysqli_fetch_array($result))
{
echo $row[0] . " is first <br/>" . $row[1] . " is second <br/>" . $row[2] . " is third <br/>" . $row[3] . " is fourth <br/>" . $row[4] . " is fifth? <br/>";



}






?>