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
  $HeaderInfo="body*script*src*jscript/EditPageData.js*type*text/javascript~head*<link rel='stylesheet' type='text/css' href='css/PageEdit.css' />";
  $FileList="display*";
  $i=0;
  $dir=opendir("../../../");
  while (false !== ($file=readdir($dir)))
  {
    if (substr_count($file, ".php")==1 && $file!="indexOrig.php")
    {
      $i++;
      $FileList=$FileList . "<div class='listEl' id='Page" . $i . "' onclick='showData(this)'>" . $file . "</div>";
    }
  }
  echo $HeaderInfo . "~" . $FileList;
}
?>