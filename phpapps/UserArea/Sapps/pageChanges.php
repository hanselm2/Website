<?php
session_start();
session_regenerate_id();



function sortEdits()
{
  $page=$_POST["page"];
  $pagesArray=array();
  $elNum=0;
  $attNum=0;
  while($elDetect=$_POST["el" . $elNum . "att" . $attNum])
  {
    $attArray=array();
    while($att=$_POST["el" . $elNum . "att" . $attNum])
     {
       array_push($attArray, $att);
       $attNum++;
     }
    $pageRef=$_POST["elrefpage" . $elNum];
    if($pageRef=="null")
    {
      $pageRef=$page;
    }
    if(count($pagesArray[$pageRef])==0)
     {
       $pagesArray[$pageRef]=array();
     }
    $lastSpot=count($pagesArray[$pageRef]);
    $pagesArray[$pageRef][$lastSpot]=$attArray;
    $oldHtml= $_POST["eloldhtml" . $elNum];
    array_push($pagesArray[$pageRef][$lastSpot], $_POST["eloldhtml" . $elNum], $_POST["eledithtml" . $elNum]);
    $elNum++;
    $attNum=0;
  }
  return $pagesArray;
}

function findEditables($opened, $index, $compareArray)
{
  $opened=resolveOldHtmlStyles($opened);
  $lastEdit=0;
  $finalEdit=$opened;
   while($spot=strpos($opened, "eSpec=", $index))
    {
       list($eStart, $eEnd)=attRetrieval($opened, $spot);
       $eSpec=substr($opened, $eStart, $eEnd-$eStart);
       //echo "ESPEC IS " . $eSpec;
       $index=$spot+1;
       list($edit, $editStart, $editEnd)=compareAtts($opened, $compareArray, $index, $eSpec);
       if($eSpec=="alter")
       {
         echo $edit;
         echo "ORIG " . substr($opened, $editStart, $editEnd-$editStart);
         $edit="";
       }
       if($edit!="")
       {
         $opened=substr($opened, 0, $editStart) . $edit . substr($opened, $editEnd);
       }
    }
  return $opened;
}

function attTagValidate($opened, $index)
{
  $tagStart=strrpos($opened, "<", (strlen($opened)-$index)*-1);
  $tagEnd=strpos($opened, ">", $index);
  return array($tagStart, $tagEnd);
}



