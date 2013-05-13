define('Stage', ['jquery', 'Score', 'SelectScreen', 'Level'], function($, Score, SelectScreen, Level){

	var Stage = function(canvas) {
		console.log("STAGE!!")

		this.overlay = canvas;
		this.curr_score = 0;
		this.curr_stage = canvas;
		this.STAGE_ORDER = ['level1', 'level2'];

		// begin listener for stageReturn - this is fired every time a given stage ends and has no directive
     //   $(document).on("gotoNextStage", Stage.gotoNextStage);


   // 	$(document).on("gotoNextStage", $.proxy(Stage.gotoNextStage, this));
    //    $(this).trigger('gotoNextStage');

    	this.gotoSelectScreen();
    //	this.gotoLevel(0);
	}



	Stage.prototype.gotoLevel = function(level) {
		var self = this;
		self.clearStage();

		console.log(self.STAGE_ORDER)
		var leveltype = String(self.STAGE_ORDER[level]);

    	Score.loadFile("/levels/"+leveltype+"/"+leveltype+".txt");
    	this.curr_stage = new Level(self.overlay, "levels/"+leveltype+"/"+leveltype+".webm");
	}


	Stage.prototype.clearStage = function(){
		this.curr_score = null;
		this.curr_stage = null;
	}


	Stage.prototype.gotoSelectScreen = function(){
		var self = this;
		self.clearStage();

		// called when it's damn appropriate to call it
		this.curr_stage = new SelectScreen(self.overlay);

	}




	return Stage;


//
//	Stage.prototype.gotoNextStage = function(e, data) {
///		var self = this;
///		console.log("goto next stage")
///
///		// eventually this will be called either when a select screen has been called with a keypress
///		// or at the end of a level and it's just time to frickin move on
///
///
///		// determine if you just chose a level
///		//if (e.keyCode != null) {
///		//	// probably will never use this?
///		//	// you just were in the select screen and called this as a keydown event
		//	// goto the level you chose
		//	$(document).off('keydown');
		//	var levelchoice = STAGES[e.keyCode];
////
//		//	console.log("YOU chose this level !!!  "+e.keyCode)
//		//	// TEMP: be an idiot and just go to level 1 all the time
//		//	Stage.gotoLevel(levelchoice);
////
//		//	// NOTE in select, make sure you filter for just appropriate keycodes
//		//	// TODO like all of this
////
////
//		//} else {
//			// you just finished a level, bitchen
//			// let's send you back to select
//			//self.gotoSelectScreen();
//			// TODO: send from level whether you died or lived to activate next level when you won
//
//			// TEMP: send you to level 0 for select man
//
//			this.gotoLevel(0);
//	//	}
//
//	}
//
		
		
});