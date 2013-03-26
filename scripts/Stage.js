define('Stage', ['jquery', 'Score', 'http://vjs.zencdn.net/c/video.js'], function($, Score){

	$.fn.Stage = function() {
		var self = this;
		// text/overlay
		var overlay = $(this).find('#canvas');

      	// audio
      	successAudio = $('#successSound').get(0);
      	failAudio = $('#failSound').get(0);

		var video;

		// begin listener for actionCommand - this is fired every time you begin a new section
        $(document).on("actionCommand", commandEventFired);


		init();



		function init(){
			console.log(this)
			var self = this;

      		// using videojs,  load up the dang video
      		_V_("main_video").ready(function(){
      			self.video = this;
      			self.video.volume(0.05);
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
        		overlay.html('');
		  		self.successAudio.play();
        	});
	
        	$(document).on("video_failure", function(e, fail_begin, fail_end){
	        	self.failAudio.play();
        		overlay.html('');
				self.video.currentTime(fail_begin);

				var fail_i = setInterval(function(){
					clearInterval(fail_i);
					console.log("PAuse this betch")
					// restart game
					$(document).trigger('restart');
					self.video.pause();
				}, (fail_end - fail_begin)*1000);
        	});

	
        	$(document).on("video_success", function(e, success_begin, success_end){
        		overlay.html('');
				self.video.currentTime(success_begin);

				var success_i = setInterval(function(){
					clearInterval(success_i);
					// restart game
					$(document).trigger('restart');
					self.video.pause();
				}, (success_end - success_begin)*1000);
        	});


        	$(document).on("textOn", function(e, stageText, text_begin, text_end){
        		overlay.html(stageText);
        		var text_i = setInterval(function(){
        			clearInterval(text_i);
        			overlay.html('');
        		}, (text_end - text_begin)*1000);
        	});


		}

		function commandEventFired(e, command, begin, end) {
  			// command is in UP/DOWN/LEFT/RIGHT/ACTION
  			// deal with keypress shittt
		    overlay.html("<img src='/images/"+command+".png'/>");

		}




		



	}


});