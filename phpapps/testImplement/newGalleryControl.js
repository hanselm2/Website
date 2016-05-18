var browserInfo;
var galleryObjsArray=[];

function galleryObj(afterWindow, beforeWindow, biosWindow, thumbWindow)
{
  this.afterWindow=afterWindow;
  this.beforeWindow=beforeWindow;
  this.thumbWindow=thumbWindow;
  this.biosWindow=biosWindow;
  this.biosWindowObj;
  this.thumbWindowObj;
  this.biosKeyArr=[];
  this.selectedPicEl;
  this.selectedBios;
  this.selectedAfter;
  this.selectedBefore;
}

galleryObj.prototype.unSelectThru=function(limitingEl)
{
limitingEl=limitingEl || null;
if(this.selectedPicEl && this.selectedPicEl!=limitingEl)
{
  this.selectedPicEl.htmlLinker.removeAttribute("focused");
  unfocus(this.selectedPicEl.htmlLinker);
  if(this.selectedPicEl.showCont)
  {
    if(!limitingEl.showCont || limitingEl.showCont!=this.selectedPicEl.showCont)
    {
      this.selectedPicEl.showCont.toggleShow();
      this.selectedPicEl=this.selectedPicEl.showCont.trigger;
      this.unSelectThru(limitingEl);
    }
  }
  return true;
}
if(!this.selectedPicEl && limitingEl)
{
  return true;
}
return false;
};

galleryObj.prototype.selectThru=function(startingEl)
{
  focus(startingEl.htmlLinker);
  startingEl.htmlLinker.setAttribute("focused", "true");
  if(startingEl.target)
  {
    startingEl=this.selectThru(startingEl.target.dirChildren[0]);
  }
  return startingEl;
};

galleryObj.prototype.showSelected=function (jsBottomEl) //each El is either a trigger or a bottomEl
{
  var prop=(jsBottomEl.axProp=="clientHeight") ? "top":"left";
  var prevPos=jsBottomEl.htmlLinker.getBoundingClientRect()[prop];//this is a spot
  var bool=this.unSelectThru(jsBottomEl);
  var postPos=jsBottomEl.htmlLinker.getBoundingClientRect()[prop];
  var dPos=postPos-prevPos; //change due to previous toggleshow and readjustment
  if(bool)
  {
    if(jsBottomEl.showCont && jsBottomEl.showCont.contDimSum)
    {
      jsBottomEl.showCont.contDimSum(0, dPos);
    }
    jsBottomEl=this.selectThru(jsBottomEl);
    this.switchImages(jsBottomEl.indices[0], jsBottomEl.indices[1]);
    this.selectedPicEl=jsBottomEl;
  }
};

galleryObj.prototype.galSelElModify=function(jsCont)
{
  var child;
  jsCont=jsCont || this.thumbWindowObj.innerEls;
  if(jsCont.nextChildReturn)
  {
    child=jsCont.nextChildReturn();
    if(child!=null)
    {
      if(child.nextChildReturn && typeof child.nextChildReturn == "function")
      {
        this.galSelElModify(child);
      }
      else
      {
	    //needs to seperate Append
	if(!child.indices && !child.target)  //This is more correct since I can give targets to a bottomEl as well, there will need to be modification in the target section though
	{
	     child.indices=child.htmlLinker.getAttribute("id").split(",");
	     //child.biosSelector=this.imgSet[child.indices[0]][2];
	}
	unfocus(child.htmlLinker);
	child.listenerObj=listenerObj("global");
	child.listenerObj.addListener("mouseover", child.htmlLinker, {func:focus, args:child.htmlLinker});
	child.listenerObj.addListener("mouseout", child.htmlLinker, {func:unfocus, args:child.htmlLinker});
	child.listenerObj.addListener("click", child.htmlLinker, {func:galleryObj.prototype.showSelected, context:this, args:child});
      }
     this.galSelElModify(jsCont);
    }
  }
  else
  {
    throw "Not A Valid Container Element";
  }
};

