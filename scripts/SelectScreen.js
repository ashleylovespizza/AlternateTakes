define('SelectScreen', ['jquery', 'Score', 'Stage', 'http://vjs.zencdn.net/c/video.js'], function($, Score, Stage){

	var SelectScreen = function(canvas) {
		var self = this;
		console.log("select screen!")
		// manage canvas
		this.overlay = canvas;
		var movie_file_name = "/levels/selection_bg.mp4"

		_V_("main_video").ready(function(){
     		self.video = this;

     		self.video.volume(1);

			self.video.src(movie_file_name);
			this.play();
			self.setupSelect();
     	});
	}

	SelectScreen.prototype.setupSelect = function(){
		$("#select_screen").css("display", "block");

	}


	return SelectScreen;


});