<?php


$dir="../../../";

include_once("fileTypeDirections.php");

function deriveStartDir($fullPath, $core)
{
  $s=stripos($fullPath, "handhremodel.com/");
  $fullPath=substr_replace($fullPath, $core, 0, $s+17);
  $e=strripos($fullPath, "/");

  return substr($fullPath, 0, $e+1);
}

function siftDir($direct, $html="", $startDir="", $count=0)
{
  if($direct==$startDir || $count==0)
  {
    $dirPrelim="<div class='dir'><div>" . $direct . "<input class='notifier' type='checkbox' value='" . $direct . "' checked='checked' onclick='menuAlter(this)' /></div> <div id='" . $direct . "' style='display:inline;'>";
  }
  else
  {
    $dirPrelim="<div class='dir'><div>" . $direct . "<input class='notifier' type='checkbox' value='" . $direct . "' onclick='menuAlter(this)' /></div> <div id='" . $direct . "' style='display:none;'>";
  }
  $dirContents=scandir($direct);
  $count++;
  $intBuild="";
  foreach($dirContents as $item)
  {
    $type=typeDecide($item);
    if($type=="ImageBuffer")
    {
      $intBuild=$intBuild . "<img src='" . $direct . $item . "' onclick='previewExisting(this)' />";
    }
    else
    {
      if($item!=".." && $item!=".")
      {
        if(is_dir($direct . $item))
        {
          $intBuild=siftDir($direct . $item . "/", $intBuild, $startDir, $count);
        }
      }
    }
  }
  if(stripos($intBuild, "<img src='")!==false)
  {
    $intBuild= $dirPrelim . $intBuild . "</div></div>";
  }
  else
  {
    $intBuild="";
  }
  return $html . $intBuild;
}

$startDir=deriveStartDir(rawurldecode($_POST["sourceDir"]), $dir);

$html="dirViewer*<div id='dirPop'>";  //"currentDisplay*div*id*dirViewer~dirViewer*<input type='button' value='Refresh' onclick='reloadDirs()' /><div>";

$list=siftDir($dir, "", $startDir);

$html=$html . $list . "</div>";

echo $html;

?>