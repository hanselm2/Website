var thumbpics=new Array();
var preloadedImages=new Array();
var browserInfo;
var selectedPic;
var dropDown;

function loadXMLDoc(spec, type)
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
		 storeImages(spec, type, xmlDoc);
                 }
           if (xmlhttp.readyState==0)
              {
                 loadXMLDoc(spec, type);
              }
        }
xmlhttp.open("GET","gallerysource.xml", true);
xmlhttp.send();
}

function storeImages(spec, type, reference)
{
browserCheck();
/*if (type=="cat")     //remove all this
{
document.getElementById("topTitle").innerHTML=spec+" Projects:";
var Categories=reference.getElementsByTagName(spec)[0].getElementsByTagName("Group");
}
else
{
var Categories=reference.getElementsByTagName("Group");
Categories=workAround(spec, Categories);
}
*/
//1numCategories=Categories.length;   
numCategories=reference.length;
    for (a=0;a<numCategories;a++)  //
	{
	  preloadedImages[a]=new Array();
          //1var Afters=Categories[a].getElementsByTagName("After");  
          var Afters=reference[a][0];
	  //1var numAfters=Afters.length;                            
          var numAfters=Afters.length;
	  preloadedImages[a][0]=new Array();
          thumbpics[a]=new Array();
          var afterString;
          for (c=0;c<numAfters;c++)  //Number of AfterPics Dictates Number of Thumbnails
	    {
               thumbpics[a][c]=thumb(reference, Afters[c], type);
                /*if (Afters[c].hasChildNodes())
                {
                 //Tagging system
                   preloadedImages[a][0][c]=new Array();
                   preloadedImages[a][0][c][0]=Picture(Afters, c, 500, 500);
                   Tags=Afters[c].getElementsByTagName("Tag");
                   numTags=Tags.length;
                   for (d=0; d<numTags; d++)
                   {
                     preloadedImages[a][0][c][d+1]=imageTag(Tags[d], type);
                   }
                }*/
                //1else
                //1{
		    //1preloadedImages[a][0][c]=Picture(Afters, c, 500, 500);  
                    preloadedImages[a][0][c]=Picture( Afters, c, 500, 500);
                //1}
	    }
            //1var Befores=Categories[a].getElementsByTagName("Before");   
            var Befores=reference[a][1];
	    //1numBefores=Befores.length;                                 
            var numBefores=Befores.length;
            preloadedImages[a][1]=new Array();
              for (c=0;c<numBefores;c++)
	      {
                //1var image=Picture(Befores, c, 180, 180);              
                var image=Picture(Befores, c, 180, 180);
                if (a==numCategories-1 && c==numBefores-1)
                {
                   if (image.addEventListener)
                   {
                      image.addEventListener("load", initialPics, false);
                   }
                   else
                   {
                       if (image.attachEvent)
                       {
                          image.attachEvent("onload", initialPics);
                       }
                    if (image.complete)
                    {
                    initialPics();
                    }
                   }
                }
               preloadedImages[a][1][c]=image;
               }
             /*if (browserInfo=="bad")   //2remove this stuff for db
             {
               var Bios=unescape(Categories[a].getElementsByTagName("Bios")[0].text);
             }
             else
             {
               var Bios=unescape(Categories[a].getElementsByTagName("Bios")[0].textContent);
             }*/
	     //1preloadedImages[a][2]=Bios;    
             preloadedImages[a][2]=unescape(reference[a][2]);
	}
}

function initialPics()
{
  var root=document.getElementById("Top");
  setnumItems(root, thumbpics);
  switchImages(0,0);
}

function setnumItems(root, picArray)
{
var child;
var numThumbs=picArray.length;
for (i=0;i<numThumbs;i++)
{
  if (root)
   {
      if (picArray[i][0])
       {
        var infrastructure=document.createElement("li");
        infrastructure.style.marginLeft="25px";
        var branch=document.createElement("ul");
        branch.style.paddingLeft=0;
        var topNode=makeTopNode(picArray[i][0],"div");
        var NodeInfo=makeNodeInfo(picArray[i][0].className);
        topNode.appendChild(NodeInfo);
        branch.appendChild(topNode);
        infrastructure.appendChild(branch);
        root.appendChild(infrastructure);
       }
       else
       {
          var infrastructure=makeTopNode(picArray[i], "li");
          infrastructure.style.marginLeft="25px";
          infrastructure.style.float="left";
          var NodeInfo=makeNodeInfo(picArray[i].name);
          console.log(picArray[i]);
          NodeInfo.appendChild(picArray[i]);
          infrastructure.appendChild(NodeInfo);
          var item=root.appendChild(infrastructure);
          if (i==0)
          {
             child=item;
          }
          if (i==numThumbs-1)
          {  
             root.style.height=(i+2)*45+"px";
          }
       }
   }
}
return child;
}


//Checks for simple javascript issues
function browserCheck()
{
var check=navigator.appName;
if (check=="Microsoft Internet Explorer")
{
browserInfo="bad";
}
}

function focus(picture)
{
 if (browserInfo=="bad")
 {
   picture.style.filter="alpha(opacity=100)";
 }
 else
 {
   picture.style.opacity=1;
 }
}

function unfocus(picture)
{
if (selectedPic!=picture)
 {
  if (browserInfo=="bad")
  {
    picture.style.filter="alpha(opacity=60)";
  }
  else
  {
    picture.style.opacity=.6;
  }
 }
}

