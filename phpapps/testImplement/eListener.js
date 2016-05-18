
function arraysEqual(a, b) 
{
  if (a === b)
  {  
    return true;
  }
  if (a == null || b == null)
  {
    return false;
  }
  if (a.length != b.length)
  {
    return false;
  }

  for (var i = 0; i < a.length; ++i) 
  {
    if (a[i] !== b[i])
	{
	  return false;
	}
  }
  return true;
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



var globalListenId=makeId();

//When applied to eventAppend, extra details may be passed using the listenerDetails Obj because all listeners are of the form func.apply(context, args)
function singleListener(eventTag, obj, listenerDetails, listener)  //listenerDetails {func: , context: , args: }  must include details about the listener
{
  this.e=eventTag;
  this.obj=obj;
  if(listenerDetails)
  {
    if(!listenerDetails.context)
	{
	  listenerDetails.context=obj;
	}  
	this.listenerDetails=listenerDetails;
	var fn=listenerDetails.func;
    var context=listenerDetails.context;
    var args=listenerDetails.args;
	if(!Array.isArray(args))
	{
	  args=[args];
	}
  }
  //listener should be constructed 
  this.listener=listener || function(){fn.apply(context, args)}; 
  //if a specific listener is designated, it should be alloted in the listener section and the details will be included without making a new listener
  //This allows for shared listeners and removal as well
  //while a listenerDetails obj is required, it is recommended that it reflects the listener details
  //if it does not, if may rewrite to a seperate function or cause problems because the context/args/fn will be different than expected
}

singleListener.prototype.remove=function()
					{
					  if(this.obj.removeEventListener)
					  {
					   this.obj.removeEventListener(this.e, this.listener);
					  }
					  else
					  {
					    if(this.obj.detachEvent);
						{
						  this.obj.detachEvent(this.e, this.listener);
						}
					  }
					};

singleListener.prototype.add=function()
					{
					  if(this.obj.addEventListener)
					  {
					   this.obj.addEventListener(this.e, this.listener);
					  }
					  else
					  {
					    if(this.obj.attachEvent);
						{
						  this.obj.attachEvent(this.e, this.listener);
						}
					  }
					};
					
singleListener.prototype.spotVerify=function()
					{
					  if(this.gId && this.gId>-1)
					  {
					    for(var a=(this.gId>=window[globalListenId].length)? window[globalListenId].length-1:this.gId;a>=0;a--)
						{
						  if(window[globalListenId][a].e==this.e && window[globalListenId][a].listener==this.listener && window[globalListenId][a].obj)
						  {
						    this.gId=a;
						    return true;
						  }
						}
					  }
					  return false;
					};

function listenerObj(specifiers, eventTags, obj, listenerDetails, listener)  //this is a storage class invoked after eventAppend Should be done this way so as to pass arguments and such
{
  
  //Private Latent Functions
  function latentDump()
  {
    latentArray=[];
  }
  
  function toLatent(array)
  {
    for(var a=0;a<array.length;a++)
	{
	  latentArray.push(array[a]);
	}
  }
  
  //Private detect Same Listener Fn
  //There are two methods of detection:  if the listener is specified or by comparing the details.  
  //Since every listener made from a listenerDetails obj is unique, the way to detect it is to check all of its value
  //Conversely, some objs can be formed from an already formed listener and therefore should be registered off of the listener
  //some problems will arise if the listenerDetails indeed do not match the listener
  //this is few and far between and, with care, can be exploited to have a pre-write rewrite function
  function detectFn(event, listenerDetails, obj, listener, replaceArray)
  {
    var extra=(listener) ? listener:listenerDetails;
	var array=(replaceArray) ? replaceArray:listenerArray;
    for(var a=0;a<array.length;a++)
	{
	  if(array[a].e==event && array[a].obj==obj)
	  {
	    if((extra.func && array[a].listenerDetails.func==extra.func && arraysEqual(array[a].listenerDetails.args, extra.args) && array[a].listenerDetails.context==extra.context) || array[a].listener==extra)//slight discrepancy, args is an array that will have seperate pointers with possibly same values
		{
	      return true;
		}
	  }
	}
	return false;
  }
  
  //returns a match [array] based on the listener event, listener, or obj it is attached to
  function matchListener(specifier, array)
  {
    array=array || listenerArray;
	var matches=[];
    var specs=[];
	var el;
    switch (typeof specifier)
	{
	 case "function":
	    specs.push(specifier);
		el="listener";
		break;
	 case "object":
	    specs.push(specifier);
		if(specifier instanceof singleListener)
		{
		  el="listener";
		}
		else
		{
		  el="obj";
		}
		break;
	 case "string":
	    specs=specifier.split(" ");
		el="e";
		break;
	 default:
	   specs.push("all");
	   el="all";
	   break;
	}
	for(var a=0;a<array.length;a++)
	{
	  for(var b=0;b<specs.length;b++)
	  {
	    if(array[a][el]==specs[b] || (el=="listener" && array[a]==specs[b]))
		{
		  matches.push(array[a]);
		}
		else
		{
		  if(specs[b]=="all" && el=="all")
		  {
		    matches.push(array[a]);
		  }
		}
	  }
	}
	return matches;
  }
  
//rewrites a listener based on it's implementation
//takes an incomplete obj version of listenerDetails {func:, context:, args:}
//listener may be returned through listenerReturn or modification of addListener
  
function listenerRewrite(listener, altObj)  //altObj of {func: , context: , args: }
  {
    var matches=matchListener(listener);
	for(a=0; a<matches.length;a++)
	{
	  matches[a].remove();
	  if(!matches[a].listenerDetails)
	  {
		matches[a].listenerDetails={};
	  }
	  if(altObj.func)
	  {
		matches[a].listenerDetails.func=altObj.func;
	  }
	  if(altObj.context)
	  {
		matches[a].listenerDetails.context=altObj.context;
	  }
	  if(altObj.args)
	  {
		matches[a].listenerDetails.args=altObj.args;
	  }
	  if(matches[a].listenerDetails.func && matches[a].listenerDetails.args && matches[a].listenerDetails.context)
	  {
		var fn=matches[a].listenerDetails.func;
		var context=matches[a].listenerDetails.context;
		var args=matches[a].listenerDetails.args;
	    matches[a].listener=function(){fn.apply(context, args)};
	  }
	  addEventListener(matches[a].e, matches[a].listener, matches[a].obj);
	}
  }
  
  //Removal Functions 
  //Removes all stored listeners
  function removeAll()
  {
    for(var a=0;a<listenerArray.length;a++)
    {
      listenerArray[a].remove();
	  toLatent(listenerArray.splice(a,1));
    }
  }
  
  //removes on a specific attribute
  //can be a combination of 3 specs which are htmlObj, listener, and eventTag string
  function removeOn(spec1, spec2, spec3)
  {
    var matches=matchListener(spec1);
	if(spec2)
	{
	  matches=matchListener(spec2, matches);
	}
	if(spec3)
	{
	  matches=matchListener(spec3, matches);
	}
	for(var a=0;a<matches.length;a++)
	{
	   if(GLOBAL && matches[a].gId>-1)
		{
		  if(matches[a].spotVerify())
		  {
		    window[globalListenId].splice(matches[a].gId, 1);  //this would require a shift in every index afterwards...
		  }
		}
		matches[a].remove();
		toLatent(listenerArray.splice(listenerArray.indexOf(matches[a]), 1));
	}
  }
  
  //addListener Fn
  //listenerDetails mandatory while listener is an overwrite that may be included
  //it is possible to write a seperate listenerDetails and pass an empty array to the listenerRewrite which rewrites to the first stored function
  function addListener(eventTags, obj, listenerDetails, listener) //listenerDetails of format {context: func: args:[]}
  {
   events=eventTags.split(" ");
   for(var a=0;a<events.length;a++)
   {
	var temp=new singleListener(events[a], obj, listenerDetails, listener);
	listenerDetails=temp.listenerDetails;//For completeness of listenerDetails
    var sim=detectFn(events[a], listenerDetails, obj, listener)
    if(MULTI || (!MULTI && !sim))
	{
	   if(!reInstateOn(events[a], temp.listener, obj))
	   {
		 if(GLOBAL)
	     {
	       window[globalListenId].push(temp);
		   temp.gId=window[globalListenId].length-1;
         }
		 temp.add();
	     listenerArray.push(temp);
	   }
	}
	else
	{
	  if(GLOBAL && sim && temp.gId && !temp.spotVerify())  //check to see if the event was removed through the global access
	  {
	    //Should return the object
	    window[globalListenId].push(temp);
		temp.gId=window[globalListenId].length-1;
	  }
	}
   }
  }
  
  //Reinstate any previously deleted Fns, specifier bases on all for same object, all for same listener fn, all for same eventTag(s), or all in the dump
  //takes 3 specs which means combination of listener, htmlObj, and eventTag string
  function reInstateOn(spec1, spec2, spec3)
  {
      var matches=matchListener(spec1, latentArray);
	  if(spec2)
	  {
	    matches=matchListener(spec2, matches);
	  }
	  if(spec3)
	  {
	    matches=matchListener(spec3, matches);
	  }
	  for(var a=0;a<matches.length;a++)
	   {
	       addListener(matches[a].e, matches[a].listenerDetails, matches[a].obj, matches[a].listener);
		   latentArray.splice(latentArray.indexOf(matches[a]),1);
       }
	   if(matches.length>0)
	   {
	     return true;
	   }
	   else
	   {
	     return false;
	   }
  }
  
  
  //Returns a listener given a two part specifier
  //"[first, next, last, number] [eventTag]" and possibly the object
  //if only a specifier is taken, the localBar of LOCALINDEX is used to refer to the listenerArray
  function listenerReturn(specifier, htmlObj)
  {
    var specs=specifier.split(" ");//is maximum of two set, 'numberspecifier event'  leniency is allowed for order
	var localIndex="last";
	var query;
	var matches;
	for(var a=0; a<2 && a<specs.length;a++)
	{
	  switch(specs[a])
	  {
		case "click":
		case "mousedown":
		case "mouseup":
		case "mouseover":
		case "load":
		case "mouseup":
		case "mouseout":
		   query=specs[a];
		   break;
		default:
			localIndex=specs[a];
		   break;
	  }
	}
	if(query)
	{
	  matches=matchListener(query);
	}
	else
	{
	  matches=listenerArray;
	}
	if(htmlObj)
	{
	  matches=matchListener(htmlObj, matches);
	}
	switch(localIndex)
	{
	  case "first":
	    localIndex=0;
	    break;
	  case "last":
	    localIndex=matches.length-1;
	    break;
	  case "next":
	    if(matches!=listenerArray)
		{
		  var a=0;
		  while(listenerArray.indexOf(matches[a])<LOCALINDEX)
		  {
		    a++;
			if(a==matches.length)
			{
			  a=0;
			  break;
			}
		  }
		  localIndex=a;
		}
		else
		{
          localIndex=LOCALINDEX+1;
		}
		break;
	  default:
	    if(isNaN(localIndex))
		  {
		    localIndex=0;
		  }
		  else
		  {
		    if(localIndex>=matches.length)
			{
			  localIndex=localIndex%matches.length;
			}
		  }
	    break;
	}
	if(!query && !htmlObj)
	{
	  LOCALINDEX=localIndex;
	}
	return matches[localIndex].listener;
  }

//invokes a listener event based on 3 specifiers
//can be a combination of htmlObj, listener, eventTag string
function listenerInvokeOn(spec1, spec2, spec3)
  {
    var matches=matchListener(spec1);
	if(spec2)
	{
	  matches=matchListener(spec2, matches);
	}
	if(spec3)
	{
	  matches=matchListener(spec3, matches);
	}
	for(var a=0;a<matches.length;a++)
	{
	  matches[a].listener.call();
	}
  }

//invokes all listeners stored in the object  
function listenerInvokeAll()
  {
    for(var a=0;a<listenerArray.length;a++)
	{
	  listenerArray[a].listener.call();
	}
  }
  
  var GLOBAL=false;
  var MULTI=false;
  var LOCALINDEX=-1;
  
  var specs=specifiers.split(" ");
  for(var a=0;a<specs.length;a++)
  {
    switch(specs[a])
	{
	  case "global":
	     GLOBAL=true;
		 break;
	  case "multi":
	     MULTI=true;
		 break;
	  default:
	     break;	
	}
  }
  var listenerArray=[];
  var latentArray=[];
  if(GLOBAL && !window[globalListenId])
  {
    window[globalListenId]=[];
  }
  if(eventTags && obj && listenerDetails)
  {
  addListener(eventTags, obj, listenerDetails, listener);
  }
  
  return {addListener:addListener, listenerInvokeAll:listenerInvokeAll, listenerInvokeOn:listenerInvokeOn, listenerReturn:listenerReturn, listenerRewrite:listenerRewrite, reInstateOn:reInstateOn, removeAll:removeAll, removeOn:removeOn};
}