<?php
/*
$xml = simplexml_load_file("../remodelsource.xml");
$con=mysqli_connect('localhost', 'handhre1_Control', '41e37b63aff720a7e39c27fba88f3252');
mysqli_select_db('handhre1_functions', $con);
$i=0;

foreach($xml->children() as $child)
{
  echo "whoa";
  $remodelType=$child->attributes();
  foreach($child->children() as $grandchild)
  {
    $job=$grandchild->attributes();
    foreach($grandchild->children() as $Ggrandchild)
    {
      $tFrame=$Ggrandchild->getName();
      if($tFrame=="After")
       {
      $query="INSERT INTO After_Pics(Source, Job, SlideShow, RemodelType) VALUES ('" . $Ggrandchild . "', '" . $job . "' , 'Yes', '" . $remodelType . "')";
       mysqli_query($con, $query);
       }
      else
       {
         $query="INSERT INTO Before_Pics(Source, ImageNum) VALUES ('" . $Ggrandchild . "', '" . $i . "')";
         mysqli_query($con, $query);
         $i++;
       }
    }
  }
}
*/

/*$xml = simplexml_load_file("../gallerysource.xml");
$con=mysqli_connect('localhost', 'handhre1_Control', '41e37b63aff720a7e39c27fba88f3252');
mysqli_select_db('handhre1_functions', $con);

foreach($xml->children() as $child)
{
  $remodelType=$child->getName();
  foreach($child->children() as $Ggrandchild)
  {
    $job=$Ggrandchild['name'];
    $subType=$Ggrandchild['id'];
    $finalcount=mysqli_fetch_assoc(mysqli_query("SELECT ID FROM After_Pics ORDER BY ID DESC LIMIT 1"));
    $finalcount=$finalcount['ID']+1;
    $i=$finalcount;
    $place=$finalcount;
    foreach($Ggrandchild->children() as $GGgrandchild)
    {
        switch($GGgrandchild->getName())
        {
          case "After":
           $testerQuery="SELECT * FROM After_Pics WHERE Source='" . $GGgrandchild['source'] . "' AND SubType='0'";
           if(!mysqli_fetch_assoc(mysqli_query($testerQuery)))
           {
             $query="INSERT INTO After_Pics(Source, Job, SlideShow, RemodelType, SubType) VALUES ('" . $GGgrandchild['source'] . "','" . $job . "', 'No', '" . $remodelType . "' , '" . $subType . "')";
             $i++;
           }
           else
           {
             $query="UPDATE After_Pics SET SubType='" . $subType . "' WHERE Source='" . $GGgrandchild['source'] . "'";
           }
          break;
          case "Before":
           $testerQuery="SELECT * FROM Before_Pics WHERE Source='" . $GGgrandchild['source'] . "'";
           if(!mysqli_fetch_assoc(mysqli_query($testerQuery)) || $GGgrandchild['source']=="Gallery/mask.jpg")
           {
             if($place>=$finalcount && $place<$i)
             {
                $index=$place;
             }
             else
             {

                $index='';

             }
             $query="INSERT INTO Before_Pics(Source, ImageNum) VALUES ('" . $GGgrandchild['source'] . "','" . $index . "')";
             $place++;
           }
           else
           {
             $query='';
           }
          break;
          case "Bios":
           $query="INSERT INTO Pic_Bios VALUES('" . $job . $subType . "' , '" . $GGgrandchild . "')";
           break;
        }
      mysqli_query($con, $query);
    }
  }
}*/
?>