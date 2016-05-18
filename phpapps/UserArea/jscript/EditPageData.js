function showData(button)
{
  var page=button.innerHTML;
  prepareDisplayArea(page);
}

function prepareDisplayArea(page)
{
  var focusArea=document.getElementById("display")
  var helperArea=document.getElementById("displayhelper");
  helperArea.innerHTML="";
  focusArea.innerHTML="";
  sourceSwap(document.getElementsByTagName("link"), "css/PageEdit.css", "css/dataShown.css");
  AppLoad('Sapps/PageRetrieval.php', 'page=' + page);
}

function editMode(container, headAtt, headFill, bodyAtt, bodyFill)
{
  document.body.onmousedown="mouseTrack(event)";
  //Allow for mouse positioning of edit boxes
  var base=location.href;
  base=base.slice(0, base.lastIndexOf("/"));
  headFill=linkCollect(unescape(headFill), "http://" + location.hostname + "/", absoluteLink);
  headFill=headFill +"<script type='text/javascript' src='" + base + "/jscript/editPageComm.js'></script>";
  bodyFill=linkCollect(unescape(bodyFill), "http://" + location.hostname + "/", absoluteLink)
  var pageContent=container.contentDocument;
  popAttributes(pageContent.head, headAtt);
  pageContent.head.innerHTML=headFill;
  headFill=scriptParser(headFill, pageContent.head);
  popAttributes(pageContent.body, bodyAtt);
  pageContent.body.innerHTML=bodyFill;
//  bodyFill=scriptParser(bodyFill, pageContent.body);
}

/*function absoluteLink(string, base)
{
  var pos=0;
  var foundlink=true;
  do
  {
    var op1=string.indexOf("src=", pos);
    var op2=string.indexOf("href=", pos);
    if(op1>op2 && op2!=-1)
    {
      split=op2+6;
      string=
      pos=split;
    }
    else
    {
      if(op1!=-1)
      {
        split=op1+5;
        string=string.substring(0,split) + base + string.substring(split);
        pos=split;
      }
      else
      {
        foundlink=false;
      }
    }

  }
  while(foundlink==true)
  return string;
}*/

function linkCollect(string, base, decision)
{
  var pos=0;
  var foundlink=true;
  do
  {
    var op1=string.indexOf("src=", pos);
    var op2=string.indexOf("href=", pos);
    if(op1>op2 && op2!=-1)
    {
      split=op2+6;
      string=decision(string, split, base);
      pos=split;
    }
    else
    {
      if(op1!=-1)
      {
        split=op1+5;
        string=decision(string, split, base);
        pos=split;
      }
      else
      {
        foundlink=false;
      }
    }

  }
  while(foundlink==true)
  return string;
}

function absoluteLink(string, split, base)
{
  string=string.substring(0,split) + base + string.substring(split);
  return string;
}
function absoluteUnlink(string, pointOne, base)
{
  pos1=string.indexOf("'", pointOne);
  pos2=string.indexOf('"', pointOne);
  if(pos1<pos2 && pos2!=-1)
  {
    var link=string.substring(pointOne, pos2);
    link=link.replace(base, "");
    string=string.substring(0,pointOne) + link + string.substring(pos2); 
    return string;
  }
  else
  {
   if(pos1!=-1)
   {
     var link=string.substring(pointOne, pos1);
     link=link.replace(base, "");
     string=string.substring(0,pointOne) + link + string.substring(pos1); 
     return string;
   }
 }
}


function plusChange(string)
{
  while(string.indexOf("+")!=-1)
  {
    string=string.replace("+", " ");
  }
  return string;
}

function sourceSwap(possElements, prev, replacement)
{
  for( i=0;i<possElements.length; i++)
  {
    if(possElements[i].href==prev)
    {
      possElements[i].href=replacement;
    }
  }
}

function scriptParser(string, local)
{
 var index=0;
  var spot=string.indexOf("<script", index);
  while(spot!=-1)
  {
    var script=local.ownerDocument.createElement('script'); //location should be appendLocal and should have document extrapolated from it
    var attend=string.indexOf(">", spot);
    attParser(string.substring(spot,attend), script);  
    var scriptend=string.indexOf("</script>");
    script.innerHTML=string.substring(attend+1, scriptend);
    local.appendChild(script);
    string=string.slice(index,spot) + string.slice(scriptend+9);
   spot=string.indexOf("<script");  //IS NOT READING THE CORRECT INFO OR MAKING MULTIPLE CALLS
  }
  return string;
}

