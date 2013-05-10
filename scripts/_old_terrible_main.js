   // for now, just hardcode to load the testmovie
  //  var canvas, ctx, vid, vidTimer, text, myPlayer, datastr;

var reactionMS = 1000;
var stageWidth = 720;
var stageHeight = 480;
var stage;
var update = true;

// dev var for when we're palying shit
var playing = true;

// global to keep track of current action
var curr_action = '';
// when should failure happen?
var failIndex;
//video.js player
var myPlayer;
// datastr is the original data string imported from the text file
var datastr;
// this is the lines index -  current i of lines[] you're on
var l_i = -1;
// holds audio for good and bad sounds
var successAudio, failAudio;


var processed_data = new Array();

var actionKeyCodes = new Object();
actionKeyCodes['UP'] = 38;
actionKeyCodes['DOWN'] = 40;
actionKeyCodes['RIGHT'] = 39;
actionKeyCodes['LEFT'] = 37;
actionKeyCodes['ACTION'] = 32; 



    $(function() {

      // assign stage variable for display shits
      stage = $("#canvas");

      // using videojs,  load up the dang video
      _V_("main_video").ready(function(){
        console.log("Asdf")
        myPlayer= this;
        console.log(myPlayer);
        triggerLoad();
      });

      // create the audio entities
      successAudio = document.getElementById('successSound');
      failAudio = document.getElementById('failSound');



  $(document).keydown(function(e) {
    if (e.keyCode==actionKeyCodes[curr_action]) {
      playSuccess();
      curr_action = 'YOUDIDIT';
      console.log((actionKeyCodes[curr_action]))
    } else if ((actionKeyCodes[curr_action])!= undefined){
      youFailed();
      // TODO: jump ahead to fail? or checkpoint? not sure. let's do fail!
    }
  });


      // load up the json
      $.ajax({
        url: "/video_source/starwars_trashcompactor/starwars_trashcompactor.txt",
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
        lines[i] = lines[i].split(/\t/);
        var new_begin_time = parseATFloat(lines[i][1]);
    //    console.log(new_begin_time)
        lines[i][1] = new_begin_time;


        var new_end_time = parseATFloat(lines[i][2]);
        lines[i][2] = new_end_time;

        // push individual line array to processed data array
        processed_data.push(lines[i]);

        if (lines[i][3] == 'FAIL') {
            failIndex = processed_data.length -1;
          }
      }
    }
    // empty out datastring
    datastr = null;
    lines_index = 0;


//    myPlayer.addEvent("timeupdate", function(){
  
    video_interval = setInterval(loopCheck, 50);
   //   console.log(myPlayer.currentTime())
      // if current player time is greater than the beginning of the next section,
      // IT'S GO TIME.
     // console.log(l_i)
     // console.log(l_i+1)


    if (playing) 
      myPlayer.play();

//    myPlayer.volume(0);
  }
}

function loopCheck(){
     //   console.log(processed_data[l_i+1][1]);
      if (myPlayer.currentTime() > processed_data[l_i+1][1]) {
        // you should move to the next section
        console.log("NEXT SECTION!!!")
        console.log("former section: "+l_i)
        // clear out whatever current shit is happening

        // then increment to next 
        l_i++;


        console.log("next section: "+l_i)
        // LIFE BEGINS ANEW
        // it'd be nice to make a screen singleton class and use that instead of a million global variables
        doShitForAction(processed_data[l_i][3]);



        // todo - when this hits the lenght of lines[]

      }

}

function playSuccess(){
  // TODO play a nice sound for success
  successAudio.play();
}

function playFailure(){
  failAudio.play();
}

function youFailed(){
  playFailure();
  curr_action = '';
  stopActionPng();
  clearInterval(video_interval);
  myPlayer.currentTime(processed_data[failIndex][1]);

  

  var delay = (processed_data[failIndex][2] - processed_data[failIndex][1]) * 1000;
  console.log(delay);

  var failTimeout = setInterval(function(){
    clearInterval(failTimeout);
    failTimeout = null;
    myPlayer.pause();
    myPlayer.currentTime(0);
    stage.html("RELOAD TO START AGAIN :)")
  }, delay);

}

function stopActionPng(){
  // whatever png is flashing in the canvas div (if any), stop that bitch
  stage.html('');
}

function doShitForAction(action){
  console.log("do shit for action "+action)
  if (action=="UP" || action=="DOWN" || action=="LEFT" || action=="RIGHT" || action=="ACTION") {
    
    curr_action = action;

    //show appropriate doodle
    stage.html("<img src='/images/"+action+".png'/>");

    // set a keypress listener for just the next timeToRespond seconds, otherwise KILL U
    var localKeyListenerInterval = setInterval(function(){
      if(curr_action != 'YOUDIDIT') {
        // you actually failed, whoops
        youFailed();
        

        } 
        curr_action = '';
        clearInterval(localKeyListenerInterval);
        localKeyListenerInterval = null;
      
    }, reactionMS);



  } else if (action=="START" || action=="FAIL" || action=="SUCCESS" || action.slice(0,9)=="CHECKPOINT") {
    // DO NOTHING
    curr_action = '';
  } else {
    //action is probably text!
    curr_action = '';

    action = action.replace (/"/g, "");

    stage.html(action);

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


      function parseATFloat(time_str) {
        // takes a string formatted from the text file, ie 00:00:01:77
        // and converts it to a javascript style time float

        // time will look something like: 00:00:14:34
        // FOR NOW it's ok to discard the first hour column 00: set

        var timeparts = String(time_str).split(':');
        var hours = parseFloat(time_str);
    //    console.log(timeparts)
    //    console.log("HI!!!")
        var minutes = parseFloat(timeparts[1]);
        var seconds = parseFloat(timeparts[2]);
        var ms = parseFloat(timeparts[3]);
    //   console.log("ASKDFJAKLSJF")
    //   console.log(hours);
    //   console.log(minutes);
    //   console.log(seconds);
    //   console.log(ms);

        var ret_seconds = parseFloat((hours*3600)+(minutes*60)+(seconds)+(ms/100));
        return ret_seconds;
      }





