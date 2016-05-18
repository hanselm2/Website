<?php
include('Data/functionLinker.php');
$marker="Gallery";
if ($type=='cat')
 {
//for now this does not allow specifying of front pic except for slideshow selection
   $query="SELECT After_Pics.Source, After_Pics.SubType, After_Pics.Job, Before_Pics.Source, Pic_Bios.Bio  FROM After_Pics INNER JOIN Before_Pics ON After_Pics.ID=Before_Pics.ImageNum INNER JOIN Pic_Bios ON After_Pics.BioMarker=Pic_Bios.JobType WHERE After_Pics.RemodelType='" . $spec . "' ORDER BY After_Pics.Job, After_Pics.SlideShow DESC, After_Pics.Source";
   $result=mysqli_query($con, $query);
 }
 else
 {
   $query="SELECT After_Pics.Source, After_Pics.Job, After_Pics.SubType, Before_Pics.Source, Pic_Bios.Bio  FROM After_Pics INNER JOIN Before_Pics ON After_Pics.ID=Before_Pics.ImageNum INNER JOIN Pic_Bios ON After_Pics.BioMarker=Pic_Bios.JobType WHERE After_Pics.Job='" . $spec . "' ORDER BY After_Pics.SubType, After_Pics.SlideShow DESC, After_Pics.Source";
   $gallerySelector=2;
   $result=mysqli_query($con, $query);
 }
mysqli_close($con);
include('dbpicsort.php');
?>
