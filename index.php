<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--Copy to other php file and seperate the ajax into another file as well-->
<?php include('phpapps/slideshowdbpuller.php'); ?>
<!--format stylesheet-->

<html>

<head xmlns="http://www.w3.org/1999/xhtml">
<title>H&H Remodel</title>
<meta name="description" content="Residential Remodeling in the Western Suburbs of Chicago." />
<meta name="keywords" content="Remodel, Room Addition, Kitchen Addition, Bathroom Addition, Home Maintenance, Home Repair,
H&ampH Remodel, H&ampH Design and Remodel, Chicagoland Builders, Wheaton, Carol Stream, Naperville, Glendale Heights, Bloomingdale,
Home Improvement" />
<?php include('phpapps/tabIcon.php')?>
<script type="text/javascript" src="scripts/hhdlessershildeshow.js">
</script>
<link rel="stylesheet" type="text/css" href="css/formatsheet.css" />
<link rel="stylesheet" type="text/css" href="css/SSformat.css" />
<script type="text/javascript">
var xmlReq=<?php echo $xmlReq ?>;
if(xmlReq=='true')
{
loadXMLDoc();
}
else
{
<?php echo $script; ?>
storeImages('data', catArray);
}
</script>
</head>

<body >

<div id="outline">

<?php include('phpapps/bannersetup.php')?>
<div id="tabmenu">
<ul>
<li id="Tab0" onclick="changeTab(0)"><span>Additions</span></li>
<li id="Tab1" onclick="changeTab(1)"><span>Kitchens</span></li>
<li id="Tab2" onclick="changeTab(2)"><span>Bathrooms</span></li>
<li id="Tab3" onclick="changeTab(3)"><span>Miscellaneous</span></li>
</ul>
</div>
<div id="infobody">

<img id="backgroundimage" src="functionalityPics/hhdinfobackgroundindex.png" alt="Background" />

<div id="info">

<div id="afterpic">
<img id="label" src="functionalityPics/hhdimagelabelafter2.png" alt="AfterPicture" />
<noscript><h3>You must have javascript/ActiveX enabled on your browser to view these images properly.</h3></noscript>
</div>
<div id="beforepic">
<img id="label" src="functionalityPics/hhdimagelabelbefore2.png" alt="BeforePicture" />
<noscript><h3>You must have javascript/ActiveX enabled on your browser to view these images properly.</h3></noscript>
</div>
<div id="piclist">
<noscript><h3>You must have javascript/ActiveX enabled on your browser to view these images properly.</h3></noscript>
</div>
<p id="caption">
This is a sample of H&H's remodel jobs, please visit the <a href="hhdgalleryoptions.php">Project Gallery</a>
or <a id="jobLink" href="hhdgalleryoptions.php">Click Here</a> to view more of the above Project.
</p>


</div>

</div>

</div>

</body>

</html>