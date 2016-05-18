<?php
$menuTable="Menu_App";
$type=$appArray['AddInfo'];
$menuquery="SELECT * FROM " . $menuTable . " WHERE UserType='" . $type . "'";
//$menuquery="SELECT * FROM Menu_App WHERE UserType='Super'";
$menuresult=mysqli_query($menuquery);
$tabitem=mysqli_fetch_assoc($menuresult);
$menuhtml="<ul id='MainMenu'>";
$headerInfo="<script type='text/javascript' src='ajax/AppUI.js'></script>";
do
{
   if($tabitem['Tab'])
   {
     $menuhtml=$menuhtml . "<li><a onclick=AppLoad('" . $tabitem['Script'] . "')>" . $tabitem['Tab'] . "</a></li>";
   }
//   if($tabitem['Resources'])
//    {
//         $filetype=substr($tabitem['Resources'], strrpos($tabitem['Resources'], ".")+1);
//       switch ($filetype)
//       {
//          case 'js':
//              $heading="<script type='text/javascript' src='" . $tabitem['Resources'] . "'></script>";
//              break;
//          case 'css':
//              $heading="<link rel='stylesheet' type='text/css' href='" . $tabitem['Resources'] . "' />";
//              break;
//          default:
//              $heading="";
//       }
//       $headerInfo=$headerInfo . $heading;
//   }
}
while($tabitem = mysqli_fetch_assoc($menuresult));
$menuhtml=$menuhtml . "</ul>";
?>