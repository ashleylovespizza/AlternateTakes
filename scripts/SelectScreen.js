define('SelectScreen', ['jquery', 'Score', 'Stage', 'http://vjs.zencdn.net/c/video.js'], function($, Score, Stage){

	var SelectScreen = function(canvas, stage_ref) {
		var self = this;

		// manage canvas
		this.overlay = canvas;
		this.stage = stage_ref;

		var movie_file_name = "/levels/selection_bg.mp4"

		_V_("main_video").ready(function(){
     		self.video = this;

     		self.video.volume(.1);

			self.video.src(movie_file_name);
			this.play();
			self.setupSelect();
     	});
	}

	SelectScreen.prototype.setupSelect = function(){
		$("#select_screen").css("display", "block");

    	$(document).keydown($.proxy(this.keyPressed, this));

	}

	SelectScreen.prototype.keyPressed = function(e, data) {
		console.log("YOU PRESS A BUTTON !!!  "+e.keyCode)
		if (e.keyCode==38) {
			//up
			if ( $("#selection li.selected").prev().is('li') ) {
				$("#selection li.selected").prev().addBack().toggleClass("selected");
			} else {
				$("#selection li.selected").removeClass("selected");
				$("#selection li").last().addClass("selected");
			}
		} else if(e.keyCode==40) {
			//down 
			if ($("#selection li.selected").next().is('li')) {
				$("#selection li.selected").next().addBack().toggleClass("selected");
			} else {
				$("#selection li.selected").next().addBack().removeClass("selected");
				$("#selection li").first().addClass("selected");

			}
		} else if(e.keyCode==13) {
			//enter, make selection!
		//	console.log($("#selection li.selected a").attr("level"))
			this.clearOut();
			this.stage.gotoLevel(Number($("#selection li.selected a").attr("level")))
		}

	};
	SelectScreen.prototype.clearOut = function() {
		$(document).off("keydown");
		
		$("#select_screen").css("display", "none");
	}
	return SelectScreen;


});