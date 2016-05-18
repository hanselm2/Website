<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<?php
function sortOptions($array, $str, $indent)
{
 foreach ($array as $value)
  {
   $buffer=str_repeat("\t" ,$indent);
   if (strspn($value,"0123456789",strlen($value)-1)==1)
   {
       $insert=str_replace(array("0","1","2","3","4","5","6","7","8","9"),"",$value); 
       $str=$str . $buffer . $insert . "\n\n";
   }
   else
   {
   $str=$str . $buffer . $value . "\n\n";
   }
   $value=str_replace(" ","",$value);
   $optionsselected=$value . "options";
   if (isset($_POST[$optionsselected]))
    {
    $options=$_POST[$optionsselected];
    $indent++;
    $returns=sortOptions($options, $str, $indent);
    $str=$returns[0];
    $indent=$returns[1]; 
    }
  $str=$str . "\n\n";
 }
 $indent=0;
 return (array($str,$indent));
}

if (isset($_POST["fname"]) && isset($_POST["lname"]) && isset($_POST["email"]) && isset($_POST["phonenum"]) && isset($_POST["remodels"]) && isset($_POST["city"]))
{
$remodelsstr="\n";
$firstname=filter_var($_POST["fname"], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
$lastname=filter_var($_POST["lname"], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
$email=filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
$phone=filter_var($_POST["phonenum"], FILTER_SANITIZE_NUMBER_INT);
$city=$_POST["city"];
$howtoreach=$_POST["allowedcontact"];
$remodels=$_POST["remodels"];
$price=$_POST["pricerange"];
$comments=filter_var($_POST["comments"], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
$intcontact=$_POST["appointments"];
$dummy=sortOptions($remodels, $remodelsstr, 0);
$remodelsstr=$dummy[0];
ini_set("SMTP", "mail.hhdtest.freehostingcloud.com");
ini_set("smtp_port", 25);
ini_set("sendmail_from", "postmaster@hhdtest.freehostingcloud.com");
$phpheaders = "From: HandHwebsite < formreplies@handhremodel.com >";
mail("formreplies@handhremodel.com","Bid Request for $firstname $lastname","Customer Name: $firstname $lastname\nE-mail address: $email \nPhone Number: $phone \nCity: $city \nOnly Wants to be contacted through $howtoreach \nThey're intent of Contact is: $intcontact \n\nThe prospective remodel jobs are: \n$remodelsstr \nThe amount they are willing to spend is:  $price \n\nComments:\n$comments", $phpheaders,'-f' . "formreplies@handhremodel.com" . '');
mail($email, "Thank You For Your Submission", $firstname." ". $lastname.",\n\n\tThank you for submitting your information.  This is just a confirmation email to ensure that we have received your submission.  We look forward to helping you start the process of having a more accommodating home.\n\nPeter Hanselman\nPresident", $phpheaders,'-f' . "formreplies@handhremodel.com" . '');

}
else
{
echo "<h1>There Was An Error With Your Submission!</h1>";
echo "<p>It seems that a required field was not filled out or there was a script error.  Please try re-opening the form and if the problem persists please feel free to use the other contact information.</p>";
}
?>
<head>
<?php include('phpapps/tabIcon.php')?>
<title>Thank You For Submitting</title>
<link rel="stylesheet" type="text/css" href="css/formatsheet.css"/>
<link rel="stylesheet" type="text/css" href="css/nonSSformat.css"/>
</head>
<body>
<div id="outline">
<?php include('phpapps/bannersetup.php'); ?>
<div id="infobody">
<img id="backgroundimage" src="functionalityPics/hhdinfobackgroundindex.png">
<div id="info">
<h1 id="message">Thank You for Submitting for a Bid</h1>
<p id="details"> We will try to respond to this bid in at most two weeks and appreciate your business.</p>
</div>
</div>
</div>
</body>
</html>