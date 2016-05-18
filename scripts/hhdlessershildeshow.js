var XMLDoc;
var browserInfo;
var slideshowthumbpics=new Array();
var afterslideshowPics=new Array();
var beforeslideshowPics=new Array();
var slideshowBios=new Array();
var counter;
var numCategories;
var categoryIndex=0;
opaque=1;
var slideshow="true";
var okayStops;
var respec;
var selectedPic;

function loadXMLDoc()
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
                 if (!xmlDoc)
                 {
                    loadXMLDoc();
                 }
                 storeImages('xml');
               }
            if (xmlhttp.readyState==0)
               {
                 loadXMLDoc();
               }
        }
xmlhttp.open("GET","remodelsource.xml", true);
xmlhttp.send(null);
}

function thumb(Group, Pic, spacing)
{
                          var thumb=new Image(100,100);
                          thumb.src=Pic;
                          thumb.style.position="absolute";
                          thumb.id=Group;
                          thumb.style.top=spacing+"px";
                          thumb.onclick=function(){show_selected(this)};
                          if (browserInfo=="bad")
                           {
                            thumb.style.filter="alpha(opacity=60)"; 
                           }
                          else
                           {
                             thumb.style.opacity=.6;
                           }
                          thumb.onmouseover=function(){focus(this)};
                          thumb.onmouseout=function(){unfocus(this)}
       return thumb;
}

function picture(Pic, width, height)
{
                        var image=new Image(width,height);
			image.src=Pic;
			image.style.position="absolute";
                        image.style.zIndex="-1";
                        image.style.left="0";
       return image;
}

function storeImages(sourceType, sqlList)
{
browserCheck();
if(sourceType=='xml')
 {
   var Categories=xmlDoc.getElementsByTagName("Tabs");
   numCategories=Categories.length;
 }
 else
 {
   Categories=sqlList;
   numCategories=sqlList.length;
 }
var randomArray=new Array();
	for (a=0;a<numCategories;a++)
	{
        if(sourceType=='xml')
        {
	  var Groups=Categories[a].getElementsByTagName("Group");
	  var numGroups=Groups.length;
        }
        else
        {
          var Groups=Categories[a];
          var numGroups=Groups.length;
        }
        var randomArray=pickSlideShow(a, numGroups, randomArray);
        }
          var spacing=5;
          var numSlides=randomArray.length;
		for (b=0;b<numSlides;b++)
		{
                    var index=randomArray[b];
                    var value=b%numCategories;
		    if(sourceType=='xml')
                    {
                      var Aftersrc=Categories[value].getElementsByTagName("Group")[index].getElementsByTagName("After")[0].childNodes[0].nodeValue;
         	    }
                    else
                    {
                      var Aftersrc=Categories[value][index][0];
                    }
                    slideshowthumbpics[b]=thumb(b, Aftersrc, spacing);
                    spacing=spacing+110;
		    afterslideshowPics[b]=picture(Aftersrc, 500, 500);
  		    if(sourceType=='xml')
                    {
                       var Beforesrc=Categories[value].getElementsByTagName("Group")[index].getElementsByTagName("Before")[0].childNodes[0].nodeValue;
         	    }
                    else
                    {
                      var Beforesrc=Categories[value][index][1];
                    }
		      //Must upload mask.jpg and modify xml to display correctly    
		    var image=picture(Beforesrc, 180, 180);
                      if (b==numSlides-1)
                        {
                          if (image.addEventListener)
                           {
                              image.addEventListener("load", function() {executeSlideShow()}, false);
                           }
                          else
                           {
                             if (image.attachEvent)
                              {
                                image.attachEvent("onload", executeSlideShow);
                              }
                            }
                          }
                       beforeslideshowPics[b]=image;
                     if(sourceType=='xml')
                     {
                       slideshowBios[b]=Categories[value].getElementsByTagName("Group")[index].getAttribute("id");
                     }
                     else
                     {
                       slideshowBios[b]=Categories[value][index][2];
                     }
		    //info=document.createElement("p");
		    //info.innerHTML=Bios;
		}
}