function compareAtts($opened, $possAttArray, $index, $eSpec)
{
  $replacePoint;
  $notableInfo;
  list($tagStart, $tagEnd)=attTagValidate($opened, $index);
  $newText="";
  for($i=0; $i<count($possAttArray);$i++)
  {
    $indivAtts=$possAttArray[$i];
    $totalItems=count($indivAtts);
    for($a=0;$a<$totalItems-2;$a=$a+2)  //FOR OPTIMIZING SHOULD REMOVE ELEMENT FROM ARRAY AFTER EDITING
    {
      $comparer=false;
      $searchStringA=rawurldecode($indivAtts[$a]) . "=";
      $searchStringB=rawurldecode($indivAtts[$a+1]);
      $att=stripos($opened, $searchStringA, $tagStart);
      $value=strpos($opened, $searchStringB, $tagStart);
      if($att && $value) // REPLACE WITH PREG MATCH/SPLITTING
      {
        if($value>$att && $value<$tagEnd)
        {
          if($searchStringA=="src=" && $eSpec=="alter")
          {
            $notableInfo=$searchStringB;
            list($replacePoint, $htmlEnd)=attRetrieval($opened, $att);
          }
          $comparer=true;
        }
      }
      else
      {
         break;
      }
    }
    if($comparer)
    {

      switch($eSpec)
      {
        case "edit":
          $oldHtml=$indivAtts[$totalItems-2];
          $tagName=findTagName($opened, $tagStart);
          if(strlen($oldHtml)>0)
          {
            $oldHtml=resolveOldHtmlStyles($oldHtml);
            $htmlStart=$tagEnd+1;
            $testSegment=substr($opened, $htmlStart, strlen($oldHtml));
            $tester=readThruMinusQuotes($oldHtml, $testSegment); 
            if($tester)
            {
              $htmlEnd=passThruNested($opened, $tagName, $htmlStart, $htmlStart);
            //echo "FOR OLDHTML " .substr($oldHtml,0,20) . "BEGIN TAG IS " . $tagName . " End Tag Name IS " . substr($opened,$htmlEnd, 20);
            // for security purposes need to parse from additional embedded html
              $editChange=rawurldecode($indivAtts[$totalItems-1]);
              $editChange=resolveOldHtmlStyles($editChange);
              $newText=editFillin($opened, $editChange, $htmlStart, 0, "");
              $replacePoint=$htmlStart;
            }
          }
          break 2;
        case "alter":
          $relRootLocale="../../../";
          $tagElement=substr($opened, $tagStart, $tagEnd-$tagStart);
          //$part1=stripos($tagElement, "src=");  //USE HREF TOO FOR SOURCES OR OBJECTS IN FUTURE
          //list($valueBegin, $valueEnd)=
          //trieval($tagElement, $part1); 
          //$origValue=substr($tagStart, $valueBegin, $valueEnd-$valueBegin-1);
          $editSrc=rawurldecode($indivAtts[$totalItems-1]);

          if(stripos($editSrc, "handhremodel.com/phpapps/UserArea/Buffer/ImageBuffer/")!==false)  //if a new image
          {
            $editSrcBase=strrchr($editSrc, "/");
            $editSrcBase=substr($editSrcBase, 1);
            $dirEnd=strrpos($notableInfo, "/" , -1);
            $placementDir=substr($notableInfo, 0, $dirEnd+1);
            include("../../Data/BufferManifestLinker.php");
            $user=mysqli_real_escape_string($_SESSION["UserREF"]);
            $query="SELECT FileName FROM ImageBuffer WHERE USER='" . $user . "' AND FileName='" . $editSrcBase . "'";
            $resultSet=mysqli_query($con, $query);  //VERY INEFFICIENT IN THE LONG RUN BECAUSE QUERIES EVERYTIME
            if($resultSet && mysqli_num_rows($resultSet)!=0)
            {
              $loadedFiles=scanDir("../Buffer/ImageBuffer/");
              foreach($loadedFiles as $file)
              {
                if($file==$editSrcBase)  //FILE IS IN BUFFER DIRECTORY
                {
                  $number="";
                  $period=strrpos($editSrcBase, ".", -1);
                  while(is_file($relRootLocale .$placementDir . substr($editSrcBase, 0, $period) . $number . substr($editSrcBase, $period)))  //FILE IS IN PLACEMENT DIRECTORY ALREADY
                  {
                     if(is_int($number))
                     {
                       $number++;
                     }
                     else
                     {
                       $number=0;
                     }
                  }
                  $editSrcBase=substr($editSrcBase, 0, $period) . $number . substr($editSrcBase, $period);
                  $editSrc=$placementDir . $editSrcBase;
                  rename("../Buffer/ImageBuffer/" . $file, $relRootLocale . $placementDir . $editSrcBase);
                  break;
                }
              }
            }
            else
            {
              $editSrc="";//INDICATES THE FILE DID NOT LOAD
            }
          }
          $imgQuestion=typeDecide($editSrc);
          if($imgQuestion && is_file($relRootLocale . $editSrc))  //If NOW ADJUSTED NAME IS FILE THEN ALTER INTERIOR FILE SCRIPT
          {
            $newText=$editSrc;
          }
          else
          {
            $editSrc="";
            //ADD AN ERROR SCRIPT LATER
          }
          //EITHER NOW LOADED IMAGE OR OLD IMAGE SHOULD CHECK FOR FILE IN OTHER DIRECTORIES BECAUSE OF POTENTIAL FOR INJECTIONN OF FALSE URLS
        
          break 2;
        default:
          //NOTHING RIGHT NOW PROB ERROR THOUGH
          break 2;
      }
    }
  }
  return array($newText, $replacePoint, $htmlEnd);
}