//HERE
function attValidate(string)
{
  var realAtts=new Array();
  var possAtts=string.split(" ");
  var init=true;
  for(a=0;a<possAtts.length;a++)
  {
    var divider=possAtts[a].indexOf("=");
    if(divider!=-1)//no equals signs allowed in html aside from attributes
    {
       if(init==false)
       {
         realAtts.push(specifier);
       }
       var specifier=possAtts[a]; 
       init=false; //start line makes a new specifier
    }
    else
    {
       specifier=specifier + " " + possAtts[a];  //piece of attribute adds to the start
    }
  }
  if(init==false)
   {
     realAtts.push(specifier);
   }
  return realAtts;
}

function attParser(string, element)
{
  var attArray=attValidate(string);
  for(i=0;i<attArray.length;i++)
  {
    var splitter=attArray[i].indexOf("=");
    var att=attArray[i].substring(0,splitter);
    var value=attArray[i].substring(splitter+2, attArray[i].length-1);
    element.setAttribute(att, value);
  }
}
//HERE

function popAttributes(element, attArray)
{
  if(attArray)
  {
    for(i=0; i<attArray.length; i=i+2)
    {
      element.setAttribute(attArray[i], attArray[i+1]);
    }
  }
}

//function for UI in secondaryhelper

function highlight(hstart, hend, triggered, highlighted)
{
   var editDoc=document.getElementById("editingFrame").contentDocument;
   editable=editDoc.getElementById(triggered);
   hiSpanClearer(highlighted, editDoc);
   editable.innerHTML=editable.innerHTML.slice(0, hstart)+"<span class='edithighlight'  style='color:white;font-weight:bold;' spotsaver='" + hstart+ "' id='" + highlighted + "'>" + editable.innerHTML.slice(hstart, hend) + "</span>" + editable.innerHTML.slice(hend);
}



function hiSpanClearer(highlightedID, highlightDoc)
{
  var highlightee=highlightDoc.getElementById(highlightedID);
  if(highlightee!=null)
  {
    var start=highlightee.getAttribute('spotsaver');
    var realm=highlightee.parentNode;
    var replant=highlightee.innerHTML;
    realm.removeChild(highlightee);
    realm.innerHTML=realm.innerHTML.slice(0,start) + replant + realm.innerHTML.slice(start);
  }
 return;
}

function editDisplay(triggered, highlighted)
{
  var containmentArea=document.getElementById("editcontainer");
  var editDoc=document.getElementById("editingFrame").contentDocument;
  hiSpanClearer(highlighted, editDoc);
  editable=editDoc.getElementById(triggered);
  var i=0;
  var pointer=0;
  var finaltext="";
  while(containmentArea.childNodes[i]!=null)
  {
    var child=containmentArea.childNodes[i];
    if(child.nodeType==1)
    {
      var start=child.getAttribute("hstart");
      var end=child.getAttribute("hend");
      finaltext=finaltext+editable.innerHTML.slice(pointer,start) + child.value;
      pointer=end;
    }
  i++;
  }
  finaltext=finaltext+editable.innerHTML.slice(pointer);
  editable.innerHTML=finaltext;
  editable.onclick();
  document.getElementById("editreal").disabled=false;
}



function realEdit(triggered, highlighted, pageEdit)
{
  editDisplay(triggered, highlighted);
  var editDoc=document.getElementById("editingFrame").contentDocument;
  var refString="";
  returns=retrieveEdits(editDoc.body, 0, refString, 0);
  refString=returns.refString;
//  refString=refString.slice(0, refString.length-1);
  refPage=document.getElementById("editingFrame").getAttribute("pagesource");
  //would make a seperate function but that would allow for initialization
  parameters="page=" + refPage.slice(refPage.lastIndexOf("/")+1) + refString;
//  document.getElementById("display").innerHTML=document.getElementById("display").innerHTML + parameters;
//  alert(parameters);
  document.getElementById("display").innerHTML="";
  document.getElementById("displayhelper").innerHTML="";
  AppLoad("Sapps/pageChanges.php", parameters);
  //Could Keep Seperate but That leaves in between interference so WYSIWYG is not necessarily true Better on Server Side
}