function pickSlideShow(Category, numGroups, array)
{
	//picks two random pictures per tab to be played through if the user is inactive
        var groupArray=new Array();
        for (i=0;i<numGroups;i++)
        {
          groupArray[i]=i;
        }
	for (i=0;i<1;i++)
	{
           numGroups=groupArray.length;
	   randGroup=Math.floor(Math.random()*numGroups);
           array[Category+(i*numCategories)]=groupArray[randGroup];
           groupArray.splice(randGroup,1);
	}
    return array;
}

function executeSlideShow()
{
counter=1;
numImages=afterslideshowPics.length;
if (document.getElementById("afterpic"))
{
afterBackImage=document.getElementById("afterpic").appendChild(afterslideshowPics[counter]);
afterFrontImage=document.getElementById("afterpic").appendChild(afterslideshowPics[counter-1]);
beforeBackImage=document.getElementById("beforepic").appendChild(beforeslideshowPics[counter]);
beforeFrontImage=document.getElementById("beforepic").appendChild(beforeslideshowPics[counter-1]);
//document.getElementById("picinfo").innerHMTL=slideshowBios[counter-1];
setnumItems(slideshowthumbpics.length, document.getElementById("piclist"));
selectedPic=document.getElementById(counter-1);
focus(selectedPic);
fade(afterFrontImage, beforeFrontImage, afterBackImage, beforeBackImage, numImages, afterslideshowPics, beforeslideshowPics);
}
else
{
executeSlideShow();
}
}

