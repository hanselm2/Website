<?php
$disp="";
include('phpapps/Data/functionLinker.php');
$query="SELECT  Bio FROM Pic_Bios";
$result=mysqli_query($con, $query);
mysqli_close();

function urlencodeall($x) 
{
    $out = "";
    for ($i = 0; isset($x[$i]); $i++) 
    {
        $c = $x[$i];
        if (!ctype_alnum($c))
        {
         $c = '%' . sprintf('%02X', ord($c));
        }
        $out .= $c;
    }
    return $out;
}

function to_utf8( $string ) { 
// From http://w3.org/International/questions/qa-forms-utf-8.html 
    if ( preg_match('%^(?: 
      [\x09\x0A\x0D\x20-\x7E]            # ASCII 
    | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte 
    | \xE0[\xA0-\xBF][\x80-\xBF]         # excluding overlongs 
    | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte 
    | \xED[\x80-\x9F][\x80-\xBF]         # excluding surrogates 
    | \xF0[\x90-\xBF][\x80-\xBF]{2}      # planes 1-3 
    | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15 
    | \xF4[\x80-\x8F][\x80-\xBF]{2}      # plane 16 
)*$%xs', $string) ) { 
        return $string; 
    } else { 
        return iconv( 'CP1252', 'UTF-8', $string); 
    } 
} 

$type=ord("–");
$test="<h4 id='underlined'>PROJECT: Rehabilitate existing Ranch – Cape Cod home</h4><ul>Goal: Re-build an existing crumbling Family Room and kitchen.  Improve the existing house’s layout and curb appeal 
<li><ul>Rebuild East Wing of the house.
<li><ul>Family Room:
<li>Tear-down existing structure</li>
<li>Stabilize foundation</li>
<li>Repair concrete floor</li>
</ul></li>
<li>Expand Kitchen and eating area</li>
</ul></li>
<li><ul>Rehab center portion of existing First floor:
<li>Create formal dining room</li>
<li>New front entry space</li>
<li>Rehabilitated Laundry and Bathroom space</li>
</ul></li>
<li><ul>New 2nd floor Bathroom.
<li>Shed dormer with 4 unit bathroom and linen</li></ul></li></ul>";
//$test=to_utf8($test);
$test=htmlentities($test, ENT_QUOTES, "UTF-8");
/*for( $i=0;$i<strlen($test);$i++)
{
  if($test[$i])
  {
    $disp.=$test[$i];//urldecode($test1)) . " VERSUS " . $test1;
  }
}*/

$test=urlencode($test);

$disp.=$test . "\n" .html_entity_decode(urldecode($test), ENT_QUOTES, "UTF-8"); //urlencodeall($test) . " VERSUSE \n" . urldecode(urlencodeall($test));

if ($result)
{
while($array=mysqli_fetch_array($result))
{
$disp=$disp . "<div>" . rawurldecode($array[0]) . " VERSUS " . $array[0] . "</div>";
}
}
?>

<html>
<body>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<div id="outline">
<?php echo $disp; ?>
</div>
</body>
</html>