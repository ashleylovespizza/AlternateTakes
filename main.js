   // for now, just hardcode to load the testmovie
  //  var canvas, ctx, vid, vidTimer, text, myPlayer, datastr;

    //video.js player
    var myPlayer;
    // datastr is the original data string imported from the text file
    var datastr;
    // this is the lines index -  current i of lines[] you're on
    var l_i = -1;


    var processed_data = new Array();

      


    $(function(){
      // first, load up the dang video

// OLD WAY:
//      vid = document.getElementById("video");
 //       vid.play();


// NEW WAY WITH VIDEO JS
      _V_("main_video").ready(function(){
        console.log("Asdf")
        myPlayer= this;
        console.log(myPlayer);
        triggerLoad();
      });

      $.ajax({
        url: "/video_source/testmovie/testmovie.txt",
        async: false,
        success: function(data) {
          datastr = new String(data);
          triggerLoad(datastr);
        }
      })


    });











/*************************************************************************************************************************************************
**************************************************************************************************************************************************
**************************  ASSISTANCE FUNCTIONS ************************************************************************************************/




function triggerLoad(data) {
  if (datastr != null && myPlayer != null){
    // process data string
    var lines = data.split(/\r\n|\r|\n/);
    for (var i = 0; i<lines.length; i++) {
      // only worry about nonempty lines
      if (lines[i] != '') {
        var new_begin_time = parseATFloat(lines[i][1]);
        lines[i][1] = new_begin_time;

        var new_end_time = parseATFloat(lines[i]2]);
        lines[i][2] = new_end_time;

        // push individual line array to processed data array
        processed_data.push(lines[i].split(/\t/));
      }
    }
    // empty out datastring
    datastr = null;
    lines_index = 0;


    myPlayer.addEvent("timeupdate", function(){
      console.log(myPlayer.currentTime())
      // if current player time is greater than the beginning of the next section,
      // IT'S GO TIME.
      if (myPlayer.currentTime() > lines[l_i+1][1]) {
        // you should move to the next section

        // clear out whatever current shit is happening

        // then increment to next 
        l_i++;

        // LIFE BEGINS ANEW
        // it'd be nice to make a screen singleton class and use that instead of a million global variables
        doShitForAction(lines[l_i][3]);



        // todo - when this hits the lenght of lines[]

      }
    })


    myPlayer.play();
  }
}

function playSuccess(){
  // TODO play a nice sound for success
}

function doShitForAction(action){
  // yayyy a huge switch!

  if (action=="UP" || action=="DOWN" || action=="LEFT" || action=="RIGHT") {
    // set a keypress listener for just the next timeToRespond seconds, otherwise KILL U
  } else if (action=="START" || action=="FAIL" || action=="SUCCESS" || action.slice(0,9)=="CHECKPOINT")
  switch(action)
  {
    case 'START':
      break;
    case 'UP':
      $(document).keydown(function(e)) {
        if (e.keyCode==38) {
          playSuccess();
        }
      };
      break;
    case 'DOWN':
      $(document).keydown(function(e)) {
        if (e.keyCode==38) {
          playSuccess();
        }
      };
      break;
  }

}

    // restart button - end game (clear interval), reset times and current section, begin ANEW
    $("#restart").click(function(){
      console.log("RESTART")
      // restart!
      endGame();

//      vid.currentTime = 0;
  //    currentSection = 0;

//
  //    vid.play();
    //  vidTimer = setInterval(checkStatus, 1000/30);

    })



      function endGame(){
        myPlayer.pause();
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



      function parseATFloat(time_str) {
        // takes a string formatted from the text file, ie 00:00:01:77
        // and converts it to a javascript style time float

        // time will look something like: 00:00:14:34
        // FOR NOW it's ok to discard the first hour column 00: set
        var timeparts = String(time_str).split(':');
        var hours = parseFloat(timeparts[0]);
        var minutes = parseFloat(timeparts[1]);
        var seconds = parseFloat(timeparts[2]);
        var ms = parseFloat(timeparts[3]);

        var ret_seconds = (hours*3600)+(minutes*60)+(seconds)+(ms/60);
        return ret_seconds;
      }

      function checkStatus() {
       //// console.log(vid.currentTime)
       //// console.log(gameInfo[gameSections[currentSection]])
       //// var wah = (parseFloat(vid.currentTime) > parseFloat(gameInfo[gameSections[currentSection]])/1000 );
       //// console.log(wah);
       var current_moment_in_vid = parseFloat(vid.currentTime);
       var next_moment_to_be_aware_of = parseATFloat(processed_data[currentSection+1][1]);
       console.log(current_moment_in_vid);


        // you're moving beyond the current section, congratulations
        if (parseFloat(vid.currentTime) > 10 ) {
          
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