function findTagName($string, $tagStart)
{
  if(strpos($string,">",$tagStart)<strpos($string, " ", $tagStart))
  {
    $key=">";
  }
  else
  {
    $key=" ";
  }
  $startPoint=$tagStart+1;
  $localEnd=strpos($string, $key, $tagStart);
  $tag=substr($string, $startPoint, $localEnd-$startPoint);
  return $tag;
}

function editFillin($oldString, $possSickString, $oldIndex, $newIndex, $finalText)
{
$oldFound=stripos($oldString, "<" , $oldIndex);
$newFound=stripos($possSickString, "<" , $newIndex);
  if($oldFound!==false && $newFound!==false)
  {
    $oldTag=findTagName($oldString, $oldFound);
    $newTag=findTagName($possSickString, $newFound);
    if($oldTag==$newTag)
    {
     $imgTest=stripos($oldTag, "img");
     $inputTest=stripos($oldTag, "input");
     $breakTest=stripos($oldTag, "br");
     if($imgTest!==false || $inputTest!==false || $breakTest!==false)
     {
       $endTag="/>";
       $oldNullEnd=stripos($oldString, $endTag, $oldFound) + strlen($endTag);
       $newNullEnd=stripos($possSickString, $endTag, $newFound) + strlen($endTag);
     }
     else
     {
       $comTest=stripos($oldTag, "!--");
       if($comTest!==false)
       {
         $endTag="-->";
         $oldNullEnd=stripos($oldString, $endTag, $oldFound) + strlen($endTag);
         $newNullEnd=stripos($possSickString, $endTag, $newFound) + strlen($endTag);
       }
       else
       {
         $oldNullEnd=passThruNested($oldString, $oldTag, $oldFound+1, $oldFound+1);
         $newNullEnd=passThruNested($possSickString, $oldTag, $newFound+1, $newFound+1);
         $oldNullEnd=$oldNullEnd+strlen($oldTag);
         $newNullEnd=$newNullEnd+strlen($oldTag);
       }
     }
      $finalText= $finalText . substr($possSickString, $newIndex, $newFound-$newIndex) . substr($oldString, $oldFound, $oldNullEnd-$oldFound); 
      $finalText=editFillin($oldString, $possSickString, $oldNullEnd, $newNullEnd, $finalText);
      return $finalText;
    }
  }
  else
  {
    $finalText=$finalText . substr($possSickString, $newIndex);
    return $finalText;
  }
}

function passThruNested($string, $tagName, $startIndex, $endIndex)
{
  $endTag="</" . $tagName . ">";
  $possEndTag=stripos($string, $endTag, $endIndex);
  $extraTag=stripos($string, "<" . $tagName, $startIndex);
  if($extraTag!==false && $extraTag<$possEndTag)
  {
      $possEndTag=passThruNested($string, $tagName, $extraTag+1, $possEndTag+1); 
      return $possEndTag;
  }
  else
  {
     return $possEndTag;// + strlen($endTag);
  }
} 

function resolveOldHtmlStyles($string)
{
$index=0;
  while($foundEl=strpos($string, "<input", $index))
  {
    $elEnd=strpos($string, ">", $foundEl);
    if(strpos($string, "/>", $foundEl)!=$elEnd-1)
    {
    $string=substr_replace($string, "/>", $elEnd, 1);
    }
    $index=$elEnd;
  }
  $string=str_replace("<br>", "<br/>", $string);
  return $string;
}

function twoOptionRetrieval($attString, $option1, $option2, $index=0)
{
  $op1=strpos($attString,$option1, $index);
  $op2=strpos($attString, $option2, $index);
    if($op1 && $op1<$op2)
    {
      $option=$op1; 
    }
    else
    {
      if($op2)
      {
        $option=$op2;
      }
      else
      {
        if($op1)
        {
          $option=$op1;
        }
        else
        {
          $option=false;
        }
      }
    }
  return $option;
} 

