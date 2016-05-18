<?php
session_start();
session_regenerate_id();
include('../Data/SecureUser.php');
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
  $headerInfo="";
  do
   {
    $specTable=$appArray['AppName'];
    include("../" . $appArray['AppPath']."start.php");
   }
  while($appArray=mysqli_fetch_array($result, MYSQL_ASSOC));
}
?>


<!-- Include the sitemenu div for template -->
<html>
<head>
<link rel='stylesheet' type='text/css' href='css/MemberGeneral.css' />
<?php echo $headerInfo; ?>
</head>
<body>
<?php echo $menuhtml; ?>
<div id="display">

</div>
<div id="displayhelper">

</div>
</body>
</html>