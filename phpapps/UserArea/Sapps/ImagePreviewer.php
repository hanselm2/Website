<?php
$fileName=rawurlencode($_GET['previewee']);
$fileRef="";

$testTypes=array(".png",".jpg",".jpeg",".gif",".tif",".tiff");
foreach($testTypes as $type)
{
  $endPos=strpos($fileName, $type);
  if($endPos!==false)
  {
    $fileRef=substr($fileName, 0, $endPos+strlen($type));
    break;
  }
}

?>

<html>
<head>
</head>
<body>
<img id="preview" width="150px" height="150px" style="position:absolute;left:0px;top:0px;" src="<?php echo rawurldecode($fileRef); ?>" />
</body>
</html>