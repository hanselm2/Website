<?php
$parameters=explode(",",$_GET["packet"]);
$spec=$parameters[0];
$type=$parameters[1];
include('phpapps/gallerydbpuller.php');


?>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--hhdFAQ.php-->
<html>

<head>
<title>H&H Remodel Gallery</title>
<?php include('phpapps/tabIcon.php')?>
<meta name="description" content="Residential Remodeling in the Western Suburbs of Chicago About Us">
<meta name="keywords" content="Remodel, Room Addition, Kitchen Addition, Bathroom Addition, Home Maintenance, Home Repair,
H&H Remodel, H&H Design and Remodel, Chicagoland Builders, Wheaton, Carol Stream, Naperville, Glendale Heights, Bloomingdale,
Home Improvement">
<!--<link rel="stylesheet" type="text/css" href="css/normalimgspecs.css"></link>-->
<link rel="stylesheet" type="text/css" href="css/formatsheet.css"/>
<link rel="stylesheet" type="text/css" href="css/gallery.css"/>
<link rel="stylesheet" type="text/css" href="css/galleryoptions.css"/>
<link rel="stylesheet" type="text/css" href="css/nonSSformat.css" />
<script type="text/javascript" src="scripts/gallerycontrol.js">
</script>
<script type="text/javascript">
<?php echo $script; ?>
</script>
</head>

<body onload="storeImages('<?php echo $spec ?>', '<?php echo $type ?>', catArray)"<!--"loadXMLDoc('<?php echo $spec ?>', '<?php echo $type?>')"-->>

<div id="outline">

<?php include('phpapps/bannersetup.php')?>
<div id="infobody">

<img id="backgroundimage" src="functionalityPics/hhdinfobackgroundcontact.png">

<div id="info">
<div id="afterpic">
<img id="label" src="functionalityPics/hhdimagelabelafter2.png">
</div>
<div id="beforepic">
<img id="label" src="functionalityPics/hhdimagelabelbefore2.png">
</div>
<div id="piclist">
<h4 id="topTitle">Select a Project Type</h4>
<ul id="Top"> 


</ul>
</div>
<div id="picinfo">


</div>

</div>
</div>
</div>
</body>

</html>