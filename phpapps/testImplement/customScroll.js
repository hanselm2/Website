var stdBarSrcVert="phpapps/testImplement/scrollBarButVert.png";
var stdBarSrcHoriz="phpapps/testImplement/scrollBarButHoriz.png";
var scrollObjsArray=[];


function setCharSelect(possible2, exempt)  //second set of possiblities and whether they are exemptions from the normal set or a seperate set
{
  exempt= exempt || false;
  var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if(possible2)
  {
	if(exempt)
	{
	  for(var i=0; i<possible2.length; i++)
	  {
	    possible.replace(possible2[i], "");
	  }
	}
	else
	{
	  possible=possible2;
	}
  }
  
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

function makeId(cont, length) {
   length = length || 5;
   cont= cont || window;
    var text = "";
	var selChar;
	
    do//First character cannot be a number
	{
	  selChar=setCharSelect();
	}
	while(parseInt(selChar))
	text=selChar;
    for (var i=1; i<length; i++) 
	{
        text += setCharSelect();
    }
	text=idGenTest(text, cont);
    return text;
}

function interiorDist(htmlCont, distObj, axProp)
{
  if(axProp=="clientHeight")
  {
    var post1="top";
	var post2="bottom";
  }
  if(axProp=="clientWidth")
  {
    var post1="left";
	var post2="right";
  }
  if(post1 && post2)
  {
    return Math.floor(distObj.getBoundingClientRect()[post2]-htmlCont.getBoundingClientRect()[post1]+domNumValCorrect(window.getComputedStyle(distObj).getPropertyValue("margin-"+post2).replace("px","")));
  }
  else
  {
    throw "AxProp Is Not Properly Defined";
  }
}

function fullAxisVal(baseProp, domObj)
{
	if(baseProp=="clientWidth")
	 {
	  var post1="-left";
	  var post2="-right";
	 }
	if(baseProp=="clientHeight")
	 {
	  var post1="-top";
	  var post2="-bottom";
	 }
	if(post1 && post2)
	{
       	var cssObj=window.getComputedStyle(domObj);
	    return domObj[baseProp]+domNumValCorrect(cssObj.getPropertyValue("margin"+post1).replace("px",""))+domNumValCorrect(cssObj.getPropertyValue("margin"+post2).replace("px",""))-domNumValCorrect(cssObj.getPropertyValue("padding"+post1).replace("px",""))-domNumValCorrect(cssObj.getPropertyValue("padding"+post2).replace("px",""))+domNumValCorrect(cssObj.getPropertyValue("border"+post1).replace("px",""))+domNumValCorrect(cssObj.getPropertyValue("border"+post2).replace("px",""));
	}
}

function domNumValCorrect(val, correction)
{
  correction= correction || 0;
  val=(isNaN(val)) ? correction : val;
  return parseInt(val);
}

//Random id tester for window Object
function idGenTest(id, cont, tryString)
{
  var maxTierTries=26;  //Number to specify before stacking numbers... should not exceed length of setChars to select from
  tryString=tryString || "";
  cont= cont || window;
  if(cont[id]!==undefined)
  {
   if(tryString.length!=0 && tryString.length<maxTierTries)
   {
     id=id.slice(0, id.length-1);
   }
   var selChar=setCharSelect(tryString, true);
   tryString+=selChar;
   id+=selChar;
   id=idGenTest(id, cont, tryString);
  }
  return id;
}

//Looks through a container for the given val, returning the first instance in the nesting
function searchAttWithin(att, val, cont, thruAll, noDepth)  //for later, could modify to search nested within and reflect that in array structure
{
  thruAll=thruAll || false;
  noDepth=noDepth || false;

  var partialstr;
  var partial=[];
  var match=[];
  if(cont.children)
  {
    for(var a=0;a<cont.children.length;a++)
    {
            if(att=="id" || att=="class")
      {
        partialstr=cont.children[a].getAttribute(att);
        if(typeof partialstr=="string")
        {
          var found=partialstr.split(" ");
		  for(var b=0;b<found.length;b++)
		  {
		    if(found[b]==val)
			{
			  if(thruAll)
			  {
			    partial.push(cont.children[a]);
			  }
			  else
			  {
			    if(partial.length==0)
				{
				  partial.push(cont.children[a]);
				}
			  }
			}
		  }
        }
      }
    	if((cont.children[a].getAttribute(att) && cont.children[a].getAttribute(att)==val) || (cont.children[a][att] && cont.children[a][att]==val))
	   {
	          match.push(cont.children[a]);
		  if(partial.length>1)
		  {
		    partial.pop();
		  }
	          if(!thruAll)
	          {
                    return match;  //returns single length array
                  }
		  else
		  {
		    while(partial.length>0)
			{
			  match.unshift(partial.pop());
			}
		  }
	   }
	   else
	   {
	     if(noDepth && cont.children[a].children.length>0)
		 {
		    var extra=searchAttWithin(att, val, cont.children[a], thruAll, noDepth);
		    if(extra && extra.length>0)
			{
			  for(var b=0;b<extra.length;b++)
			  {
			    match.push(extra[b]);  //this gives arrays of order [el, [el1, el2], [el1], el2]  by definition every array is a seperate tier and all corresponding 1st elements in the tier
			  }
			}
		 }
	   }
    }
  }
  if(partial.length>0 && match.length==0)
  {
    match=partial;
  }
  else
  {
    while(partial.length>0)
	{
	  match.push(partial.shift());
	}
  }
  return match;
}

function eventRemove(event, listener, htmlObj)
{
  if(htmlObj.removeEventListener)
  {
    htmlObj.removeEventListener(event, listener);
  }
  if(htmlObj.detachEvent)
  {
    htmlObj.detachEvent(event, listener);
  }
}

//Standard ScrollBar as defined in Javascript
function stdBarBut(cont, sBarButClass)
{
   var sBar=document.createElement("img");
   if(cont.getAttribute("class").indexOf("right")!=-1 || cont.getAttribute("class").indexOf("left")!=-1)//inconsisten litmus
   {
     sBar.style.width="100%";
     sBar.src=stdBarSrcVert;
   }
   else
   {
     sBar.style.height="100%";
     sBar.src=stdBarSrcHoriz;
   }
   sBar.className=sBarButClass;
   cont.appendChild(sBar);
   return sBar;
}
//Container and htmlLinks to display them
function selfRefObj(id, objSpace)
{
  objSpace=objSpace || window;
  this.id=id;
  this.objSpace=objSpace;
}

function selfRefObjFns()
    {
	  this.refSelf=function(){
       return this.objSpace[this.id];};
	   this.alertSelf=function(){
       alert(this.id + " in this objSpace " + this.objSpace + " Which self Refs to " + this.objSpace.id);
               };
      return this;
    };
	
selfRefObjFns.call(selfRefObj.prototype);

//Scroll Button Object  Needs Speed, Direction, the htmlButtonlink, and it's global objectID
//Shared variables for scrollBut object (linked variables)
function scrollSet(speed, axis, fullFrame, sCont, sWindow, setId, upBut, downBut, sBarCont)
{
    selfRefObj.call(this, setId);
	this.listenerObj=listenerObj("global");
        this.min=0;
	this.addDim=0
	this.paused=true;
	this.axis=axis;
	this.axProp=(axis=="margin-top") ? "clientHeight" : "clientWidth";
	this.speed=speed;
	this.fullFrame=fullFrame;
	this.sCont=sCont;
	this.sWindow=sWindow;
	var ref=this;
	var upButid="upBut";
	var downButid="downBut";
    this.buttonIdSet=[upButid, downButid];
	this[upButid]=new scrollBut(true, upBut, upButid, this);
	this[downButid]=new scrollBut(false, downBut, downButid, this);
	//Obj for storing local innerElements
	this.innerEls={schema:[], id:"innerEls", contDimSum:function(add, dPos){this.addDim+=add;this.jsCont.contDimSum(add, dPos);}};
	showContBase.call(this.innerEls, this, this.axProp);
	showContBaseFns.call(this.innerEls);
	this.inventory();
    this.start=domNumValCorrect(window.getComputedStyle(sCont).getPropertyValue(axis).replace("px",""));
	if(this.start>this.min)//StillBuggy if the user presets a marginspace, the minimum is changed to that margin (only if positive atm) means extra play in axis
	{
	  this.min=this.start;
	}
    this.addDim=this.sWindow[this.axProp]-this.innerEls.addDim+(this.min*2); 
	if(sBarCont)
	{
	  this.sBar=new scrollBar(this, sBarCont);
	}
	this.posChange();
	this.htmlEventLink();
}

selfRefObjFns.call(scrollSet.prototype);

//links the children to the shared object
scrollSet.prototype.pairChild=function(child)
							{
							   this.buttonIdSet.push(child);
							};

//Implements the children's function							
scrollSet.prototype.childImplement=function(fn)
										{
										   for(var a=0;a<this.buttonIdSet.length;a++)
										   {
										     fn.call(this[this.buttonIdSet[a]]);
										   }
										};

scrollSet.prototype.inventory=function (uniqueId, htmlCont, jsCont, schemaRow)  //first instance is stored button
						{   //extra arguments are passed to bottom objs
							var top=false;
							htmlCont= htmlCont || this.sCont;
							uniqueId=uniqueId || makeId(this.innerEls);
							jsCont=jsCont || this.innerEls;
							if(!schemaRow)
							{
							  top=true;
							}
							schemaRow=schemaRow || this.innerEls.schema;
							
							var objSlot;
							var triggerObj;
							var schemaOffset=schemaRow.length;
							var schemaPass;
						    for(var a=0;a<htmlCont.children.length;a++)
							{
							  uniqueId=idGenTest(uniqueId, this.innerEls);
								if(htmlCont.children[a].children.length>0)
								{
								  if(htmlCont.children[a].getAttribute("showCont"))//indicator in the DOM not to make a showCont
								  {
									this.innerEls[uniqueId]=new showCont(htmlCont.children[a], jsCont, this.axProp, triggerObj, uniqueId, this.innerEls);//hmmmm
									objSlot=this.innerEls[uniqueId];
									if(objSlot.trigger) //locates all objs made by scrollset to have their listeners in the scrollset as well This is not as portable
									{
										this.listenerObj.addListener("click", objSlot.trigger.htmlLinker, {func:showCont.prototype.toggleShow, context:objSlot});
									}
									objSlot.htmlMeasureDim();
									schemaRow[a+schemaOffset]=new Array();
									schemaRow[a+schemaOffset][0]=uniqueId;//stores container obj as first element w/ objs inside of it
									if(triggerObj)
									{
									  triggerObj.target=this.innerEls[uniqueId];
									}
									triggerObj=undefined;
									schemaPass=schemaRow[a+schemaOffset];
								  }
								  else
								  {
								    objSlot=jsCont;
									schemaPass=schemaRow;
								  }
								  this.inventory(uniqueId, htmlCont.children[a], objSlot, schemaPass);//Every Html Cont gets rolled through for inventory
								  schemaOffset=schemaRow.length;  //in case we appended to same row more or less than 1
								}
								else  //all bottom elements should have their attributes appended
								{
								  //modify to your scrollElementNeeds
								   switch(htmlCont.children[a].getAttribute("contFunc"))
									{
									   case "trigger":
											objSlot=new triggerEl(htmlCont.children[a], this.axProp, jsCont, uniqueId, this.innerEls);
											triggerObj=objSlot;
											break;
										case "bottom":
									        objSlot=new bottomEl(htmlCont.children[a], this.axProp, jsCont, uniqueId, this.innerEls);
											break;
										default:
										    objSlot=new bottomEl(htmlCont.children[a],this.axProp, jsCont, uniqueId, this.innerEls);
										    break;
									}
									schemaRow[a+schemaOffset]=uniqueId;
								}
								if(objSlot!=jsCont)
								{
								  jsCont.dirChildren.push(objSlot);  //each obj contains uniqueId ref to innerEls space
								}
							}
				                   if(top)//more powerful would be to use the schema unimplemented==first occurence
						    {
							jsCont.addDim=jsCont.htmlMeasureDim(htmlCont);
						    }
						};
						
//Reads through the html and generates a popHeight as well as ShowContainers
//Based on template (ElementWithId) and div with children inside is linked and invisible										
scrollSet.prototype.deSelect=function(callId)
				{
				   if(this.timer!=undefined)
				   {
					clearTimeout(this.timer);
				   }
				   	this.paused=true;
				    this.childImplement(this[callId].pauseAnim);
				};

   //Times Scroll Function
scrollSet.prototype.scroll=function(callId)
		{
			  var nexPoint=parseInt(this.start)+parseInt(this.speed)*this[callId].upward;
			  if(nexPoint>this.min)
			  {
			    nexPoint=this.min;
			  }
			  if(nexPoint<=this.min && this.addDim<this.min)
			  {
			    if(nexPoint<=this.addDim )
				{
				  nexPoint=this.addDim
				}
			      this.start=nexPoint;
			      this.posChange();
			      //this.linkedObjAction(sharedVarChange, "start", nexPoint);
			      //this.scrollBody.style[this.axis]=this.start+"px";
			      var timerObj=this;
			      this.timer=setTimeout(function(){timerObj.scroll(callId)},100);
			  }
		};
//Toggles Pause value for scroll Object
scrollSet.prototype.togglePause=function(callId)
		{
		  if(this.paused==true)
		     {
					this.paused=false;
					this.childImplement(this[callId].playAnim);
					this.scroll(callId);
			}
			else
			{
			   this.deSelect(callId);
			}
		};
	
scrollSet.prototype.posChange=function (startOverride)
	  {
	    this.start= startOverride || this.start;
	    if(this.sBar)
		{
		  var rEq=(this.sBar.tRatio!=0) ? (1/this.sBar.tRatio) : 0;
		  this.sBar.bar.style[this.axis]=(((this.start-this.min)*-1)*rEq)+"px"; //accounts for extra>0 shifts index by min
		}
		this.sCont.style[this.axis]=this.start+"px";
	  };

scrollSet.prototype.mSet=function()
				{
				   this.mPosInit=(this.axis=="margin-top") ? window.event.clientY : window.event.clientX;
				   
				   this.listenerObj.addListener("mousemove", window, {func:scrollSet.prototype.mTrack, context:this});
				   var proxy=this;
				   var listener=this.listenerObj.listenerReturn("last mousemove", window);
				   var func=function(){
				        proxy.listenerObj.removeOn(window, listener, "mousemove");
					    proxy.listenerObj.removeOn(window, this, "mouseup");
				        };
				   this.listenerObj.addListener("mouseup", window, {func:func});
				   //this.listenerObj.addListener("mouseup", window, {func:function(){proxy.listenerObj.removeOn(window, proxy.listenerObj.listenerReturn("last mouseup", window), "mouseup");proxy.listenerObj.removeOn(window, this, "mouseup");}});//never removes only compiles
				   //var listener2=eventAppend("mouseup", function(){eventRemove("mousemove", listener, window);}, window);
				   //eventAppend("mouseup", function(){eventRemove("mouseup", listener2, window);}, window);
				};

				
scrollSet.prototype.mTrack=function()
				{
				   var mPos=(this.axis=="margin-top") ? window.event.clientY : window.event.clientX;
				   var dMPos=parseInt(mPos-this.mPosInit+parseInt(this.sBar.bar.style[this.axis].replace("px","")));
				   if(dMPos<=this.sBar.tDist && dMPos>=0)
				   {
				     this.start=parseInt(this.start+parseInt((mPos-this.mPosInit)*this.sBar.tRatio*-1));
					 this.mPosInit=mPos;
				   }
				   else
				   {
				     if(dMPos>this.sBar.tDist)
					 {
					   this.start=parseInt(this.sBar.tDist*this.sBar.tRatio)*-1;
					 }
					 else
					 {
					   this.start=this.min;
					 }
				   }
				   this.posChange();
				};
				
scrollSet.prototype.htmlEventLink=function()
                      {
					    for(var i=0;i<this.buttonIdSet.length;i++)
						{
						  this.listenerObj.addListener("mousedown", this[this.buttonIdSet[i]].linker, {func:scrollSet.prototype.togglePause, context:this, args:this.buttonIdSet[i]});
						  this.listenerObj.addListener("mouseup mouseout", this[this.buttonIdSet[i]].linker, {func:scrollSet.prototype.deSelect, context:this, args:this.buttonIdSet[i]});
					      /*eventAppend("mousedown", scrollSet.prototype.togglePause, this[this.buttonIdSet[i]].linker, [true, this], this.buttonIdSet[i]);
                          eventAppend("mouseup", scrollSet.prototype.deSelect, this[this.buttonIdSet[i]].linker, [true, this], this.buttonIdSet[i]);
	                      eventAppend("mouseout", scrollSet.prototype.deSelect, this[this.buttonIdSet[i]].linker, [true, this], this.buttonIdSet[i]);*/
						}
						if(this.sBar.bar)
						{
						  this.listenerObj.addListener("mousedown", this.sBar.bar, {func:scrollSet.prototype.mSet, context:this});
						  //eventAppend("mousedown", scrollSet.prototype.mSet, this.sBar.bar, [true, this]);
						}
					  };	  
					  
scrollSet.prototype.contDimSum=function (add, dPos)
							{
							  dPos=dPos || 0;
							  add=Math.floor(add);
							  this.start-=dPos;//plus or minus I'm doing post minus init.  if it's negative, then it has moved up and so we need to move down.  that means start must become less negative so it should be subtracted
							  if(this.addDim!=0 && this.addDim-add<0 && this.start<this.addDim-add && this.start<this.min)  //previous additional Dimension play was exactly none
							  {
							    this.start=this.start*(this.addDim-add)/this.addDim;
							  }
							  else
							  {
							    if(this.addDim>add || this.start>this.min)//second condition incase of over correction
								{
							      this.start=this.min;
								}
							  }
							  this.addDim-=add;
							  this.sBar.sizeChange(this.addDim*-1);
							  this.posChange();
							};
					  
function bottomEl(htmlLinker, axProp, jsCont, uniqueId, objSpace)
{
  selfRefObj.call(this, uniqueId, objSpace);
  this.htmlLinker=htmlLinker;
  this.showCont=jsCont;
  this.axProp=axProp;
  this.fullDim=fullAxisVal(axProp, this.htmlLinker);
}

selfRefObjFns.call(bottomEl.prototype);						
							
function triggerEl(htmlLinker, axProp, uniqueId, objSpace, target)
{
  bottomEl.call(this, htmlLinker, axProp, uniqueId, objSpace);
  this.target=target || undefined;
  function anchor(el)
  {
    if(el.getclientBoundingRect.bottom-el.getClientBoundingRect.top>windowheight)
	{
	  this.start=el.getClientBoundingRect.top;
	}
  }
}

selfRefObjFns.call(triggerEl.prototype);  //a little messy still, I would like to reference all the prototypes of my previous constructors


function showContBaseFns()
{
 this.nextChildReturn=function(pSpot) {                  
                            if(!this.pointer && this.pointer!=0)
							{
							  this.pointer=-1;
							}			
                            if(pSpot)
							{
							  this.pointer=pSpot-1;
							}							
                            this.pointer++;
							if(this.pointer<this.dirChildren.length)
							{
                              return this.dirChildren[this.pointer];
							}
							else
							{
							  this.pointer=-1;
							  return null;
							}
                        };
  this.htmlRemeasureDim=function () { 
                           this.htmlMeasureDim();
						   for(var a=0;a<this.dirChildren.length;a++)
						     {
							   if(this.dirChildren[a].dirChildren)  //if a container of the first level is not showing, subtract it's total from it's holder
                               {											   
								 this.dirChildren[a].htmlRemeasureDim();
							   }
						     }
						};
						
						
  this.htmlMeasureDim=function(htmlCont, Dim, axProp){//returns comprehensive size of an object based on visual standard when all is displayed
                           axProp=axProp || this.axProp;
						   htmlCont=htmlCont || this.htmlLinker;
						   Dim= Dim || 0;
						   var possDim=0;
						   for(var a=0;a<htmlCont.children.length;a++)
						   {
						   if(htmlCont.children[a].getAttribute("display")!="none")
							 {
							   if(htmlCont.children[a].children.length>0)
							   {
							     possDim=interiorDist(htmlCont, htmlCont.children[a], this.axProp);
								 if(possDim>Dim)
								 {
								   Dim=possDim;
								 }
							     Dim=this.htmlMeasureDim(htmlCont.children[a], Dim);
							   }
							   else
							   {
							     possDim=interiorDist(htmlCont, htmlCont.children[a], this.axProp);
								 if(possDim>Dim)
								 {
								   Dim=possDim;
								 }
							   }
							 }
						   }
						   if(this.htmlLinker && htmlCont==this.htmlLinker)
						   {
						     this.addDim=Dim;
						   }
						   return Dim;
						 };

	return this;
}
  

function showContBase(jsCont, axProp)
{
  this.axProp=axProp;
  this.pointer=-1;
  this.addDim=0;
  this.jsCont=jsCont;
  this.dirChildren=[];
}

selfRefObjFns.call(showContBase.prototype);
showContBaseFns.call(showContBase.prototype);

function showContFns()
{
  this.toggleShow=function (dPos)
			{
			  if(!this.show)
			  {
				this.htmlLinker.style.display="inline";
				this.show=true;
			  }
			  else
			  {
				this.htmlLinker.style.display="none";
				this.show=false;
			  }
			  var prev=this.addDim;
			  this.htmlRemeasureDim();
			  this.contDimSum(this.addDim-prev, dPos);
			  
			};
	this.contDimSum=function (add, dPos)
			{
			    this.jsCont.addDim+=add;
			    this.jsCont.contDimSum(add, dPos); //top element is scrollSet with different contDimSum
			};
  return this;
};

function showCont(htmlCont, jsCont, axProp, triggerObj, uniqueId, objSpace)
{
  selfRefObj.call(this, uniqueId, objSpace);
  showContBase.call(this, jsCont, axProp);
  this.htmlLinker=htmlCont;
  this.htmlLinker.style.display="none";
  this.trigger=triggerObj;
  this.show=false;
}

showContBaseFns.call(showCont.prototype);
showContFns.call(showCont.prototype);

function scrollBarFns()
{
  this.sizeChange=function (moveDist)  //positive dist means travel
    {
	  if(moveDist>0)
	  {
	    if(this.maxtDist-moveDist>0)
		{
		  this.bar.style[this.axProp]=this.maxtDist-moveDist+this.min+"px";
		  this.tDist=moveDist;
		  this.tRatio=1;
		}
		else
		{
		  this.bar.style[this.axProp]=this.min+"px";
		  this.tDist=this.maxtDist;
		  this.tRatio=moveDist/this.maxtDist;
		}
	  }
	  else
	  {
	    this.bar.style[this.axProp]="100%";
		this.tDist=0;
		this.tRatio=0;
	  }
	};
   return this;
}

function scrollBar(setObj, sBarCont, sBarButClass)
{
  sBarButClass= sBarButClass || "scrollBarBut";
  this.setId=setObj.id;//setId;
  this.min=15;
  this.barCont=sBarCont;
  this.bar=searchAttWithin("class", sBarButClass, this.barCont)[0];
  if(!this.bar)
  {
    this.bar=stdBarBut(this.barCont, sBarButClass);
  }
  this.bar.setAttribute("draggable", false);
  this.axProp=(setObj.axis=="margin-top") ? "height" : "width";
  this.maxtDist=window.getComputedStyle(this.barCont).getPropertyValue(this.axProp).replace("px","")-this.min;
  this.sizeChange(setObj.addDim*-1);  //must invert the value from addDim
}

scrollBarFns.call(scrollBar.prototype);   
						
function scrollBut(upward, htmlLinker, selfId, objSpace)//speed, axis, upward, scrollBody, htmlLink, globalId, shared)
{
   //id stored for global reference
   selfRefObj.call(this, selfId, objSpace);
	//Should be a way to determine direction for both axes up vs down and right vs left;
    if (upward)  //Should reflect both axis later
	{
	  this.upward=1;
	  this.animPlay="Upward";
	}
       else
	{
	  this.upward=-1;
	  this.animPlay="Downward";
	}
       //physical button in correlation to the obj
       this.linker=htmlLinker;
	   this.linker.setAttribute("draggable", false);
}

//Button Animations	
scrollBut.prototype.pauseAnim=function ()
	{
	   this.linker.style["opacity"]=1; //Should be anything and stored to the object in Ani
	};
	
scrollBut.prototype.playAnim=function ()
	{
	   this.linker.style["opacity"]=.5;
	};
   //Shared Animations should be transfered to scrollSet
   scrollBut.prototype.animPause="Paused";

function scrollBuild(frameCont, axis, speed, sWindowClass, upButId, downButId, sBarClass, sContClass)
	{
	  	  //presets
	  speed= speed || 5;
	  sWindowClass= sWindowClass || "scrollFrame";//defined by Class
	  sContClass=sContClass || "scrollCont";//defined by Class
	  upButId=upButId || "scrollUpBut";
	  downButId=downButId || "scrollDownBut";
	  sBarClass=sBarClass || "scrollBar";//defined by Class
	  axis=(axis==true) ? "margin-top" : "margin-left";
	  
	  var sWindow=searchAttWithin("class", sWindowClass, frameCont)[0];
	  var sCont=searchAttWithin("class", sContClass, sWindow)[0];
	  var upBut=searchAttWithin("id", upButId, frameCont, false, true)[0];
	  var downBut=searchAttWithin("id", downButId, frameCont, false, true)[0];
      sCont.style[axis]=domNumValCorrect(window.getComputedStyle(sCont).getPropertyValue(axis)); //redundant, but it ensures the correct margin
	  var setId=makeId();
	  var sBarCont=searchAttWithin("class", sBarClass, frameCont, false, true)[0];
	  //this may be unecessary
	  var scrollObj=new scrollSet(speed, axis, frameCont, sCont, sWindow, setId, upBut, downBut, sBarCont);
	  return scrollObj;
   }