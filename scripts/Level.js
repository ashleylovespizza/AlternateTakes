define('Level', ['jquery', 'Score', 'http://vjs.zencdn.net/c/video.js'], function($, Score){

	var Level = function(canvas, movie_file_name) {
		// Level constructor
		var self = this;

		// text/overlay
		this.overlay = $('#canvas');
	
     	// audio
     	this.successAudio = $('#successSound').get(0);
     	this.failAudio = $('#failSound').get(0);
		
		this.video = null;
		this.video_reference = null;

	
		// begin listener for actionCommand - this is fired every time you begin a new section
     	$(document).on("actionCommand", $.proxy(this.commandEventFired, this));
	
     	// using videojs,  load up the dang video
     	// TODO: make sure you're using the movie_file_name for this shit, and not just the "main_video" _V_ object
     	this.video_reference = _V_("main_video").ready(function(){
     		self.video = this;

     		self.video.volume(.5);

			self.video.src(movie_file_name);

     		// listen for every moment the video is updated and broadcast that happening
     		self.video.addEvent("timeupdate", function(e) {
    			var curr_time = self.video.currentTime();
    			$(document).trigger("videoTimeUpdate", curr_time);
    		})



			if(Score.scoreReady()) {
				this.play();
			} else {
				$(document).on('scoreReady', this.play);
			}
     	});


     	$(document).on("command_success", function(e, curr_command){
     		console.log('YOU DID IT');

		    self.overlay.html("<img src='/images/"+curr_command+"_success.png'/>");
     		self.successAudio.currentTime = 0;
	  		self.successAudio.play();
     	});
	
     	$(document).on("command_goaway", function(e, curr_command){
     		console.log('get shit off the screen');

		    self.overlay.html("");
     	});
	


     	$(document).on("video_failure", function(e, fail_begin, fail_end){
	     	self.failAudio.play();
	     	console.log("fail.")
   // 		self.overlay.html('');
		    self.overlay.html("<img src='/images/FAIL.png'/>");
			self.video.currentTime(fail_begin);

			var fail_image = setInterval(function(){
				clearInterval(fail_image);
				fail_image = null;
		   		self.overlay.html("");
			}, 1400);

			var fail_i = setInterval(function(){
				clearInterval(fail_image);
				fail_image = null;
				clearInterval(fail_i);
				fail_i = null;

				self.resetLevel();
				// restart game
				$(document).trigger('back_to_select');
			}, (fail_end - fail_begin)*1000);
     	});

	
     	$(document).on("video_success", function(e, success_begin, success_end){
     		console.log("video success!!")
     		self.overlay.html('');
			self.video.currentTime(success_begin);

			var success_i = setInterval(function(){
				clearInterval(success_i);
				self.resetLevel();
				// restart game
				$(document).trigger('back_to_select');
			}, (success_end - success_begin)*1000);
     	});


     	$(document).on("textOn", function(e, levelText, text_begin, text_end){
     		console.log("text overlay: "+levelText);
     		self.overlay.html(levelText);
     		var text_i = setInterval(function(){
     			clearInterval(text_i);
     			console.log("removing text "+levelText);
     			if (self.overlay.html() == levelText) {
	     			self.overlay.html('');
	     		}
     		}, (text_end - text_begin)*1000);
     	});


	}

	Level.prototype.resetLevel = function() {
		this.overlay.html('');
		this.video.pause();
		$(document).off("actionCommand");
		$(document).off("command_success");
		$(document).off("video_failure");
		$(document).off("video_success");
		$(document).off("textOn");

		self.video_reference = null;
	//	$("#main_video").remove();
	}



	Level.prototype.commandEventFired = function(e, command, begin, end) {
  		// command is in UP/DOWN/LEFT/RIGHT/ACTION
  		// deal with keypress shittt
  		console.log("overlay: "+command)
	    this.overlay.html("<img src='/images/"+command+".png'/>");

	}


	return Level;

});