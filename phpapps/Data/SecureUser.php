<?php
if (isset($_SESSION['sup']))
 {
   include "SupUserLinker.php";
 }
else
 {
   include "CommonUserLinker.php";
 }
?>