function fade(afterfadeimage, beforefadeimage, afterrelayimage, beforerelayimage, numImages, afterimageArray, beforeimageArray)
{
afterwindow=document.getElementById("afterpic");
beforewindow=document.getElementById("beforepic");
  if (beforewindow.childNodes.length>3||afterwindow.childNodes.length>3)
  {
    if (browserInfo=="bad")
    {
      spec="alpha(opacity="+opaque*100+")";
      if (afterwindow.childNodes.length>3)
       {
         afterfadeimage.style.filter=spec;
       }
      if (beforewindow.childNodes.length>3  && beforefadeimage)
       {
         beforefadeimage.style.filter=spec;
       }
    }
    else
    {
      if (afterwindow.childNodes.length>3)
       {
         afterfadeimage.style.opacity=opaque;
       }
      if (beforewindow.childNodes.length>3 && beforefadeimage)
       {
         beforefadeimage.style.opacity=opaque;
       }
    }
   opaque=opaque-.01;
   if (opaque>=-.01)
   {
     okayStops=setTimeout(function(){fade(afterfadeimage, beforefadeimage, afterrelayimage, beforerelayimage, numImages, afterimageArray, beforeimageArray)}, 20);
   }
   else
   {
     counter++;
     if (respec!=1)
      {
        spec1=counter-1;
      }
     if (respec!=2)
      {
        spec2=counter-1;
      }
     if (counter==numImages)
      {
        counter=0;
        if (respec!=1)
         {
           spec1=numImages-1;
         }
        if (respec!=2)
         {
           spec2=numImages-1;
         }
        respec=0;
      }
     if (slideshow=="true")
     {
       index="Tab"+categoryIndex;
       removeSelectedTab(index);
       categoryIndex++;
       if (categoryIndex%numCategories==0)
        {
          categoryIndex=0;
        }
       setnumItems(slideshowthumbpics.length);
       var newThumb=document.getElementById(spec2);
       var reset=selectedPic;
       selectedPic=newThumb;
       unfocus(reset);
       focus(newThumb);
     }
    if (afterwindow.childNodes.length>3)
     {
       if (afterimageArray[counter])
       {
        afterBackImage=afterimageArray[counter];
       if (spec1 || spec1==0)
        {
          afterFrontImage=afterimageArray[spec1];
        }
        else
        {
        afterFrontImage=afterfadeimage;
        }
        document.getElementById("afterpic").replaceChild(afterBackImage, afterrelayimage);
        document.getElementById("afterpic").replaceChild(afterFrontImage, afterfadeimage);
        if (afterwindow.childNodes.length==3)
         {
           document.getElementById("afterpic").insertBefore(afterBackImage,afterFrontImage);
         }
       }
       else
       {
         if (respec==0)
         {
           afterFrontImage=afterimageArray[spec1];
         }
       respec=1;
       }
     }
    if (beforewindow.childNodes.length>3)
     {
       if (beforeimageArray[counter])
       {
         if (!beforefadeimage)
         {
           beforefadeimage=document.getElementById("beforepic").lastChild;
         }
         beforeBackImage=beforeimageArray[counter];
         beforeFrontImage=beforeimageArray[spec2];
         document.getElementById("beforepic").replaceChild(beforeBackImage, beforerelayimage);
         document.getElementById("beforepic").replaceChild(beforeFrontImage, beforefadeimage);
         if (beforewindow.childNodes.length==3)
          {
            document.getElementById("beforepic").insertBefore(beforeBackImage,beforeFrontImage);
          }
       }
       else
       {
         beforeFrontImage=undefined;
         respec=2;
       }
     }
    opaque=1;
    if (browserInfo=="bad")
     {
       if (afterwindow.childNodes.length>3)
        {
          afterBackImage.style.filter="alpha(opacity=100)";
        }
       if (beforewindow.childNodes.length>3)
        {
          beforeBackImage.style.filter="alpha(opacity=100)";
        }
    }
    else
     {
       if (afterwindow.childNodes.length>3)
        {
          afterBackImage.style.opacity=1;
        }
       if (beforewindow.childNodes.length>3)
        {
          beforeBackImage.style.opacity=1;
        }
     }
        var identifier=slideshowBios[spec2];
        document.getElementById("jobLink").href="hhdgallery.php?packet="+identifier+",job";
    okayStops=setTimeout(function(){fade(afterFrontImage, beforeFrontImage, afterBackImage, beforeBackImage, numImages, afterimageArray, beforeimageArray)}, 1000);
   }
  }
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

function setnumItems(numThumbs, window)
{
//var i;
selectTab();
for (i=0;i<numThumbs;i++)
{
if (window)
{
     if (window.childNodes[i])
     {
       window.replaceChild(slideshowthumbpics[i], window.childNodes[i]);
     }
     else
     {
       window.appendChild(slideshowthumbpics[i]);
     }
}
}

}

function show_selected(picture)
{
  if (selectedPic)
   {
     reset=selectedPic;
     selectedPic=null;
     unfocus(reset);
   }
index="Tab"+categoryIndex;
removeSelectedTab(index);
var index=picture.id;
categoryIndex=index%numCategories;
selectTab();
selectedPic=picture;
focus(picture);
stopShow();
resetPics(index);
}

function stopShow()
{
clearTimeout(okayStops);
}

function resetPics(index)
{
afterwindow=document.getElementById("afterpic");
beforewindow=document.getElementById("beforepic");
scrubElement(afterwindow, 2);
scrubElement(beforewindow, 2);
counter=1;
afterFrontImage=afterwindow.appendChild(afterslideshowPics[index]);
beforeFrontImage=beforewindow.appendChild(beforeslideshowPics[index]);
if (browserInfo=="bad")
{
  afterFrontImage.style.filter="alpha(opacity=100)";
  beforeFrontImage.style.filter="alpha(opacity=100)";
}
else
{
  afterFrontImage.style.opacity="1";
  beforeFrontImage.style.opacity="1";
}
}

function changeTab(tabNumber)
{
  if (selectedPic)
   {
     reset=selectedPic;
     selectedPic=null;
     unfocus(reset);
   }
index="Tab"+categoryIndex;
categoryIndex=tabNumber;
removeSelectedTab(index);
selectTab();
selectedPic=document.getElementById("piclist").childNodes[tabNumber];
focus(selectedPic);
resetPics(tabNumber);
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

function removeSelectedTab(index)
{
  document.getElementById(index).getElementsByTagName("span")[0].style.color="black";
}

function selectTab()
{
  index="Tab"+categoryIndex;
  document.getElementById(index).getElementsByTagName("span")[0].style.color="#C11B17";
}

function scrubElement(element, numSurvivors)
{
   while (element.childNodes.length>numSurvivors)
   {
      element.removeChild(element.lastChild);
   }
}
