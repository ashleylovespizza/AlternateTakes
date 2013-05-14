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
	
		// begin listener for actionCommand - this is fired every time you begin a new section
     	$(document).on("actionCommand", $.proxy(this.commandEventFired, this));
	
     	// using videojs,  load up the dang video
     	// TODO: make sure you're using the movie_file_name for this shit, and not just the "main_video" _V_ object
     	_V_("main_video").ready(function(){
     		self.video = this;

     		self.video.volume(1);

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


     	$(document).on("command_success", function(e){
     		console.log('YOU DID IT')
     		self.overlay.html('');
     		self.successAudio.currentTime = 0;
	  		self.successAudio.play();
     	});
	
     	$(document).on("video_failure", function(e, fail_begin, fail_end){
	     	self.failAudio.play();
	     	console.log("fail.")
     		self.overlay.html('');
			self.video.currentTime(fail_begin);

			var fail_i = setInterval(function(){
				clearInterval(fail_i);
				console.log("PAuse this betch")
				// restart game
				$(document).trigger('back_to_select');
				self.video.pause();
			}, (fail_end - fail_begin)*1000);
     	});

	
     	$(document).on("video_success", function(e, success_begin, success_end){
     		console.log("video success!!")
     		self.overlay.html('');
			self.video.currentTime(success_begin);

			var success_i = setInterval(function(){
				clearInterval(success_i);
				// restart game
				$(document).trigger('back_to_select');
				self.video.pause();
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

	Level.prototype.commandEventFired = function(e, command, begin, end) {
  		// command is in UP/DOWN/LEFT/RIGHT/ACTION
  		// deal with keypress shittt
  		console.log("overlay: "+command)
	    this.overlay.html("<img src='/images/"+command+".png'/>");

	}


	return Level;

});