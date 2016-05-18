<?php
$page=$_POST["page"];

function compound($text)
{
  $smooshed="";
  while(! feof($text))
  {
    $smooshed=$smooshed . fgets($text);
  }
 return $smooshed;
}

//function extract($text, $allowables)
//{
//  $fullString=compound($text);
//  $allowables=keyCheck($fullString, $allowables);
//  return $allowables;
//}

function keyCheck($Content, $allowables)
{
  $n=1;
  $start=$n%3;
  $query=queryCall($n);
  $index=0;
  while($pos=stripos($Content, $query, $index))
    {
      if($start!=1)
      {
        //two conditions, If it's innerHTML take the whole thing.
        $allowables=$allowables . sift(substr($Content, $index, $pos-$index), $start);
      }
      $index=$pos+strlen($query); //read in everytime because only need what's beyond
      $n++;
      $start=$n%3;
      $query=queryCall($n);
    }
  return $allowables;  
}

function sift($section, $indicator)
{
  if(strlen(str_replace(" ", "", $section))!=0)
  {
    if($indicator==2)//attributes of elements
    {
      $pairings=explode(" ",$section);
      $pairings=attValidate($pairings);
      $insertable=",[";
      foreach($pairings as $pair)
      {
        $parts=explode("=", $pair);
        $insertable=$insertable . "'" . $parts[1] . "','" . str_replace(array('"',"'"),array('\"',"\'"), $parts[2]) . "',";
      }
      return substr_replace($insertable, "]", strlen($insertable)-1);
    }
    else
    {
      return ",\"" . rawurlencode($section) . "\"";
    }
  }
  else
  {
    return ",null";
  }
}

function attValidate($stringArray)
{
  $shrunkArray=array();
  $init=true;
  for($i=0;$i<strlen($stringArray);$i++)
  {
    $divider=stripos($stringArray[$i], "=");
    if($divider && (stripos($stringArray[$i], "'")>$divider || stripos($stringArray[$i], '"')>$divider))//last addendum allows for somewhat easy coverage of any equals signs that may be in code lines
    {
       if($init==false)
       {
         array_push($shrunkArray, $specifier);
       }
       $specifier=$stringArray[$i]; 
       $init=false; //start line makes a new specifier
    }
    else
    {
       $specifier=$specifier . " " . $stringArray[$i];  //piece of attribute adds to the start
    }
  }
  if($init==false)
   {
     array_push($shrunkArray, $specifier);
   }
  return $shrunkArray;
}

function queryCall($n)
{
  switch($n)
  {
    case 1:
         return "<head";
         break;
    case 3:
         return "</head>";
         break;
    case 4:
         return "<body";
         break;
    case 6:
         return "</body>";
         break;
    default:
         return ">";
  }
}

$allowables="";  //APPLY TEMP SCRIPTS CONTAINER LATER
$HTML="head* " . "~body*script*src*ajax/editBufferState.js*type*text/javascript~body*script*src*jscript/EditPageData.js*type*text/javascript~displayhelper*<div id='describer'>Edit Here</div><button id='edittest' type='button' disabled='true'>Nothing Selected</button><button id='editreal' type='button' disabled='true'>Edit Page</button><div id='editcontainer' width='100%' height='100%'>Select an Item to Edit</div>~display*<div id='describer'>Select Item to Edit</div>~display*";
$open="http://handhremodel.com/" . $page;
if($opened=fopen($open, "r", FALSE))
 {
  //$allowables=extract($opened, $allowables);
  $fullString=compound($opened);
  $allowables=keyCheck($fullString, $allowables);
  $HTML=$HTML . "iframe*id*editingFrame*pagesource*" . $open . "*height*100%*width*99%*onload*editMode(this";
  echo $HTML . $allowables .  ")";
 }

?>