//checkform.js
var count=0;
var xmlDoc;
var browserInfo;
var remodelsSpan="remodels[]check";

function descriptor(text, weight, margin, width, color, float, insertpoint)
{
this.p=document.createElement("p");
this.p.innerHTML=text;
this.p.style.fontWeight=weight;
this.p.style.margin="5px";
this.p.style.marginLeft=margin;
this.p.style.color=color;
this.p.style.width=width;
this.p.style.float=float;
this.insert=function()
       {
         insertpoint.appendChild(this.p);
       }
}

function inputCheckbox(name, insertpoint)
{
if (browserInfo=="bad")
  {
    this.input=document.createElement("<input type='checkbox'/>");
  }
else
  {
    this.input=document.createElement("input");
    this.input.type="checkbox";
  }
this.input.value=options[i].firstChild.nodeValue;
this.input.name=name;
/*if (name=="Other")
{
this.input.onclick=function(){promptBox(this)};
}*/
this.input.style.cssFloat="left";
//this.input.style.marginTop="18px";
this.insert=function(optionalChild)
      {
          insertpoint.insertBefore(this.input, insertpoint.firstChild);
          if (optionalChild)
          {
            var div=insertpoint.appendChild(optionalChild);
          }
      }
}

function browserCheck()
{
    check=navigator.appName;
    if (check=="Microsoft Internet Explorer")
      {
	    var browserInfo="bad";
      }
}

function checkform(input)
{
     spanid=input.name + "check";
     if (window.XMLHttpRequest)
       {
	xmlhttp=new XMLHttpRequest();
       }
     else
       {
        xmlhttp=new ActiveXObject("Microsoft.XMLHttp");
       }
xmlhttp.onreadystatechange=function()
     {
       if (/*xmlhttp.status==200 && */xmlhttp.readyState==4)
	{
	 document.getElementById(spanid).innerHTML=xmlhttp.responseText;
	 evalsubmit();
        }
     }
var goodvalue=encodeURIComponent(input.value);
var qstr="q="+goodvalue;
var jstr="&j="+input.name;
var inputcheck=qstr+jstr;
xmlhttp.open("POST","phpapps/sanitize.php",true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(inputcheck);
}

function valid(button, topSpec, leftSpec)
{
if (button.checked==true )
{
   count++;
   dropdown(button, topSpec, leftSpec);
}
if (button.checked==false)
{
    if (count>0)
     {  
	if (document.getElementById(button.value))
	    {
	    document.getElementById(button.value).innerHTML="";
	    document.getElementById(button.value).style.margin="0";
	    } 
	count--;
     }
}
if (count>0)
{
   document.getElementById(remodelsSpan).innerHTML="";
}
else
{
   document.getElementById(remodelsSpan).innerHTML="(Check at least one)";
}
evalsubmit();
}

/*function setcheck(button)
{
   spanid=button.name+"check";
   document.getElementById(spanid).innerHTML="";
   evalsubmit();
}*/


function evalsubmit()
{
	var screwups=document.getElementsByTagName("span");
	var x;
        var allow;
	for (x in screwups)
	{
          if (screwups[x].className)
	    {
	      if (screwups[x].innerHTML!="")
              {
                 allow="no";
              }
	    }
	} 
        if (allow!="no")
        {
	       document.getElementById("contactform").method="POST";
	       document.getElementById("contactform").action="test.php";
	       document.getElementById("contact1").disabled=false;
        }
	  else
	    {
	       document.getElementById("contactform").method="";
	       document.getElementById("contactform").action="";
	       document.getElementById("contact1").disabled=true;
	    }
}

function acquireOptions()
{
    if (window.XMLHttpRequest)
      {
      xmlhttp=new XMLHttpRequest();
      }
    else
      {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      browserInfo="bad";
      }
    xmlhttp.onreadystatechange=function()
        {  
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
               {
		 xmlDoc=xmlhttp.responseXML;
               }
        }
xmlhttp.open("GET","remodeloptions.xml", true);
xmlhttp.send();
}

function dropdown(button, topSpec, leftSpec)
{
if (button.value.indexOf(" ")!=-1)
{
  var holder=button;
  button=new Object();
  button.name=holder.name;
  button.value=holder.value.split(" ").join("");
}
options=xmlDoc.getElementsByTagName(button.value)[0].getElementsByTagName("name");
var numoptions=options.length;
if (!holder)
{
var listspot=document.getElementById(button.value);
}
else
{
var listspot=document.getElementById(holder.value);
}
listspot=alterListSpot(listspot, topSpec, leftSpec);
var txt=new descriptor("Do any of these apply?", "bold", "3px", "180px", "red", "none", listspot);
txt.insert();
var tabReq=document.createElement("table");
var Inputgrid=listspot.appendChild(tabReq);
Inputgrid.style.marginLeft="7px";
var Inputrow=Inputgrid.insertRow(0);
Inputgrid.cellSpacing="8px";
  for (i=0;i<numoptions;i++)
  {
    Inputrow.vAlign="top";
    var cellReq=document.createElement("td");
    var Inputcell=Inputrow.appendChild(cellReq);
    Inputcell.vAlign="top";
    var text=" "+options[i].firstChild.nodeValue;
    if (topSpec=="35px")
    {
      var width="160px";
    }
    else
    {
      var width="180px";
    }
    var txt=new descriptor(text, "normal", "10px", width, "black", "left", Inputcell);
    var name=button.value+"options[]";
    var response=new inputCheckbox(name, txt.p);
    var option;
   if (options[i].getAttribute("id"))
    {
      identifier=options[i].getAttribute("id");
      response.input.value=response.input.value+identifier;
      response.input.onclick=function (){valid(this, "35px", "15px")};
      var option=document.createElement("div");
      option.id=response.input.value;
    }
   response.insert(option);
   txt.insert();
   if (button.name=="remodels[]")
   {
    if ((i+1)%3==0)
     {
       rowReq=document.createElement("tr");
       Inputrow=Inputgrid.appendChild(rowReq);
     }
   }
   else
   {
     rowReq=document.createElement("tr");
     Inputrow=Inputgrid.appendChild(rowReq);
   }
  }
}

function alterListSpot(listspot, Top, Left)
{
  listspot.style.marginLeft=Left;
  listspot.style.marginBottom="20px";
  listspot.style.marginTop=Top;
  return listspot;
}

function promptBox(button)
{

}

browserCheck();
acquireOptions();
