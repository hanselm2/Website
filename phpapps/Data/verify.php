<?php
session_start();
$username="handhre1_tester";
$password="generic";
$db="handhre1_tester";
$sql="localhost";
$table="LUI";
$uname=strip_tags(substr($_POST["uname"],0,32));
$pword=strip_tags(substr($_POST["pword"],0,32));
$query="SELECT uniqueID, Super FROM " . $table . " WHERE uName=MD5('" . $uname . "') AND pWord=MD5('" . $pword . "')";
$con=mysqli_connect($sql, $username, $password);
if (mysqli_select_db($db, $con))
{
   $result=mysqli_fetch_array(mysqli_query($con, $query));
    if ($result)
      {
          $_SESSION['UserREF']=$result[0];
          if ($result[1])
          {
             $_SESSION['sup']=$result[1];
          }
          $_SESSION["LID"]=md5(time());
          $_SESSION["IP"]=md5($_SERVER["REMOTE_ADDR"]);
          $_SESSION['HTTP_USER_AGENT']= md5($_SERVER['HTTP_USER_AGENT']);
          mysqli_close($con);
          include("SecureUser.php");
          $LogID=md5($_SESSION["LID"] . $_SESSION["IP"] . $_SESSION["HTTP_USER_AGENT"]);
          $query="UPDATE " . $appTable . " SET LogID='" . $LogID . "'";
          mysqli_query($con, $query);
          if ($loadTable)
           {
             $query="UPDATE " . $loadTable . "SET LogID=" . $LogID;
             mysqli_query($con, $query);
           }
          mysqli_close($con);
          setcookie("logged", "passthru", time()+60*60*1);
          header("Location: ../UserArea/memberArea.php");
      }
    else
      {
          $_SESSION['tries']++;
          header("Location: ../UserArea/login.php");
      }
}
else
{
    $_SESSION['tries']++;
    header("Location: ../UserArea/login.php");
}
?>