<?php
  session_start();
 if(!isset($_SESSION['tries']))
    {
      $_SESSION['tries']=0; 
    }
  else
    {
      if($_COOKIE['logged']=="passthru")
       {
         header("Location: memberArea.php");
       }
      else
       {
        if($_SESSION['tries']>0 && $_SESSION['tries']<5)
         {
            $result="Invalid Username/Password";
         }
        else
         {
            if($_SESSION['tries']>=5)
            {
              $result="Too many tries!  Please refresh page in a minute.";
            }
          
         }
       }
    }
?>

<html>
<body>
<span><?php echo $result; ?></span>
<form action="../Data/verify.php" enctype="application/x-www-form-urlencoded" method="post">
<span>Username</span><input type="text" name="uname" size="30" maxlength="30" />
<br/>
<span>Password</span><input type="password" name="pword" size="30" maxlength="30" />
<br/>
<input type="submit" />
</form>
</body>
</html>