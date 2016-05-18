var triggered;
var triggeredID;
var highlightedID;

function elementPrep()
{
  triggeredID=setUiID("triggered");
  highlightedID=setUiID("highlighted");
  sift(document.body, null, 0);
  linkNullify(document.links);
}

function setUiID(baseword)
{
  var addNum=0;
  while(document.getElementById("baseword")!=null)
  {
   baseword=baseword+addNum;
   addNum++;
  }
  return baseword;

}

function linkNullify(linkList)
{
  for(i=0;i<linkList.length;i++)
  {
    linkList[i].setAttribute("oldHref", linkList[i].href);
    linkList[i].href="javascript:void(0)";
  }
}

function storePrevAtts(element)
{
var stringAttArray="";
for(i=0;i<element.attributes.length;i++)
{
  stringAttArray=stringAttArray+escape(element.attributes[i].name)+","+escape(element.attributes[i].value) + ",";
}
stringAttArray=stringAttArray+escape(element.innerHTML);
//stringAttArray=stringAttArray.slice(0,stringAttArray.length-2)+")";
element.setAttribute("eSpecAtts",stringAttArray);
}

function sift(Container, spice, index)
{
 if(Container.getAttribute("eSpec")!=null)
  {
    storePrevAtts(Container);
    var spice=convertUI(Container, spice); //Container Element is element to be altered and read of property
  }
  var containerParts=Container.childNodes;
   for(i=0; i<containerParts.length; i++)
    {
      var piece=containerParts[i].nodeType;
      if(piece==1 && containerParts[i].tagName!="SCRIPT")
       {
         i=sift(containerParts[i], spice, i);        
       }
    }
  return index;
}

function convertUI(element, spice)
{
  switch(element.getAttribute("eSpec"))
  {
     case "reference":
       spice=element.getAttribute("refpoint");
       break;
     case "edit":
//         element.setAttribute("eSpecAtts", element.getAttribute("eSpecAtts") + "," + spice);
       element.setAttribute("onclick", "editThis(this)");
//       element.setAttribute("onchange", action);
       element.style.backgroundColor="yellow";
//       element.style.opacity=.6;
       element.style.border="dotted black 2px";
       element.setAttribute("onmouseover", "overShow(this, event)");
       element.setAttribute("onmouseout", "revertShow(this, event)");
       break;
     case "alter":
       element.setAttribute("onclick", "alterThis(this)");
//       element.setAttribute("onchange", action);
       element.style.backgroundColor="blue";
//       element.style.opacity=.6;
       element.style.border="dotted black 2px";
       element.setAttribute("onmouseover", "overShow(this, event)");
       element.setAttribute("onmouseout", "revertShow(this, event)");
       break;
  }
  element.setAttribute("eSpecAtts", element.getAttribute("eSpecAtts") + "," + spice);
  return spice;
}

function overShow(element, evt)
{
  evt.cancelBubble=true;
  if(element.select!="triggered")
  {
    element.style.borderColor="red";
    element.style.color="green";
  }
}

function revertShow(element, evt)
{
  if(evt)
  {
    evt.cancelBubble=true;
  }
  if(element.select!="triggered")
  {
    element.style.borderColor="black";
    element.style.color="black";
  }
}

function editThis(element, reference)
{
  /*if(triggered)
  {
    triggered.id="no longer selected";
    triggered.select="";
  }
  triggered=element;
  element.select="triggered";
  element.setAttribute("id", triggeredID);
  var superArea=top.document;
  editcontainer=superArea.getElementById("editcontainer");
  if(editcontainer.getElementsByTagName("textarea").length>0)
  {
     removeTextBoxes(editcontainer);
  }*/
  var editcontainer=openEditor(element, "editDisplay");
  editPopulate(editcontainer, element.innerHTML);
}

function alterThis(element, reference)
{
  var editcontainer=openEditor(element, "alterConfirm");
  alterFace(editcontainer, element.src);
}

function alterFace(editcontainer, link)
{
  var pathEnd=link.lastIndexOf("/");
  var pathBegin=link.lastIndexOf(".com")+4;
  var path=link.substring(pathBegin, pathEnd);
  var name=link.substring(pathEnd+1);
  path.replace("/", " ");
  var currentDisplay=document.createElement("div");
  currentDisplay.id="currentDisplay";
  currentDisplay.innerHTML="<iframe id='previewer' name='previewer' width='155px' height='155px'  style='scroll:none;' src='Sapps/ImagePreviewer.php?previewee=" + link + "'></iframe><div>Select New Image From <input type='button' value='Current Photos' onclick='retrieveImgs(\"" + triggeredID + "\", this)' /> or <form id='fileBox' action='Sapps/fileBuffer.php' method='Post' target='previewer' enctype='multipart/form-data'><input type='file' name='localFile' onchange='previewFile()'  /></form></div>";
//PAY ATTENTION TO UNWRITTEN FUNCTIONS ^^
  editcontainer.appendChild(currentDisplay);
}

function openEditor(element, action)
{
  if(triggered)
  {
    triggered.id="no longer selected";
    triggered.select="";
    revertShow(triggered);
  }
  triggered=element;
  element.select="triggered";
  element.setAttribute("id", triggeredID);
  var superArea=top.document;
  var editcontainer=superArea.getElementById("editcontainer");
  clearContainer(editcontainer);
  superArea.getElementById("edittest").disabled=false;
  superArea.getElementById("edittest").innerHTML="Preview My Edit";
  superArea.getElementById("edittest").setAttribute("onclick", action + "('"+triggeredID+"','"+highlightedID+"')");
  superArea.getElementById("editreal").setAttribute("onclick", "realEdit('" +triggeredID+"','"+highlightedID+"')");
 return editcontainer;
}

function clearContainer(container)
{
  container.innerHTML="";
}

function editPopulate(editcontainer, text)
{
  var start=0;
  var end;
  do
  { 
    end=text.indexOf("<", start);
    if(end==-1)
    {
      end=text.length;
    }
    var group=text.substring(start, end);
    editBox(editcontainer, start, end, group);
    if(end<text.length)
    {
      var norm=text.indexOf(" ", end);
      var dev=text.indexOf(">", end);
      if(dev<norm)
      {
        norm=dev;
      }
      start=weedOut(text, text.substring(end+1, norm), end, end)+1; 
    }
    else
    {
     start=0;
    }
  }
  while(start!=0)
}

function weedOut(text, specific, tagstart, beyondtag)
{
  if(specific!="input" && specific!="img" && specific!="br")
  {
   var tagend=text.indexOf("</"+specific, beyondtag);
   var testtag=text.indexOf("<"+specific, tagstart+1);
   if(testtag<tagend && testtag!=-1)//there is another tag inside so there will be another tagend beyond that tagend
   {
      tagend=weedOut(text, specific, testtag, tagend+1);
   }
   else
   {
     tagend=text.indexOf(">",tagend);
   }
  }
  else
  {
    tagend=text.indexOf(">", tagstart);
  }
  return tagend;
}

function editBox(placementpoint, hstart, hend, value)
{
  var box=placementpoint.ownerDocument.createElement('textArea');
  box.setAttribute("class","editbox");
  box.setAttribute("hstart", hstart);
  box.setAttribute("hend", hend);
  box.innerHTML=value;
  box.setAttribute('onfocus',"highlight("+hstart+","+hend+",'"+triggeredID+"','"+highlightedID+"')");
  placementpoint.appendChild(box);
}


elementPrep();