function show_selected(picture, child)
{
if (!picture.hasChildNodes())
{
  picture=document.getElementById(picture.id);
}
  if (selectedPic)
   {
     reset=selectedPic;
     selectedPic=null;
     unfocus(reset);
   }
indices=picture.id.split(",");
catindex=indices[0];
picindex=indices[1];
var root=picture.parentNode;
if (dropDown!=catindex)
{
   if (dropDown)
     {
       removeOtherDrop();
     }
   dropDown=catindex;
   child=setnumItems(root, thumbpics[catindex]);
}
if (child)
  {
   selectedPic=child;
   focus(child);
   picture.onmouseout=function(){unfocus(selectedPic)};
   picture.onclick=function(){show_selected(this, child)};
  }
else
  {
   selectedPic=picture;
  }
focus(picture);
switchImages(catindex, picindex);
}

function switchImages(catindex, picindex)
{
var afterwindow=document.getElementById("afterpic");
var beforewindow=document.getElementById("beforepic");
var biowindow=document.getElementById("picinfo");
scrubElement(afterwindow,2);
scrubElement(beforewindow,2);
scrubElement(biowindow,0);
biowindow.innerHTML="";
biowindow.innerHTML=preloadedImages[catindex][2];
if (preloadedImages[catindex][0][picindex][0])
{
  i=0;
    while (i<preloadedImages[catindex][0][picindex].length)
    {
      var item=afterwindow.appendChild(preloadedImages[catindex][0][picindex][i]);
      if (i>0)
      {
        if(browserInfo=="bad")
         {
           item.style.filter="alpha(opacity=0)";
         }
        else
         {
           item.style.opacity=0;
         }
      }
     i++;
    }
}
else
{
  afterwindow.appendChild(preloadedImages[catindex][0][picindex]);
}
if (preloadedImages[catindex][1][picindex])
 {
   beforewindow.appendChild(preloadedImages[catindex][1][picindex]);
 }
}

function removeOtherDrop()
{
var window=document.getElementById("Top").getElementsByTagName("li")[dropDown].getElementsByTagName("ul")[0];
if (window.hasChildNodes())
{
     while (window.childNodes.length>1)
	{
	   window.removeChild(window.lastChild);
	}
}
window.firstChild.onmouseout=function(){unfocus(this)};
window.firstChild.onclick=function(){show_selected(this)};
window.style.height="45px";
unfocus(window.firstChild);
}

function appear(object, relatedId)
{
if (browserInfo=="bad")
{
object.style.filter="alpha(opacity=80)";
}
else
{
object.style.opacity=.8;
}
if (relatedId)
{
relatedPic=document.getElementById(relatedId);
focus(relatedPic);
}
}

function hide(object, relatedId)
{
if (browserInfo=="bad")
{
object.style.filter="alpha(opacity=0)";
}
else
{
object.style.opacity=0;
}
if (relatedId)
{
relatedPic=document.getElementById(relatedId);
unfocus(relatedPic);
}
}

function scrubElement(element, numSurvivors)
{
   while (element.childNodes.length>numSurvivors)
   {
      element.removeChild(element.lastChild);
   }
}

function thumb(Category, Pic, type)
{
                   var thumb=new Image(35,35);
                   thumb.src=Pic;
                   thumb.id=a+","+c;
                   thumb.style.marginTop="5px";
                   thumb.style.marginLeft="5px";
                   thumb.style.float="right";
                   if (browserInfo=="bad")
                   {
                      thumb.style.filter="alpha(opacity=100)";
                   }
                   if (c==0)
                   {
                     if (type=="job")
                     {
                        thumb.className=Category[a][3];
                     }
                     else
                     {
                        thumb.className="Job "+Category[a][4].toUpperCase()+" "+Category[a][3];
                     }
                   }
                thumbnum=c+1;  
                thumb.name="Picture "+thumbnum;
       return thumb;
}

function Picture(Array, counter, width, height)
{
                var image=new Image(width,height);
		//1image.src=Array[counter].getAttribute("source");
                image.src=Array[counter];
		image.style.position="absolute";
                image.style.zIndex="-1";
          return image;
}

function imageTag(Tag, type)
{
                     var dummy;
                     var tag=document.createElement("div");
                     tag.style.position="absolute";
                     tag.style.width=Tag.getAttribute("width");
                     tag.style.height=Tag.getAttribute("height");
                     tag.style.left=Tag.getAttribute("left");
                     tag.style.top=Tag.getAttribute("top");
                     tag.style.backgroundColor="white";
                     tag.style.cursor="pointer";
                     if (browserInfo=="bad")
                      {
                        tag.style.filter="alpha(opacity=0)"; 
                      }
                     else
                      {
                        tag.style.opacity=0;
                      }
                     tag.innerHTML=Tag.childNodes[0].nodeValue;
                     if (type=="job")
                     {
                     dummy=Tag.getAttribute("linker");
                     links=dummy.split(",");
                     var relatedPic="thumbpics[eval(links[0])][eval(links[1])]";
                     tag.onclick=function(){show_selected(eval(relatedPic))};
                     }
                     tag.onmouseover=function(){appear(this,dummy)};
                     tag.onmouseout=function(){hide(this,dummy)};
       return tag;
}

function makeTopNode(governor, type)
{
        var topNode=document.createElement(type);
        topNode.style.height="45px";
        topNode.style.width="100px";
        topNode.id=governor.id;
        topNode.style.cursor="pointer";
        topNode.onmouseover=function(){focus(this)};
        topNode.onmouseout=function(){unfocus(this, this.id)};
        topNode.onclick=function(){show_selected(this)};
                   if (browserInfo=="bad")
                    {
                       topNode.style.filter="alpha(opacity=60)"; 
                    }
                   else
                    {
                       topNode.style.opacity=.6;
                    }
    return topNode;
}

function makeNodeInfo(info)
{
        var NodeInfo=document.createElement("p");
        NodeInfo.style.marginTop=0;
        NodeInfo.style.width="100px";
        NodeInfo.innerHTML=info;
   return NodeInfo;
}