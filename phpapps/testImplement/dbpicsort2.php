<?php
if(isset($scrollContFill)==false)
{
  $scrollContFill=array();
}
$buffer="";
$numCats=-1;
$i=0;
$script="var catArray=new Array();";
$defaultBefore="Gallery/mask.jpg";
$defaultNoBios="There is currently no desription regarding this work. <div>Feel free to <a href='hhdcontactinfo.php'>contact H & H Remodel</a> with any questions regarding the construction process.</div>";
$beforePicFill="<img ref='default' src='" . $defaultBefore . "' class='displayPic' style='display:none;' />";
$afterPicFill="";
$scrollContProxy="";
$biosContProxy="";

while($array=mysqli_fetch_array($result))
{
if ($buffer!=$array[2])//changes html $script on change in what is classified as "category" (Job/Cat) due to ordering from SQL request
  {
    $buffer=$array[2];
    $numCats++;
    $script=$script . "catArray[" . $numCats . "]=new Array();";
    if ($marker=="Gallery")
    {
	//two arrays per table row
	//0 and 1 pertain to after and beforepics
      $script= $script . "catArray[" . $numCats . "][0]=new Array(); catArray[" . $numCats . "][1]=new Array();";
      if(isset($gallerySelector)==FALSE)
	  {
	    $gallerySelector=1;
	  }
	  $title=(($gallerySelector==1) ? "Job " : "") . strtoupper($array[2]);
	  if($i>0)
	  {
	    $scrollContProxy.="</div>";
	  }
	  $scrollContProxy.="<h2 contFunc='trigger'>". $title . "</h2><div id='" . $title . "' class='catCont' showCont='true' style='display:none;'>";
	  
    } 
    $i=0;
  }
switch ($marker)
{
case "SS":
      $script=$script . "catArray[" . $numCats . "][" . $i . "]=new Array(); catArray[" . $numCats . "][" . $i . "][0]='" . $array[0] . "'; catArray[" . $numCats . "][" . $i . "][1]='" . $array[3] . "'; catArray[" . $numCats . "][" . $i . "][2]='" . $array[1] . "';";
      break;
case "Gallery":
     //$script=$script . "catArray[" . $numCats . "][0][" . $i . "]='" . $array[0] . "'; catArray[" . $numCats . "][1][" . $i . "]='" . $array[3] ."';";
	 $afterPicFill.="<img src='" . $array[0] . "' ref='" . $numCats . "," . $i ."' class='displayPic' style='' />";
	 if($array[3]!=$defaultBefore)
	 {
	 $beforePicFill.="<img src='" . $array[3] . "' ref='" . $numCats . "," . $i ."' class='displayPic' style='' />";//need css file for the images
	 }
	 $scrollContProxy.= "<img src='" . $array[0] . "' id='" . $numCats . "," . $i . "' style='' class='thumbPic' />";
     if ($i==0)
     {
        $temp=html_entity_decode(urldecode($array[4]), ENT_QUOTES, "UTF-8");
        if(strlen(trim($temp, " "))==0)
        {
          $temp=$defaultNoBios;
        }
      	$biosContProxy.= "<div ref='" . $numCats ."' showCont='true' class='bios'>" . $temp . "</div>";
     }
     break;
}
$i++;
}
$scrollContProxy.="</div>";
$scrollContFill[]=$scrollContProxy;
$scrollContFill[]=$biosContProxy;
?>