function attRetrieval($attString, $startPos=0)
{
  $option=twoOptionRetrieval($attString, '"', "'", $startPos);
  $attStart=strpos($attString, "=", $startPos);
  $fencePost=substr($attString, $attStart+1, $option-$attStart);
  do
  {
    $otherPost=strpos($attString, $fencePost, $attStart+2);
  }
  while(substr($attString, $otherPost-1, 1)=="\\");
  return array($option+1, $otherPost);
}

function readThruMinusQuotes($string, $compareString)
{
  $compareString=str_replace("&amp;", "&", $compareString);
  $compareString=str_replace("<br/>", "<br>", $compareString);
  $index=0;
  $compareIndex=0;
  $continue=true;
  do
  {
    $option=twoOptionRetrieval($string, '\"', "\'", $index);
    if($option===false)
    {
      $option=strlen($string);
      $continue=false;
    }
   /* $op1=strpos($string,'\"', $index);
    $op2=strpos($string, "\'", $index);
    if($op1 && $op1<$op2)
    {
      $option=$op1; 
    }
    else
    {
      if($op2)
      {
        $option=$op2;
      }
      else
      {
        if($op1)
        {
          $option=$op1;
        }
        else
        {
          $option=strlen($string);
          $continue=false;
        }
      }
    }*/
    $testPart=substr($string, $index, $option-$index);
    $testPart=str_replace("&amp;", "&", $testPart);
    $testPart=str_replace("<br/>", "<br>", $testPart);
    if(stripos($compareString, $testPart, $compareIndex)!==false || $testPart=="")
    {
      $compareIndex=$compareIndex+strlen($testPart);
      $index=$option+2;
      $registered=true;
    }
    else
    {
      $registered=false;
      $continue=false;
    }
  }
  while($continue==true);  
 return $registered;
}

function typeDecide($name)
{
  $type=strrchr($name, ".");
  switch($type)
  {
    case ".png":
    case ".gif":
    case ".jpg":
    case ".jpeg":
    case ".tif":
    case ".tiff":
        return true;
    default:
        return false;
  } 
}

include('../../Data/SecureUser.php');
$ip=md5($_SERVER["REMOTE_ADDR"]);
$LogID=md5($_SESSION['LID'] . $ip . md5($_SERVER['HTTP_USER_AGENT']));
$query="SELECT * FROM " . $appTable . " WHERE LogID='" . $LogID . "'";
$result=mysqli_query($con, $query);
$appArray=mysqli_fetch_assoc($result);
if($_SESSION['IP']!=$ip || !$appArray)
{
  if (isset($_COOKIE['logged']))
   {
      setcookie('logged', 'end', time()-3600);
   }
  header("Location:login.php");
}
else
{
  $pageSpecs=sortEdits();
  //echo "displayhelper*div*id*testDisplays*innerHTML*";
  while($pageEls = current($pageSpecs))
  {
    $query="SELECT InnerHtml FROM pageData WHERE Page='" . key($pageSpecs) . "'";
    include("../../Data/SupEditLinker.php");  //links to editing function db
    $pageResult=mysqli_query($con, $query);
    $maxLength=mysqli_field_len($pageResult, 0);
    while($testHtml=mysqli_fetch_array($pageResult))
    {
      $newReplaceString=findEditables(rawurldecode($testHtml[0]), 0, $pageEls);
      if($newReplaceString && strlen($newReplaceString)!=0)
      {
        $newReplaceString=rawurlencode($newReplaceString);
        $editQuery="UPDATE pageData SET InnerHtml='" . $newReplaceString . "' WHERE Page='" . key($pageSpecs) . "'";
        if(strlen($newReplaceString)>$maxLength)
        {
          $newLength=strlen($newReplaceString)+10;
          $lengMod="ALTER TABLE pageData MODIFY InnerHtml varchar(" . $newLength . ")";
          $testIt=mysqli_query($lengMod);
        }
        $hmmmm=mysqli_query($editQuery);
      }
    }
    //echo "~";
    next($pageSpecs);
  }
  mysqli_close();

  include('PageRetrieval.php');
}




?>