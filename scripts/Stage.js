define('Stage', ['jquery', 'Score', 'Level', 'SelectScreen'], function($, Score, Level, SelectScreen){

	var Stage = function(canvas) {
		console.log("STAGE!!")

		this.overlay = canvas;
		this.curr_score = 0;
		this.curr_stage = canvas;
		this.STAGE_ORDER = ['select', 'level1', 'level2', 'level3', 'finish']


		// begin listener for stageReturn - this is fired every time a given stage ends and has no directive
     //   $(document).on("gotoNextStage", Stage.gotoNextStage);


    	$(document).on("gotoNextStage", $.proxy(Stage.gotoNextStage, this));

        $(document).trigger('gotoNextStage');

	}

	Stage.gotoNextStage = function(e, data) {
		var self = this;
		console.log("goto next stage")

		// eventually this will be called either when a select screen has been called with a keypress
		// or at the end of a level and it's just time to frickin move on


		// determine if you just chose a level
		if (e.keyCode != null) {
			// you just were in the select screen and called this as a keydown event
			// goto the level you chose
			$(document).off('keydown');
			var levelchoice = STAGES[e.keyCode];

			console.log("YOU chose this level !!!  "+e.keyCode)
			// TEMP: be an idiot and just go to level 1 all the time
			Stage.gotoLevel(levelchoice);

			// NOTE in select, make sure you filter for just appropriate keycodes
			// TODO like all of this


		} else {
			// you just finished a level, bitchen
			// let's send you back to select
			self.gotoSelectScreen();
			// TODO: send from level whether you died or lived to activate next level when you won

			// TEMP: send you to level 1 man
			//Stage.gotoLevel(1);
		}

	}


	Stage.gotoLevel = function(level) {
		var self = this;
		Stage.clearStage();
		// TODO use level to actually find the appropriate txt and video files

		// TEMP always load level 1
    	Score.loadFile("/video_source/starwars_trashcompactor/starwars_trashcompactor.txt");
    	this.curr_stage = new Level(self.overlay, "/video_source/starwars_trashcompactor/starwars_trashcompactor.webm");
	}


		
		
	Stage.clearStage = function(){
		this.curr_score = null;
		this.curr_stage = null;
	}


	Stage.gotoSelectScreen = function(){
		var self = this;
		self.clear();

		// called when it's damn appropriate to call it
		curr_stage = new SelectScreen(self.overlay);

	}




	return Stage;

});