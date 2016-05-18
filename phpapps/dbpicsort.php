<?php
$buffer="";
$numCats=-1;
$i=0;
$script="var catArray=new Array();";
while($array=mysqli_fetch_array($result))
{
if ($buffer!=$array[2])
  {
    $buffer=$array[2];
    $numCats++;
    $script=$script . "catArray[" . $numCats . "]=new Array();";
    if ($marker=="Gallery")
    {
      $script= $script . "catArray[" . $numCats . "][0]=new Array(); catArray[" . $numCats . "][1]=new Array();";
    } 
    $i=0;
  }
switch ($marker)
{
case "SS":
      $script=$script . "catArray[" . $numCats . "][" . $i . "]=new Array(); catArray[" . $numCats . "][" . $i . "][0]='" . $array[0] . "'; catArray[" . $numCats . "][" . $i . "][1]='" . $array[3] . "'; catArray[" . $numCats . "][" . $i . "][2]='" . $array[1] . "';";
      break;
case "Gallery":
      $script=$script . "catArray[" . $numCats . "][0][" . $i . "]='" . $array[0] . "'; catArray[" . $numCats . "][1][" . $i . "]='" . $array[3] ."';";
     if ($i==0)
     {
       if(isset($gallerySelector)==FALSE)
        {
           $gallerySelector=1;
        }
      $script=$script . "catArray[" . $numCats . "][2]=unescape('" . $array[4] . "');catArray[" . $numCats . "][3]='" . $array[$gallerySelector] . "';catArray[" . $numCats . "][4]='" . $array[2] . "';";
     }
     break;
}
$i++;
}
?>
