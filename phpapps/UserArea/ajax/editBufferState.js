function changeBufferState(filePath, fileSpot)
{

  if (window.XMLHttpRequest)
  {
   var BufferQuery=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
   var BufferQuery=new ActiveXObject("Microsoft.XMLHTTP");
  }
  BufferQuery.onreadystatechange=function()
    {
    if (BufferQuery.readyState==4 && BufferQuery.status==200)
      {
      responseString=BufferQuery.responseText;
      if(responseString=="LOADED")
        {
          setImg(fileSpot, filePath);
        }
        else
        {
          alert("SHOULD BE REPLACED WITH ERROR HTML SOON!");
        }
      }
    }

  var rawFile=filePath.substr(filePath.indexOf("Buffer/"));
  if(rawFile!=-1)
  {
    BufferQuery.open("POST", "Sapps/FileSourcePreview.php");
    BufferQuery.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    BufferQuery.send("newFile=" + rawFile);
  }
  else
  {
    setImg(fileSpot, filePath);
  }
}

function setImg(fileSpot, filePath)
{
  fileSpot.setAttribute("src" , filePath);
}