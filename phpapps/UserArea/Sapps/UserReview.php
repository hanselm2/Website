<?php
session_start();
session_regenerate_id();
include('../../Data/SecureUser.php');
$ip=md5($_SERVER["REMOTE_ADDR"]);
$LogID=md5($_SESSION['LID'] . $ip . md5($_SERVER['HTTP_USER_AGENT']));
$query="SELECT * FROM " . $appTable . " WHERE LogID='" . $LogID . "'";
$result=mysqli_query($con, $query);
$appArray=mysqli_fetch_assoc($result);
if($_SESSION['IP']!=$ip || !$appArray)
{
  if (isset($_COOKIE['logged']))
   {
      setcookie('logged', 'end', time()-3600);
   }
  header("Location:login.php");
}
else
{
  $query="SELECT * FROM User_List";
  $result=mysqli_query($con, $query);
  $i=1;
  $HeaderInfo="head*<script type='text/javascript' src='EditUser.js'></script>";
  //add css file as well
  $UserList="display*";
  while($User=mysqli_fetch_assoc($result))
  {
    $UserList=$UserList . "<div id='User" . $i . "'><div id='Name'>" . $User['Name'] . "</div><div id='Address'>" . $User['Address'] . "</div><div id='Job Status'>" . $User['JobStatus'] . "</div><div id='Creation Date'>" . $User['CreationDate'] . "</div><div id='LoginData'>" . $User['LastLog'] . "</div><a id='edit' onclick='EditUser.js'>Edit</a></div>"; 
  }
  echo $HeaderInfo . "," . $UserList;
}
?>