galleryObj.prototype.biosPrep=function(jsCont)
{
  if(!this.biosKeyArr)
  {
  this.biosKeyArr=[];
  }
  jsCont=jsCont || this.biosWindowObj.innerEls;
  if(jsCont.nextChildReturn)
  {
    var child=jsCont.nextChildReturn();
    if(child)
    {
      if(child.nextChildReturn && typeof child.nextChildReturn == "function" && child.toggleShow)
      {
        this.biosKeyArr[child.htmlLinker.getAttribute("ref")]=child;  //this is unique within the scroll Cont Can be changed to any property
      }
      this.biosPrep(jsCont);
    }
  }
  else
  {
    throw "Not A Valid Container Element";
  }
};

galleryObj.prototype.biosSwitch=function (biosEl)
{
  if(this.selectedBios!=biosEl)//jsBiosCont
  {
    if(this.selectedBios)
    {
     this.selectedBios.toggleShow();
    }
    biosEl.toggleShow();
    this.selectedBios=biosEl;
  }
};

galleryObj.prototype.switchImages=function(catIndex, picIndex) //need to account for multiple loaded imagesets
{
  ref=catIndex + "," + picIndex;
  if(this.selectedAfter)
  {
    this.selectedAfter.style["display"]="none";
  }
  if(this.selectedBefore)
  {
    this.selectedBefore.style["display"]="none";
  }
  this.selectedAfter=searchAttWithin("ref", ref, this.afterWindow)[0];
  this.selectedBefore=searchAttWithin("ref", ref, this.beforeWindow)[0];
  this.selectedAfter.style["display"]="block";
  if(!this.selectedBefore)
  {
    this.selectedBefore=searchAttWithin("ref", "default", this.beforeWindow)[0];
  }
  this.selectedBefore.style["display"]="block";
  this.biosSwitch(this.biosKeyArr[catIndex]);//could we just do displaying it?STILL NEED TO REWORK  The cat thing needs to be acknowledged
};

function displaySetUp(displayBox, scrollObjArr, afterWindowId, beforeWindowId, biosWindowId, thumbWindowId)//to be implemented at the bottom of the displayCont
{
  //presets for duplication
  scrollObjArr=scrollObjArr || scrollObjsArray; //reference to preset global object
  displayBox=displayBox || searchAttWithin("id", "displayBox", document, true)[0];//can be customized for preset categories
  afterWindowId=afterWindowId || "afterpic";
  beforeWindowId=beforeWindowId || "beforepic";
  biosWindowId=biosWindowId || "picinfo";
  thumbWindowId=thumbWindowId || "piclist";
  
  //This does not allow for specification of multiple interior display containers yet...
  var galObj=new galleryObj(searchAttWithin("id", afterWindowId, displayBox)[0], searchAttWithin("id", beforeWindowId, displayBox)[0], searchAttWithin("id", biosWindowId, displayBox)[0], searchAttWithin("id", thumbWindowId, displayBox)[0]);
    for(var a=0;a<scrollObjArr.length;a++)
	{
	  if(scrollObjArr[a].fullFrame==galObj.biosWindow)
	  {
	    galObj.biosWindowObj=scrollObjArr[a];
		galObj.biosPrep();
	  }
	  if(scrollObjArr[a].fullFrame==galObj.thumbWindow)
	  {
	    galObj.thumbWindowObj=scrollObjArr[a];
		galObj.galSelElModify();
	  }
	  if(galObj.biosWindowObj && galObj.thumbWindowObj)
	  {
	    break;
	  }
	}
  galObj.switchImages(0,0);//This is a cop out because there will always be one obj of cat 1 and pic 1
  return galObj;
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

function focus(htmlObj)
{
  if (browserInfo=="bad")
  {
    htmlObj.style.filter="alpha(opacity=100)";
  }
  else
  {
    htmlObj.style.opacity=1;
  }
}

function unfocus(htmlObj)
{
  if(!htmlObj.getAttribute("focused"))
  {
    if (browserInfo=="bad")
    {
      htmlObj.style.filter="alpha(opacity=60)";
    }
    else
    {
      htmlObj.style.opacity=.6;
    }
  }
}