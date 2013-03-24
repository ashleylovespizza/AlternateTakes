define('Stage', ['jquery', 'Score', 'http://vjs.zencdn.net/c/video.js'], function($, Score){

	$.fn.Stage = function() {
		var overlay = $(this).find('#canvas');
		var video;

		init();

		function init(){
			console.log("YO BRAH")

			var self = this;
      		// using videojs,  load up the dang video
      		_V_("main_video").ready(function(){
      			self.video = this;
      			console.log("video is ready");
				if(Score.scoreReady()) {
					this.play();
				} else {
					$(document).on('scoreReady', this.play);
				}
	
      		});
		}

	}
/*
	$.fn.Stage.prototype.init = function() {
		console.log("YO BRAH")

		var self = this;
      	// using videojs,  load up the dang video
      	_V_("main_video").ready(function(){
      		self.video = this;
      		console.log("video is ready");
			if(Score.scoreReady()) {
				this.play();
			} else {
				$(document).on('scoreReady', this.play);
			}

      	});

	}

*/
/*
	$.fn.Stage.prototype.stagePlay = function() {

	}
*/
});