function retrieveEdits(Container, index, refString, elementIndex)
{
 var base="http://" + location.hostname + "/";
 var espec=Container.getAttribute("eSpec");
 if(espec!=null)
  {
    prevAtts=Container.getAttribute("eSpecAtts").split(",");
    numAtts=prevAtts.length;
    for(a=0; a<numAtts-2; a++)
    {
      attFill=prevAtts[a].replace(escape(base), "");  //ALL CREATED USING SAME SCRIPT ALL SHOULD HAVE SAME BASE
      refString=refString + "&el" + elementIndex + "att" + a + "=" + attFill;
    }
      var oldHtml=linkCollect(unescape(prevAtts[numAtts-2]), base, absoluteUnlink);
    if(espec=="alter")
    {
      var editHtml=Container.getAttribute("src");  //  For Now this WILL BE DONE IN PHP SCRIPT FOR CONTROL.replace(base, "");
    }
    else
    {
      var editHtml=linkCollect(Container.innerHTML, base, absoluteUnlink);
    }
    refString=refString + "&eloldhtml" + elementIndex + "=" + escape(oldHtml) + "&eledithtml" + elementIndex + "=" + escape(editHtml) + "&elrefpage" + elementIndex + "=" + prevAtts[numAtts-1];
    elementIndex++;
    
  }
  var containerParts=Container.childNodes;
   for(i=0; i<containerParts.length; i++)
    {
      var piece=containerParts[i].nodeType;
      if(piece==1 && containerParts[i].tagName!="SCRIPT")
       {
         returns=retrieveEdits(containerParts[i], i, refString, elementIndex);        
         refString=returns.refString;
         i=returns.index;
         elementIndex=returns.elementIndex;
       }
    }
  return {index:index , refString:refString, elementIndex:elementIndex};
}

function previewFile(loaded)
{
  document.getElementById("fileBox").submit();
}

function alterConfirm(triggered, highlighted)
{
  var editDoc=document.getElementById("editingFrame").contentDocument;
  //hiSpanClearer(highlighted, editDoc);
  var alterable=editDoc.getElementById(triggered);
  var returnFrame=document.getElementById("previewer").contentDocument;
  var newSource=returnFrame.getElementById("preview").getAttribute("src");
  changeBufferState(newSource, alterable);
  document.getElementById("editreal").disabled=false;
}

function retrieveImgs(triggered, button)
{
  button.setAttribute("disabled", true);
  origImg=document.getElementById("editingFrame").contentDocument.getElementById(triggered).getAttribute("src");
  //Should do object BUT takes up more memory to store and implement something for one use
  var dirViewer=document.createElement("div");
  dirViewer.id="dirViewer";
  var func="reloadDirs(this, '" +origImg + "')";
  dirViewer.innerHTML="<input type='button' value='Refresh' onclick='" + func + "' />";
  document.getElementById("currentDisplay").appendChild(dirViewer);  
  AppLoad("Sapps/imageSelector.php", "sourceDir=" + escape(origImg));
}

function menuAlter(buttonBox)
{
  var state=buttonBox.checked;
  var menu=document.getElementById(buttonBox.value);
  if(state==true)
  {
   menu.style.display="inline";
  }
  else
  {
    menu.style.display="none";
  }  
}

function previewExisting(image)
{
  var source=image.getAttribute("src");
  var EofRoot=source.lastIndexOf("../");
  source="http://" + location.hostname + source.substr(EofRoot+2);
  var returnFrame=document.getElementById("previewer").contentDocument;
  var newSource=returnFrame.getElementById("preview").setAttribute("src", source);
}

function reloadDirs(button, origImg)
{
  button.setAttribute("disabled", true);
  var subset=document.getElementById("dirPop");
  button.parentNode.removeChild(subset);
  button.parentNode.setAttribute("onChange", button+ ".setAttribute('disabled', false);");
  AppLoad("Sapps/imageSelector.php", "sourceDir=" + escape(origImg));
  
}