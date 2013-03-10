
<!DOCTYPE html>
<html>
<head>
  <title>ALTERNATE TAKES</title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
  <script type="text/javascript">
    var canvas, ctx, vid, vidTimer, text;

    var gameInfo = {
      "intro_end": 4.600,
      "action_end": 6.300,
      "fail_start": 6.300,
      "fail_end": 15.000,
      "pass_start": 15.400,
      "pass_end": 17.000
    }
    var gameSections = ["intro_end", "action_end", "fail_start", "fail_end", "pass_start", "pass_end"];

    $(function(){
      // first, load up the dang video
      vid = document.getElementById("video");
      vid.volume = 0;
      vid.play();

      vidTimer = setInterval(checkStatus, 1000/30);
      currentSection = 0;

      $("#restart").click(function(){
        console.log("RESTART")
        // restart!
        endGame();

        vid.currentTime = 0;
        currentSection = 0;


        vid.play();
        vidTimer = setInterval(checkStatus, 1000/30);

      })


      function endGame(){
        vid.pause();
        clearInterval(vidTimer);
        vidTimer = null;
      }


      function waitForAction() {
        console.log("WAIT FOR ACTION!")
        // called once to set up the action listener when you move into the action part of the clip
        $(document).keydown(function(evt){
            if (evt.keyCode == 32) {
              // you have pressed the spacebar, great jorb

              //jump the video ahead to pass_start
              clearInterval(vidTimer);
              vidTimer = null;

              currentSection = 4;
              vid.currentTime = gameInfo['pass_start']; 

              vidTimer = setInterval(checkStatus, 1000/30);
            } else {
              clearInterval(vidTimer);
              vidTimer = null;

              currentSection = 2;
              vid.currentTime = gameInfo['fail_start']; 

              vidTimer = setInterval(checkStatus, 1000/30);
            }
        })
      }





      function checkStatus() {
       //// console.log(vid.currentTime)
       //// console.log(gameInfo[gameSections[currentSection]])
       //// var wah = (parseFloat(vid.currentTime) > parseFloat(gameInfo[gameSections[currentSection]])/1000 );
       //// console.log(wah);

        // you're moving beyond the current section, congratulations
        if (parseFloat(vid.currentTime) > parseFloat(gameInfo[gameSections[currentSection]]) ) {
          
          // are you at the end?
          if (currentSection > gameSections.length-3) {
            
            // you're at the end man
            // just like, don't set the timeout anymore, ok?
            // eventually make it stop at the right moment.
            if (vid.currentTime > (vid.duration-0.001)) {
              endGame();
            }

          }
          else if(currentSection == 0){
            console.log("moving beyond the intro, yay!")
            // moved beyond the intro, now in the ACTION area
            currentSection++;
            waitForAction();
          } 
          else if (currentSection == 1) {
            // you didn't press a button in time >_<
            // progress to FAILURE.
            console.log("YOU MISSED THE BUTTON DUDE")
            currentSection = 2;
            //vid.currentTime = gameInfo[currentSection];

          } 
          else if (currentSection == 2) {
            // you just failed.  end at the end of failure.
            currentSection = 3;

          }
          else if (currentSection == 3){
            // FAIL, PAUSE, DIE
            endGame();
          }
        } else if (currentSection == 1) {
            // you're currently looking for an action. for now let's just like, 
            
        }


      }
    });
  </script>

  <style>
    #video, #canvas {
      position: absolute;
      top: 20px;
      left: 20px;
    }
  </style>
</head>

<body>
  <div id="test">
    <video id="video" width="720" height="480">
          <source src="./video_source/starwars_deathstar.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
    </video>
  
    <a id="restart" href="#">RESTART!</a>
    
    <canvas id="canvas" width="720" height="480"></canvas>

  </div>
  
</body>
</html>