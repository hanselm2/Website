function AppLoad(source, parameters)
{
  if (window.XMLHttpRequest)
  {
    var AppQuery=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    var AppQuery=new ActiveXObject("Microsoft.XMLHTTP");
  }
  AppQuery.onreadystatechange=function()
    {
    if (AppQuery.readyState==4 && AppQuery.status==200)
      {
      responseString=AppQuery.responseText;
      alert(responseString.substr(0,290));
      HtmlFill(responseString);
      }
    }
  AppQuery.open("POST", source);
  AppQuery.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  AppQuery.send(parameters);
}

function HtmlFill(packet)
{
  objectArray=packet.split("~");
  var i=0;
  while(objectArray[i])
  {
    //alert(objectArray[i]);
    instructions=objectArray[i].split("*");
    if(container=document.getElementById(instructions[0]))
    {
    }
    else
    {    
      container=document.getElementsByTagName(instructions[0])[0];
    }
    var pieces=instructions.length;
    if(pieces>2)//if(instructions[1] && instructions[1].search("script")!=-1 || instructions[1].search("iframe")!=-1)
    {
     if(pieces%2==0)
     {
       var insert=document.createElement(instructions[1]);
       for(u=2; u<instructions.length;u=u+2)
       {
         insert.setAttribute(instructions[u], instructions[u+1]);
       }
       container.appendChild(insert);
     }
     else
     {
       for(u=1; u<instructions.length;u=u+2)
       {
         container.setAttribute(instructions[u], instructions[u+1]);
       }
     }
    }
    else
    {
     prevCode=container.innerHTML;
     container.innerHTML=prevCode+instructions[1];
    }
   i++;
  }
}