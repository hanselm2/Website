<?php
//NEEDS TO BE THROWN TO GENERAL APP FOR BOTH USER AND SUPER
session_start();
session_regenerate_id();

//check manifest and delete all files under User Name
include_once("fileTypeDirections.php");  //need to change path upon throwing
include("../../Data/BufferManifestLinker.php");

$baseDir="../Buffer/";
 $bufferTables=array("ImageBuffer");
 foreach($bufferTables as $table)
 {
  $dirFiles=scandir($baseDir . $table . "/");
  $checkQuery="SELECT FileName FROM " . $table;
  $manifest=mysqli_query($checkQuery);
  if($manifest)
  {
     //DELETE GHOST FILES NOT IN MANIFEST AT ALL  (WOULD LOVE TO TURN INTO A FUNCTION BUT THAT ALLOWS FOR CALLING OUTSIDE OF STANDARDS SET and deletion)
     foreach($dirFiles as $file)
     {
    
       $legal=false;
       if($file!="." && $file!="..")
       {
         while($cargo=mysqli_fetch_array($manifest))
           {      
             if($file==$cargo[0])//NEED TO DELETE MATCHES TO INCREASE SPEED OF CHECK THRU
             {
               $legal=true;
               break;
             }
           }
         mysqli_data_seek($manifest, 0);
         if($legal==false)
         {
           unlink($baseDir . $table . "/" . $file);
         }
       }
     }
   }
 }

 $fileName=$_FILES["localFile"]["name"];
 if($fileName)
 {
   $user=mysqli_real_escape_string($_SESSION["UserREF"]);
   $queryTable=typeDecide($fileName); 
   if($queryTable!="unallowed")
   {
     $userPreview=" WHERE UploadState='1' AND User='" . $user . "'";
     $checkQuery="SELECT FileName FROM " . $queryTable . $userPreview;
     $manifest=mysqli_query($checkQuery);
     $dir=$baseDir . $queryTable . "/";
     $dirFiles=scandir($dir);
   //DELETE ANY PREVIEW IMAGE BEFORE HAND FROM THE USERS MANIFEST
     if($manifest && mysqli_num_rows($manifest)!=0)
     {
       foreach($dirFiles as $file)
       {
         $deletable=false;
         while($cargo=mysqli_fetch_array($manifest))
         {
           if($file==$cargo[0])
           {
             $deletable=true;
             break;
           }
         }
         mysqli_data_seek($manifest,0);
         if($deletable==true)
         { 
           unlink($dir . $file);
         }
       }
       $checkQuery="DELETE FROM " . $queryTable . $userPreview;
       mysqli_query($checkQuery);
     }
     //APPEND NEW MANIFEST ITEM
     $possFile=$dir . $fileName;
     $numerator=0;
     while(is_file($possFile))
     {
       $numerator++;
       $typeStart=strrpos($possFile, ".", -1);
       $possFile=substr($possFile, 0, $typeStart) . $numerator . substr($possFile, $typeStart);
     }
     //Upload FileName and replace Manifest with FileName
    if(move_uploaded_file($_FILES["localFile"]["tmp_name"], $possFile))
     {
       $checkQuery="INSERT INTO " . $queryTable . " (UploadState, TimeOfUpLoad, FileName, User) VALUES (1, '" . $_SERVER["REQUEST_TIME"] . "', '" . $fileName . "', '" . $user . "')";
       mysqli_query($checkQuery);
     }
    if($queryTable=="ImageBuffer")
    {
      $_GET["previewee"]="http://www.handhremodel.com/phpapps/UserArea/Buffer/ImageBuffer/" . $fileName;
      include("ImagePreviewer.php");
    }
  } 
}

mysqli_close();








?>