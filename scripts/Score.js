define('Score', ['jquery', 'http://vjs.zencdn.net/c/video.js'], function($){

	var Score = function(scoreFile) {
	
		this.score_data = [];	
		// Score constructor
		this.loadFile(scoreFile);

	}

	Score.prototype.test = function() {
		console.log("f");
	}

	Score.prototype.loadFile = function(scoreFile){
	  
	  var self = this;

      // load up the json
      $.ajax({
        url: scoreFile,
        async: false,
        success: function(data) {
        	var lines = data.split(/\r\n|\r|\n/);
    		for (var i = 0; i<lines.length; i++) {
    		  // get rid of empty lines
    		  if (lines[i] != '') {
    		    lines[i] = lines[i].split(/\t/);
    	
    		    var new_begin_time = self.parseATFloat(lines[i][1]);
    		    lines[i][1] = new_begin_time;
		
    		    var new_end_time = self.parseATFloat(lines[i][2]);
    		    lines[i][2] = new_end_time;
		
    		    // push individual line array to processed data array
    		    self.score_data.push(lines[i]);
    		  }
    		}
    		console.log(self.score_data);
        }
      });
	};




/*********************************** Helper functions *************************************************/

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

    return Score;
});