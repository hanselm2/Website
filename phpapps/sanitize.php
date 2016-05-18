<?php
$formobject=$_POST["q"];
$forminput=$_POST["j"];
$formobject=str_replace(" ", "", $formobject);
switch ($forminput)
{
case "fname":
case "city":
case "lname":
	if (!filter_var($formobject, FILTER_VALIDATE_REGEXP,array("options"=>array("regexp"=>"/^\w+$/"))))
	   {
	      $response="Please Make Sure Your Entry is Valid";
	   }
	   else
	   {
	      $response="";
	   }
	  echo $response;	
	break;
case "email":
	if (!filter_var($formobject, FILTER_VALIDATE_EMAIL))
	   {
	      $response="Invalid E-mail";
	   }
	   else
	   {
	      $response="";
	   }
	  echo $response;	
	break;
case "phonenum":
	if (!filter_var($formobject, FILTER_VALIDATE_REGEXP,array("options"=>array("regexp"=>"/\d\d\d-\d\d\d-\d\d\d\d/"))))
	   {
	      $response="Please Follow Format Provided";
	   }
	   else
	   {
	      $response="";
	   }
	  echo $response;	
	break;
default:
	echo "There has been an error in the script.  Please refresh the page or refrain from typing code.";
}
?>