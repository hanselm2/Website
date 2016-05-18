<?php
$parameters=explode(",",$_GET["packet"]);
$spec=$parameters[0];
$type=$parameters[1];
$connect="dbGalQuery";
include('phpapps/testImplement/dbgalSel.php');


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
<link rel="stylesheet" type="text/css" href="css/scrollBase.css"/>
<!--<link rel="stylesheet" type="text/css" href="css/gallery.css"/>-->
<style>
#infobody
{

position:relative;

margin-top:0px;

width:770px;

height:649px;
float:right;

}
#afterpic
{
float:left;
position:relative;
width:500px;
height:500px;
}

#afterpic .displayPic
{
  position:absolute;
  z-index:-1;
  height:500px;
  width:500px;
  display:none;
}

#beforepic
{
position:relative;
width:180px;
height:180px;
}

#beforepic .displayPic
{
  position:absolute;
  z-index:-1;
  height:180px;
  width:180px;
  display:none;
}

.thumbPic
{
  display:block;
  margin-left:auto;
  margin-right:auto;
  margin-top:5px;
  margin-bottom:5px;
  height:100px;width:100px;
  opacity:1;
  filter:alpha(opacity=100);
}

#picinfo
{
margin-top:10px;
position:relative;
float:left;
width:500px;
height:300px;
}

#picinfo #underlined
{
text-decoration:underline;
}
#beforepic
{
float:right;
margin-right:10px;
}
#piclist
{
margin-top:20px;
position:relative;
float:right;
height:300px;
width:200px;
}

#piclist .scrollCont *
{
  display:block;
  text-align:center;
  margin-left:auto;
  margin-right:auto;
}

#beforepic, #afterpic
{
border-left:solid gray 1px;
border-top:solid gray 1px;
}

#label
{
position:absolute;
z-index=1;
}

#Top
{
list-style:none;
margin-left:5px;
padding-left:0px;
}

#topTitle
{
text-decoration:underline;
}
</style>


<link rel="stylesheet" type="text/css" href="css/galleryoptions.css"/>
<link rel="stylesheet" type="text/css" href="css/nonSSformat.css" />
<script type="text/javascript" src="phpapps/testImplement/eListener.js"></script>
<script type="text/javascript" src="phpapps/testImplement/customScroll.js"></script>
<script type="text/javascript" src="phpapps/testImplement/newGalleryControl.js"></script>
<script type="text/javascript">
<?php echo $script; ?>
</script>
</head>
<body>
<div id="outline">

<?php include('phpapps/bannersetup.php')?>
<div id="infobody">

<img id="backgroundimage" src="functionalityPics/hhdinfobackgroundcontact.png">

<div id="info">
<div id="displayBox">
<div id="afterpic">
<img id="label" src="functionalityPics/hhdimagelabelafter2.png">
<?php echo $afterPicFill; ?>
</div>
<div id="beforepic">
<img id="label" src="functionalityPics/hhdimagelabelbefore2.png">
<?php echo $beforePicFill; ?>
</div>
<div id="piclist" class="scrollFull">
<?php $vert=true;include("phpapps/testImplement/scrollCont.php"); ?>
</div>
<div id="picinfo" class="scrollFull">
<?php $vert=true;include("phpapps/testImplement/scrollCont.php"); ?>
</div>
<script type='text/javascript'>
var script=document.getElementsByTagName('script');
galleryObjsArray.push(displaySetUp(script[script.length-1].parentNode, scrollObjsArray));
</script>
</div>
</div>
</div>
</div>
</body>

</html>