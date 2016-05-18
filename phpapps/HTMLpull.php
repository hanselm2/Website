<?php
include('Data/functionLinker.php');

$query="SELECT InnerHtml FROM pageData WHERE Page='" . $pageIndex . "' AND Spot='" . $spot . "'";
$result=mysqli_query($con, $query);
if($result)
{
$insert="";
 while($array=mysqli_fetch_assoc($result))
 {
   $insert=$insert . $array["InnerHtml"];
 }
 $insert=rawurldecode($insert);
mysqli_close($con); 
}
else
{  
$insert="";
//place load error
}
?>
