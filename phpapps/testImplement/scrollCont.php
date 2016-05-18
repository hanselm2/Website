<?php
  if(isset($scrollCount)==false)
  {
    $scrollCount=0;
  }
  else
  {
    $scrollCount++;
  }
  if($vert==false)
  {
    $orient1="left";
    $orient2="right";
  }
  else
  {
    $orient1="top";
    $orient2="bottom";
  }
?>
<div class="scrollBut <?php echo ($vert ? 'top':'left');?>">
<img id="scrollUpBut" class="scrollButImg" src="phpapps/testImplement/scrollBut<?php echo ($vert ? 'Top':'Left'); ?>.png" style="" />
</div>
<div id="scrollFrame" class="scrollFrame">
<div id="sBar" class="scrollBar <?php echo($vert ? 'right':'bottom'); ?>" style="">
<img src="phpapps/testImplement/scrollBarBut<?php echo($vert ? 'Vert':'Horiz'); ?>.png" class="scrollBarBut <?php echo($vert ? 'vert':'horiz'); ?>" />
</div>
<div id="scrollCont" class="scrollCont <?php echo($vert ? 'vert':'horiz'); ?>" style="padding-<?php echo ($vert ? 'right':'bottom') ?>:15px;">
<?php echo $scrollContFill[$scrollCount];?>
</div>
</div>
<div class="scrollBut <?php echo ($vert ? 'bottom':'right');?>">
<img id="scrollDownBut" class="scrollButImg" src="phpapps/testImplement/scrollBut<?php echo ($vert ? 'Down':'Right'); ?>.png" style="" />
</div>
<script type="text/javascript">
var script=document.getElementsByTagName("script");
scrollObjsArray.push(scrollBuild(script[script.length-1].parentNode, true));
</script>