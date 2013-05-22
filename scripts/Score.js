define('Score', ['jquery'], function($){

	var instance = null;

	var Score = function() {	
		// Score constructor
	
		this.score_data = [];
		this.current_score_section = -1;
		this.current_key_interval = null;

		this.ACTION_COMMANDS = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'ACTION'];

		// maximum of how long you have to respond, in seconds
		this.ACTION_DURATION = 0.5;
		this.ACTION_KEYCODES = {
			'UP':     38,
			'DOWN':   40,
			'RIGHT':  39,
			'LEFT':   37,
			'ACTION': 32  
		};


		if(instance !== null){
            throw new Error("Cannot instantiate more than one Score, use Score.getInstance()");
        } 
        
	}

	Score.getInstance = function() {
        // summary:
        //      Gets an instance of the singleton. It is better to use 
        if(instance === null){
            instance = new Score();
        }
        return instance;
    }

    // called from main.js
	Score.prototype.loadFile = function(scoreFile){ 
	  var self = this;

      // load up the json
      $.ajax({
        url: scoreFile,
        async: false,
        success: function(data) {
        	$.proxy(self.processData(data), self);
        }
      });
	};



	Score.prototype.play = function() {
		// 
	}

	Score.prototype.update = function(e, data) {
		// run every on every video update
		var self = this;

		if (data > this.score_data[this.current_score_section+1]['begin']) {
			// move to next section!
			this.current_score_section++;

			var cue = this.score_data[this.current_score_section];

			// if it's a command - LEFT RIGHT UP DOWN ACTION
			if($.inArray(cue['command'], this.ACTION_COMMANDS) > -1) {
				var time_diff = 1000 * Number(cue['end'] - cue['begin']);
				console.log("section "+this.current_score_section+" needs you to press "+cue['command']+ ' within ' + time_diff)
				// this section requires an action, how exciting!

				// just handles if the correct button is pressed or not - only 'on' when it needs to be on
				console.log("begin listening for THIS KEY: "+cue['command'])

				//TODO - maybe move this to happen just once?
    			$(document).keydown($.proxy(this.keyPressed, this));

				clearInterval(self.current_key_interval);
				self.current_key_interval = null;
				self.current_command_listener = cue['command']

				self.current_key_interval = setInterval(function(){
					console.log("OVER NOW for "+self.current_command_listener)
					// get rid of self so this only fires once
					clearInterval(self.current_key_interval);
					self.current_key_interval = null;
					$(document).trigger('command_goaway');

					// if key listener is still alive, you know you failed
					if ($._data( $(document).get(0), "events" )['keydown'] != null) {
						console.log("TOO LATE ASSHOLE");
						$(document).trigger('command_failure');
					}
			    	//$(document).off('keypress');
				}, time_diff);


				$(document).trigger('actionCommand', [cue['command'], cue['begin'], cue['end']]);



			} else if(cue['command'] == 'FAIL') {
				// if you've reached this, it means you've actually succeeded, huzzah!

				$(document).off('keydown');
        		$(document).off("videoTimeUpdate");

        		console.log('score goes to success!');
        		// jump ahead to SUCCESS!
        		for (var i = self.current_score_section; i < self.score_data.length; i++) {
        			if (self.score_data[i]['command'] == 'SUCCESS') {
        				// this is where you wanna be str8 up
        				console.log("word: "+self.score_data[i]['begin'])
        				$(document).trigger("video_success", [self.score_data[i]['begin'], self.score_data[i]['end']]);
        			}
        		}
			} else if(cue['command'].slice(0,9)=="CHECKPOINT" || cue['command'] == 'START') {
				// do nothing!
			} else {
  			 	//action is probably text!
 			 	$(document).trigger('textOn', [cue['command'].replace(/"/g, ""), cue['begin'], cue['end']]);
			
  			}


		}
	}



	Score.prototype.scoreReady = function() {
		return !!(this.score_data.length > 0);
	}

	Score.prototype.keyPressed = function(e, data) {
		$(document).off('keydown');
		console.log("YOU PRESS A BUTTON !!!  "+e.keyCode)
		// checks if a key is appropriate and goes from there
	//	console.log(this.score_data)
	//	console.log("fuck a bug "+this.current_score_section)
		var curr_action = this.score_data[this.current_score_section]['command'];
	//	console.log("ucrr action "+curr_action)
	//	console.log("SAMESIES?? "+this.ACTION_KEYCODES[curr_action])
		if (e.keyCode == this.ACTION_KEYCODES[curr_action]) {
			$(document).trigger('command_success', curr_action);
    	} else { // if ((this.ACTION_KEYCODES[curr_action])!= undefined){
			$(document).trigger('command_failure');
		}
	};




	Score.prototype.clearScore = function() {

		this.score_data = [];
		this.current_score_section = -1;
		this.current_key_interval = null;

    	$(document).off("videoTimeUpdate");
        $(document).off("command_failure");
	}



/*********************************** Helper functions *************************************************/

	Score.prototype.processData = function(data) {
		console.log("Score: processing data")
		// takes in raw data from ajax load of text file
		// processes and puts it into this.score_data array
		// sets up video update listener
		// triggers scoreReady event (heard by Stage)
		var self = this;

		var lines = data.split(/\r\n|\r|\n/);
    	for (var i = 0; i<lines.length; i++) {
    	  // get rid of empty lines
    	  if (lines[i] != '') {
    	  	var cue = new Array();

    	    lines[i] = lines[i].split(/\t/);
    	    next_line = lines[i+2].split(/\t/);
    	
    	    cue['command'] = lines[i][3];

    	    cue['begin'] = this.parseATFloat(lines[i][1]);

    	    var potential_end = this.parseATFloat(lines[i][2]);
    	    var next_begin = this.parseATFloat(next_line[1]);
    	 //   console.log("spider " + i+" tits: "+next_line)

    	    if ($.inArray(cue['command'], this.ACTION_COMMANDS) > -1) {
    	    	// end should be ACTION_DURATION after origin
    	    //	console.log("next begin: "+next_begin);
    	    //	console.log("current begin: "+Number(cue['begin']));
    	    //	console.log("if THIS: "+Number(next_begin - Number(cue['begin'])));
    	    //	console.log("is less than THIS: "+this.ACTION_DURATION);
    	    //	console.log("we end here: "+Number(next_begin-0.01))

    	    	//ACTION_DURATION is the maximum amount of time allowed
    	    	if (next_begin - Number(cue['begin']) < this.ACTION_DURATION) {
					cue['end'] = next_begin - .01;
    	    	} else {
	    	    	cue['end'] = Number(cue['begin']) + this.ACTION_DURATION;
	    	    }
    	    } else {
    	    	// end is just the end, text or checkpoint
    	    	cue['end'] = potential_end;
    	    }

    	    // push individual line array to processed data array
    	    this.score_data.push(cue);
    	  }
    	}

    	$(document).on("videoTimeUpdate", $.proxy(this.update, this));

        $(document).on("command_failure", function(e){
			$(document).off('keydown');
        	$(document).off("videoTimeUpdate");

        	console.log('score also fails :(');
        	// jump ahead to FAILURE
        	for (var i = self.current_score_section; i < self.score_data.length; i++) {
        		if (self.score_data[i]['command'] == 'FAIL') {
        			// this is where you wanna be str8 up
        			console.log("word: "+self.score_data[i]['begin'])
        			$(document).trigger("video_failure", [self.score_data[i]['begin'], self.score_data[i]['end']]);
        		}
        	}
        })



    	$(document).trigger('scoreReady');
	}




	Score.prototype.parseATFloat = function(time_str) {
        // takes a string formatted from the text file, ie 00:00:01:77
        // and returns a float in ms of the time

        // time will look something like: 00:00:14:34
        // FOR NOW it's ok to discard the first hour column 00: set



        var timeparts = String(time_str).split(':');
        var hours = parseFloat(time_str);
        var minutes = parseFloat(timeparts[1]);
        var seconds = parseFloat(timeparts[2]);
        var ms = parseFloat(timeparts[3]);

        var ret_seconds = parseFloat((hours*3600)+(minutes*60)+(seconds)+(ms/100));

        return ret_seconds;
    }




    return Score.getInstance();
});