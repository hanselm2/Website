<?php

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
        return "ImageBuffer";
    default:
        return "unallowed";
  } 
}

?>