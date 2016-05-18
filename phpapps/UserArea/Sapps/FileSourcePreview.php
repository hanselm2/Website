<?php

session_start();
session_regenerate_id();

include_once("fileTypeDirections.php");

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
  include("../../Data/BufferManifestLinker.php");

  $file=$_POST['newFile'];
  $fileName=strrchr($file, "/");
  $fileName=substr($fileName, 1);
  $refTable=typeDecide($file);
  if($refTable!="unallowed")
  {
    $changeQuery="UPDATE " . $refTable . " SET UploadState='2' WHERE User='" . mysqli_real_escape_string($_SESSION["UserREF"]) . "' AND FileName='" . mysqli_real_escape_string($fileName) . "'";
    $result=mysqli_query($changeQuery);
    if($result)
    {
      echo "LOADED";
    }
    else
    {
      echo "ERROR LOADING";
    }
  }
}

?>