<?php
//Link to Function SQL table for Picture References
include('Data/functionLinker.php');
$query="SELECT After_Pics.Source, After_Pics.Job, After_Pics.RemodelType, Before_Pics.Source  FROM After_Pics INNER JOIN Before_Pics ON After_Pics.ID=Before_Pics.ImageNum WHERE After_Pics.SlideShow='Yes'";
$result=mysqli_query($con, $query);
mysqli_close($con);

//Segment Data into strings for slideshow
//Link in with marker for different parsing
if ($result)
{
$marker="SS";
include('dbpicsort.php');
//Discernable Problem is tab order and ensuring it

$xmlReq='false';
}
else
{
$xmlReq='true';
}

?>
